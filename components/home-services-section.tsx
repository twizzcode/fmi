import { connection } from "next/server"
import { FileTextIcon, GlobeIcon, RocketIcon, BackpackIcon } from "@radix-ui/react-icons"

import { BlurFade } from "@/components/ui/blur-fade"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { featureLinks } from "@/lib/site-data"
import { getServicesWithImageUrls } from "@/lib/services"

const featureIcons = [FileTextIcon, RocketIcon, GlobeIcon, BackpackIcon]

export async function HomeServicesSection() {
  await connection()

  const servicesFromDb = await getServicesWithImageUrls().catch(() => [])

  const services =
    servicesFromDb.length > 0
      ? servicesFromDb.map((item) => ({
          title: item.title,
          description: item.description,
          buttonLabel: item.buttonLabel,
          href: item.href,
          image: item.imageUrl ?? "/images/foto bersama.jpg",
        }))
      : featureLinks

  return (
    <section className="bg-slate-50 py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <BlurFade inView delay={0.04} className="mb-10 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Layanan Kami
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
            Layanan penunjang bagi mahasiswa, jejaring organisasi, dan pihak
            eksternal yang ingin terhubung dengan FMI FMIPA UNNES.
          </p>
        </BlurFade>

        <BentoGrid className="auto-rows-[26rem] grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((item, index) => (
            <BlurFade
              key={`${item.title}-${index}`}
              inView
              delay={0.06 + index * 0.07}
              className="h-full"
            >
              <BentoCard
                Icon={featureIcons[index % featureIcons.length] ?? FileTextIcon}
                name={item.title}
                description={item.description}
                href={item.href}
                cta={item.buttonLabel}
                image={item.image}
                className="col-span-1 rounded-2xl border border-slate-300 bg-white"
                background={
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(63,103,156,0.12),_transparent_42%)]" />
                }
              />
            </BlurFade>
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}
