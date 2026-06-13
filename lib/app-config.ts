const defaultAppUrl = "http://lvh.me:3000"
const defaultAdminUrl = "http://admin.lvh.me:3000"

export const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? defaultAppUrl
export const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? defaultAdminUrl

export const appOrigin = new URL(appUrl).origin
export const adminOrigin = new URL(adminUrl).origin
export const appHost = new URL(appUrl).host
export const adminHost = new URL(adminUrl).host

export const authBaseUrl = process.env.BETTER_AUTH_URL ?? appOrigin
export const authTrustedOrigins = [
  appOrigin,
  adminOrigin,
]

export const cookieDomain =
  process.env.AUTH_COOKIE_DOMAIN ?? getCookieDomainFromUrl(appUrl)

export function canAccessAdmin(role?: string | null) {
  return role === "admin" || role === "developer"
}

export function isAdminHost(host?: string | null) {
  return (host ?? "").toLowerCase() === adminHost.toLowerCase()
}

export function createAdminUrl(pathname = "/") {
  return new URL(pathname, adminOrigin)
}

export function createAppUrl(pathname = "/") {
  return new URL(pathname, appOrigin)
}

function getCookieDomainFromUrl(url: string) {
  const { hostname } = new URL(url)

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return undefined
  }

  return hostname
}
