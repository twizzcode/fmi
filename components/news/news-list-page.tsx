"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SearchIcon } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Input } from "@/components/ui/input"
import { PageHero } from "@/components/page-hero"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { NewsArticle } from "@/lib/news"

const ITEMS_PER_PAGE = 9
type SortMode = "latest" | "oldest" | "popular"

export function NewsListPage({ items }: { items: NewsArticle[] }) {
  const [query, setQuery] = useState("")
  const [sortMode, setSortMode] = useState<SortMode>("latest")
  const [page, setPage] = useState(1)

  const filteredNews = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    const matched = items.filter((item) => {
      if (!normalized) return true

      return [item.title, item.excerpt, item.category, item.author]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    })

    const sorted = [...matched].sort((a, b) => {
      if (sortMode === "popular") return b.views - a.views
      if (sortMode === "oldest") {
        return a.publishedAt.getTime() - b.publishedAt.getTime()
      }
      return b.publishedAt.getTime() - a.publishedAt.getTime()
    })

    return sorted
  }, [items, query, sortMode])

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visibleNews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredNews.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage, filteredNews])

  const pageNumbers = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }
    if (currentPage <= 2) return [1, 2, 3]
    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages]
    }
    return [currentPage - 1, currentPage, currentPage + 1]
  }, [currentPage, totalPages])

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Berita FMI"
        title="Berita dan Wawasan Organisasi"
        description="Kumpulan kabar, cerita kegiatan, dan catatan ringan seputar gerak dakwah, pembinaan, dan kolaborasi FMI FMIPA UNNES."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <BlurFade inView className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
              Berita
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {filteredNews.length} berita ditemukan
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Jelajahi berita terbaru, paling lama diunggah, atau yang paling banyak dibaca.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px] lg:ml-auto lg:w-[36rem]">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                placeholder="Cari berita, kategori, atau penulis"
                className="h-12 rounded-full px-5 pl-12"
              />
            </div>

            <Select
              value={sortMode}
              onValueChange={(value) => {
                setSortMode(value as SortMode)
                setPage(1)
              }}
            >
              <SelectTrigger className="h-12 min-h-12 rounded-full px-5">
                <SelectValue placeholder="Urutkan berita" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Terbaru</SelectItem>
                <SelectItem value="oldest">Paling lama diupload</SelectItem>
                <SelectItem value="popular">Paling banyak dibaca</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </BlurFade>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {visibleNews.map((item, index) => (
            <BlurFade key={`${item.slug}-${page}`} inView delay={0.05 + index * 0.06} className="h-full">
              <Link href={`/berita/${item.slug}`} className="group block h-full">
                <article className="flex h-full flex-col">
                  <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[1.5rem] bg-slate-100">
                    <Image
                      src={item.imageUrl}
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
                    <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-slate-900 transition group-hover:text-[#3f679c]">
                      {item.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">
                      {item.excerpt}
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-900">
                        FMI
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-900">{item.author}</p>
                        <p className="text-xs text-slate-500">
                          {item.date} · {item.views.toLocaleString("id-ID")} dibaca
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </BlurFade>
          ))}
        </div>

        <BlurFade inView delay={0.18}>
          <Pagination className="mt-14">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text="Sebelumnya"
                  className="rounded-full text-slate-500 hover:text-[#3f679c]"
                  onClick={(event) => {
                    event.preventDefault()
                    setPage((current) => Math.max(1, current - 1))
                  }}
                />
              </PaginationItem>

              {currentPage > 2 && totalPages > 3 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}

              {pageNumbers.map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === currentPage}
                    className={
                      pageNumber === currentPage
                        ? "rounded-full border-[#3f679c] bg-[#3f679c] !text-white hover:bg-[#355887] hover:!text-white"
                        : "rounded-full text-slate-600 hover:text-[#3f679c]"
                    }
                    onClick={(event) => {
                      event.preventDefault()
                      setPage(pageNumber)
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {currentPage < totalPages - 1 && totalPages > 3 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  text="Berikutnya"
                  className="rounded-full text-slate-500 hover:text-[#3f679c]"
                  onClick={(event) => {
                    event.preventDefault()
                    setPage((current) => Math.min(totalPages, current + 1))
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </BlurFade>
      </section>
    </div>
  )
}
