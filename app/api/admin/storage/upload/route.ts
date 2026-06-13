import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { canAccessAdmin } from "@/lib/app-config"
import { createSignedStorageUrl, uploadImageToStorage } from "@/lib/supabase/storage"

const galleryPrefix = "galeri"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session || !canAccessAdmin(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "File tidak ditemukan." },
        { status: 400 }
      )
    }

    const objectPath = await uploadImageToStorage({
      file,
      folder: galleryPrefix,
    })
    const signedUrl = await createSignedStorageUrl(objectPath)

    return NextResponse.json({
      message: "File berhasil diunggah ke Supabase Storage.",
      path: objectPath,
      url: signedUrl,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload storage gagal diproses."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
