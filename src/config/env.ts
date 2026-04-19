import dotenv from "dotenv";

dotenv.config();

export const { DATABASE_URL, PORT, FRONTEND_URL } = process.env;