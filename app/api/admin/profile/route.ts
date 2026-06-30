import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { db, schema } from "@/lib/db"
import { createSignedStorageUrl, uploadImageToStorage } from "@/lib/supabase/storage"

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const imageFile = formData.get("image") as File | null

    let imagePath = null

    if (imageFile) {
      const objectPath = await uploadImageToStorage({
        file: imageFile,
        folder: "profiles",
      })
      imagePath = await createSignedStorageUrl(objectPath)
    }

    const updateData: { name: string; image?: string } = { name }
    if (imagePath) {
      updateData.image = imagePath
    }

    await db
      .update(schema.users)
      .set(updateData)
      .where(eq(schema.users.id, session.user.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
