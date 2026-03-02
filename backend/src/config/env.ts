import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3333),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

export const env = envSchema.parse(process.env);