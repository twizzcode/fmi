"use server"

import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth, getSessionUserRole } from "@/lib/auth"
import { canAccessAdmin } from "@/lib/app-config"
import { db, schema } from "@/lib/db"
import {
  deleteStorageObject,
  uploadImageToStorage,
} from "@/lib/supabase/storage"

export type ServiceActionState = {
  error: string | null
  success: string | null
}

type ParsedServiceFields =
  | ServiceActionState
  | {
      title: string
      description: string
      buttonLabel: string
      href: string
      sortOrder: number
      image: FormDataEntryValue | null
    }

export async function createServiceAction(
  _previousState: ServiceActionState,
  formData: FormData
): Promise<ServiceActionState> {
  const authResult = await requireAdminSession()
  if (authResult) return authResult

  const parsed = parseServiceFields(formData)
  if (isServiceActionState(parsed)) return parsed

  if (!(parsed.image instanceof File) || parsed.image.size === 0) {
    return {
      error: "Gambar layanan wajib diunggah.",
      success: null,
    }
  }

  try {
    const imagePath = await uploadImageToStorage({
      file: parsed.image,
      folder: "services",
    })

    await db.insert(schema.services).values({
      id: randomUUID(),
      title: parsed.title,
      description: parsed.description,
      buttonLabel: parsed.buttonLabel,
      href: parsed.href,
      imagePath,
      sortOrder: parsed.sortOrder,
    })

    revalidateServicePaths()

    return {
      error: null,
      success: "Layanan berhasil ditambahkan.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Gagal menambahkan layanan.",
      success: null,
    }
  }
}

export async function updateServiceAction(
  _previousState: ServiceActionState,
  formData: FormData
): Promise<ServiceActionState> {
  const authResult = await requireAdminSession()
  if (authResult) return authResult

  const id = formData.get("id")
  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID layanan tidak valid.", success: null }
  }

  const parsed = parseServiceFields(formData)
  if (isServiceActionState(parsed)) return parsed

  const replaceImage = formData.get("replaceImage") === "on"
  const image = formData.get("image")

  const [existing] = await db
    .select()
    .from(schema.services)
    .where(eq(schema.services.id, id.trim()))
    .limit(1)

  if (!existing) {
    return { error: "Layanan tidak ditemukan.", success: null }
  }

  if (replaceImage && (!(image instanceof File) || image.size === 0)) {
    return {
      error: "Unggah gambar baru untuk mengganti gambar lama.",
      success: null,
    }
  }

  try {
    let imagePath = existing.imagePath

    if (replaceImage && image instanceof File && image.size > 0) {
      imagePath = await uploadImageToStorage({
        file: image,
        folder: "services",
      })
    }

    await db
      .update(schema.services)
      .set({
        title: parsed.title,
        description: parsed.description,
        buttonLabel: parsed.buttonLabel,
        href: parsed.href,
        imagePath,
        sortOrder: parsed.sortOrder,
      })
      .where(eq(schema.services.id, existing.id))

    if (replaceImage && imagePath !== existing.imagePath) {
      await deleteStorageObject(existing.imagePath).catch(() => undefined)
    }

    revalidateServicePaths()

    return {
      error: null,
      success: "Layanan berhasil diperbarui.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Gagal memperbarui layanan.",
      success: null,
    }
  }
}

export async function deleteServiceAction(
  _previousState: ServiceActionState,
  formData: FormData
): Promise<ServiceActionState> {
  const authResult = await requireAdminSession()
  if (authResult) return authResult

  const id = formData.get("id")
  if (typeof id !== "string" || !id.trim()) {
    return { error: "ID layanan tidak valid.", success: null }
  }

  const [existing] = await db
    .select()
    .from(schema.services)
    .where(eq(schema.services.id, id.trim()))
    .limit(1)

  if (!existing) {
    return { error: "Layanan tidak ditemukan.", success: null }
  }

  try {
    await db.delete(schema.services).where(eq(schema.services.id, existing.id))
    await deleteStorageObject(existing.imagePath).catch(() => undefined)
    revalidateServicePaths()

    return {
      error: null,
      success: "Layanan berhasil dihapus.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Gagal menghapus layanan.",
      success: null,
    }
  }
}

function parseServiceFields(formData: FormData): ParsedServiceFields {
  const title = formData.get("title")
  const description = formData.get("description")
  const buttonLabel = formData.get("buttonLabel")
  const href = formData.get("href")
  const sortOrderValue = formData.get("sortOrder")
  const image = formData.get("image")

  if (typeof title !== "string" || !title.trim()) {
    return { error: "Judul layanan wajib diisi.", success: null }
  }

  if (typeof description !== "string" || !description.trim()) {
    return { error: "Deskripsi layanan wajib diisi.", success: null }
  }

  if (typeof buttonLabel !== "string" || !buttonLabel.trim()) {
    return { error: "Label tombol wajib diisi.", success: null }
  }

  if (typeof href !== "string" || !href.trim()) {
    return { error: "Link tujuan wajib diisi.", success: null }
  }

  const sortOrder =
    typeof sortOrderValue === "string" && sortOrderValue.trim()
      ? Number(sortOrderValue)
      : 0

  if (Number.isNaN(sortOrder)) {
    return { error: "Urutan layanan harus berupa angka.", success: null }
  }

  return {
    title: title.trim(),
    description: description.trim(),
    buttonLabel: buttonLabel.trim(),
    href: href.trim(),
    sortOrder,
    image,
  }
}

function isServiceActionState(
  value: ParsedServiceFields
): value is ServiceActionState {
  return "error" in value
}

async function requireAdminSession(): Promise<ServiceActionState | null> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session || !canAccessAdmin(getSessionUserRole(session))) {
    return { error: "Unauthorized", success: null }
  }

  return null
}

function revalidateServicePaths() {
  revalidatePath("/admin-space/layanan")
  revalidatePath("/layanan")
  revalidatePath("/")
}
