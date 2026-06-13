import { randomUUID } from "node:crypto"

import { supabaseStorageBucket } from "@/lib/supabase/config"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

const defaultAllowedTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const

const defaultMaxFileSize = 10 * 1024 * 1024

export async function ensureStorageBucketExists() {
  const supabase = createSupabaseAdminClient()
  const { data: bucket, error } = await supabase.storage.getBucket(
    supabaseStorageBucket
  )

  if (!error && bucket) {
    return
  }

  const { error: createError } = await supabase.storage.createBucket(
    supabaseStorageBucket,
    {
      public: false,
      fileSizeLimit: `${defaultMaxFileSize}`,
      allowedMimeTypes: [...defaultAllowedTypes],
    }
  )

  if (
    createError &&
    !createError.message.toLowerCase().includes("already exists")
  ) {
    throw createError
  }
}

export async function uploadImageToStorage({
  file,
  folder,
  allowedTypes = defaultAllowedTypes,
  maxFileSize = defaultMaxFileSize,
}: {
  file: File
  folder: string
  allowedTypes?: readonly string[]
  maxFileSize?: number
}) {
  if (file.size === 0) {
    throw new Error("File tidak ditemukan.")
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format file harus PNG, JPEG, WEBP, atau GIF.")
  }

  if (file.size > maxFileSize) {
    throw new Error("Ukuran file maksimal 10MB.")
  }

  await ensureStorageBucketExists()

  const supabase = createSupabaseAdminClient()
  const extension = getFileExtension(file.name, file.type)
  const fileName = `${randomUUID()}.${extension}`
  const objectPath = `${folder}/${fileName}`

  const { error } = await supabase.storage
    .from(supabaseStorageBucket)
    .upload(objectPath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    throw error
  }

  return objectPath
}

export async function createSignedStorageUrl(path: string, expiresIn = 3600) {
  if (!isStorageObjectPath(path)) {
    return path
  }

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase.storage
    .from(supabaseStorageBucket)
    .createSignedUrl(path, expiresIn)

  if (error) {
    throw error
  }

  return data.signedUrl
}

export async function deleteStorageObject(path: string) {
  if (!isStorageObjectPath(path)) {
    return
  }

  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.storage
    .from(supabaseStorageBucket)
    .remove([path])

  if (error) {
    throw error
  }
}

export function isStorageObjectPath(path: string) {
  return !path.startsWith("/") && !path.startsWith("http://") && !path.startsWith("https://")
}

function getFileExtension(fileName: string, mimeType: string) {
  const normalizedName = fileName.toLowerCase()

  if (normalizedName.endsWith(".png")) return "png"
  if (normalizedName.endsWith(".jpg") || normalizedName.endsWith(".jpeg")) {
    return "jpg"
  }
  if (normalizedName.endsWith(".webp")) return "webp"
  if (normalizedName.endsWith(".gif")) return "gif"

  if (mimeType === "image/png") return "png"
  if (mimeType === "image/webp") return "webp"
  if (mimeType === "image/gif") return "gif"

  return "jpg"
}
