"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { NewspaperIcon, ImageUpIcon, PencilIcon, Trash2Icon } from "lucide-react"

import { deleteNewsArticleAction, type NewsActionState, updateNewsArticleAction } from "@/app/(admin)/admin-space/berita/actions"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter as ConfirmFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import type { NewsArticle } from "@/lib/news"

const initialActionState: NewsActionState = {
  error: null,
  success: null,
}

export function NewsManager({ items }: { items: NewsArticle[] }) {
  if (items.length === 0) {
    return (
      <div className="mt-6 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#3f679c]/10 text-[#3f679c]">
          <NewspaperIcon className="size-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">Belum ada berita</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Tambahkan berita pertama dari panel di atas untuk mulai mengisi daftar berita publik.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="aspect-[4/3] bg-slate-100">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">Gambar tidak tersedia</div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <StatusBadge status={item.status} />
                </div>
                <p className="truncate text-base font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-[#3f679c]">{item.category} · {item.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <EditNewsDialog item={item} />
                <DeleteNewsDialog item={item} />
              </div>
            </div>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.excerpt}</p>
            <p className="mt-3 truncate text-xs text-slate-400">/{item.slug}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

function EditNewsDialog({ item }: { item: NewsArticle }) {
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isDirty) {
      setConfirmOpen(true)
      return
    }

    if (!nextOpen) {
      setIsDirty(false)
    }

    setOpen(nextOpen)
  }

  function handleConfirmClose() {
    setConfirmOpen(false)
    setIsDirty(false)
    setOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon-sm" aria-label="Edit berita">
            <PencilIcon className="size-4" />
          </Button>
        </DialogTrigger>
        {open ? (
          <EditDialogContent
            item={item}
            isDirty={isDirty}
            onDirtyChange={setIsDirty}
            onRequestClose={() => {
              if (isDirty) {
                setConfirmOpen(true)
                return
              }

              setIsDirty(false)
              setOpen(false)
            }}
            onClose={() => {
              setIsDirty(false)
              setOpen(false)
            }}
          />
        ) : null}
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tutup editor berita?</AlertDialogTitle>
            <AlertDialogDescription>
              Perubahan yang belum disimpan akan hilang jika Anda keluar sekarang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ConfirmFooter>
            <AlertDialogCancel>Lanjut edit</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmClose}
            >
              Keluar tanpa simpan
            </AlertDialogAction>
          </ConfirmFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function DeleteNewsDialog({ item }: { item: NewsArticle }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon-sm" aria-label="Hapus berita">
          <Trash2Icon className="size-4" />
        </Button>
      </DialogTrigger>
      {open ? <DeleteDialogContent item={item} onClose={() => setOpen(false)} /> : null}
    </Dialog>
  )
}

function EditDialogContent({
  item,
  isDirty,
  onDirtyChange,
  onRequestClose,
  onClose,
}: {
  item: NewsArticle
  isDirty: boolean
  onDirtyChange: (isDirty: boolean) => void
  onRequestClose: () => void
  onClose: () => void
}) {
  const [replaceImage, setReplaceImage] = useState(false)
  const [state, formAction] = useActionState(updateNewsArticleAction, initialActionState)

  useEffect(() => {
    if (state.success) onClose()
  }, [state.success, onClose])

  useEffect(() => {
    if (!replaceImage && !isDirty) {
      return
    }

    if (!replaceImage) {
      return
    }

    onDirtyChange(true)
  }, [isDirty, onDirtyChange, replaceImage])

  function markDirty() {
    if (!isDirty) {
      onDirtyChange(true)
    }
  }

  return (
    <DialogContent className="h-[84vh] max-h-[84vh] overflow-hidden rounded-2xl p-0 sm:!max-w-6xl xl:!max-w-[88rem]">
      <form action={formAction} className="flex h-full min-h-0 flex-col" onChange={markDirty}>
        <input type="hidden" name="id" value={item.id} />
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Edit Berita</DialogTitle>
          <DialogDescription>
            Perbarui metadata, cover, dan isi inti berita dengan editor rich text.
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto px-6 py-3">
          <div className="grid gap-4 md:grid-cols-[320px_minmax(0,1fr)]">
            <div className="space-y-3">
              <div className="aspect-video overflow-hidden rounded-2xl bg-slate-100">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">Gambar tidak tersedia</div>
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
                  <Input name="image" type="file" accept="image/png,image/jpeg,image/webp,image/gif" />
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Judul">
                  <Input name="title" defaultValue={item.title} className="h-11 px-3" />
                </Field>
                <Field label="Slug">
                  <Input name="slug" defaultValue={item.slug} className="h-11 px-3" />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Kategori">
                  <Input name="category" defaultValue={item.category} className="h-11 px-3" />
                </Field>
                <Field label="Penulis">
                  <Input name="author" defaultValue={item.author} className="h-11 px-3" />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_10rem]">
                <Field label="Tanggal Publikasi">
                  <Input name="publishedAt" type="date" defaultValue={item.dateISO} className="h-11 px-3" />
                </Field>
                <Field label="Views">
                  <Input name="views" type="number" defaultValue={item.views} className="h-11 px-3" />
                </Field>
              </div>
              <Field label="Ringkasan">
                <Textarea name="excerpt" defaultValue={item.excerpt} className="min-h-[8rem] px-4 py-4" />
              </Field>
              <Field label="Isi Inti Berita">
                <RichTextEditor
                  name="bodyJson"
                  initialValue={item.bodyJson}
                  onValueChange={markDirty}
                />
              </Field>
            </div>
          </div>

          {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-emerald-600">{state.success}</p> : null}
        </div>

        <DialogFooter className="mx-0 mb-0 rounded-b-2xl">
          <Button type="button" variant="outline" onClick={onRequestClose}>
            Batal
          </Button>
          <SubmitButton
            label="Simpan Draft"
            pendingLabel="Menyimpan..."
            status="draft"
            variant="outline"
          />
          <SubmitButton
            label={item.status === "published" ? "Simpan & Tetap Publikasi" : "Publikasikan"}
            pendingLabel="Menyimpan..."
            status="published"
          />
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function DeleteDialogContent({ item, onClose }: { item: NewsArticle; onClose: () => void }) {
  const [state, formAction] = useActionState(deleteNewsArticleAction, initialActionState)

  useEffect(() => {
    if (state.success) onClose()
  }, [state.success, onClose])

  return (
    <DialogContent className="sm:!max-w-2xl h-[26vh] max-h-[26vh] overflow-hidden rounded-2xl p-0">
      <form action={formAction} className="flex h-full flex-col">
        <input type="hidden" name="id" value={item.id} />
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Hapus Berita</DialogTitle>
          <DialogDescription>
            Artikel {item.title} akan dihapus permanen beserta gambar covernya.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 px-6 py-2">
          {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-emerald-600">{state.success}</p> : null}
        </div>
        <DialogFooter className="mx-0 mb-0 rounded-b-2xl">
          <DialogClose asChild>
            <Button type="button" variant="outline">Batal</Button>
          </DialogClose>
          <SubmitButton label="Hapus Permanen" pendingLabel="Menghapus..." variant="destructive" />
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-900">{label}</label>
      {children}
    </div>
  )
}

function SubmitButton({
  label,
  pendingLabel,
  status,
  variant = "default",
}: {
  label: string
  pendingLabel: string
  status?: "draft" | "published"
  variant?: "default" | "destructive" | "outline"
}) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      name={status ? "status" : undefined}
      value={status}
      variant={variant}
      disabled={pending}
    >
      {pending ? pendingLabel : label}
    </Button>
  )
}

function StatusBadge({ status }: { status: NewsArticle["status"] }) {
  return (
    <span
      className={
        status === "published"
          ? "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700"
          : "inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700"
      }
    >
      {status === "published" ? "Published" : "Draft"}
    </span>
  )
}
