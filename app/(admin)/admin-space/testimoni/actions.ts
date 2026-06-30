"use server"

import { randomUUID } from "node:crypto"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { auth, getSessionUserRole } from "@/lib/auth"
import { canAccessAdmin } from "@/lib/app-config"
import { db, schema } from "@/lib/db"
import {
  deleteStorageObject,
  uploadImageToStorage,
} from "@/lib/supabase/storage"

export type TestimonialActionState = {
  error: string | null
  success: string | null
}

export async function createTestimonialAction(
  _previousState: TestimonialActionState,
  formData: FormData
): Promise<TestimonialActionState> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session || !canAccessAdmin(getSessionUserRole(session))) {
    return {
      error: "Unauthorized",
      success: null,
    }
  }

  const name = formData.get("name")
  const designation = formData.get("designation")
  const quote = formData.get("quote")
  const image = formData.get("image")

  if (typeof name !== "string" || !name.trim()) {
    return {
      error: "Nama wajib diisi.",
      success: null,
    }
  }

  if (typeof designation !== "string" || !designation.trim()) {
    return {
      error: "Jabatan wajib diisi.",
      success: null,
    }
  }

  if (typeof quote !== "string" || !quote.trim()) {
    return {
      error: "Testimoni wajib diisi.",
      success: null,
    }
  }

  if (!(image instanceof File) || image.size === 0) {
    return {
      error: "Foto wajib diunggah.",
      success: null,
    }
  }

  try {
    const imagePath = await uploadImageToStorage({
      file: image,
      folder: "testimonials",
    })

    await db.insert(schema.testimonials).values({
      id: randomUUID(),
      userId: session.user.id,
      name: name.trim(),
      designation: designation.trim(),
      quote: quote.trim(),
      imagePath,
    })

    revalidatePath("/admin-space/testimoni")
    revalidatePath("/testimoni")
    revalidatePath("/")

    return {
      error: null,
      success: "Testimoni berhasil ditambahkan.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal menyimpan testimoni.",
      success: null,
    }
  }
}

export async function updateTestimonialAction(
  _previousState: TestimonialActionState,
  formData: FormData
): Promise<TestimonialActionState> {
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const id = formData.get("id")
  const name = formData.get("name")
  const designation = formData.get("designation")
  const quote = formData.get("quote")
  const replaceImage = formData.get("replaceImage")
  const image = formData.get("image")

  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID testimoni tidak valid.", success: null }
  }

  if (typeof name !== "string" || !name.trim()) {
    return { error: "Nama wajib diisi.", success: null }
  }

  if (typeof designation !== "string" || !designation.trim()) {
    return { error: "Jabatan wajib diisi.", success: null }
  }

  if (typeof quote !== "string" || !quote.trim()) {
    return { error: "Testimoni wajib diisi.", success: null }
  }

  const [existing] = await db
    .select()
    .from(schema.testimonials)
    .where(eq(schema.testimonials.id, id.trim()))
    .limit(1)

  if (!existing) {
    return { error: "Testimoni tidak ditemukan.", success: null }
  }

  const shouldReplaceImage = replaceImage === "on"

  if (shouldReplaceImage && (!(image instanceof File) || image.size === 0)) {
    return {
      error: "Upload ulang foto wajib dilakukan sebelum menyimpan perubahan.",
      success: null,
    }
  }

  try {
    let imagePath = existing.imagePath

    if (shouldReplaceImage && image instanceof File && image.size > 0) {
      const newImagePath = await uploadImageToStorage({
        file: image,
        folder: "testimonials",
      })

      imagePath = newImagePath
    }

    await db
      .update(schema.testimonials)
      .set({
        name: name.trim(),
        designation: designation.trim(),
        quote: quote.trim(),
        imagePath,
      })
      .where(eq(schema.testimonials.id, existing.id))

    if (shouldReplaceImage && imagePath !== existing.imagePath) {
      await deleteStorageObject(existing.imagePath).catch(() => undefined)
    }

    revalidatePath("/admin-space/testimoni")
    revalidatePath("/testimoni")
    revalidatePath("/")

    return {
      error: null,
      success: "Testimoni berhasil diperbarui.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui testimoni.",
      success: null,
    }
  }
}

export async function deleteTestimonialAction(
  _previousState: TestimonialActionState,
  formData: FormData
): Promise<TestimonialActionState> {
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const id = formData.get("id")

  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID testimoni tidak valid.", success: null }
  }

  const [existing] = await db
    .select()
    .from(schema.testimonials)
    .where(eq(schema.testimonials.id, id.trim()))
    .limit(1)

  if (!existing) {
    return { error: "Testimoni tidak ditemukan.", success: null }
  }

  try {
    if (existing.imagePath) {
      await deleteStorageObject(existing.imagePath)
    }

    await db
      .delete(schema.testimonials)
      .where(eq(schema.testimonials.id, existing.id))

    revalidatePath("/admin-space/testimoni")
    revalidatePath("/testimoni")
    revalidatePath("/")

    return {
      error: null,
      success: "Testimoni berhasil dihapus.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal menghapus testimoni.",
      success: null,
    }
  }
}

async function requireAdminSession(): Promise<TestimonialActionState | null> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session || !canAccessAdmin(getSessionUserRole(session))) {
    return {
      error: "Unauthorized",
      success: null,
    }
  }

  return null
}

