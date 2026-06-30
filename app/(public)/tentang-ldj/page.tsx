import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { ldjItems } from "@/lib/site-data";

export default function AboutLdjPage() {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Tentang LDJ"
        title="Mengenal Lembaga Dakwah Jurusan"
        description="LDJ adalah ruang dakwah di tingkat jurusan yang bergerak bersama FMI untuk menguatkan pembinaan, ukhuwah, dan syiar di lingkungan FMIPA UNNES."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <BlurFade inView delay={0.04}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#3f679c]">
              Peran LDJ
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Jaringan dakwah yang tumbuh dekat dengan mahasiswa di tiap jurusan.
            </h2>
            <div className="mt-5 space-y-4 text-base leading-8 text-slate-600 md:text-lg">
              <p>
                Lembaga Dakwah Jurusan hadir sebagai simpul gerakan yang lebih
                dekat dengan kultur, kebutuhan, dan dinamika mahasiswa pada
                masing-masing jurusan. Melalui LDJ, proses syiar, pembinaan,
                dan penguatan komunitas bisa berjalan lebih kontekstual dan
                berkelanjutan.
              </p>
              <p>
                FMI berperan sebagai ruang koordinasi tingkat fakultas yang
                menghubungkan semangat gerak LDJ agar tetap saling menguatkan,
                searah dalam nilai, dan mampu berkolaborasi dalam program yang
                lebih luas.
              </p>
              <p>
                Di level jurusan, LDJ membina mahasiswa muslim dengan pendekatan
                yang lebih dekat dan personal, menjadi penggerak kajian,
                mentoring, serta ruang kebersamaan yang relevan dengan konteks
                akademik masing-masing jurusan, sekaligus menjalin sinergi dengan
                FMI untuk memperluas dampak syiar dan kebermanfaatan di lingkungan
                FMIPA.
              </p>
            </div>
          </div>
        </BlurFade>
      </section>

      <section id="daftar-ldj" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#3f679c]">
            Daftar LDJ
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Enam lembaga dakwah jurusan yang bergerak bersama FMI.
          </h2>
        </div>

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
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#3f679c]">
                    {item.department}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
