"use server"

import { randomUUID } from "node:crypto"

import { and, eq, inArray } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { canAccessAdmin } from "@/lib/app-config"
import { auth } from "@/lib/auth"
import { db, schema } from "@/lib/db"
import {
  deleteStorageObject,
  deleteStorageObjects,
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
  previousState: GalleryActionState = initialState,
  formData: FormData
): Promise<GalleryActionState> {
  void previousState
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session || !canAccessAdmin(session.user.role)) {
    return { error: "Unauthorized", success: null }
  }

  const title = getTitle(formData.get("title"))
  if (title instanceof Error) {
    return { error: title.message, success: null }
  }

  const eventDate = getEventDate(formData.get("eventDate"))
  if (eventDate instanceof Error) {
    return { error: eventDate.message, success: null }
  }

  const images = getImageFiles(formData.getAll("images"))
  if (images instanceof Error) {
    return { error: images.message, success: null }
  }

  let uploadedPaths: string[] = []

  try {
    const entryId = randomUUID()
    uploadedPaths = await uploadGalleryImages(images)

    await db.transaction(async (tx) => {
      await tx.insert(schema.galleryEntries).values({
        id: entryId,
        userId: session.user.id,
        title,
        storagePath: uploadedPaths[0]!,
        eventDate,
        status: "pending",
      })

      await tx.insert(schema.galleryPhotos).values(
        uploadedPaths.map((storagePath, index) => ({
          id: randomUUID(),
          galleryEntryId: entryId,
          storagePath,
          sortOrder: index,
        }))
      )
    })

    revalidateGalleryPaths()

    return {
      error: null,
      success: "Kegiatan galeri berhasil ditambahkan.",
    }
  } catch (error) {
    await Promise.all(
      uploadedPaths.map((path) => deleteStorageObject(path).catch(() => undefined))
    )

    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal menambahkan kegiatan galeri.",
      success: null,
    }
  }
}

export async function updateGalleryEntryAction(
  previousState: GalleryActionState = initialState,
  formData: FormData
): Promise<GalleryActionState> {
  void previousState
  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const id = formData.get("id")
  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID galeri tidak valid.", success: null }
  }

  const title = getTitle(formData.get("title"))
  if (title instanceof Error) {
    return { error: title.message, success: null }
  }

  const eventDate = getEventDate(formData.get("eventDate"))
  if (eventDate instanceof Error) {
    return { error: eventDate.message, success: null }
  }

  const removedPhotoIds = formData
    .getAll("removedPhotoIds")
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
  const newImages = getOptionalImageFiles(formData.getAll("newImages"))
  if (newImages instanceof Error) {
    return { error: newImages.message, success: null }
  }

  const [existingEntry] = await db
    .select()
    .from(schema.galleryEntries)
    .where(eq(schema.galleryEntries.id, id.trim()))
    .limit(1)

  if (!existingEntry) {
    return { error: "Kegiatan galeri tidak ditemukan.", success: null }
  }

  const existingPhotos = await db
    .select()
    .from(schema.galleryPhotos)
    .where(eq(schema.galleryPhotos.galleryEntryId, existingEntry.id))

  const retainedPhotos = existingPhotos.filter(
    (photo) => !removedPhotoIds.includes(photo.id)
  )

  if (retainedPhotos.length === 0 && newImages.length === 0) {
    return {
      error: "Minimal harus ada satu foto di dalam kegiatan galeri.",
      success: null,
    }
  }

  let uploadedPaths: string[] = []

  try {
    uploadedPaths = await uploadGalleryImages(newImages)

    await db.transaction(async (tx) => {
      if (removedPhotoIds.length > 0) {
        await tx
          .delete(schema.galleryPhotos)
          .where(
            and(
              eq(schema.galleryPhotos.galleryEntryId, existingEntry.id),
              inArray(schema.galleryPhotos.id, removedPhotoIds)
            )
          )
      }

      const normalizedRetained = retainedPhotos.map((photo, index) => ({
        ...photo,
        sortOrder: index,
      }))

      await Promise.all(
        normalizedRetained.map((photo) =>
          tx
            .update(schema.galleryPhotos)
            .set({ sortOrder: photo.sortOrder })
            .where(eq(schema.galleryPhotos.id, photo.id))
        )
      )

      if (uploadedPaths.length > 0) {
        await tx.insert(schema.galleryPhotos).values(
          uploadedPaths.map((storagePath, index) => ({
            id: randomUUID(),
            galleryEntryId: existingEntry.id,
            storagePath,
            sortOrder: normalizedRetained.length + index,
          }))
        )
      }

      const nextCoverPath =
        normalizedRetained[0]?.storagePath ?? uploadedPaths[0] ?? existingEntry.storagePath

      await tx
        .update(schema.galleryEntries)
        .set({
          title,
          eventDate,
          storagePath: nextCoverPath,
        })
        .where(eq(schema.galleryEntries.id, existingEntry.id))
    })

    const removedPaths = existingPhotos
      .filter((photo) => removedPhotoIds.includes(photo.id))
      .map((photo) => photo.storagePath)

    await Promise.all(
      removedPaths.map((path) => deleteStorageObject(path).catch(() => undefined))
    )

    revalidateGalleryPaths()

    return {
      error: null,
      success: "Kegiatan galeri berhasil diperbarui.",
    }
  } catch (error) {
    await Promise.all(
      uploadedPaths.map((path) => deleteStorageObject(path).catch(() => undefined))
    )

    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui kegiatan galeri.",
      success: null,
    }
  }
}

export async function deleteGalleryEntryAction(
  previousStateOrFormData: GalleryActionState | FormData = initialState,
  maybeFormData?: FormData
): Promise<GalleryActionState> {
  const formData =
    previousStateOrFormData instanceof FormData
      ? previousStateOrFormData
      : maybeFormData

  if (!(formData instanceof FormData)) {
    return { error: "Data hapus galeri tidak valid.", success: null }
  }

  const authResult = await requireAdminSession()
  if (authResult) {
    return authResult
  }

  const id = formData.get("id")
  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID galeri tidak valid.", success: null }
  }

  const [existingEntry] = await db
    .select()
    .from(schema.galleryEntries)
    .where(eq(schema.galleryEntries.id, id.trim()))
    .limit(1)

  if (!existingEntry) {
    return { error: "Kegiatan galeri tidak ditemukan.", success: null }
  }

  const existingPhotos = await db
    .select()
    .from(schema.galleryPhotos)
    .where(eq(schema.galleryPhotos.galleryEntryId, existingEntry.id))

  try {
    const paths = Array.from(
      new Set([
        existingEntry.storagePath,
        ...existingPhotos.map((photo) => photo.storagePath),
      ])
    )

    await deleteStorageObjects(paths)

    await db
      .delete(schema.galleryEntries)
      .where(eq(schema.galleryEntries.id, existingEntry.id))

    revalidateGalleryPaths()

    return {
      error: null,
      success: "Kegiatan galeri berhasil dihapus.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal menghapus kegiatan galeri.",
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

function getTitle(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return new Error("Nama kegiatan wajib diisi.")
  }

  return value.trim()
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

function getImageFiles(values: FormDataEntryValue[]) {
  const files = values.filter(
    (value): value is File => value instanceof File && value.size > 0
  )

  if (files.length === 0) {
    return new Error("Upload minimal satu foto galeri.")
  }

  if (files.length > 10) {
    return new Error("Maksimal 10 foto kegiatan per galeri.")
  }

  return files
}

function getOptionalImageFiles(values: FormDataEntryValue[]) {
  return values.filter(
    (value): value is File => value instanceof File && value.size > 0
  )
}

async function uploadGalleryImages(files: File[]) {
  const uploadedPaths: string[] = []

  for (const file of files) {
    const path = await uploadImageToStorage({
      file,
      folder: "galeri",
    })
    uploadedPaths.push(path)
  }

  return uploadedPaths
}

function revalidateGalleryPaths() {
  revalidatePath("/admin-space/galeri")
  revalidatePath("/galeri-fmiunnes")
  revalidatePath("/")
}
