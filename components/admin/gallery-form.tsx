"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { ImagesIcon, PlusIcon } from "lucide-react"

import {
  createGalleryEntryAction,
  type GalleryActionState,
} from "@/app/(admin)/admin-space/galeri/actions"
import { GalleryDateField } from "@/components/admin/gallery-date-field"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const initialGalleryActionState: GalleryActionState = {
  error: null,
  success: null,
}

export function GalleryForm({ disabled = false }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(
    createGalleryEntryAction,
    initialGalleryActionState
  )

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      const frame = requestAnimationFrame(() => {
        setOpen(false)
      })

      return () => cancelAnimationFrame(frame)
    }
  }, [state.success])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-10 bg-[#3f679c] px-4 text-white hover:bg-[#355887]"
          disabled={disabled}
        >
          <PlusIcon className="size-4" />
          Tambah Kegiatan Galeri
        </Button>
      </DialogTrigger>

      {open ? (
        <DialogContent className="overflow-hidden rounded-2xl p-0 sm:!max-w-3xl">
          <form ref={formRef} action={formAction} className="flex flex-col">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Tambah Kegiatan Galeri</DialogTitle>
              <DialogDescription>
                Satu kegiatan dapat memuat nama kegiatan, tanggal, dan banyak
                foto sekaligus.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 px-6 py-4 md:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-900">
                    Nama Kegiatan
                  </label>
                  <Input
                    name="title"
                    placeholder="Contoh: Kajian Rutin Fakultas"
                    className="h-11 px-4"
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-900">
                    Foto Kegiatan
                  </label>
                  <Input
                    name="images"
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    disabled={disabled}
                  />
                  <p className="text-xs leading-5 text-slate-500">
                    Bisa upload banyak foto sekaligus untuk satu kegiatan
                    galeri.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <GalleryDateField name="eventDate" disabled={disabled} />
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  <div className="mb-2 flex items-center gap-2 font-medium text-slate-900">
                    <ImagesIcon className="size-4 text-[#3f679c]" />
                    Satu card = satu kegiatan
                  </div>
                  Card galeri akan dikelompokkan berdasarkan kegiatan, bukan
                  per foto.
                </div>
                {state.error ? (
                  <p className="text-sm text-red-600">{state.error}</p>
                ) : null}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <SubmitButton disabled={disabled} />
            </DialogFooter>
          </form>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="bg-[#3f679c] text-white hover:bg-[#355887]"
      disabled={disabled || pending}
    >
      {pending ? "Menyimpan..." : "Simpan Kegiatan"}
    </Button>
  )
}
