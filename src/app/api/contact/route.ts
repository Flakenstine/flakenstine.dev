import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/schemas";

// Everything here is read per request, so the image carries no secrets.
export const dynamic = "force-dynamic";

const REQUIRED = ["EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASSWORD"];

// The container healthcheck uses this side-effect-free request to verify that
// the required runtime environment is present without sending an email.
export function GET() {
  const missing = REQUIRED.some((name) => !process.env[name]);
  return new Response(null, { status: missing ? 503 : 204 });
}

const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

// This intentionally stays process-local: the site runs as one container.
// A shared store or edge rule is still needed if the deployment is scaled out.
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function getClientKey(headers: Headers) {
  // Set at the edge by Cloudflare, then by the proxy in front of the container.
  // Only the last x-forwarded-for hop is the proxy's own; the rest is whatever
  // the client claimed.
  return (
    headers.get("cf-connecting-ip")?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
    "unknown"
  );
}

function checkRateLimit(key: string, now = Date.now()) {
  for (const [other, entry] of rateLimits) {
    if (entry.resetAt <= now) rateLimits.delete(other);
  }

  const entry = rateLimits.get(key);
  if (!entry) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export async function POST(request: Request) {
  const limit = checkRateLimit(getClientKey(request.headers));
  if (!limit.allowed) {
    return Response.json(
      { error: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Validate on the server too: the form's own checks can be bypassed.
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const { name, email, message } = parsed.data;
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASSWORD } =
    process.env;

  try {
    // Without this, nodemailer would quietly try a mail server on localhost.
    if (!EMAIL_HOST) throw new Error("EMAIL_HOST is not set");

    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT ?? 587),
      secure: EMAIL_SECURE === "true",
      auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
    });

    await transporter.sendMail({
      from: EMAIL_USER,
      replyTo: email,
      to: EMAIL_USER,
      subject: `Contact Form: ${name} <${email}>`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return Response.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    return Response.json({ error: "Failed to send email." }, { status: 500 });
  }
}
