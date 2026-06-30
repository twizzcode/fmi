"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

const tabs = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
]

export function TestimonialFilterTabs({ currentTab }: { currentTab: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)
    params.delete("page")

    const query = params.toString()
    router.push(query ? `/admin/testimoni?${query}` : "/admin/testimoni")
  }

  return (
    <div className="inline-flex items-center rounded-lg bg-muted p-[3px] text-muted-foreground">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.value

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              "inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-all hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring",
              isActive &&
                "bg-background text-foreground shadow-sm dark:border-input dark:bg-input/30"
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
