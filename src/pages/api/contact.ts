import type { APIRoute } from "astro";
import {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASSWORD,
} from "astro:env/server";
import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/schemas";

export const prerender = false;

// The container healthcheck uses this side-effect-free request to verify that
// the required runtime environment is present without sending an email.
export const GET: APIRoute = () => new Response(null, { status: 204 });

const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

// This intentionally stays process-local: the site runs as one container.
// A shared store or edge rule is still needed if the deployment is scaled out.
const rateLimitStore = new Map<string, RateLimitEntry>();

function purgeExpiredRateLimits(now: number) {
  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

function getClientKey(request: Request, clientAddress?: string) {
  // Cloudflare's header is set at the edge; avoid x-forwarded-for because it
  // is commonly client-controlled unless the entire proxy chain is trusted.
  return (
    request.headers.get("cf-connecting-ip")?.trim() ||
    clientAddress?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function checkRateLimit(key: string, now = Date.now()) {
  purgeExpiredRateLimits(now);

  const entry = rateLimitStore.get(key);
  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

const json = (
  body: unknown,
  status: number,
  headers: HeadersInit = {},
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const rateLimit = checkRateLimit(getClientKey(request, clientAddress));
  if (!rateLimit.allowed) {
    return json(
      { error: "Too many messages. Please try again later." },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  // Validate on the server too — the client schema can be bypassed.
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ error: "Please check the form and try again." }, 400);
  }

  const { name, email, message } = parsed.data;

  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_SECURE,
      auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
    });

    await transporter.sendMail({
      from: EMAIL_USER,
      replyTo: email,
      to: EMAIL_USER,
      subject: `Contact Form: ${name} <${email}>`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return json({ message: "Email sent successfully!" }, 200);
  } catch (error) {
    console.error("Email error:", error);
    return json({ error: "Failed to send email." }, 500);
  }
};
