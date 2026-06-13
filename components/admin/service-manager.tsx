"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { BriefcaseBusinessIcon, ImageUpIcon, PencilIcon, Trash2Icon } from "lucide-react"

import type { ServiceView } from "@/lib/services"
import {
  deleteServiceAction,
  type ServiceActionState,
  updateServiceAction,
} from "@/app/(admin)/admin-space/layanan/actions"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const initialActionState: ServiceActionState = {
  error: null,
  success: null,
}

export function ServiceManager({ services }: { services: ServiceView[] }) {
  if (services.length === 0) {
    return (
      <div className="mt-6 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#3f679c]/10 text-[#3f679c]">
          <BriefcaseBusinessIcon className="size-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          Belum ada layanan
        </h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Tambahkan layanan pertama dari panel di atas agar section Layanan Kami
          di homepage menjadi dinamis.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {services.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div className="aspect-[4/3] bg-slate-100">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Gambar tidak tersedia
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-[#3f679c]">
                  Urutan {item.sortOrder} · {item.buttonLabel}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <EditServiceDialog item={item} />
                <DeleteServiceDialog item={item} />
              </div>
            </div>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
            <p className="mt-3 truncate text-xs text-slate-400">{item.href}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

function EditServiceDialog({ item }: { item: ServiceView }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-sm" aria-label="Edit layanan">
          <PencilIcon className="size-4" />
        </Button>
      </DialogTrigger>
      {open ? <EditDialogContent item={item} onClose={() => setOpen(false)} /> : null}
    </Dialog>
  )
}

function DeleteServiceDialog({ item }: { item: ServiceView }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon-sm" aria-label="Hapus layanan">
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
  item: ServiceView
  onClose: () => void
}) {
  const [replaceImage, setReplaceImage] = useState(false)
  const [state, formAction] = useActionState(updateServiceAction, initialActionState)

  useEffect(() => {
    if (state.success) onClose()
  }, [state.success, onClose])

  return (
    <DialogContent className="sm:!max-w-4xl h-[60vh] max-h-[60vh] overflow-hidden rounded-2xl p-0">
      <form action={formAction} className="flex h-full flex-col">
        <input type="hidden" name="id" value={item.id} />
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Edit Layanan</DialogTitle>
          <DialogDescription>
            Perbarui isi kartu layanan, link tujuan, urutan, atau ganti gambarnya.
          </DialogDescription>
        </DialogHeader>

        <div className="grid flex-1 gap-5 overflow-y-auto px-6 py-2">
          <div className="grid gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
            <div className="space-y-3">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Gambar tidak tersedia
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  name="replaceImage"
                  checked={replaceImage}
                  onChange={(event) => setReplaceImage(event.target.checked)}
                  className="size-4 rounded border-slate-300"
                />
                Ganti gambar lama
              </label>
              {replaceImage ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-900">
                    <ImageUpIcon className="size-4 text-[#3f679c]" />
                    Upload gambar baru
                  </div>
                  <Input
                    name="image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                  />
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-900">
                  Judul Layanan
                </label>
                <Input name="title" defaultValue={item.title} className="h-11 px-3" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-900">
                  Label Tombol
                </label>
                <Input
                  name="buttonLabel"
                  defaultValue={item.buttonLabel}
                  className="h-11 px-3"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_10rem]">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-900">
                    Link Tujuan
                  </label>
                  <Input name="href" defaultValue={item.href} className="h-11 px-3" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-900">
                    Urutan
                  </label>
                  <Input
                    name="sortOrder"
                    type="number"
                    defaultValue={item.sortOrder}
                    className="h-11 px-3"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-900">
                  Deskripsi
                </label>
                <Textarea
                  name="description"
                  defaultValue={item.description}
                  className="min-h-[12rem] px-4 py-4"
                />
              </div>
            </div>
          </div>

          {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
          {state.success ? (
            <p className="text-sm text-emerald-600">{state.success}</p>
          ) : null}
        </div>

        <DialogFooter className="mx-0 mb-0 rounded-b-2xl">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
          <SubmitButton label="Simpan Perubahan" pendingLabel="Menyimpan..." />
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function DeleteDialogContent({
  item,
  onClose,
}: {
  item: ServiceView
  onClose: () => void
}) {
  const [state, formAction] = useActionState(deleteServiceAction, initialActionState)

  useEffect(() => {
    if (state.success) onClose()
  }, [state.success, onClose])

  return (
    <DialogContent className="sm:!max-w-2xl h-[26vh] max-h-[26vh] overflow-hidden rounded-2xl p-0">
      <form action={formAction} className="flex h-full flex-col">
        <input type="hidden" name="id" value={item.id} />
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Hapus Layanan</DialogTitle>
          <DialogDescription>
            Kartu layanan {item.title} akan dihapus permanen beserta gambarnya di storage.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 px-6 py-2">
          {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
          {state.success ? (
            <p className="text-sm text-emerald-600">{state.success}</p>
          ) : null}
        </div>

        <DialogFooter className="mx-0 mb-0 rounded-b-2xl">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
          <SubmitButton
            label="Hapus Permanen"
            pendingLabel="Menghapus..."
            variant="destructive"
          />
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function SubmitButton({
  label,
  pendingLabel,
  variant = "default",
}: {
  label: string
  pendingLabel: string
  variant?: "default" | "destructive"
}) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" variant={variant} disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  )
}
