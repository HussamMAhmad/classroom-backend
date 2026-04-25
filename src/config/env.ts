import dotenv from "dotenv";

dotenv.config();

const required = ["DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL"] as const;
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const DATABASE_URL = process.env.DATABASE_URL!;
export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET!;
export const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL!;
export const PORT = process.env.PORT;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const ARCJET_KEY = process.env.ARCJET_KEY;
export const ARCJET_ENV = process.env.ARCJET_ENV;