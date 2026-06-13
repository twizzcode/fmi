import { asc, desc } from "drizzle-orm"

import { db, schema } from "@/lib/db"
import { createSignedStorageUrl } from "@/lib/supabase/storage"

export type ServiceView = {
  id: string
  title: string
  description: string
  buttonLabel: string
  href: string
  imagePath: string
  imageUrl: string | null
  sortOrder: number
  createdAt: Date
}

export async function getServices() {
  return db
    .select()
    .from(schema.services)
    .orderBy(asc(schema.services.sortOrder), desc(schema.services.createdAt))
}

export async function getServicesWithImageUrls(): Promise<ServiceView[]> {
  const services = await getServices()

  return Promise.all(
    services.map(async (item) => {
      let imageUrl: string | null = item.imagePath

      try {
        imageUrl = await createSignedStorageUrl(item.imagePath)
      } catch {
        imageUrl = item.imagePath
      }

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        buttonLabel: item.buttonLabel,
        href: item.href,
        imagePath: item.imagePath,
        imageUrl,
        sortOrder: item.sortOrder,
        createdAt: item.createdAt,
      }
    })
  )
}
