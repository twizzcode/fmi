"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type StructureRadialChartProps = {
  ikhwan: number
  akhwat: number
  total: number
}

const chartConfig = {
  ikhwan: {
    label: "Ikhwan",
    color: "#3f679c",
  },
  akhwat: {
    label: "Akhwat",
    color: "#8db3e2",
  },
} satisfies ChartConfig

export function StructureRadialChart({
  ikhwan,
  akhwat,
  total,
}: StructureRadialChartProps) {
  const chartData = [
    { name: "Ikhwan", value: ikhwan, fill: "var(--color-ikhwan)" },
    { name: "Akhwat", value: akhwat, fill: "var(--color-akhwat)" },
  ]

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,360px)] md:items-center">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatItem
          label="Fungsionaris Ikhwan"
          value={String(ikhwan)}
          tone="bg-[#3f679c] text-white"
          description="Komposisi pengurus ikhwan dalam kabinet periode ini."
        />
        <StatItem
          label="Fungsionaris Akhwat"
          value={String(akhwat)}
          tone="bg-[#8db3e2] text-[#18365e]"
          description="Komposisi pengurus akhwat dalam kabinet periode ini."
        />
      </div>

      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[320px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={180}
          endAngle={0}
          innerRadius={80}
          outerRadius={110}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={8}
            background={{ fill: "rgba(141,179,226,0.14)" }}
            className="stroke-transparent stroke-2"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 10}
                        className="fill-[#18365e] text-4xl font-bold"
                      >
                        {total}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 14}
                        className="fill-[#5c7fae] text-sm"
                      >
                        Fungsionaris
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  )
}

function StatItem({
  label,
  value,
  tone,
  description,
}: {
  label: string
  value: string
  tone: string
  description: string
}) {
  return (
    <div className="space-y-3">
      <div className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${tone}`}>
        {label}
      </div>
      <p className="text-4xl font-bold tracking-tight text-[#18365e]">{value}</p>
      <p className="text-sm leading-6 text-slate-600">{description}</p>
    </div>
  )
}
