import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { auth } from "@/lib/auth"
import {
  appOrigin,
  canAccessAdmin,
  createAppUrl,
  isAdminHost,
} from "@/lib/app-config"

export async function proxy(request: NextRequest) {
  const { nextUrl } = request
  const host = request.headers.get("host")

  if (!isAdminHost(host)) {
    return NextResponse.next()
  }

  if (nextUrl.pathname.startsWith("/login")) {
    const loginUrl = createAppUrl("/login")
    loginUrl.searchParams.set("redirectTo", request.url)
    return NextResponse.redirect(loginUrl)
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    const loginUrl = createAppUrl("/login")
    loginUrl.searchParams.set("redirectTo", request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (!canAccessAdmin(session.user.role)) {
    return NextResponse.redirect(new URL("/", appOrigin))
  }

  const rewriteUrl = new URL(`/admin-space${nextUrl.pathname}`, request.url)
  rewriteUrl.search = nextUrl.search
  return NextResponse.rewrite(rewriteUrl)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\..*).*)",
  ],
}
