import * as z from "zod";

export const contactFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(1000, "Message must be less than 1000 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
