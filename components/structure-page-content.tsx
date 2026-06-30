import Image from "next/image"
import { Users2, UserRound, Venus } from "lucide-react"

import CardFlip from "@/components/kokonutui/card-flip"
import { StructureCabinetSelector } from "@/components/structure-cabinet-selector"
import {
  getStructureCabinetHref,
  type StructureCabinetData,
} from "@/lib/structure"

export function StructurePageContent({
  cabinets,
  currentCabinetId,
}: {
  cabinets: StructureCabinetData[]
  currentCabinetId: string
}) {
  const currentCabinet =
    cabinets.find((cabinet) => cabinet.id === currentCabinetId) ?? cabinets[0] ?? null
  const members = currentCabinet?.sections.flatMap((section) => section.members) ?? []
  const ikhwanCount = members.filter((member) => member.gender === "ikhwan").length
  const akhwatCount = members.filter((member) => member.gender === "akhwat").length
  const totalCount = members.length

  if (!currentCabinet) {
    return null
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="space-y-16 md:space-y-24">
        <section className="py-2">
          <div className="flex justify-center">
            <StructureCabinetSelector
              cabinets={cabinets.map((cabinet) => ({
                id: cabinet.id,
                name: cabinet.name,
                logoPath: cabinet.logoUrl || cabinet.logoPath,
                orderLabel: cabinet.orderLabel,
                href: getStructureCabinetHref(cabinet.id),
              }))}
              selectedId={currentCabinet.id}
            />
          </div>
          <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#5c7fae]">
            Nama Kabinet
          </p>
          <h2 className="mt-4 text-center text-4xl font-bold tracking-tight text-[#18365e] md:text-6xl">
            {currentCabinet.name}
          </h2>
          <p className="mt-4 text-center text-lg font-medium leading-8 text-[#45658f]">
            {currentCabinet.theme}
          </p>
        </section>

        <section className="grid gap-10 md:grid-cols-[300px_minmax(0,1fr)] md:items-center">
          <div className="flex items-center justify-center rounded-[1.75rem] bg-[radial-gradient(circle_at_top,_rgba(141,179,226,0.22),_transparent_60%),linear-gradient(180deg,#f8fbff_0%,#edf4fb_100%)] p-8">
            {currentCabinet.logoUrl || currentCabinet.logoPath ? (
              <Image
                src={currentCabinet.logoUrl || currentCabinet.logoPath}
                alt={currentCabinet.name}
                width={260}
                height={260}
                className="h-auto w-full max-w-[240px] object-contain"
              />
            ) : (
              <div className="text-center text-sm text-slate-400">
                Logo kabinet belum diisi
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5c7fae]">
              Logo Dan Filosofi
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#18365e]">
              Logo Kabinet
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {currentCabinet.philosophy}
            </p>
          </div>
        </section>

        <section>
          <div className="grid gap-8 md:grid-cols-3">
            <StatCard
              label="Total Fungsionaris"
              value={String(totalCount)}
              description="Jumlah keseluruhan pengurus aktif di struktur FMI."
              icon={<Users2 className="h-5 w-5" />}
            />
            <StatCard
              label="Fungsionaris Ikhwan"
              value={String(ikhwanCount)}
              description="Komposisi pengurus ikhwan dalam kabinet periode ini."
              icon={<UserRound className="h-5 w-5" />}
            />
            <StatCard
              label="Fungsionaris Akhwat"
              value={String(akhwatCount)}
              description="Komposisi pengurus akhwat dalam kabinet periode ini."
              icon={<Venus className="h-5 w-5" />}
            />
          </div>
        </section>

        <div className="space-y-20 md:space-y-24">
          {currentCabinet.sections.map((section) => (
            <section key={section.department}>
              <div className="mb-8 flex items-center gap-5">
                <div className="h-px flex-1 bg-slate-200" />
                <h2 className="text-center text-xl font-bold uppercase tracking-[0.25em] text-slate-800 md:text-2xl">
                  {section.department}
                </h2>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {section.members.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center text-sm text-slate-500">
                  Belum ada fungsionaris di departemen ini.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {section.members.map((member) => (
                    <div key={member.id} className="w-full">
                      <CardFlip
                        title={member.name}
                        nickname={member.nickname || member.name.split(" ")[0] || member.name}
                        role={member.position}
                        major={member.program}
                        entryYear={member.entryYear}
                        quote={member.quote}
                        imageSrc={member.photoUrl || member.photoPath || "/images/foto bersama.jpg"}
                        imageAlt={member.name}
                        socials={{
                          instagram: member.instagram
                            ? `https://instagram.com/${member.instagram.replace("@", "")}`
                            : undefined,
                          tiktok: member.tiktok || undefined,
                          youtube: member.youtube || undefined,
                          linkedin: member.linkedin || undefined,
                          github: member.github || undefined,
                          website: member.website || undefined,
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dce8f6] text-[#3f679c]">
          {icon}
        </div>
        <p className="text-4xl font-bold tracking-tight text-[#18365e]">{value}</p>
      </div>
      <h3 className="mt-5 text-base font-semibold text-[#27466f]">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  )
}
