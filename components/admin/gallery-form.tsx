"use client"

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { ImageUpIcon } from "lucide-react"

import {
  createGalleryEntryAction,
  type GalleryActionState,
} from "@/app/(admin)/admin-space/galeri/actions"
import { GalleryDateField } from "@/components/admin/gallery-date-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialGalleryActionState: GalleryActionState = {
  error: null,
  success: null,
}

export function GalleryForm({ disabled = false }: { disabled?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(
    createGalleryEntryAction,
    initialGalleryActionState
  )

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#3f679c]/10 text-[#3f679c]">
          <ImageUpIcon className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Tambah Item Galeri
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Upload foto galeri dan simpan tanggal kegiatan agar setiap item bisa
            dikelola lewat card modal.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-900">File Gambar</label>
          <Input
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            disabled={disabled}
          />
        </div>
        <GalleryDateField name="eventDate" disabled={disabled} />
      </div>

      {state.error ? <p className="mt-4 text-sm text-red-600">{state.error}</p> : null}
      {state.success ? (
        <p className="mt-4 text-sm text-emerald-600">{state.success}</p>
      ) : null}

      <div className="mt-5">
        <SubmitButton disabled={disabled} />
      </div>
    </form>
  )
}

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="h-10 bg-[#3f679c] px-4 text-white hover:bg-[#355887]"
      disabled={disabled || pending}
    >
      {pending ? "Menyimpan..." : "Simpan Galeri"}
    </Button>
  )
}
