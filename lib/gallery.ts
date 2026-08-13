import { and, asc, desc, eq, inArray, sql } from "drizzle-orm"

import type { ImageItem } from "@/components/ui/image-gallery"
import { db, schema } from "@/lib/db"
import type { GalleryStatus } from "@/lib/db/schema"
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

export type GalleryActivityMinimal = {
  id: string
  title: string
  eventDate: Date
  eventDateLabel: string
  eventDateValue: string
  coverImageUrl: string | null
  photoCount: number
  status: string
}

function shuffle<T>(items: T[]) {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1))
    const current = result[index]
    result[index] = result[nextIndex]
    result[nextIndex] = current
  }

  return result
}

export async function getGalleryVisuals(limit = 24): Promise<GalleryVisual[]> {
  const activities = (await getGalleryActivities().catch(() => [])).filter(
    (activity) => activity.status === "approved"
  )
  const visuals = shuffle(
    activities.flatMap((activity) =>
      activity.photos
        .filter((photo) => photo.url)
        .map((photo) => ({
          id: photo.id,
          src: photo.url ?? "",
          alt: photo.alt,
          title: activity.title,
        }))
    )
  ).slice(0, limit)

  return visuals
}

export async function getGalleryActivities(userId?: string): Promise<GalleryActivity[]> {
  const entries = await db
    .select()
    .from(schema.galleryEntries)
    .where(userId ? eq(schema.galleryEntries.userId, userId) : undefined)
    .orderBy(desc(schema.galleryEntries.eventDate), desc(schema.galleryEntries.createdAt))

  return mapGalleryActivities(entries)
}

export async function getPaginatedGalleryActivities({
  page,
  pageSize,
  userId,
  status,
  minimal = false,
}: {
  page: number
  pageSize: number
  userId?: string
  status?: GalleryStatus | "all"
  minimal?: boolean
}): Promise<{ totalCount: number; items: GalleryActivity[] | GalleryActivityMinimal[] }> {
  const currentPage = Math.max(1, page)
  const offset = (currentPage - 1) * pageSize
  const whereClause =
    userId && status && status !== "all"
      ? and(eq(schema.galleryEntries.userId, userId), eq(schema.galleryEntries.status, status))
      : userId
        ? eq(schema.galleryEntries.userId, userId)
        : status && status !== "all"
          ? eq(schema.galleryEntries.status, status)
          : undefined

  const [countResult, entries] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.galleryEntries)
      .where(whereClause),
    db
      .select()
      .from(schema.galleryEntries)
      .where(whereClause)
      .orderBy(desc(schema.galleryEntries.eventDate), desc(schema.galleryEntries.createdAt))
      .limit(pageSize)
      .offset(offset),
  ])

  if (minimal) {
    return {
      totalCount: countResult[0]?.count ?? 0,
      items: await mapGalleryActivitiesMinimal(entries),
    }
  }

  return {
    totalCount: countResult[0]?.count ?? 0,
    items: await mapGalleryActivities(entries),
  }
}

export async function getGalleryActivityById(id: string, userId?: string): Promise<GalleryActivity | null> {
  const entries = await db
    .select()
    .from(schema.galleryEntries)
    .where(
      userId
        ? and(eq(schema.galleryEntries.id, id), eq(schema.galleryEntries.userId, userId))
        : eq(schema.galleryEntries.id, id)
    )
    .limit(1)

  const [item] = await mapGalleryActivities(entries)

  return item ?? null
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
  const entries = await db
    .select({
      id: schema.galleryEntries.id,
      title: schema.galleryEntries.title,
      eventDate: schema.galleryEntries.eventDate,
    })
    .from(schema.galleryEntries)
    .where(eq(schema.galleryEntries.status, "approved"))
    .orderBy(desc(schema.galleryEntries.eventDate), desc(schema.galleryEntries.createdAt))

  if (entries.length === 0) {
    return []
  }

  const photos = await db
    .select({
      id: schema.galleryPhotos.id,
      galleryEntryId: schema.galleryPhotos.galleryEntryId,
      storagePath: schema.galleryPhotos.storagePath,
      sortOrder: schema.galleryPhotos.sortOrder,
      createdAt: schema.galleryPhotos.createdAt,
    })
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

  const signedUrlMap = new Map<string, string | null>()
  await Promise.all(
    photos.map(async (photo) => {
      if (signedUrlMap.has(photo.storagePath)) {
        return
      }

      try {
        const url = await createSignedStorageUrl(photo.storagePath)
        signedUrlMap.set(photo.storagePath, url)
      } catch {
        signedUrlMap.set(photo.storagePath, null)
      }
    })
  )

  return entries
    .map((entry) => {
      const entryPhotos = photoMap.get(entry.id) ?? []

      return {
        id: entry.id,
        title: entry.title,
        dateISO: entry.eventDate.toISOString().slice(0, 10),
        formattedDate: formatGalleryDate(entry.eventDate),
        images: entryPhotos
          .map<ImageItem>((photo, index) => ({
            src: signedUrlMap.get(photo.storagePath) ?? "",
            alt: `${entry.title} ${index + 1}`,
          }))
          .filter((photo) => photo.src),
      }
    })
    .filter((activity) => activity.images.length > 0)
}

async function mapGalleryActivities(
  entries: Array<typeof schema.galleryEntries.$inferSelect>
): Promise<GalleryActivity[]> {
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

async function mapGalleryActivitiesMinimal(
  entries: Array<typeof schema.galleryEntries.$inferSelect>
): Promise<GalleryActivityMinimal[]> {
  if (entries.length === 0) {
    return []
  }

  const photoCounts = await db
    .select({
      galleryEntryId: schema.galleryPhotos.galleryEntryId,
      count: sql<number>`count(*)::int`,
    })
    .from(schema.galleryPhotos)
    .where(
      inArray(
        schema.galleryPhotos.galleryEntryId,
        entries.map((entry) => entry.id)
      )
    )
    .groupBy(schema.galleryPhotos.galleryEntryId)

  const photoCountMap = new Map<string, number>()
  for (const row of photoCounts) {
    photoCountMap.set(row.galleryEntryId, row.count)
  }

  const coverPaths = Array.from(new Set(entries.map((entry) => entry.storagePath)))
  const signedUrlMap = new Map<string, string | null>()
  await Promise.all(
    coverPaths.map(async (path) => {
      try {
        const url = await createSignedStorageUrl(path)
        signedUrlMap.set(path, url)
      } catch {
        signedUrlMap.set(path, null)
      }
    })
  )

  return entries.map((entry) => ({
    id: entry.id,
    title: entry.title,
    eventDate: entry.eventDate,
    eventDateLabel: formatGalleryDate(entry.eventDate),
    eventDateValue: entry.eventDate.toISOString().slice(0, 10),
    coverImageUrl: signedUrlMap.get(entry.storagePath) ?? null,
    photoCount: photoCountMap.get(entry.id) ?? 0,
    status: entry.status ?? "approved",
  }))
}

function formatGalleryDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}
