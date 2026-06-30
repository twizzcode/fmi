import type { Metadata } from "next"
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import SlideTextButton from "@/components/kokonutui/slide-text-button";
import AnimatedTestimonialsDemo from "@/components/animated-testimonials-demo";
import { HomeRandomGallerySection } from "@/components/home-random-gallery-section";
import { HomeServicesSection } from "@/components/home-services-section";
import { getLatestNewsArticles } from "@/lib/news";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Beranda",
  description: "Forum Mahasiswa Islam FMIPA UNNES hadir sebagai wadah ukhuwah, pembinaan, dan informasi kegiatan mahasiswa muslim di FMIPA UNNES.",
  alternates: {
    canonical: "/",
  },
}

function getAuthorInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export default async function Home() {
  const latestNews = await getLatestNewsArticles(3)
  return (
    <div className="bg-white">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/foto bersama.jpg"
            alt="Kegiatan FMI"
            fill
            priority
            className="object-cover brightness-[0.35]"
          />
        </div>

        <div className="relative mx-auto flex min-h-[72svh] max-w-7xl items-center justify-center px-6 py-20 text-center">
          <div className="max-w-5xl text-white">
            <BlurFade delay={0.05} duration={0.6}>
              <p className="text-sm font-semibold uppercase tracking-[0.38em] text-white/75">
                Selamat Datang di
              </p>
            </BlurFade>
            <BlurFade delay={0.12} duration={0.7}>
              <h1 className="mt-5 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
                Forum Mahasiswa Islam
                <br />
                FMIPA UNNES
              </h1>
            </BlurFade>
            <BlurFade delay={0.2} duration={0.7}>
              <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-white/82 md:text-xl">
                Wadah ukhuwah, pembinaan, dan kontribusi mahasiswa muslim FMIPA
                UNNES dalam menebar kebermanfaatan, menguatkan keilmuan, serta
                membangun peradaban kampus yang madani.
              </p>
            </BlurFade>
            <BlurFade delay={0.28} duration={0.7}>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  className="w-[12.25rem] rounded-full bg-white px-6 py-6 text-base font-normal !text-slate-900 shadow-lg shadow-black/10 transition-colors duration-300 hover:bg-[#3f679c] hover:!text-white"
                >
                  <Link
                    href="/tentang-fmiunnes"
                    className="group relative inline-flex items-center justify-center overflow-hidden transition-colors duration-300"
                  >
                    <span className="relative inline-flex h-6 w-[7.25rem] items-center justify-center overflow-hidden">
                      <span className="absolute inline-flex translate-x-0 items-center transition-all duration-300 ease-out group-hover:translate-x-8 group-hover:opacity-0">
                        Tentang FMI
                      </span>
                      <span className="absolute inline-flex -translate-x-8 items-center opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
                        FMI-LY 🩵
                      </span>
                    </span>
                    <ArrowRightIcon className="absolute right-4 h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      <HomeServicesSection />

      <section className="bg-[var(--muted)] py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-18 px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <BlurFade inView direction="right" delay={0.04}>
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3f679c]">
                Apasih FMI Itu?
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Lembaga dakwah kampus yang menjadi ruang pembinaan dan organisasi.
              </h2>
              <p className="text-base leading-8 text-slate-600 md:text-lg">
                Forum Mahasiswa Islam FMIPA UNNES merupakan lembaga kemahasiswaan
                tingkat fakultas yang menjadi tempat bertumbuh secara ruhiyah,
                intelektual, dan sosial untuk mahasiswa FMIPA.
              </p>
              <SlideTextButton
                href="/tentang-fmiunnes"
                text={
                  <span className="flex items-center gap-2">
                    <span>Selengkapnya tentang FMI</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </span>
                }
                hoverText="Baca sekarang :)"
                className="h-12 rounded-full !bg-[#3f679c] px-8 text-sm font-semibold tracking-normal !text-white hover:!bg-[#355887] md:min-w-0"
              />
            </div>
          </BlurFade>

          <BlurFade inView direction="left" delay={0.12}>
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(157,178,206,0.28),_transparent_70%)] blur-2xl" />
              <div className="relative rounded-[2.5rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(148,163,184,0.2)]">
                <Image
                  src="/images/Logo FMI hitam.png"
                  alt="Logo FMI"
                  width={420}
                  height={420}
                  className="mx-auto h-auto w-full max-w-[280px]"
                />
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <BlurFade inView className="mb-20 text-center md:mb-24">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3f679c]">
              Testimoni
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Cerita mereka yang bertumbuh bersama FMI.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Beberapa kesan singkat dari mahasiswa yang menemukan ruang belajar,
              ukhuwah, dan kebermanfaatan lewat perjalanan mereka di FMI.
            </p>
          </BlurFade>

          <BlurFade inView delay={0.08}>
            <AnimatedTestimonialsDemo />
          </BlurFade>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <BlurFade
          inView
          className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3f679c]">
              Berita Terbaru
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Ikuti kabar terbaru dari gerak FMI FMIPA UNNES.
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Tiga artikel terbaru ini jadi pintu masuk cepat untuk melihat
              kegiatan, pembinaan, dan arah gerak organisasi.
            </p>
          </div>

          <Button
            asChild
            variant="link"
            className="h-auto px-0 text-sm font-semibold text-[#3f679c] underline underline-offset-4 hover:text-[#355887]"
          >
            <Link href="/berita" className="inline-flex items-center gap-2">
              <span>Lihat berita lainnya</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Button>
        </BlurFade>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {latestNews.length === 0 ? (
            <p className="text-sm text-slate-500">Kosong</p>
          ) : (
            latestNews.map((item, index) => (
              <BlurFade
                key={item.title}
                inView
                delay={0.05 + index * 0.07}
                className="h-full"
              >
                <Link href={`/berita/${item.slug}`} className="group block h-full">
                  <article className="flex h-full flex-col">
                    <div className="relative aspect-video overflow-hidden rounded-[1.5rem] bg-slate-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-1 flex-col pt-6">
                      <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {item.category}
                      </span>

                      <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-slate-900 transition group-hover:text-[#3f679c]">
                        {item.title}
                      </h3>

                      <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">
                        {item.excerpt}
                      </p>

                      <div className="mt-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-200 bg-white">
                            <AvatarImage src={item.authorImageUrl ?? undefined} alt={item.author} />
                            <AvatarFallback className="bg-white text-xs font-semibold text-slate-900">
                              {getAuthorInitials(item.author)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium text-slate-900">
                              {item.author}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.date} · {item.views.toLocaleString("id-ID")} dibaca
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </BlurFade>
            ))
          )}
        </div>

      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:pb-28">
        <BlurFade inView className="overflow-hidden rounded-[2rem] bg-[#2f4f7d]">
          <div className="flex flex-col gap-6 px-8 py-10 text-white md:px-12 md:py-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight md:text-4xl">
                Yuk temukan teman sholih-sholihah mu di kanal media kami.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
                Terhubung lebih dekat dengan FMI lewat kanal komunikasi kami
                untuk tanya, berbagi, dan ikut tumbuh bersama.
              </p>
            </div>

            <div className="flex shrink-0 items-center">
              <Button
                asChild
                className="h-11 rounded-full bg-[#3f679c] px-6 text-sm font-semibold text-white hover:bg-[#4a76b0]"
              >
                <Link href="/kontak">Temukan Sekarang</Link>
              </Button>
            </div>
          </div>
        </BlurFade>
      </section>

      <HomeRandomGallerySection />
    </div>
  );
}
