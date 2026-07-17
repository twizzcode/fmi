import { BlurFade } from "@/components/ui/blur-fade"
import { ImageGallery, type ImageItem } from "@/components/ui/image-gallery"
import { getGalleryVisuals } from "@/lib/gallery"

export async function HomeRandomGallerySection() {
  const visuals = await getGalleryVisuals(9)
  const images = visuals.map<ImageItem>((item) => ({
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
            mobile: 2,
          }}
          className="w-full"
        />
      </BlurFade>
    </section>
  )
}
