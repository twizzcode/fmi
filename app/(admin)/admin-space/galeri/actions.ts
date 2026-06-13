"use server"

import { randomUUID } from "node:crypto"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { canAccessAdmin } from "@/lib/app-config"
import { auth } from "@/lib/auth"
import { db, schema } from "@/lib/db"
import {
  deleteStorageObject,
  uploadImageToStorage,
} from "@/lib/supabase/storage"

export type GalleryActionState = {
  error: string | null
  success: string | null
}

const initialState = {
  error: null,
  success: null,
} satisfies GalleryActionState

export async function createGalleryEntryAction(
  _previousState: GalleryActionState = initialState,
  formData: FormData
): Promise<GalleryActionState> {
  void _previousState
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const eventDate = getEventDate(formData.get("eventDate"))
  if (eventDate instanceof Error) {
    return { error: eventDate.message, success: null }
  }

  const image = formData.get("image")
  if (!(image instanceof File) || image.size === 0) {
    return { error: "Gambar galeri wajib diunggah.", success: null }
  }

  try {
    const storagePath = await uploadImageToStorage({
      file: image,
      folder: "galeri",
    })

    await db.insert(schema.galleryEntries).values({
      id: randomUUID(),
      storagePath,
      eventDate,
    })

    revalidateGalleryPaths()

    return {
      error: null,
      success: "Item galeri berhasil ditambahkan.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal menambahkan item galeri.",
      success: null,
    }
  }
}

export async function updateGalleryEntryAction(
  _previousState: GalleryActionState = initialState,
  formData: FormData
): Promise<GalleryActionState> {
  void _previousState
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const path = formData.get("path")
  if (typeof path !== "string" || !path.trim()) {
    return { error: "Path galeri tidak valid.", success: null }
  }

  const eventDate = getEventDate(formData.get("eventDate"))
  if (eventDate instanceof Error) {
    return { error: eventDate.message, success: null }
  }

  const id = formData.get("id")
  const normalizedPath = path.trim()

  try {
    if (typeof id === "string" && id.trim()) {
      await db
        .update(schema.galleryEntries)
        .set({
          eventDate,
          storagePath: normalizedPath,
        })
        .where(eq(schema.galleryEntries.id, id.trim()))
    } else {
      await db.insert(schema.galleryEntries).values({
        id: randomUUID(),
        storagePath: normalizedPath,
        eventDate,
      })
    }

    revalidateGalleryPaths()

    return {
      error: null,
      success: "Metadata galeri berhasil diperbarui.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui item galeri.",
      success: null,
    }
  }
}

export async function deleteGalleryEntryAction(
  _previousState: GalleryActionState = initialState,
  formData: FormData
): Promise<GalleryActionState> {
  void _previousState
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const path = formData.get("path")
  if (typeof path !== "string" || !path.trim()) {
    return { error: "Path galeri tidak valid.", success: null }
  }

  const id = formData.get("id")

  try {
    if (typeof id === "string" && id.trim()) {
      await db
        .delete(schema.galleryEntries)
        .where(eq(schema.galleryEntries.id, id.trim()))
    }

    await deleteStorageObject(path.trim()).catch(() => undefined)

    revalidateGalleryPaths()

    return {
      error: null,
      success: "Item galeri berhasil dihapus.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Gagal menghapus item galeri.",
      success: null,
    }
  }
}

async function requireAdminSession(): Promise<GalleryActionState | null> {
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

function getEventDate(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return new Error("Tanggal galeri wajib dipilih.")
  }

  const parsed = new Date(`${value.trim()}T00:00:00`)

  if (Number.isNaN(parsed.getTime())) {
    return new Error("Tanggal galeri tidak valid.")
  }

  return parsed
}

function revalidateGalleryPaths() {
  revalidatePath("/admin-space/galeri")
  revalidatePath("/galeri-fmiunnes")
  revalidatePath("/")
}
