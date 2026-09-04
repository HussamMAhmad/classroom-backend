import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../config/prisma.js";
import { BETTER_AUTH_SECRET, FRONTEND_URL } from "../config/env.js";

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET!,
  trustedOrigins: [FRONTEND_URL!],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    useSecureCookies: true,
    crossSubDomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      sameSite: "None",
      secure: true,
      httpOnly: true,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "STUDENT",
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
