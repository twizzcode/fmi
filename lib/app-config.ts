const defaultAppUrl = "http://lvh.me:3000"
const defaultAdminUrl = "http://admin.lvh.me:3000"

function getEnvUrl(value: string | undefined, fallback: string) {
  return value?.trim() || fallback
}

function getUniqueOrigins(urls: string[]) {
  return [...new Set(urls.map((url) => new URL(url).origin))]
}

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1"
}

function getSharedCookieDomain(hostnames: string[]) {
  const names = [...new Set(hostnames.map((hostname) => hostname.toLowerCase()))]

  if (!names.length || names.some(isLocalHostname)) {
    return undefined
  }

  const reversedParts = names.map((hostname) => hostname.split(".").reverse())
  const sharedParts: string[] = []

  for (let index = 0; index < reversedParts[0].length; index += 1) {
    const part = reversedParts[0][index]

    if (!part || reversedParts.some((parts) => parts[index] !== part)) {
      break
    }

    sharedParts.push(part)
  }

  return sharedParts.length >= 2 ? sharedParts.reverse().join(".") : undefined
}

export const appUrl = getEnvUrl(process.env.NEXT_PUBLIC_APP_URL, defaultAppUrl)
export const adminUrl = getEnvUrl(process.env.NEXT_PUBLIC_ADMIN_URL, defaultAdminUrl)

export const appOrigin = new URL(appUrl).origin
export const adminOrigin = new URL(adminUrl).origin
export const appHost = new URL(appUrl).host
export const adminHost = new URL(adminUrl).host
export const appHostname = new URL(appUrl).hostname
export const adminHostname = new URL(adminUrl).hostname

export const authBaseUrl = getEnvUrl(process.env.BETTER_AUTH_URL, appOrigin)
export const authTrustedOrigins = getUniqueOrigins([appUrl, adminUrl, authBaseUrl])

export const cookieDomain =
  process.env.AUTH_COOKIE_DOMAIN ?? getSharedCookieDomain([appHostname, adminHostname])

export function canAccessAdmin(role?: string | null) {
  return role === "staff" || role === "admin" || role === "developer"
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
