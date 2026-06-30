import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { canAccessAdmin } from "@/lib/app-config"
import { auth, getSessionUserRole } from "@/lib/auth"
import { getGalleryActivities } from "@/lib/gallery"
import { isSupabaseStorageConfigured } from "@/lib/supabase/config"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !canAccessAdmin(getSessionUserRole(session))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isSupabaseStorageConfigured()) {
      return NextResponse.json([])
    }

    const items = await getGalleryActivities(
      getSessionUserRole(session) === "admin" || getSessionUserRole(session) === "developer"
        ? undefined
        : session.user.id
    )

    return NextResponse.json(items)
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat data galeri." },
      { status: 500 }
    )
  }
}
