import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { structureSections } from "@/lib/site-data";

export default function StructurePage() {
  return (
    <div className="bg-[var(--muted)]">
      <PageHero
        eyebrow="Struktur Organisasi"
        title="Susunan Pengurus FMI FMIPA UNNES"
        description="Tampilan ini disusun mengikuti pola halaman Laravel sebelumnya dengan pendekatan kartu horizontal yang tetap nyaman untuk perangkat mobile."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="space-y-12">
          {structureSections.map((section) => (
            <section key={section.department}>
              <div className="mb-8 flex items-center gap-5">
                <div className="h-px flex-1 bg-slate-200" />
                <h2 className="text-center text-xl font-bold uppercase tracking-[0.25em] text-slate-800 md:text-2xl">
                  {section.department}
                </h2>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="scrollbar-hide flex snap-x gap-6 overflow-x-auto pb-4">
                {section.members.map((member) => (
                  <Card
                    key={`${section.department}-${member.name}`}
                    className="min-w-[280px] snap-center md:min-w-[320px]"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full ring-4 ring-[var(--accent)] ring-offset-4 ring-offset-white">
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={160}
                          height={160}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.24em] text-[var(--primary)]">
                        {member.position}
                      </p>
                      <p className="mt-4 text-sm text-slate-500">{member.program}</p>
                      <a
                        href={`https://instagram.com/${member.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex rounded-full border border-pink-200 px-4 py-2 text-sm font-medium text-pink-600 transition hover:border-pink-300 hover:bg-pink-50"
                      >
                        {member.instagram}
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
