import { createServerFn } from "@tanstack/react-start";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

type ContactRequest = z.infer<typeof contactSchema>;

export const sendContactEmail = createServerFn({ method: "POST" }).handler(
  async (ctx: { data: ContactRequest }) => {
    try {
      const data = ctx.data;
      // Validate the data
      const validatedData = contactSchema.parse(data);
      const { name, email, message } = validatedData;

      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      } as SMTPTransport.Options);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        replyTo: email,
        to: process.env.EMAIL_USER,
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

      return { success: true, message: "Email sent successfully!" };
    } catch (error) {
      console.error("Email error:", error);
      return { success: false, error: "Failed to send email." };
    }
  }
);
