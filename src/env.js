import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  EMAIL_USER: z.string().email(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string().transform((val) => parseInt(val, 10)),
  EMAIL_SECURE: z.string().transform((val) => val === "true"),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = validateEnv();
