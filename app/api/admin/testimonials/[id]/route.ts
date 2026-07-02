import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { canAccessAdmin } from "@/lib/app-config"
import { auth, getSessionUserRole } from "@/lib/auth"
import { getTestimonialById } from "@/lib/testimonials"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !canAccessAdmin(getSessionUserRole(session))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const role = getSessionUserRole(session)
    const item = await getTestimonialById(
      id,
      role === "admin" || role === "developer" ? undefined : session.user.id
    )

    if (!item) {
      return NextResponse.json({ error: "Testimoni tidak ditemukan." }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat detail testimoni." },
      { status: 500 }
    )
  }
}
