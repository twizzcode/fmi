"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type AnalyticsPoint = {
  label: string
  users: number
  galleries: number
  members: number
  news: number
}

const chartConfig = {
  users: {
    label: "Akun",
    color: "#3f679c",
  },
  galleries: {
    label: "Galeri",
    color: "#6e94c6",
  },
  members: {
    label: "Fungsionaris",
    color: "#8db3e2",
  },
  news: {
    label: "Berita",
    color: "#bdd3ee",
  },
} satisfies ChartConfig

export function DashboardAnalyticsChart({ data }: { data: AnalyticsPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[320px] w-full aspect-auto">
      <BarChart data={data} barGap={10}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="users" fill="var(--color-users)" radius={[8, 8, 0, 0]} />
        <Bar dataKey="galleries" fill="var(--color-galleries)" radius={[8, 8, 0, 0]} />
        <Bar dataKey="members" fill="var(--color-members)" radius={[8, 8, 0, 0]} />
        <Bar dataKey="news" fill="var(--color-news)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
