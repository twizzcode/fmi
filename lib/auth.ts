import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

import {
  appHost,
  adminHost,
  authTrustedOrigins,
  cookieDomain,
} from "@/lib/app-config"
import { db, schema } from "@/lib/db"

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

export const auth = betterAuth({
  baseURL: {
    allowedHosts: [appHost, adminHost],
    fallback: process.env.BETTER_AUTH_URL,
    protocol: "http",
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: authTrustedOrigins,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  account: {
    storeStateStrategy: "database",
  },
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    crossSubDomainCookies: cookieDomain
      ? {
          enabled: true,
          domain: cookieDomain,
        }
      : {
          enabled: false,
        },
  },
  user: {
    additionalFields: {
      role: {
        type: ["user", "admin", "developer"],
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {},
  plugins: [nextCookies()],
})
