import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { headers } from "next/headers"
import { cache } from "react"

import {
  appHost,
  adminHost,
  authBaseUrl,
  authTrustedOrigins,
  cookieDomain,
} from "@/lib/app-config"
import { db, schema } from "@/lib/db"

function createAuth() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
  const protocol = authBaseUrl.startsWith("https://") ? "https" : "http"

  return betterAuth({
    baseURL: {
      allowedHosts: [appHost, adminHost],
      fallback: authBaseUrl,
      protocol,
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
          type: ["user", "staff", "admin", "developer", "alumni"],
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
}

let authInstance: unknown

export function getAuth() {
  authInstance ??= createAuth()
  return authInstance as ReturnType<typeof createAuth>
}

export const auth = new Proxy({} as ReturnType<typeof createAuth>, {
  get(_target, property, receiver) {
    return Reflect.get(getAuth(), property, receiver)
  },
})

export const getRequestSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  })
})

export function getSessionUserRole(session: unknown) {
  if (!session || typeof session !== "object") {
    return null
  }

  const user = (session as { user?: unknown }).user

  if (!user || typeof user !== "object" || !("role" in user)) {
    return null
  }

  const role = (user as { role?: unknown }).role
  return typeof role === "string" ? role : null
}
