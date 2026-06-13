"use client";

import { useMemo, useState } from "react";

import { BlurFade } from "@/components/ui/blur-fade";
import { ImageGallery, type ImageItem } from "@/components/ui/image-gallery";
import { PageHero } from "@/components/page-hero";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { galleryItems } from "@/lib/site-data";

const monthLabels = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

type GalleryActivity = {
  id: string;
  title: string;
  dateISO: string;
  description: string;
  images: ImageItem[];
};

type ActivityEntry = GalleryActivity & {
  year: number;
  month: number;
  monthLabel: string;
  monthKey: string;
  formattedDate: string;
};

const galleryActivities: GalleryActivity[] = [
  {
    id: "kajian-rutin-juni",
    title: "Kajian Rutin Fakultas",
    dateISO: "2026-06-10",
    description:
      "Sesi dokumentasi kegiatan pekanan yang menonjolkan suasana komunitas dan diskusi terbuka.",
    images: createDummyImages(galleryItems[0]?.image ?? "/images/foto bersama.jpg", "Kajian Rutin Fakultas", 8),
  },
  {
    id: "pembinaan-mentoring-juni",
    title: "Pembinaan dan Mentoring",
    dateISO: "2026-06-06",
    description:
      "Kumpulan momen pembinaan anggota baru dengan suasana belajar yang hangat dan terarah.",
    images: createDummyImages(galleryItems[1]?.image ?? "/images/foto bersama.jpg", "Pembinaan dan Mentoring", 10),
  },
  {
    id: "kolaborasi-april",
    title: "Kolaborasi Antarlembaga",
    dateISO: "2026-04-15",
    description:
      "Dokumentasi acara bersama LDJ dan organisasi mahasiswa lain di lingkungan FMIPA.",
    images: createDummyImages(galleryItems[2]?.image ?? "/images/foto bersama.jpg", "Kolaborasi Antarlembaga", 7),
  },
  {
    id: "rapat-desember",
    title: "Rapat Koordinasi Pengurus",
    dateISO: "2025-12-08",
    description:
      "Suasana penyusunan arah gerak, evaluasi program, dan sinkronisasi agenda antarbidang di FMI.",
    images: createDummyImages(galleryItems[3]?.image ?? "/images/foto bersama.jpg", "Rapat Koordinasi Pengurus", 6),
  },
  {
    id: "syiar-oktober",
    title: "Syiar dan Media Kampus",
    dateISO: "2025-10-27",
    description:
      "Dokumentasi publikasi, desain, dan penguatan pesan dakwah yang disiapkan untuk mahasiswa FMIPA.",
    images: createDummyImages(galleryItems[4]?.image ?? "/images/foto bersama.jpg", "Syiar dan Media Kampus", 9),
  },
  {
    id: "aksi-sosial-agustus",
    title: "Aksi Sosial Mahasiswa",
    dateISO: "2025-08-14",
    description:
      "Momen keterlibatan FMI dalam kegiatan sosial, penggalangan dukungan, dan gerakan kepedulian bersama.",
    images: createDummyImages(galleryItems[5]?.image ?? "/images/foto bersama.jpg", "Aksi Sosial Mahasiswa", 10),
  },
];

export default function GalleryPage() {
  const entries = useMemo<ActivityEntry[]>(
    () =>
      galleryActivities.map((item) => {
        const date = new Date(item.dateISO);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        return {
          ...item,
          year,
          month,
          monthLabel: monthLabels[month - 1] ?? "",
          monthKey: `${year}-${String(month).padStart(2, "0")}`,
          formattedDate: new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(date),
        };
      }),
    [],
  );

  const yearOptions = useMemo(
    () =>
      Array.from(new Set(entries.map((item) => item.year.toString()))).sort(
        (a, b) => Number(b) - Number(a),
      ),
    [entries],
  );

  const [selectedYear, setSelectedYear] = useState(() => yearOptions[0] ?? "");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const visibleEntries = useMemo(
    () =>
      entries.filter((item) => item.year.toString() === selectedYear),
    [entries, selectedYear],
  );

  const monthOptions = useMemo(
    () =>
      Array.from(
        new Map(
          visibleEntries.map((item) => [
            item.monthKey,
            {
              value: item.monthKey,
              label: `${item.monthLabel} ${item.year}`,
            },
          ]),
        ).values(),
      ).sort((a, b) => b.value.localeCompare(a.value)),
    [visibleEntries],
  );

  const groupedByYear = useMemo(() => {
    const yearMap = new Map<
      number,
      Map<string, { label: string; items: ActivityEntry[] }>
    >();

    for (const item of visibleEntries) {
      if (!yearMap.has(item.year)) {
        yearMap.set(item.year, new Map());
      }

      const monthMap = yearMap.get(item.year)!;

      if (!monthMap.has(item.monthKey)) {
        monthMap.set(item.monthKey, {
          label: `${item.monthLabel} ${item.year}`,
          items: [],
        });
      }

      monthMap.get(item.monthKey)!.items.push(item);
    }

    return Array.from(yearMap.entries())
      .sort(([a], [b]) => b - a)
      .map(([year, monthMap]) => ({
        year,
        months: Array.from(monthMap.entries())
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([key, value]) => ({
            key,
            label: value.label,
            items: value.items,
          })),
      }));
  }, [visibleEntries]);

  const totalPhotosInYear = useMemo(
    () =>
      visibleEntries.reduce((total, item) => total + item.images.length, 0),
    [visibleEntries],
  );

  function handleMonthChange(value: string) {
    setSelectedMonth(value);

    if (value === "all") {
      return;
    }

    requestAnimationFrame(() => {
      const section = document.getElementById(`month-${value}`);
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Galeri FMI"
        title="Momen, Kegiatan, dan Jejak Gerak FMI"
        description="Kumpulan dokumentasi kegiatan FMI FMIPA UNNES yang merekam suasana pembinaan, syiar, kolaborasi, dan kebersamaan mahasiswa dalam berbagai agenda organisasi."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <BlurFade inView delay={0.04} className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Jelajahi dokumentasi FMI per tahun dan per bulan.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                Pilih tahun untuk melihat arsip yang aktif, lalu gunakan bulan
                sebagai pintasan cepat ke bagian yang ingin Anda buka.
              </p>
            </div>

            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
              {totalPhotosInYear} foto pada tahun ini
            </div>
          </div>
        </BlurFade>

        <div className="flex flex-col gap-3 md:flex-row md:justify-end">
          <Select
            value={selectedYear}
            onValueChange={(value) => {
              setSelectedYear(value);
              setSelectedMonth("all");
            }}
          >
            <SelectTrigger className="h-12 w-full rounded-full px-5 md:w-[12rem]">
              <SelectValue placeholder="Pilih tahun" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="h-12 w-full rounded-full px-5 md:w-[14rem]">
              <SelectValue placeholder="Lompat ke bulan" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-16 space-y-16 md:mt-20 md:space-y-24">
          {groupedByYear.flatMap((yearGroup) => yearGroup.months).map((monthGroup, monthIndex) => (
            <div
              key={monthGroup.key}
              id={`month-${monthGroup.key}`}
              className="relative flex scroll-mt-28 flex-col gap-8 md:flex-row md:gap-16"
            >
              <BlurFade
                inView
                delay={0.04 + monthIndex * 0.04}
                className="top-28 h-min shrink-0 md:sticky md:w-56"
              >
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    {monthGroup.label}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Dokumentasi kegiatan FMI yang tercatat pada periode ini.
                  </p>
                </div>
              </BlurFade>

              <BlurFade
                inView
                delay={0.06 + monthIndex * 0.04}
                className="min-w-0 flex-1"
              >
                <div className="space-y-12">
                  {monthGroup.items.map((activity, activityIndex) => (
                    <div
                      key={activity.id}
                      className={activityIndex === 0 ? "" : "pt-12"}
                    >
                      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#3f679c]">
                            {activity.formattedDate}
                          </p>
                          <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                            {activity.title}
                          </h3>
                        </div>

                        <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                          {activity.images.length} foto
                        </div>
                      </div>

                      <ImageGallery
                        images={activity.images.slice(0, 10)}
                        gap={20}
                        lazyLoading
                        columns={{
                          desktop: 3,
                          tablet: 2,
                          mobile: 1,
                        }}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </BlurFade>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function createDummyImages(src: string, label: string, count: number): ImageItem[] {
  return Array.from({ length: Math.min(count, 10) }, (_, index) => ({
    src: createDummyImageUrl(src, label, index),
    alt: `${label} ${index + 1}`,
    width: 1200,
    height: 900,
  }));
}

function createDummyImageUrl(src: string, label: string, index: number) {
  const fallbackImages = [
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  ];

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  return fallbackImages[index % fallbackImages.length] ?? fallbackImages[0]!;
}
