import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PageHero } from "@/components/page-hero"
import { StructurePageContent } from "@/components/structure-page-content"
import { getStructureCabinetPageData } from "@/lib/structure"

export const dynamic = "force-dynamic"

export async function generateMetadata(
  props: PageProps<"/struktur/[id]">
): Promise<Metadata> {
  const { id } = await props.params
  const { currentCabinet } = await getStructureCabinetPageData(id)

  if (!currentCabinet) {
    return {
      title: "Struktur FMI",
      description: "Lihat struktur pengurus FMI FMIPA UNNES.",
    }
  }

  return {
    title: `Struktur ${currentCabinet.name}`,
    description: `Lihat struktur pengurus ${currentCabinet.name} di FMI FMIPA UNNES.`,
    alternates: {
      canonical: `/struktur/${currentCabinet.id}`,
    },
  }
}

export default async function StructureCabinetPage(props: PageProps<"/struktur/[id]">) {
  const { id } = await props.params
  const { cabinets, currentCabinet } = await getStructureCabinetPageData(id)

  if (!currentCabinet) {
    notFound()
  }

  return (
    <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)]">
      <PageHero
        eyebrow="Struktur Organisasi"
        title="Susunan Pengurus FMI FMIPA UNNES"
        description="Lihat struktur pengurus FMI melalui kartu interaktif. Sebelum masuk ke daftar fungsionaris, kenali dulu nama kabinet, filosofi, identitas visual, dan komposisi timnya."
      />

      <StructurePageContent
        cabinets={cabinets}
        currentCabinetId={currentCabinet.id}
      />
    </div>
  )
}
