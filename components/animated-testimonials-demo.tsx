import { connection } from "next/server"

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"
import { getApprovedTestimonialsWithImageUrls } from "@/lib/testimonials"

export default async function AnimatedTestimonialsDemo() {
  await connection()

  const testimonialsFromDb = await getApprovedTestimonialsWithImageUrls().catch(
    () => []
  )

  const testimonialsFromDbWithImages = testimonialsFromDb
    .filter((item) => item.imageUrl)
    .map((item) => ({
      quote: item.quote,
      name: item.name,
      designation: item.designation,
      src: item.imageUrl ?? "/images/foto bersama.jpg",
    }))

  if (testimonialsFromDbWithImages.length === 0) {
    return null
  }

  return <AnimatedTestimonials testimonials={testimonialsFromDbWithImages} autoplay />
}
