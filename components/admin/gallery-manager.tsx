"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import { useFormStatus } from "react-dom"
import { ImageIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react"

import type { GalleryActivity } from "@/lib/gallery"
import {
  deleteGalleryEntryAction,
  type GalleryActionState,
  updateGalleryEntryAction,
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

export function GalleryManager({ items }: { items: GalleryActivity[] }) {
  if (items.length === 0) {
    return (
      <div className="mt-6 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#3f679c]/10 text-[#3f679c]">
          <ImageIcon className="size-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          Belum ada kegiatan galeri
        </h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Tambahkan kegiatan pertama melalui modal, lalu upload banyak foto
          sekaligus untuk satu card galeri.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div className="aspect-[4/3] bg-slate-100">
            {item.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.coverImageUrl}
                alt={item.title}
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
                <p className="line-clamp-2 text-base font-semibold text-slate-900">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-[#3f679c]">
                  {item.eventDateLabel}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <EditGalleryDialog item={item} />
                <DeleteGalleryDialog item={item} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
              <span>{item.photoCount} foto</span>
              <span>1 cover ditampilkan</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function EditGalleryDialog({ item }: { item: GalleryActivity }) {
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

function DeleteGalleryDialog({ item }: { item: GalleryActivity }) {
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
  item: GalleryActivity
  onClose: () => void
}) {
  const [state, formAction] = useActionState(
    updateGalleryEntryAction,
    initialGalleryActionState
  )
  const [removedPhotoIds, setRemovedPhotoIds] = useState<string[]>([])

  useEffect(() => {
    if (state.success) {
      onClose()
    }
  }, [state.success, onClose])

  const visiblePhotos = useMemo(
    () => item.photos.filter((photo) => !removedPhotoIds.includes(photo.id)),
    [item.photos, removedPhotoIds]
  )

  function togglePhotoRemoval(photoId: string) {
    setRemovedPhotoIds((current) =>
      current.includes(photoId)
        ? current.filter((id) => id !== photoId)
        : [...current, photoId]
    )
  }

  return (
    <DialogContent className="h-[85vh] max-h-[85vh] overflow-hidden rounded-2xl p-0 sm:!max-w-5xl">
      <form action={formAction} className="flex h-full min-h-0 flex-col">
        <input type="hidden" name="id" value={item.id} />
        {removedPhotoIds.map((photoId) => (
          <input key={photoId} type="hidden" name="removedPhotoIds" value={photoId} />
        ))}

        <DialogHeader className="shrink-0 border-b px-6 py-5">
          <DialogTitle>Edit Kegiatan Galeri</DialogTitle>
          <DialogDescription>
            Ubah nama kegiatan, tanggal, tambah banyak foto baru, atau hapus
            foto lama satu per satu.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-5">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-900">
                Nama Kegiatan
              </label>
              <Input
                name="title"
                defaultValue={item.title}
                className="h-11 px-4"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-900">
                Tambah Foto Baru
              </label>
              <Input
                name="newImages"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/gif"
              />
              <p className="text-xs leading-5 text-slate-500">
                File baru akan ditambahkan ke kegiatan yang sama.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-slate-900">
                  Foto Dalam Kegiatan
                </label>
                <span className="text-xs text-slate-500">
                  {visiblePhotos.length} foto aktif
                </span>
              </div>
              <p className="text-xs leading-5 text-slate-500">
                Klik tombol pada masing-masing foto untuk menandai hapus satu
                per satu.
              </p>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {item.photos.map((photo) => {
                  const isRemoved = removedPhotoIds.includes(photo.id)

                  return (
                    <div
                      key={photo.id}
                      className={`relative overflow-hidden rounded-2xl border text-left transition ${
                        isRemoved
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <Button
                        type="button"
                        variant={isRemoved ? "outline" : "destructive"}
                        size="icon-sm"
                        className="absolute top-2 right-2 z-10 shadow-sm"
                        onClick={() => togglePhotoRemoval(photo.id)}
                        aria-label={isRemoved ? "Batal hapus foto" : "Hapus foto ini"}
                      >
                        <XIcon className="size-4" />
                      </Button>
                      <div className="aspect-[4/3] bg-slate-100">
                        {photo.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={photo.url}
                            alt={photo.alt}
                            className={`h-full w-full object-cover ${
                              isRemoved ? "opacity-40" : ""
                            }`}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-slate-400">
                            Preview tidak tersedia
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 p-3">
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="truncate text-slate-600">{photo.alt}</span>
                          <span
                            className={
                              isRemoved ? "font-medium text-red-600" : "text-slate-400"
                            }
                          >
                            {isRemoved ? "Akan dihapus" : "Aktif"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <GalleryDateField
              name="eventDate"
              defaultValue={item.eventDateValue}
            />
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Jika foto cover ikut dihapus, sistem otomatis memilih foto aktif
              pertama sebagai cover baru.
            </div>
            {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
          </div>
        </div>
        </div>

        <DialogFooter className="shrink-0 -mx-0 -mb-0 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
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
  item: GalleryActivity
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
        <input type="hidden" name="id" value={item.id} />

        <DialogHeader className="border-b px-0 pb-4">
          <DialogTitle>Hapus Kegiatan Galeri</DialogTitle>
          <DialogDescription>
            Seluruh foto di dalam kegiatan ini juga akan ikut dihapus.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-medium">{item.title}</p>
          <p className="mt-1 text-red-800/80">{item.eventDateLabel}</p>
          <p className="mt-1 text-red-800/80">{item.photoCount} foto</p>
        </div>

        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

        <DialogFooter className="-mx-0 -mb-0 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <SubmitButton label="Hapus Kegiatan" variant="destructive" />
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
