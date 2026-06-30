"use client"

import { useMemo, useState } from "react"

import { BlurFade } from "@/components/ui/blur-fade"
import { ImageGallery, type ImageItem } from "@/components/ui/image-gallery"
import { PageHero } from "@/components/page-hero"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type GalleryPageActivity = {
  id: string
  title: string
  dateISO: string
  formattedDate: string
  images: ImageItem[]
}

type ActivityEntry = GalleryPageActivity & {
  year: number
  month: number
  monthLabel: string
  monthKey: string
}

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
]

export function GalleryPageContent({
  activities,
}: {
  activities: GalleryPageActivity[]
}) {
  const entries = useMemo<ActivityEntry[]>(
    () =>
      activities.map((item) => {
        const date = new Date(`${item.dateISO}T00:00:00`)
        const year = date.getFullYear()
        const month = date.getMonth() + 1

        return {
          ...item,
          year,
          month,
          monthLabel: monthLabels[month - 1] ?? "",
          monthKey: `${year}-${String(month).padStart(2, "0")}`,
        }
      }),
    [activities]
  )

  const yearOptions = useMemo(
    () =>
      Array.from(new Set(entries.map((item) => item.year.toString()))).sort(
        (a, b) => Number(b) - Number(a)
      ),
    [entries]
  )

  const [selectedYear, setSelectedYear] = useState(() => yearOptions[0] ?? "")
  const [selectedMonth, setSelectedMonth] = useState("all")

  const visibleEntries = useMemo(
    () =>
      entries.filter((item) =>
        selectedYear ? item.year.toString() === selectedYear : true
      ),
    [entries, selectedYear]
  )

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
          ])
        ).values()
      ).sort((a, b) => b.value.localeCompare(a.value)),
    [visibleEntries]
  )

  const groupedByYear = useMemo(() => {
    const yearMap = new Map<
      number,
      Map<string, { label: string; items: ActivityEntry[] }>
    >()

    for (const item of visibleEntries) {
      if (!yearMap.has(item.year)) {
        yearMap.set(item.year, new Map())
      }

      const monthMap = yearMap.get(item.year)!

      if (!monthMap.has(item.monthKey)) {
        monthMap.set(item.monthKey, {
          label: `${item.monthLabel} ${item.year}`,
          items: [],
        })
      }

      monthMap.get(item.monthKey)!.items.push(item)
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
      }))
  }, [visibleEntries])

  const totalPhotosInYear = useMemo(
    () => visibleEntries.reduce((total, item) => total + item.images.length, 0),
    [visibleEntries]
  )

  function handleMonthChange(value: string) {
    setSelectedMonth(value)

    if (value === "all") {
      return
    }

    requestAnimationFrame(() => {
      const section = document.getElementById(`month-${value}`)
      section?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Galeri FMI"
        title="Momen, Kegiatan, dan Jejak Gerak FMI"
        description="Kumpulan dokumentasi kegiatan FMI FMIPA UNNES yang dikelompokkan per agenda, sehingga satu kegiatan bisa memuat banyak foto sekaligus."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <BlurFade inView delay={0.04} className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Jelajahi dokumentasi FMI per tahun dan per bulan.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                Setiap card mewakili satu kegiatan, lengkap dengan tanggal dan
                kumpulan foto di dalamnya.
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
              setSelectedYear(value)
              setSelectedMonth("all")
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
                        images={activity.images}
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
  )
}
