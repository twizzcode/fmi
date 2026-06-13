import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";

export default function AboutLdjPage() {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Tentang LDJ"
        title="Mengenal Lembaga Dakwah Jurusan"
        description="LDJ adalah ruang dakwah di tingkat jurusan yang bergerak bersama FMI untuk menguatkan pembinaan, ukhuwah, dan syiar di lingkungan FMIPA UNNES."
      />

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <BlurFade inView delay={0.04}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#3f679c]">
                Peran LDJ
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Jaringan dakwah yang tumbuh dekat dengan mahasiswa di tiap jurusan.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
                Lembaga Dakwah Jurusan hadir sebagai simpul gerakan yang lebih
                dekat dengan kultur, kebutuhan, dan dinamika mahasiswa pada
                masing-masing jurusan. Melalui LDJ, proses syiar, pembinaan,
                dan penguatan komunitas bisa berjalan lebih kontekstual dan
                berkelanjutan.
              </p>
              <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">
                FMI berperan sebagai ruang koordinasi tingkat fakultas yang
                menghubungkan semangat gerak LDJ agar tetap saling menguatkan,
                searah dalam nilai, dan mampu berkolaborasi dalam program yang
                lebih luas.
              </p>
            </div>
          </BlurFade>

          <BlurFade inView delay={0.1}>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-[0_18px_50px_rgba(148,163,184,0.12)]">
              <h3 className="text-xl font-bold tracking-tight text-slate-900">
                Fokus gerak LDJ
              </h3>
              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  Membina mahasiswa muslim di level jurusan dengan pendekatan
                  yang lebih dekat dan personal.
                </p>
                <p>
                  Menjadi penggerak kajian, mentoring, dan ruang kebersamaan yang
                  relevan dengan konteks akademik masing-masing jurusan.
                </p>
                <p>
                  Menjalin sinergi dengan FMI untuk memperluas dampak syiar dan
                  kebermanfaatan di lingkungan FMIPA.
                </p>
              </div>

              <div className="mt-8">
                <Button
                  asChild
                  className="h-11 rounded-full bg-[#3f679c] px-6 text-sm font-semibold text-white hover:bg-[#355887]"
                >
                  <Link href="/lembaga-dakwah-jurusan">Lihat Daftar LDJ</Link>
                </Button>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    </div>
  );
}
