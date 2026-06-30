"use client"

import Image from "next/image"
import Link from "next/link"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

type CabinetOption = {
  id: string
  name: string
  logoPath: string
  orderLabel: string
  href: string
}

export function StructureCabinetSelector({
  cabinets,
  selectedId,
}: {
  cabinets: CabinetOption[]
  selectedId?: string
}) {
  const activeId = selectedId ?? cabinets[0]?.id ?? ""
  const current =
    cabinets.find((cabinet) => cabinet.id === activeId) ?? cabinets[0] ?? null

  if (!current) {
    return null
  }

  return (
    <div className="max-w-md">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-16 w-full justify-between rounded-2xl border-[#c9d8ea] bg-white px-4 shadow-[0_14px_40px_rgba(63,103,156,0.08)] hover:bg-white"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#f8fbff_0%,#edf4fb_100%)]">
                {current.logoPath ? (
                  <Image
                    src={current.logoPath}
                    alt={current.name}
                    width={40}
                    height={40}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-slate-200" />
                )}
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5c7fae]">
                  {current.orderLabel}
                </p>
                <p className="truncate text-sm font-semibold text-[#18365e]">
                  {current.name}
                </p>
              </div>
            </div>
            <ChevronDownIcon className="h-5 w-5 text-[#5c7fae]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-2xl p-2"
        >
          {cabinets.map((cabinet) => {
            const isActive = cabinet.id === current.id

            return (
              <DropdownMenuItem
                key={cabinet.id}
                asChild
                className="min-h-14 rounded-xl px-3 py-2.5"
              >
                <Link href={cabinet.href} className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#f8fbff_0%,#edf4fb_100%)]">
                    {cabinet.logoPath ? (
                      <Image
                        src={cabinet.logoPath}
                        alt={cabinet.name}
                        width={40}
                        height={40}
                        className="h-8 w-8 object-contain"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-lg bg-slate-200" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5c7fae]">
                      {cabinet.orderLabel}
                    </p>
                    <p className="truncate text-sm font-semibold text-[#18365e]">
                      {cabinet.name}
                    </p>
                  </div>
                  {isActive ? (
                    <CheckIcon className="ml-auto h-4 w-4 shrink-0 text-[#3f679c]" />
                  ) : null}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
