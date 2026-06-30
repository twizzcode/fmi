"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { ArrowLeftIcon, XIcon } from "lucide-react"

import {
  updateGalleryEntryAction,
  type GalleryActionState,
} from "@/app/(admin)/admin-space/galeri/actions"
import { GalleryDateField } from "@/components/admin/gallery-date-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { GalleryActivity } from "@/lib/gallery"

const initialGalleryActionState: GalleryActionState = {
  error: null,
  success: null,
}

type EditGaleriPageProps = {
  params: Promise<{ id: string }>
}

export default function EditGaleriPage({ params }: EditGaleriPageProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [galleryItem, setGalleryItem] = useState<GalleryActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [removedPhotoIds, setRemovedPhotoIds] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [state, formAction] = useActionState(
    updateGalleryEntryAction,
    initialGalleryActionState
  )

  const previews = useMemo(
    () =>
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles]
  )

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [previews])

  useEffect(() => {
    async function loadGallery() {
      const resolvedParams = await params
      const response = await fetch("/api/admin/gallery")

      if (!response.ok) {
        setLoading(false)
        return
      }

      const items: GalleryActivity[] = await response.json()
      const item = items.find((entry) => entry.id === resolvedParams.id) ?? null
      setGalleryItem(item)
      setLoading(false)
    }

    loadGallery()
  }, [params])

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      router.push("/galeri")
    }
  }, [state.success, router])

  function togglePhotoRemoval(photoId: string) {
    setRemovedPhotoIds((current) =>
      current.includes(photoId)
        ? current.filter((id) => id !== photoId)
        : [...current, photoId]
    )
  }

  function handleImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, 10)
    setSelectedFiles(files)

    if (event.target.files && event.target.files.length > 10) {
      const dataTransfer = new DataTransfer()
      files.forEach((file) => dataTransfer.items.add(file))
      event.target.files = dataTransfer.files
    }
  }

  function handleRemoveNewImage(index: number) {
    const nextFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index)
    setSelectedFiles(nextFiles)

    if (!imageInputRef.current) {
      return
    }

    const dataTransfer = new DataTransfer()
    nextFiles.forEach((file) => dataTransfer.items.add(file))
    imageInputRef.current.files = dataTransfer.files
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  if (!galleryItem) {
    return (
      <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
            <Link href="/galeri">
              <ArrowLeftIcon className="mr-2 size-4" />
              Kembali ke Galeri
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Galeri tidak ditemukan
          </h1>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href="/galeri">
            <ArrowLeftIcon className="mr-2 size-4" />
            Kembali ke Galeri
          </Link>
        </Button>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
          Workplace
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Edit Kegiatan Galeri
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Satu kegiatan dapat memuat nama kegiatan, tanggal, dan banyak foto sekaligus.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form ref={formRef} action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={galleryItem.id} />
          {removedPhotoIds.map((photoId) => (
            <input key={photoId} type="hidden" name="removedPhotoIds" value={photoId} />
          ))}

          <div className="space-y-6">
            <Field label="Nama Kegiatan">
              <Input
                name="title"
                defaultValue={galleryItem.title}
                placeholder="Contoh: Kajian Rutin Fakultas"
                className="h-11 px-4"
                required
              />
            </Field>

            <div className="space-y-4">
              <GalleryDateField name="eventDate" defaultValue={galleryItem.eventDateValue} />
            </div>

            <Field label="Foto Kegiatan">
              <Input
                ref={imageInputRef}
                name="newImages"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleImagesChange}
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Bisa upload banyak foto sekaligus untuk satu kegiatan galeri. Maksimal 10 foto. Format: PNG, JPG, WEBP, GIF.
              </p>

              <div className="mt-4 space-y-4">
                {galleryItem.photos.length > 0 ? (
                  <div>
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      Foto Lama
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {galleryItem.photos.map((photo) => {
                        const isRemoved = removedPhotoIds.includes(photo.id)

                        return (
                          <div
                            key={photo.id}
                            className={`group relative overflow-hidden rounded-xl border ${
                              isRemoved
                                ? "border-red-300 bg-red-50"
                                : "border-slate-200 bg-slate-50"
                            }`}
                          >
                            <div className="relative aspect-square w-full">
                              {photo.url ? (
                                <img
                                  src={photo.url}
                                  alt={photo.alt}
                                  className={`h-full w-full object-cover ${isRemoved ? "opacity-40" : ""}`}
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                                  Preview tidak tersedia
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => togglePhotoRemoval(photo.id)}
                              className={`absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full text-white transition ${
                                isRemoved ? "bg-slate-500 hover:bg-slate-600" : "bg-red-500 hover:bg-red-600"
                              }`}
                              aria-label={isRemoved ? "Batal hapus foto" : "Hapus foto ini"}
                            >
                              <XIcon className="size-4" />
                            </button>
                            <div className="border-t border-slate-200 px-3 py-2 text-xs text-slate-600">
                              <p className="truncate font-medium text-slate-800">{photo.alt}</p>
                              <p className={isRemoved ? "mt-1 text-red-600" : "mt-1 text-slate-500"}>
                                {isRemoved ? "Akan dihapus" : "Foto lama"}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null}

                {previews.length > 0 ? (
                  <div>
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      Foto Baru
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {previews.map((preview, index) => (
                        <div key={`${preview.file.name}-${index}`} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          <div className="relative aspect-square w-full">
                            <Image
                              src={preview.url}
                              alt={preview.file.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/80"
                            aria-label={`Hapus ${preview.file.name}`}
                          >
                            <XIcon className="size-4" />
                          </button>
                          <div className="border-t border-slate-200 px-3 py-2 text-xs text-slate-600">
                            <p className="truncate font-medium text-slate-800">{preview.file.name}</p>
                            <p className="mt-1 text-slate-500">Foto baru</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </Field>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Jika semua foto lama dihapus, upload minimal satu foto baru dulu sebelum simpan.
          </div>

          {state.error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{state.error}</p>
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/galeri")}
            >
              Batal
            </Button>
            <SubmitButton />
          </div>
        </form>
      </section>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="bg-[#3f679c] text-white hover:bg-[#355887]"
      disabled={pending}
    >
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
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
