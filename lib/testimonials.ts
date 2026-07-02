import { and, desc, eq, sql } from "drizzle-orm"

import { db, schema } from "@/lib/db"
import type { TestimonialStatus } from "@/lib/db/schema"
import { createSignedStorageUrl } from "@/lib/supabase/storage"

export type TestimonialView = {
  id: string
  userId: string | null
  name: string
  designation: string
  quote: string
  imagePath: string
  imageUrl: string | null
  status: string
  createdAt: Date
}

export async function getApprovedTestimonials() {
  return db
    .select()
    .from(schema.testimonials)
    .where(eq(schema.testimonials.status, "approved"))
    .orderBy(desc(schema.testimonials.createdAt))
}

export async function getTestimonials(userId?: string) {
  return db
    .select()
    .from(schema.testimonials)
    .where(userId ? eq(schema.testimonials.userId, userId) : undefined)
    .orderBy(desc(schema.testimonials.createdAt))
}

export async function getApprovedTestimonialsWithImageUrls(): Promise<TestimonialView[]> {
  const testimonials = await getApprovedTestimonials()

  return Promise.all(
    testimonials.map(async (item) => {
      let imageUrl: string | null = null

      try {
        imageUrl = await createSignedStorageUrl(item.imagePath)
      } catch {
        imageUrl = null
      }

      return {
        id: item.id,
        userId: item.userId,
        name: item.name,
        designation: item.designation,
        quote: item.quote,
        imagePath: item.imagePath,
        imageUrl,
        status: item.status,
        createdAt: item.createdAt,
      }
    })
  )
}

export async function getTestimonialsWithImageUrls(userId?: string): Promise<TestimonialView[]> {
  const testimonials = await getTestimonials(userId)

  return mapTestimonialsWithImageUrls(testimonials)
}

export async function getPaginatedTestimonialsWithImageUrls({
  page,
  pageSize,
  userId,
  status,
}: {
  page: number
  pageSize: number
  userId?: string
  status?: TestimonialStatus | "all"
}) {
  const currentPage = Math.max(1, page)
  const offset = (currentPage - 1) * pageSize
  const whereClause =
    userId && status && status !== "all"
      ? and(eq(schema.testimonials.userId, userId), eq(schema.testimonials.status, status))
      : userId
        ? eq(schema.testimonials.userId, userId)
        : status && status !== "all"
          ? eq(schema.testimonials.status, status)
          : undefined

  const [countResult, testimonials] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.testimonials)
      .where(whereClause),
    db
      .select()
      .from(schema.testimonials)
      .where(whereClause)
      .orderBy(desc(schema.testimonials.createdAt))
      .limit(pageSize)
      .offset(offset),
  ])

  return {
    totalCount: countResult[0]?.count ?? 0,
    items: await mapTestimonialsWithImageUrls(testimonials),
  }
}

export async function getTestimonialById(id: string, userId?: string): Promise<TestimonialView | null> {
  const [item] = await db
    .select()
    .from(schema.testimonials)
    .where(
      userId
        ? and(eq(schema.testimonials.id, id), eq(schema.testimonials.userId, userId))
        : eq(schema.testimonials.id, id)
    )
    .limit(1)

  if (!item) {
    return null
  }

  const [testimonial] = await mapTestimonialsWithImageUrls([item])

  return testimonial ?? null
}

async function mapTestimonialsWithImageUrls(
  testimonials: Array<typeof schema.testimonials.$inferSelect>
): Promise<TestimonialView[]> {
  return Promise.all(
    testimonials.map(async (item) => {
      let imageUrl: string | null = null

      try {
        imageUrl = await createSignedStorageUrl(item.imagePath)
      } catch {
        imageUrl = null
      }

      return {
        id: item.id,
        userId: item.userId,
        name: item.name,
        designation: item.designation,
        quote: item.quote,
        imagePath: item.imagePath,
        imageUrl,
        status: item.status,
        createdAt: item.createdAt,
      }
    })
  )
}
