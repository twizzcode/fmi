import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { notFound } from "next/navigation"

import { NewsBodyViewer } from "@/components/news/news-body-viewer"
import { NewsViewTracker } from "@/components/news/news-view-tracker"
import { BlurFade } from "@/components/ui/blur-fade"
import { createAppUrl } from "@/lib/app-config"
import { getNewsArticleBySlug, getNewsArticleSlugs, getRelatedNewsArticles } from "@/lib/news"

export function generateStaticParams() {
  return getNewsArticleSlugs().then((slugs) => slugs.map((slug) => ({ slug })))
}

export async function generateMetadata(
  props: PageProps<"/berita/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params
  const article = await getNewsArticleBySlug(slug)

  if (!article) {
    return {
      title: "Berita",
      description: "Baca berita terbaru FMI FMIPA UNNES.",
    }
  }

  const canonical = `/berita/${article.slug}`
  const imageUrl = article.imageUrl.startsWith("http")
    ? article.imageUrl
    : createAppUrl(article.imageUrl).toString()

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.author],
      images: [
        {
          url: imageUrl,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [imageUrl],
    },
  }
}

export default async function NewsDetailPage(
  props: PageProps<"/berita/[slug]">
) {
  const { slug } = await props.params
  const article = await getNewsArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const relatedNews = await getRelatedNewsArticles(article.slug, 3)

  return (
    <div className="bg-white">
      <NewsViewTracker articleId={article.id} />
      <article className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <BlurFade delay={0.04}>
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#3f679c] transition hover:text-[#355887]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke berita
          </Link>
        </BlurFade>

        <BlurFade delay={0.08}>
          <div className="mt-8">
            <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
              {article.excerpt}
            </p>
          </div>
        </BlurFade>

        <div className="mt-8 grid gap-12 xl:grid-cols-4">
          <div className="space-y-7 xl:col-span-3">
            <BlurFade inView delay={0.04}>
              <div className="relative overflow-hidden rounded-[2rem] bg-slate-100">
                <div className="relative aspect-[16/8]">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </BlurFade>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-900">
                FMI
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{article.author}</p>
                <p className="text-sm text-slate-500">
                  {article.category} · {article.date} · {article.views.toLocaleString("id-ID")} dibaca
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200" />

            <BlurFade inView delay={0.06}>
              <NewsBodyViewer value={article.bodyJson} />
            </BlurFade>
          </div>

          <aside className="h-fit xl:sticky xl:top-24">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                Berita Lainnya
              </h2>
              <Link
                href="/berita"
                className="text-xs font-medium text-slate-500 underline underline-offset-4 hover:text-slate-700"
              >
                Semua
              </Link>
            </div>

            <div className="mt-6 space-y-6">
              {relatedNews.map((item, index) => (
                <BlurFade key={item.slug} inView delay={0.05 + index * 0.05}>
                  <Link href={`/berita/${item.slug}`} className="group block border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                    <article className="flex flex-col">
                      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[1.5rem] bg-slate-100">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={140}
                          height={140}
                          className="h-auto w-24 object-contain transition duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex flex-1 flex-col pt-4">
                        <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {item.category}
                        </span>
                        <h3 className="mt-3 text-lg font-semibold leading-tight tracking-tight text-slate-900 transition group-hover:text-[#3f679c]">
                          {item.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                          {item.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-semibold text-slate-900">
                            FMI
                          </div>
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
                    </article>
                  </Link>
                </BlurFade>
              ))}
            </div>
          </aside>
        </div>
      </article>
    </div>
  )
}
