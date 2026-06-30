import { desc, gte, sql } from "drizzle-orm"
import { Users2, Images, Newspaper, BriefcaseBusiness, Eye } from "lucide-react"

import { DashboardAnalyticsChart } from "@/components/admin/dashboard-analytics-chart"
import { db, schema } from "@/lib/db"

function formatCount(value: number) {
  return value.toLocaleString("id-ID")
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function subtractDays(date: Date, days: number) {
  return addDays(date, -days)
}

export default async function DashboardPage() {
  const now = new Date()
  const todayStart = startOfDay(now)
  const last30DaysStart = subtractDays(todayStart, 29)
  const previous30DaysStart = subtractDays(last30DaysStart, 30)

  const [
    userCountResult,
    galleryCountResult,
    memberCountResult,
    newsCountResult,
    totalViewsResult,
    viewsTodayResult,
    recentNewsRows,
    recentGalleryRows,
    recentMemberRows,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(schema.users),
    db.select({ count: sql<number>`count(*)::int` }).from(schema.galleryEntries),
    db.select({ count: sql<number>`count(*)::int` }).from(schema.structureMembers),
    db.select({ count: sql<number>`count(*)::int` }).from(schema.newsArticles),
    db.select({ total: sql<number>`coalesce(sum(${schema.newsArticles.views}), 0)::int` }).from(
      schema.newsArticles
    ),
    db
      .select({ total: sql<number>`coalesce(sum(${schema.newsArticles.views}), 0)::int` })
      .from(schema.newsArticles)
      .where(gte(schema.newsArticles.updatedAt, todayStart)),
    db
      .select({
        createdAt: schema.newsArticles.createdAt,
        views: schema.newsArticles.views,
      })
      .from(schema.newsArticles)
      .where(gte(schema.newsArticles.createdAt, previous30DaysStart)),
    db
      .select({ createdAt: schema.galleryEntries.createdAt })
      .from(schema.galleryEntries)
      .where(gte(schema.galleryEntries.createdAt, previous30DaysStart)),
    db
      .select({ createdAt: schema.structureMembers.createdAt })
      .from(schema.structureMembers)
      .where(gte(schema.structureMembers.createdAt, previous30DaysStart)),
  ])

  const totalUsers = userCountResult[0]?.count ?? 0
  const totalGalleries = galleryCountResult[0]?.count ?? 0
  const totalMembers = memberCountResult[0]?.count ?? 0
  const totalNews = newsCountResult[0]?.count ?? 0
  const totalViews = totalViewsResult[0]?.total ?? 0
  const viewsToday = viewsTodayResult[0]?.total ?? 0

  const chartLabels = Array.from({ length: 4 }, (_, index) => {
    const start = addDays(previous30DaysStart, index * 15)
    return {
      label: `${start.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      })}`,
      start,
      end: addDays(start, 15),
    }
  })

  const chartData = chartLabels.map((slot) => ({
    label: slot.label,
    users: 0,
    galleries: 0,
    members: 0,
    news: 0,
  }))

  for (const row of recentNewsRows) {
    const index = chartLabels.findIndex(
      (slot) => row.createdAt >= slot.start && row.createdAt < slot.end
    )
    if (index >= 0) {
      chartData[index].news += 1
    }
  }

  for (const row of recentGalleryRows) {
    const index = chartLabels.findIndex(
      (slot) => row.createdAt >= slot.start && row.createdAt < slot.end
    )
    if (index >= 0) {
      chartData[index].galleries += 1
    }
  }

  for (const row of recentMemberRows) {
    const index = chartLabels.findIndex(
      (slot) => row.createdAt >= slot.start && row.createdAt < slot.end
    )
    if (index >= 0) {
      chartData[index].members += 1
    }
  }

  const userGrowthRows = await db
    .select({ createdAt: schema.users.createdAt })
    .from(schema.users)
    .where(gte(schema.users.createdAt, previous30DaysStart))

  for (const row of userGrowthRows) {
    const index = chartLabels.findIndex(
      (slot) => row.createdAt >= slot.start && row.createdAt < slot.end
    )
    if (index >= 0) {
      chartData[index].users += 1
    }
  }

  const viewsLast30Days = recentNewsRows
    .filter((row) => row.createdAt >= last30DaysStart)
    .reduce((sum, row) => sum + row.views, 0)

  const viewsPrevious30Days = recentNewsRows
    .filter((row) => row.createdAt >= previous30DaysStart && row.createdAt < last30DaysStart)
    .reduce((sum, row) => sum + row.views, 0)

  const viewTrend = viewsLast30Days - viewsPrevious30Days

  const latestNews = await db
    .select({
      id: schema.newsArticles.id,
      title: schema.newsArticles.title,
      views: schema.newsArticles.views,
      publishedAt: schema.newsArticles.publishedAt,
      status: schema.newsArticles.status,
    })
    .from(schema.newsArticles)
    .orderBy(desc(schema.newsArticles.publishedAt))
    .limit(5)

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
          Dashboard
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Analitik Admin FMI
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Ringkasan akun, galeri, fungsionaris, berita, dan performa pembacaan konten.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Akun Terdaftar" value={formatCount(totalUsers)} icon={<Users2 className="size-5" />} />
        <MetricCard label="Total Galeri" value={formatCount(totalGalleries)} icon={<Images className="size-5" />} />
        <MetricCard label="Fungsionaris / Staff" value={formatCount(totalMembers)} icon={<BriefcaseBusiness className="size-5" />} />
        <MetricCard label="Total Berita" value={formatCount(totalNews)} icon={<Newspaper className="size-5" />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Pertumbuhan 60 Hari Terakhir</h2>
            <p className="text-sm leading-6 text-slate-500">
              Perbandingan pertambahan akun, galeri, fungsionaris, dan berita per 15 hari.
            </p>
          </div>
          <div className="mt-6">
            <DashboardAnalyticsChart data={chartData} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dce8f6] text-[#27466f]">
              <Eye className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Pembacaan Berita</h2>
              <p className="text-sm text-slate-500">Dilihat dari total nilai views berita tersimpan.</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <InsightBox label="Total Dibaca" value={formatCount(totalViews)} tone="text-slate-900" />
            <InsightBox label="Dibaca Hari Ini" value={formatCount(viewsToday)} tone="text-[#3f679c]" />
            <InsightBox
              label="Dibaca 30 Hari Terakhir"
              value={formatCount(viewsLast30Days)}
              tone="text-[#45658f]"
              helper={
                viewTrend >= 0
                  ? `Naik ${formatCount(viewTrend)} dari 30 hari sebelumnya`
                  : `Turun ${formatCount(Math.abs(viewTrend))} dari 30 hari sebelumnya`
              }
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Berita Terbaru</h2>
          <p className="text-sm leading-6 text-slate-500">
            Monitor publikasi terbaru dan jumlah pembacaan tiap artikel.
          </p>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Judul</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Tanggal</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {latestNews.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{item.title}</td>
                    <td className="px-4 py-3 text-slate-600 capitalize">{item.status}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.publishedAt.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatCount(item.views)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dce8f6] text-[#27466f]">
          {icon}
        </div>
      </div>
    </div>
  )
}

function InsightBox({
  label,
  value,
  tone,
  helper,
}: {
  label: string
  value: string
  tone: string
  helper?: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold tracking-tight ${tone}`}>{value}</p>
      {helper ? <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p> : null}
    </div>
  )
}
