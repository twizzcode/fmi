import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { canAccessAdmin } from "@/lib/app-config"
import { auth } from "@/lib/auth"
import { getTestimonialsWithImageUrls } from "@/lib/testimonials"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !canAccessAdmin(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const items = await getTestimonialsWithImageUrls(
      session.user.role === "admin" || session.user.role === "developer"
        ? undefined
        : session.user.id
    )

    return NextResponse.json(items)
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat data testimoni." },
      { status: 500 }
    )
  }
}
