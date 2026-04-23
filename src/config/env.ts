import dotenv from "dotenv";

dotenv.config();

export const {
  DATABASE_URL,
  PORT,
  FRONTEND_URL,
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
} = process.env;
