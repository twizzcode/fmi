import Link from "next/link";
import { ArrowUpRight, Camera, Mail, MapPin, Users } from "lucide-react";
import {
  InstagramIcon,
  Location01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PageHero } from "@/components/page-hero";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { contactItems } from "@/lib/site-data";

const contactIcons = {
  Alamat: Location01Icon,
  Instagram: InstagramIcon,
  Email: Mail01Icon,
} as const;

const channelCards = [
  {
    title: "Stay in Touch",
    description: "Reach out via email untuk pertanyaan, kolaborasi, atau kebutuhan informasi seputar FMI.",
    href: "mailto:fmi.fmipa@unnes.ac.id",
    cta: "Go to Email",
    icon: Mail,
    className:
      "bg-[linear-gradient(135deg,#c70a0a_0%,#d90416_58%,#8f1212_100%)]",
    span: "lg:col-span-2",
  },
  {
    title: "Follow FMI",
    description: "Ikuti update kegiatan, publikasi, dan dokumentasi keseharian FMI melalui Instagram.",
    href: "https://instagram.com/fmiunnes",
    cta: "Go to Instagram",
    icon: Camera,
    className:
      "bg-[linear-gradient(135deg,#b400ff_0%,#ff2f92_45%,#ff6a00_100%)]",
    span: "lg:col-span-1",
  },
  {
    title: "Let's Connect",
    description: "Terhubung untuk membuka ruang diskusi dan kolaborasi organisasi secara lebih profesional.",
    href: "/kontak",
    cta: "Kolaborasi FMI",
    icon: Users,
    className:
      "bg-[linear-gradient(135deg,#0b6fae_0%,#126ea1_48%,#0e4d74_100%)]",
    span: "lg:col-span-1",
  },
  {
    title: "Visit the Base",
    description: "Temukan titik singgah dan ruang pertemuan FMI di lingkungan FMIPA UNNES.",
    href: "#alamat",
    cta: "Lihat Alamat",
    icon: MapPin,
    className:
      "bg-[linear-gradient(135deg,#2f3137_0%,#1e1f23_54%,#111827_100%)]",
    span: "lg:col-span-1",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Kontak FMI"
        title="Mari terhubung lebih dekat dengan FMI"
        description="Gunakan halaman ini untuk bertanya, menyampaikan pesan, atau membuka peluang kolaborasi bersama FMI FMIPA UNNES."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <BlurFade
          inView
          className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#3f679c]">
              Tetap Terhubung
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Kami terbuka untuk pertanyaan, masukan, dan kerja sama.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
              Jika kamu ingin mengenal FMI lebih jauh, berdiskusi tentang
              kegiatan, atau membuka ruang kolaborasi, kamu bisa mulai dari
              kanal kontak di bawah ini.
            </p>

            <div className="mt-8 space-y-4">
              {contactItems.map((item, index) => (
                <BlurFade key={item.title} inView delay={0.04 + index * 0.05}>
                  <Card className="border-slate-200 bg-white">
                    <CardContent className="flex gap-4 p-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#3f679c] text-white">
                        <HugeiconsIcon
                          icon={contactIcons[item.title as keyof typeof contactIcons]}
                          size={22}
                          strokeWidth={1.8}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                          {item.value}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
                Butuh arah cepat?
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Kamu juga bisa mulai dengan melihat dokumentasi kegiatan atau
                membaca berita terbaru FMI sebelum menghubungi kami.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-[#3f679c] text-[#3f679c] hover:bg-[#3f679c] hover:text-white"
                >
                  <Link href="/galeri-fmiunnes">Lihat Galeri</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white"
                >
                  <Link href="/berita">Baca Berita</Link>
                </Button>
              </div>
            </div>
          </div>

          <BlurFade inView delay={0.1}>
            <div className="space-y-4">
              <div className="rounded-[1.75rem] bg-slate-950 px-7 py-6 text-white">
                <p className="text-sm font-medium text-white/82">
                  Find FMI on our communication channels
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {channelCards.map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <BlurFade
                      key={card.title}
                      inView
                      delay={0.12 + index * 0.05}
                      className={card.span}
                    >
                      <div
                        className={`${card.className} relative overflow-hidden rounded-[1.25rem] p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]`}
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_35%,transparent_70%,rgba(255,255,255,0.05))]" />
                        <div className="relative flex items-start justify-between gap-5">
                          <div className="max-w-md">
                            <h2 className="text-3xl font-bold tracking-tight">
                              {card.title}
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-white/82">
                              {card.description}
                            </p>
                          </div>

                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/45 bg-white/5">
                            <Icon className="h-7 w-7" />
                          </div>
                        </div>

                        <div className="relative mt-8">
                          <Button
                            asChild
                            className="h-11 rounded-full bg-white px-5 text-sm font-semibold !text-slate-900 hover:bg-white/92 hover:!text-slate-900"
                          >
                            <Link href={card.href}>
                              {card.cta}
                              <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </BlurFade>
                  );
                })}
              </div>
            </div>
          </BlurFade>
        </BlurFade>
      </section>
    </div>
  );
}
