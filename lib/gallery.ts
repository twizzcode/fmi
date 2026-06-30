import { asc, desc, eq, inArray } from "drizzle-orm"

import type { ImageItem } from "@/components/ui/image-gallery"
import { db, schema } from "@/lib/db"
import { createSignedStorageUrl } from "@/lib/supabase/storage"

export type GalleryVisual = {
  id: string
  src: string
  alt: string
  title: string
  category?: string
}

export type GalleryPhotoView = {
  id: string
  path: string
  url: string | null
  alt: string
  sortOrder: number
}

export type GalleryActivity = {
  id: string
  title: string
  eventDate: Date
  eventDateLabel: string
  eventDateValue: string
  coverImageUrl: string | null
  photoCount: number
  photos: GalleryPhotoView[]
  status: string
}

export async function getGalleryVisuals(limit = 24): Promise<GalleryVisual[]> {
  const activities = (await getGalleryActivities().catch(() => [])).filter(
    (activity) => activity.status === "approved"
  )
  const visuals = activities
    .flatMap((activity) =>
      activity.photos
        .filter((photo) => photo.url)
        .map((photo) => ({
          id: photo.id,
          src: photo.url ?? "",
          alt: photo.alt,
          title: activity.title,
        }))
    )
    .slice(0, limit)

  return visuals
}

export async function getGalleryActivities(userId?: string): Promise<GalleryActivity[]> {
  const entries = await db
    .select()
    .from(schema.galleryEntries)
    .where(userId ? eq(schema.galleryEntries.userId, userId) : undefined)
    .orderBy(desc(schema.galleryEntries.eventDate), desc(schema.galleryEntries.createdAt))

  if (entries.length === 0) {
    return []
  }

  const photos = await db
    .select()
    .from(schema.galleryPhotos)
    .where(
      inArray(
        schema.galleryPhotos.galleryEntryId,
        entries.map((entry) => entry.id)
      )
    )
    .orderBy(
      asc(schema.galleryPhotos.galleryEntryId),
      asc(schema.galleryPhotos.sortOrder),
      asc(schema.galleryPhotos.createdAt)
    )

  const photoMap = new Map<string, typeof photos>()
  for (const photo of photos) {
    const existing = photoMap.get(photo.galleryEntryId) ?? []
    existing.push(photo)
    photoMap.set(photo.galleryEntryId, existing)
  }

  const uniquePaths = Array.from(
    new Set([
      ...entries.map((entry) => entry.storagePath),
      ...photos.map((photo) => photo.storagePath),
    ])
  )

  const signedUrlMap = new Map<string, string | null>()
  await Promise.all(
    uniquePaths.map(async (path) => {
      try {
        const url = await createSignedStorageUrl(path)
        signedUrlMap.set(path, url)
      } catch {
        signedUrlMap.set(path, null)
      }
    })
  )

  return entries.map((entry) => {
    const entryPhotos = photoMap.get(entry.id) ?? []
    const normalizedPhotos =
      entryPhotos.length > 0
        ? entryPhotos
        : [
            {
              id: `legacy-${entry.id}`,
              galleryEntryId: entry.id,
              storagePath: entry.storagePath,
              sortOrder: 0,
              createdAt: entry.createdAt,
            },
          ]

    return {
      id: entry.id,
      title: entry.title,
      eventDate: entry.eventDate,
      eventDateLabel: formatGalleryDate(entry.eventDate),
      eventDateValue: entry.eventDate.toISOString().slice(0, 10),
      coverImageUrl: signedUrlMap.get(entry.storagePath) ?? null,
      photoCount: normalizedPhotos.length,
      status: entry.status ?? "approved",
      photos: normalizedPhotos.map((photo, index) => ({
        id: photo.id,
        path: photo.storagePath,
        url: signedUrlMap.get(photo.storagePath) ?? null,
        alt: `${entry.title} ${index + 1}`,
        sortOrder: photo.sortOrder,
      })),
    }
  })
}

export async function getGalleryPageActivities(): Promise<
  Array<{
    id: string
    title: string
    dateISO: string
    formattedDate: string
    images: ImageItem[]
  }>
> {
  const activities = (await getGalleryActivities().catch(() => [])).filter(
    (activity) => activity.status === "approved"
  )

  return activities
    .map((activity) => ({
      id: activity.id,
      title: activity.title,
      dateISO: activity.eventDateValue,
      formattedDate: activity.eventDateLabel,
      images: activity.photos
        .filter((photo) => photo.url)
        .map<ImageItem>((photo) => ({
          src: photo.url ?? "",
          alt: photo.alt,
        })),
    }))
    .filter((activity) => activity.images.length > 0)
}

function formatGalleryDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}
