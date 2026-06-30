import type { Metadata } from "next"

import { GalleryPageContent } from "@/components/gallery/gallery-page-content"
import { getGalleryPageActivities } from "@/lib/gallery"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Galeri FMI UNNES",
  description: "Lihat galeri kegiatan FMI FMIPA UNNES dalam dokumentasi foto dan momen organisasi.",
  alternates: {
    canonical: "/galeri-fmiunnes",
  },
}

export default async function GalleryPage() {
  const activities = await getGalleryPageActivities()

  return <GalleryPageContent activities={activities} />
}
