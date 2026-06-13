import { desc } from "drizzle-orm"

import { db, schema } from "@/lib/db"
import { createSignedStorageUrl } from "@/lib/supabase/storage"

export type TestimonialView = {
  id: string
  name: string
  designation: string
  quote: string
  imagePath: string
  imageUrl: string | null
  createdAt: Date
}

export async function getTestimonials() {
  return db
    .select()
    .from(schema.testimonials)
    .orderBy(desc(schema.testimonials.createdAt))
}

export async function getTestimonialsWithImageUrls(): Promise<TestimonialView[]> {
  const testimonials = await getTestimonials()

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
        name: item.name,
        designation: item.designation,
        quote: item.quote,
        imagePath: item.imagePath,
        imageUrl,
        createdAt: item.createdAt,
      }
    })
  )
}
