"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { ImageIcon, PencilIcon, Trash2Icon } from "lucide-react"

import type { AdminGalleryItem } from "@/lib/gallery"
import {
  deleteGalleryEntryAction,
  type GalleryActionState,
  updateGalleryEntryAction,
} from "@/app/(admin)/admin-space/galeri/actions"
import { GalleryDateField } from "@/components/admin/gallery-date-field"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const initialGalleryActionState: GalleryActionState = {
  error: null,
  success: null,
}

export function GalleryManager({ items }: { items: AdminGalleryItem[] }) {
  if (items.length === 0) {
    return (
      <div className="mt-6 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#3f679c]/10 text-[#3f679c]">
          <ImageIcon className="size-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          Belum ada file galeri
        </h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Upload pertama Anda akan langsung muncul di sini beserta modal untuk
          mengatur tanggal kegiatannya.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.path}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div className="aspect-[4/3] bg-slate-100">
            {item.signedUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.signedUrl}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Preview tidak tersedia
              </div>
            )}
          </div>
          <div className="space-y-4 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900">
                  {item.name}
                </p>
                <p className="mt-1 text-sm text-[#3f679c]">
                  {item.eventDateLabel ?? "Tanggal belum diatur"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <EditGalleryDialog item={item} />
                <DeleteGalleryDialog item={item} />
              </div>
            </div>
            <div className="space-y-1 text-xs text-slate-500">
              <p className="truncate">{item.path}</p>
              <p>
                {item.updatedAt
                  ? `Diperbarui ${new Date(item.updatedAt).toLocaleString("id-ID")}`
                  : "Waktu update tidak tersedia"}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function EditGalleryDialog({ item }: { item: AdminGalleryItem }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-sm" aria-label="Kelola galeri">
          <PencilIcon className="size-4" />
        </Button>
      </DialogTrigger>
      {open ? <EditDialogContent item={item} onClose={() => setOpen(false)} /> : null}
    </Dialog>
  )
}

function DeleteGalleryDialog({ item }: { item: AdminGalleryItem }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon-sm" aria-label="Hapus galeri">
          <Trash2Icon className="size-4" />
        </Button>
      </DialogTrigger>
      {open ? <DeleteDialogContent item={item} onClose={() => setOpen(false)} /> : null}
    </Dialog>
  )
}

function EditDialogContent({
  item,
  onClose,
}: {
  item: AdminGalleryItem
  onClose: () => void
}) {
  const [state, formAction] = useActionState(
    updateGalleryEntryAction,
    initialGalleryActionState
  )

  useEffect(() => {
    if (state.success) {
      onClose()
    }
  }, [state.success, onClose])

  return (
    <DialogContent className="overflow-hidden rounded-2xl p-0 sm:!max-w-3xl">
      <form action={formAction} className="flex flex-col">
        <input type="hidden" name="id" value={item.id ?? ""} />
        <input type="hidden" name="path" value={item.path} />

        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Kelola Item Galeri</DialogTitle>
          <DialogDescription>
            Atur tanggal kegiatan untuk tiap foto galeri langsung dari card
            modal ini.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 px-6 py-4 md:grid-cols-[260px_minmax(0,1fr)]">
          <div className="space-y-3">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
              {item.signedUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.signedUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Preview tidak tersedia
                </div>
              )}
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
              <p className="truncate font-medium text-slate-900">{item.name}</p>
              <p className="mt-1 truncate">{item.path}</p>
            </div>
          </div>

          <div className="space-y-4">
            <GalleryDateField
              name="eventDate"
              defaultValue={item.eventDateValue}
            />
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Tanggal ini dipakai sebagai metadata galeri. File lama yang belum
              punya tanggal bisa langsung dilengkapi dari modal ini.
            </div>
            {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
            {state.success ? (
              <p className="text-sm text-emerald-600">{state.success}</p>
            ) : null}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
          <SubmitButton label="Simpan Perubahan" />
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function DeleteDialogContent({
  item,
  onClose,
}: {
  item: AdminGalleryItem
  onClose: () => void
}) {
  const [state, formAction] = useActionState(
    deleteGalleryEntryAction,
    initialGalleryActionState
  )

  useEffect(() => {
    if (state.success) {
      onClose()
    }
  }, [state.success, onClose])

  return (
    <DialogContent className="rounded-2xl sm:!max-w-md">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={item.id ?? ""} />
        <input type="hidden" name="path" value={item.path} />

        <DialogHeader>
          <DialogTitle>Hapus Item Galeri</DialogTitle>
          <DialogDescription>
            Foto akan dihapus dari storage beserta metadata tanggalnya.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-medium">{item.name}</p>
          <p className="mt-1 break-all text-red-800/80">{item.path}</p>
        </div>

        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
          <SubmitButton label="Hapus Galeri" variant="destructive" />
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function SubmitButton({
  label,
  variant = "default",
}: {
  label: string
  variant?: "default" | "destructive"
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant={variant}
      className={
        variant === "default"
          ? "bg-[#3f679c] text-white hover:bg-[#355887]"
          : undefined
      }
      disabled={pending}
    >
      {pending ? "Memproses..." : label}
    </Button>
  )
}
