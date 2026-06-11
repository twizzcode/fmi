"use client";
import { useMemo } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ImageGallery, type ImageItem } from "@/components/ui/image-gallery";
import { PageHero } from "@/components/page-hero";
import { galleryItems } from "@/lib/site-data";

export default function GalleryPage() {
  const images = useMemo<ImageItem[]>(
    () =>
      galleryItems.map((item) => ({
        src: item.image,
        alt: item.title,
      })),
    [],
  );

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Galeri FMI"
        title="Momen, Kegiatan, dan Jejak Gerak FMI"
        description="Kumpulan dokumentasi kegiatan FMI FMIPA UNNES yang merekam suasana pembinaan, syiar, kolaborasi, dan kebersamaan mahasiswa dalam berbagai agenda organisasi."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <BlurFade inView delay={0.04}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#3f679c]">
                Dokumentasi
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Galeri yang merangkum perjalanan kegiatan FMI dari berbagai sisi.
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                Halaman ini menampilkan potret kegiatan, pembinaan, syiar, dan
                kolaborasi FMI dalam format visual yang lebih rapi dan mudah
                dijelajahi. Nantinya bagian ini bisa langsung disambungkan ke
                data galeri dinamis dari panel admin atau backend.
              </p>
            </div>
          </BlurFade>

          <BlurFade inView delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3f679c]">
                  Total Foto
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {galleryItems.length}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3f679c]">
                  Highlight
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Kajian, pembinaan, syiar, dan kolaborasi antarorganisasi.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3f679c]">
                  Format
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Disusun dalam masonry layout agar visual lebih hidup dan tidak datar.
                </p>
              </div>
            </div>
          </BlurFade>
        </div>

        <BlurFade inView delay={0.14} className="mt-14 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(148,163,184,0.12)] md:p-6">
          <ImageGallery
            images={images}
            gap={20}
            lazyLoading
            columns={{
              desktop: 3,
              tablet: 2,
              mobile: 1,
            }}
            className="w-full"
          />
        </BlurFade>
      </section>
    </div>
  );
}
