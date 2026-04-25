import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../config/prisma";
import { BETTER_AUTH_SECRET, FRONTEND_URL } from "../config/env";

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET!,
  trustedOrigins: [FRONTEND_URL!],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "student",
        input: true,
      },
      imageCldPublic: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});
