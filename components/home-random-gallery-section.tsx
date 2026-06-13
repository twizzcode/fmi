import { connection } from "next/server"

import { BlurFade } from "@/components/ui/blur-fade"
import { ImageGallery, type ImageItem } from "@/components/ui/image-gallery"
import { getGalleryVisuals } from "@/lib/gallery"

export async function HomeRandomGallerySection() {
  await connection()

  const visuals = await getGalleryVisuals(18)
  const images = shuffleArray(visuals).slice(0, 9).map<ImageItem>((item) => ({
    src: item.src,
    alt: item.alt,
  }))

  if (images.length === 0) {
    return null
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 md:pb-28">
      <BlurFade inView delay={0.08}>
        <ImageGallery
          images={images}
          gap={20}
          lazyLoading
          columns={{
            desktop: 3,
            tablet: 2,
            mobile: 1,
          }}
          className="w-full"
        />
      </BlurFade>
    </section>
  )
}

function shuffleArray<T>(items: T[]) {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[randomIndex]] = [next[randomIndex], next[index]]
  }

  return next
}
