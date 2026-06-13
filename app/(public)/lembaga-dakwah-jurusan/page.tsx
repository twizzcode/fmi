import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { ldjItems } from "@/lib/site-data";

export default function LdjPage() {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="LDJ FMI"
        title="Lembaga Dakwah Jurusan"
        description="Halaman pengenalan lembaga dakwah jurusan di bawah naungan FMI FMIPA UNNES, disajikan sebagai grid kartu yang siap dihubungkan ke data dinamis."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {ldjItems.map((item) => (
            <Card key={item.name} className="p-0">
              <CardContent className="flex h-full flex-col p-8">
                <div className="relative mb-8 flex h-32 items-center justify-center">
                  <div className="absolute inset-x-12 inset-y-2 rounded-full bg-[radial-gradient(circle,_rgba(138,180,227,0.22),_transparent_70%)]" />
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={140}
                    height={140}
                    className="relative h-auto max-h-28 w-auto"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {item.name}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.instagramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(90deg,#833ab4_0%,#fd1d1d_52%,#fcb045_100%)] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200/60 transition hover:brightness-110"
                >
                  Kunjungi Instagram
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
