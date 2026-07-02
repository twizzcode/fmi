import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { canAccessAdmin } from "@/lib/app-config"
import { auth, getSessionUserRole } from "@/lib/auth"
import { getGalleryActivityById } from "@/lib/gallery"
import { isSupabaseStorageConfigured } from "@/lib/supabase/config"

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

    if (!isSupabaseStorageConfigured()) {
      return NextResponse.json({ error: "Storage belum dikonfigurasi." }, { status: 503 })
    }

    const { id } = await params
    const role = getSessionUserRole(session)
    const item = await getGalleryActivityById(
      id,
      role === "admin" || role === "developer" ? undefined : session.user.id
    )

    if (!item) {
      return NextResponse.json({ error: "Galeri tidak ditemukan." }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat detail galeri." },
      { status: 500 }
    )
  }
}
