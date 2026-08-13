import { Suspense } from "react"

import { DashboardAnalyticsChart } from "@/components/admin/dashboard-analytics-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { db, schema } from "@/lib/db"
import { sql } from "drizzle-orm"
import { BriefcaseBusiness, Images, Newspaper, Users2 } from "lucide-react"

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

export default function DashboardPage() {
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

      <Suspense fallback={<DashboardMetricsSkeleton />}>
        <DashboardMetricsSection />
      </Suspense>

      <section className="grid gap-4 xl:grid-cols-1">
        <Suspense fallback={<DashboardChartSkeleton />}>
          <DashboardGrowthChart />
        </Suspense>
      </section>
    </div>
  )
}

async function DashboardMetricsSection() {
  const [metricsResult] = await db.select({
    users: sql<number>`(SELECT count(*)::int FROM ${schema.users})`,
    galleries: sql<number>`(SELECT count(*)::int FROM ${schema.galleryEntries})`,
    members: sql<number>`(SELECT count(*)::int FROM ${schema.structureMembers})`,
    news: sql<number>`(SELECT count(*)::int FROM ${schema.newsArticles})`,
  }).from(sql`(SELECT 1) AS dummy`)

  const totalUsers = metricsResult?.users ?? 0
  const totalGalleries = metricsResult?.galleries ?? 0
  const totalMembers = metricsResult?.members ?? 0
  const totalNews = metricsResult?.news ?? 0

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Akun Terdaftar" value={formatCount(totalUsers)} icon={<Users2 className="size-5" />} />
      <MetricCard label="Total Galeri" value={formatCount(totalGalleries)} icon={<Images className="size-5" />} />
      <MetricCard label="Fungsionaris / Staff" value={formatCount(totalMembers)} icon={<BriefcaseBusiness className="size-5" />} />
      <MetricCard label="Total Berita" value={formatCount(totalNews)} icon={<Newspaper className="size-5" />} />
    </section>
  )
}

async function DashboardGrowthChart() {
  const now = new Date()
  const todayStart = startOfDay(now)
  const last30DaysStart = subtractDays(todayStart, 29)
  const previous30DaysStart = subtractDays(last30DaysStart, 30)

  const [recentGalleryRows, recentMemberRows, userGrowthRows] = await Promise.all([
    db
      .select({ createdAt: schema.galleryEntries.createdAt })
      .from(schema.galleryEntries)
      .where(sql`${schema.galleryEntries.createdAt} >= ${previous30DaysStart.toISOString()}`),
    db
      .select({ createdAt: schema.structureMembers.createdAt })
      .from(schema.structureMembers)
      .where(sql`${schema.structureMembers.createdAt} >= ${previous30DaysStart.toISOString()}`),
    db
      .select({ createdAt: schema.users.createdAt })
      .from(schema.users)
      .where(sql`${schema.users.createdAt} >= ${previous30DaysStart.toISOString()}`),
  ])

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

  for (const row of recentGalleryRows) {
    const index = chartLabels.findIndex(
      (slot) => row.createdAt >= slot.start && row.createdAt < slot.end
    )
    if (index >= 0) chartData[index].galleries += 1
  }

  for (const row of recentMemberRows) {
    const index = chartLabels.findIndex(
      (slot) => row.createdAt >= slot.start && row.createdAt < slot.end
    )
    if (index >= 0) chartData[index].members += 1
  }

  for (const row of userGrowthRows) {
    const index = chartLabels.findIndex(
      (slot) => row.createdAt >= slot.start && row.createdAt < slot.end
    )
    if (index >= 0) chartData[index].users += 1
  }

  return (
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

function DashboardMetricsSkeleton() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-3">
              <Skeleton className="h-3 w-24 rounded-full bg-slate-200" />
              <Skeleton className="h-7 w-20 rounded-xl bg-slate-200" />
            </div>
            <Skeleton className="h-11 w-11 rounded-full bg-slate-200" />
          </div>
        </div>
      ))}
    </section>
  )
}

function DashboardChartSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <Skeleton className="h-6 w-48 rounded-xl bg-slate-200" />
      <Skeleton className="mt-3 h-4 w-full max-w-lg rounded-full bg-slate-200" />
      <Skeleton className="mt-6 h-72 w-full rounded-2xl bg-slate-200" />
    </div>
  )
}
