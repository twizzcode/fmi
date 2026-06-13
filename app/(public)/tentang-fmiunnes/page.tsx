import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { departmentProfiles, siteStats, visionMission } from "@/lib/site-data";

export default function AboutPage() {
  return (
    <div className="bg-[var(--muted)]">
      <PageHero
        eyebrow="Tentang FMI"
        title="Wadah Dakwah dan Tumbuh Bersama Mahasiswa FMIPA"
        description="Mengenal lebih dekat Forum Mahasiswa Islam FMIPA UNNES sebagai ruang pembinaan, kolaborasi, dan pengembangan diri."
      />

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--secondary)]">
              Siapa Kami
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Organisasi fakultas yang fokus pada ruhiyah, kaderisasi, dan
              kebermanfaatan.
            </h2>
            <p className="text-base leading-8 text-slate-600 md:text-lg">
              Forum Mahasiswa Islam Fakultas Matematika dan Ilmu Pengetahuan Alam
              Universitas Negeri Semarang adalah lembaga kemahasiswaan tingkat
              fakultas yang menjadi salah satu pusat dakwah kampus sekaligus sarana
              belajar berorganisasi.
            </p>
            <p className="text-base leading-8 text-slate-600 md:text-lg">
              Di tahap slicing ini, konten backend masih dimock agar struktur
              halaman dan komponen siap disambungkan ke data Laravel atau API
              Next.js di tahap berikutnya.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <a href="/struktur-fmiunnes">Lihat Susunan Pengurus</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/kontak">Hubungi Kami</a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,_rgba(157,178,206,0.32),_transparent_70%)]" />
            <div className="relative rounded-[2.5rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(240,245,250,0.88))] p-8 shadow-[0_24px_80px_rgba(148,163,184,0.22)]">
              <div className="flex justify-center">
                <Image
                  src="/images/Logo FMI hitam.png"
                  alt="Logo FMI"
                  width={300}
                  height={300}
                  className="h-auto w-full max-w-[260px]"
                />
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {siteStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-white/80 p-4 text-center shadow-sm ring-1 ring-black/5"
                  >
                    <div className="text-2xl font-bold text-slate-900">
                      {item.value}
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">
              Visi & Misi
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Arah gerak yang membangun ekosistem komunitas kampus.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-l-4 border-l-[var(--primary)]">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900">Visi</h3>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  {visionMission.vision}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-slate-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900">Misi</h3>
                <div className="mt-5 space-y-4">
                  {visionMission.mission.map((item) => (
                    <div key={item} className="flex gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-[var(--primary-foreground)]">
                        ✓
                      </span>
                      <p className="text-base leading-7 text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--secondary)]">
              Departemen
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Pengenalan singkat tiap bidang kerja FMI.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {departmentProfiles.map((department) => (
              <Card key={department.name} className="overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={department.image}
                    alt={department.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold uppercase tracking-[0.06em] text-slate-900">
                    {department.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {department.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
