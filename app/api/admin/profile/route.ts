import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

import { auth, getSessionUserRole } from "@/lib/auth"
import { db, schema } from "@/lib/db"
import { deleteStorageObject, uploadImageToStorage } from "@/lib/supabase/storage"

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return null
  }

  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, session.user.id),
  })

  return user ?? null
}

export async function PATCH(request: NextRequest) {
  try {
    const existingUser = await getAuthenticatedUser()

    if (!existingUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const imageFile = formData.get("image") as File | null

    let uploadedImagePath = existingUser.uploadedImagePath

    if (imageFile) {
      uploadedImagePath = await uploadImageToStorage({
        file: imageFile,
        folder: "profiles",
      })
    }

    await db
      .update(schema.users)
      .set({
        name,
        uploadedImagePath,
      })
      .where(eq(schema.users.id, existingUser.id))

    if (
      imageFile &&
      existingUser.uploadedImagePath &&
      existingUser.uploadedImagePath !== uploadedImagePath
    ) {
      await deleteStorageObject(existingUser.uploadedImagePath).catch(() => undefined)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const existingUser = await getAuthenticatedUser()

    if (!existingUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (existingUser.uploadedImagePath) {
      await deleteStorageObject(existingUser.uploadedImagePath).catch(() => undefined)
    }

    await db
      .update(schema.users)
      .set({ uploadedImagePath: null })
      .where(eq(schema.users.id, existingUser.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile reset error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
