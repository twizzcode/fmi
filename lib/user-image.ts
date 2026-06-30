import { createSignedStorageUrl } from "@/lib/supabase/storage"

export async function resolveUserImage(user: {
  image: string | null
  uploadedImagePath: string | null
}) {
  if (user.uploadedImagePath) {
    return createSignedStorageUrl(user.uploadedImagePath).catch(() => user.image)
  }

  return user.image
}
