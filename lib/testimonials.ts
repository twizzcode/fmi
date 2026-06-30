import { desc, eq } from "drizzle-orm"

import { db, schema } from "@/lib/db"
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
