import { GalleryPageContent } from "@/components/gallery/gallery-page-content"
import { getGalleryPageActivities } from "@/lib/gallery"

export default async function GalleryPage() {
  const activities = await getGalleryPageActivities()

  return <GalleryPageContent activities={activities} />
}
