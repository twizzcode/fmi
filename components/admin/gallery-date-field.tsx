"use client"

import { useState } from "react"
import { format } from "date-fns"
import { id as indonesiaLocale } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type GalleryDateFieldProps = {
  name: string
  defaultValue?: string
  disabled?: boolean
}

export function GalleryDateField({
  name,
  defaultValue = "",
  disabled = false,
}: GalleryDateFieldProps) {
  const [selected, setSelected] = useState<Date | undefined>(
    parseDateValue(defaultValue)
  )

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-900">Tanggal Kegiatan</label>
      <input
        type="hidden"
        name={name}
        value={selected ? format(selected, "yyyy-MM-dd") : ""}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-11 w-full justify-between px-4 text-left font-normal",
              !selected && "text-slate-400"
            )}
          >
            {selected ? format(selected, "d MMMM yyyy", { locale: indonesiaLocale }) : "Pilih tanggal galeri"}
            <CalendarIcon className="size-4 text-slate-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={indonesiaLocale}
            selected={selected}
            onSelect={setSelected}
            captionLayout="dropdown"
            showOutsideDays={false}
            startMonth={new Date(2020, 0)}
            endMonth={new Date(2035, 11)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function parseDateValue(value: string) {
  if (!value) {
    return undefined
  }

  const parsed = new Date(`${value}T00:00:00`)

  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed
}
