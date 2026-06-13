import { desc, inArray } from "drizzle-orm"

import { galleryItems as fallbackGalleryItems } from "@/lib/site-data"
import { db, schema } from "@/lib/db"
import {
  isSupabaseStorageConfigured,
  supabaseStorageBucket,
} from "@/lib/supabase/config"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

export type GalleryVisual = {
  id: string
  src: string
  alt: string
  title: string
  category?: string
}

export type AdminGalleryItem = {
  id: string | null
  name: string
  path: string
  signedUrl: string | null
  updatedAt: string | null
  eventDate: Date | null
  eventDateLabel: string | null
  eventDateValue: string
}

const galleryPrefix = "galeri"

export async function getGalleryVisuals(limit = 24): Promise<GalleryVisual[]> {
  if (isSupabaseStorageConfigured()) {
    const items = await getStorageGalleryVisuals(limit).catch(() => [])

    if (items.length > 0) {
      return items
    }
  }

  return fallbackGalleryItems.map((item, index) => ({
    id: `fallback-${index}`,
    src: item.image,
    alt: item.title,
    title: item.title,
    category: item.category,
  }))
}

export async function getAdminGalleryItems(
  limit = 48
): Promise<AdminGalleryItem[]> {
  if (!isSupabaseStorageConfigured()) {
    return []
  }

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase.storage
    .from(supabaseStorageBucket)
    .list(galleryPrefix, {
      limit,
      sortBy: { column: "updated_at", order: "desc" },
    })

  if (error || !data) {
    return []
  }

  const files = data.filter((item) => item.name && !item.id?.endsWith("/"))
  const objectPaths = files.map((item) => `${galleryPrefix}/${item.name}`)

  const metadata =
    objectPaths.length > 0
      ? await db
          .select()
          .from(schema.galleryEntries)
          .where(inArray(schema.galleryEntries.storagePath, objectPaths))
      : []

  const metadataByPath = new Map(
    metadata.map((item) => [item.storagePath, item] as const)
  )

  const items = await Promise.all(
    files.map(async (item) => {
      const objectPath = `${galleryPrefix}/${item.name}`
      const metadataItem = metadataByPath.get(objectPath) ?? null

      const { data: signedData } = await supabase.storage
        .from(supabaseStorageBucket)
        .createSignedUrl(objectPath, 60 * 60)

      return {
        id: metadataItem?.id ?? null,
        name: item.name,
        path: objectPath,
        signedUrl: signedData?.signedUrl ?? null,
        updatedAt: item.updated_at ?? null,
        eventDate: metadataItem?.eventDate ?? null,
        eventDateLabel: metadataItem?.eventDate
          ? formatGalleryDate(metadataItem.eventDate)
          : null,
        eventDateValue: metadataItem?.eventDate
          ? metadataItem.eventDate.toISOString().slice(0, 10)
          : "",
      }
    })
  )

  return items.sort((left, right) => {
    const leftTime = left.eventDate?.getTime() ?? 0
    const rightTime = right.eventDate?.getTime() ?? 0

    if (leftTime !== rightTime) {
      return rightTime - leftTime
    }

    const leftUpdated = left.updatedAt ? new Date(left.updatedAt).getTime() : 0
    const rightUpdated = right.updatedAt ? new Date(right.updatedAt).getTime() : 0

    return rightUpdated - leftUpdated
  })
}

export async function getGalleryEntries() {
  return db
    .select()
    .from(schema.galleryEntries)
    .orderBy(desc(schema.galleryEntries.eventDate))
}

async function getStorageGalleryVisuals(limit: number): Promise<GalleryVisual[]> {
  const items = await getAdminGalleryItems(limit)

  return items
    .filter((item) => item.signedUrl)
    .map((item) => ({
      id: item.id ?? item.path,
      src: item.signedUrl ?? "",
      alt: item.name,
      title: item.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]/g, " "),
    }))
}

function formatGalleryDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}
