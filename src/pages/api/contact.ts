import type { APIRoute } from "astro";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export const prerender = false;

type ContactRequest = {
  name: string;
  email: string;
  message: string;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, message } = (await request.json()) as ContactRequest;

    const transporter = nodemailer.createTransport({
      host: import.meta.env.EMAIL_HOST,
      port: Number(import.meta.env.EMAIL_PORT),
      secure: import.meta.env.EMAIL_SECURE,
      auth: {
        user: import.meta.env.EMAIL_USER,
        pass: import.meta.env.EMAIL_PASSWORD,
      },
    } as SMTPTransport.Options);

    await transporter.sendMail({
      from: import.meta.env.EMAIL_USER,
      replyTo: email,
      to: import.meta.env.EMAIL_USER,
      subject: `Contact Form: ${name} <${email}>`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Email error:", error);
    return new Response(JSON.stringify({ error: "Failed to send email." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
