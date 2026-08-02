import { z } from "zod";

/** Shared by the contact form and the API route so both agree on the rules. */
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email("Invalid email address").max(200),
  message: z
    .string()
    .min(10, "Message is required")
    .max(5000, "Message is too long"),
});

export type ContactValues = z.infer<typeof contactSchema>;
