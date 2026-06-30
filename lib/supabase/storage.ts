import { randomUUID } from "node:crypto"
import sharp from "sharp"

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
  const optimizedBuffer = await optimizeImageForStorage(file)
  const fileName = `${randomUUID()}.webp`
  const objectPath = `${folder}/${fileName}`

  const { error } = await supabase.storage
    .from(supabaseStorageBucket)
    .upload(objectPath, optimizedBuffer, {
      cacheControl: "3600",
      contentType: "image/webp",
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
  await deleteStorageObjects([path])
}

export async function deleteStorageObjects(paths: string[]) {
  const normalizedPaths = Array.from(
    new Set(paths.filter((path) => isStorageObjectPath(path)))
  )

  if (normalizedPaths.length === 0) {
    return
  }

  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.storage
    .from(supabaseStorageBucket)
    .remove(normalizedPaths)

  if (error) {
    throw error
  }
}

export function isStorageObjectPath(path: string) {
  return !path.startsWith("/") && !path.startsWith("http://") && !path.startsWith("https://")
}

async function optimizeImageForStorage(file: File) {
  const sourceBuffer = Buffer.from(await file.arrayBuffer())
  const image = sharp(sourceBuffer, {
    animated: file.type === "image/gif",
  })

  return image
    .rotate()
    .resize({
      width: 2200,
      height: 2200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 82,
      effort: 5,
    })
    .toBuffer()
}
