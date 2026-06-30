import { PageHero } from "@/components/page-hero"
import { Skeleton } from "@/components/ui/skeleton"

export function NewsPageSkeleton() {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Berita FMI"
        title="Berita dan Wawasan Organisasi"
        description="Kumpulan kabar, cerita kegiatan, dan catatan ringan seputar gerak dakwah, pembinaan, dan kolaborasi FMI FMIPA UNNES."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Skeleton className="h-4 w-16 rounded-full bg-slate-200" />
            <Skeleton className="mt-3 h-9 w-64 rounded-xl bg-slate-200" />
            <Skeleton className="mt-2 h-4 w-80 max-w-full rounded-full bg-slate-200" />
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px] lg:ml-auto lg:w-[36rem]">
            <Skeleton className="h-12 rounded-full bg-slate-200" />
            <Skeleton className="h-12 rounded-full bg-slate-200" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article key={index} className="flex h-full flex-col">
              <Skeleton className="aspect-video rounded-[1.5rem] bg-slate-200" />
              <div className="flex flex-1 flex-col pt-6">
                <Skeleton className="h-6 w-24 rounded-full bg-slate-200" />
                <Skeleton className="mt-4 h-8 w-11/12 rounded-xl bg-slate-200" />
                <Skeleton className="mt-3 h-4 w-full rounded-full bg-slate-200" />
                <Skeleton className="mt-2 h-4 w-10/12 rounded-full bg-slate-200" />
                <div className="mt-6 flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-28 rounded-full bg-slate-200" />
                    <Skeleton className="h-3 w-36 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 flex justify-center gap-3">
          <Skeleton className="h-10 w-28 rounded-full bg-slate-200" />
          <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
          <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
          <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
          <Skeleton className="h-10 w-28 rounded-full bg-slate-200" />
        </div>
      </section>
    </div>
  )
}

export function GalleryPageSkeleton() {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Galeri FMI"
        title="Momen, Kegiatan, dan Jejak Gerak FMI"
        description="Kumpulan dokumentasi kegiatan FMI FMIPA UNNES yang dikelompokkan per agenda, sehingga satu kegiatan bisa memuat banyak foto sekaligus."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Skeleton className="h-8 w-96 max-w-full rounded-xl bg-slate-200" />
            <Skeleton className="mt-3 h-4 w-full rounded-full bg-slate-200" />
            <Skeleton className="mt-2 h-4 w-9/12 rounded-full bg-slate-200" />
          </div>

          <Skeleton className="h-10 w-44 rounded-full bg-slate-200" />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:justify-end">
          <Skeleton className="h-12 w-full rounded-full bg-slate-200 md:w-[12rem]" />
          <Skeleton className="h-12 w-full rounded-full bg-slate-200 md:w-[14rem]" />
        </div>

        <div className="mt-16 space-y-16 md:mt-20 md:space-y-24">
          {Array.from({ length: 3 }).map((_, monthIndex) => (
            <div
              key={monthIndex}
              className="relative flex flex-col gap-8 md:flex-row md:gap-16"
            >
              <div className="top-28 h-min shrink-0 md:sticky md:w-56">
                <Skeleton className="h-10 w-40 rounded-xl bg-slate-200" />
                <Skeleton className="mt-3 h-4 w-full rounded-full bg-slate-200" />
                <Skeleton className="mt-2 h-4 w-10/12 rounded-full bg-slate-200" />
              </div>

              <div className="min-w-0 flex-1 space-y-12">
                {Array.from({ length: 2 }).map((_, activityIndex) => (
                  <div key={activityIndex} className={activityIndex === 0 ? "" : "pt-12"}>
                    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                      <div>
                        <Skeleton className="h-4 w-28 rounded-full bg-slate-200" />
                        <Skeleton className="mt-2 h-7 w-72 max-w-full rounded-xl bg-slate-200" />
                      </div>
                      <Skeleton className="h-10 w-24 rounded-full bg-slate-200" />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {Array.from({ length: 3 }).map((_, imageIndex) => (
                        <Skeleton
                          key={imageIndex}
                          className="aspect-[4/3] rounded-[1.5rem] bg-slate-200"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function StructurePageSkeleton() {
  return (
    <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)]">
      <PageHero
        eyebrow="Struktur Organisasi"
        title="Susunan Pengurus FMI FMIPA UNNES"
        description="Lihat struktur pengurus FMI melalui kartu interaktif. Sebelum masuk ke daftar fungsionaris, kenali dulu nama kabinet, filosofi, identitas visual, dan komposisi timnya."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="space-y-16 md:space-y-24">
          <section className="py-2">
            <div className="flex justify-center">
              <Skeleton className="h-12 w-72 rounded-full bg-slate-200" />
            </div>
            <Skeleton className="mx-auto mt-8 h-3 w-28 rounded-full bg-slate-200" />
            <Skeleton className="mx-auto mt-4 h-12 w-96 max-w-full rounded-xl bg-slate-200" />
            <Skeleton className="mx-auto mt-4 h-6 w-80 max-w-full rounded-full bg-slate-200" />
          </section>

          <section className="grid gap-10 md:grid-cols-[300px_minmax(0,1fr)] md:items-center">
            <div className="flex items-center justify-center rounded-[1.75rem] bg-[radial-gradient(circle_at_top,_rgba(141,179,226,0.22),_transparent_60%),linear-gradient(180deg,#f8fbff_0%,#edf4fb_100%)] p-8">
              <Skeleton className="h-[240px] w-full max-w-[240px] rounded-[1.75rem] bg-slate-200" />
            </div>
            <div>
              <Skeleton className="h-3 w-32 rounded-full bg-slate-200" />
              <Skeleton className="mt-3 h-8 w-44 rounded-xl bg-slate-200" />
              <Skeleton className="mt-4 h-4 w-full rounded-full bg-slate-200" />
              <Skeleton className="mt-2 h-4 w-11/12 rounded-full bg-slate-200" />
              <Skeleton className="mt-2 h-4 w-8/12 rounded-full bg-slate-200" />
            </div>
          </section>

          <section>
            <div className="grid gap-8 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl bg-slate-200" />
                    <Skeleton className="h-10 w-16 rounded-xl bg-slate-200" />
                  </div>
                  <Skeleton className="mt-5 h-5 w-40 rounded-full bg-slate-200" />
                  <Skeleton className="mt-2 h-4 w-full rounded-full bg-slate-200" />
                  <Skeleton className="mt-2 h-4 w-10/12 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-20 md:space-y-24">
            {Array.from({ length: 2 }).map((_, sectionIndex) => (
              <section key={sectionIndex}>
                <div className="mb-8 flex items-center gap-5">
                  <div className="h-px flex-1 bg-slate-200" />
                  <Skeleton className="h-8 w-48 rounded-xl bg-slate-200" />
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, memberIndex) => (
                    <div key={memberIndex} className="rounded-[1.75rem] bg-white/70 p-5 shadow-sm">
                      <Skeleton className="aspect-[3/4] rounded-[1.25rem] bg-slate-200" />
                      <Skeleton className="mt-5 h-6 w-9/12 rounded-xl bg-slate-200" />
                      <Skeleton className="mt-2 h-4 w-7/12 rounded-full bg-slate-200" />
                      <Skeleton className="mt-4 h-4 w-full rounded-full bg-slate-200" />
                      <Skeleton className="mt-2 h-4 w-10/12 rounded-full bg-slate-200" />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
