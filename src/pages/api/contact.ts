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

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
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
