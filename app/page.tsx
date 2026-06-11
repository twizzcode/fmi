import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  FileTextIcon,
  GlobeIcon,
  RocketIcon,
  BackpackIcon,
} from "@radix-ui/react-icons";
import SlideTextButton from "@/components/kokonutui/slide-text-button";
import AnimatedTestimonialsDemo from "@/components/animated-testimonials-demo";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { featureLinks, newsItems } from "@/lib/site-data";

const featureIcons = [FileTextIcon, RocketIcon, GlobeIcon, BackpackIcon];
const latestNews = [...newsItems]
  .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
  .slice(0, 3);

export default function Home() {
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
                  className="rounded-full bg-white px-7 py-6 text-base font-semibold !text-slate-900 shadow-lg shadow-black/10 hover:bg-white/92 hover:!text-slate-900"
                >
                  <a href="/tentang-fmiunnes">Tentang FMI</a>
                </Button>
                <Button
                  asChild
                  className="rounded-full bg-[#3f679c] px-7 py-6 text-base font-semibold text-white shadow-lg shadow-blue-950/20 hover:bg-[#355887]"
                >
                  <a href="/kontak">Hubungi Kami</a>
                </Button>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

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
            {featureLinks.map((item, index) => (
              <BlurFade
                key={item.title}
                inView
                delay={0.06 + index * 0.07}
                className="h-full"
              >
                <BentoCard
                  Icon={featureIcons[index] ?? FileTextIcon}
                  name={item.title}
                  description={item.description}
                  href={item.href}
                  cta={item.buttonLabel}
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
            variant="outline"
            className="h-12 rounded-full border-[#3f679c] px-6 text-sm font-semibold text-[#3f679c] hover:bg-[#3f679c] hover:text-white"
          >
            <Link href="/berita">Lihat berita lainnya</Link>
          </Button>
        </BlurFade>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {latestNews.map((item, index) => (
            <BlurFade
              key={item.title}
              inView
              delay={0.05 + index * 0.07}
              className="h-full"
            >
              <Link href="/berita" className="group block h-full">
                <article className="flex h-full flex-col">
                  <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[1.5rem] bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={180}
                      height={180}
                      className="h-auto w-32 object-contain transition duration-300 group-hover:scale-105"
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-900">
                          FMI
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-900">
                            {item.author}
                          </p>
                          <p className="text-xs text-slate-500">{item.date}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#3f679c]">
                        Baca
                        <ArrowRightIcon className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </BlurFade>
          ))}
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
    </div>
  );
}
