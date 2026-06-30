"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { eq, inArray } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { canAccessAdmin } from "@/lib/app-config"
import { db, schema } from "@/lib/db"
import { deleteStorageObjects } from "@/lib/supabase/storage"

export type GalleryAdminActionState = {
  error: string | null
  success: string | null
}

export async function approveGalleryAction(
  _previousState: GalleryAdminActionState,
  formData: FormData
): Promise<GalleryAdminActionState> {
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const id = formData.get("id")

  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID galeri tidak valid.", success: null }
  }

  try {
    await db
      .update(schema.galleryEntries)
      .set({ status: "approved" })
      .where(eq(schema.galleryEntries.id, id.trim()))

    revalidatePath("/admin-space/admin/galeri")
    revalidatePath("/admin-space/galeri")
    revalidatePath("/galeri")
    revalidatePath("/")

    return {
      error: null,
      success: "Galeri berhasil disetujui.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal menyetujui galeri.",
      success: null,
    }
  }
}

export async function rejectGalleryAction(
  _previousState: GalleryAdminActionState,
  formData: FormData
): Promise<GalleryAdminActionState> {
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const id = formData.get("id")

  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID galeri tidak valid.", success: null }
  }

  try {
    await db
      .update(schema.galleryEntries)
      .set({ status: "rejected" })
      .where(eq(schema.galleryEntries.id, id.trim()))

    revalidatePath("/admin-space/admin/galeri")
    revalidatePath("/admin-space/galeri")
    revalidatePath("/galeri")
    revalidatePath("/")

    return {
      error: null,
      success: "Galeri berhasil ditolak.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal menolak galeri.",
      success: null,
    }
  }
}

export async function deleteGalleryAdminAction(
  _previousState: GalleryAdminActionState,
  formData: FormData
): Promise<GalleryAdminActionState> {
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const id = formData.get("id")

  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID galeri tidak valid.", success: null }
  }

  const [existing] = await db
    .select()
    .from(schema.galleryEntries)
    .where(eq(schema.galleryEntries.id, id.trim()))
    .limit(1)

  if (!existing) {
    return { error: "Galeri tidak ditemukan.", success: null }
  }

  const photos = await db
    .select()
    .from(schema.galleryPhotos)
    .where(eq(schema.galleryPhotos.galleryEntryId, existing.id))

  try {
    const paths = Array.from(
      new Set([existing.storagePath, ...photos.map((photo) => photo.storagePath)])
    )

    await deleteStorageObjects(paths)

    await db
      .delete(schema.galleryEntries)
      .where(eq(schema.galleryEntries.id, existing.id))

    revalidatePath("/admin-space/admin/galeri")
    revalidatePath("/admin-space/galeri")
    revalidatePath("/galeri-fmiunnes")
    revalidatePath("/")

    return {
      error: null,
      success: "Galeri berhasil dihapus.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal menghapus galeri.",
      success: null,
    }
  }
}

async function requireAdminSession(): Promise<GalleryAdminActionState | null> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session || !canAccessAdmin(session.user.role)) {
    return {
      error: "Unauthorized",
      success: null,
    }
  }

  return null
}
