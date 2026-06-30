"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { startTransition, useActionState, useEffect, useMemo, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { ArrowLeftIcon, LoaderCircleIcon, XIcon } from "lucide-react"

import { createGalleryEntryAction, type GalleryActionState } from "@/app/(admin)/admin-space/galeri/actions"
import { GalleryDateField } from "@/components/admin/gallery-date-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type UploadedImage = {
  path: string
  url: string
}

const initialGalleryActionState: GalleryActionState = {
  error: null,
  success: null,
}

export default function TambahGaleriPage() {
  const router = useRouter()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [state, formAction] = useActionState(
    createGalleryEntryAction,
    initialGalleryActionState
  )

  const previews = useMemo(
    () =>
      selectedFiles.map((file, index) => ({
        file,
        url: URL.createObjectURL(file),
        uploaded: uploadedImages[index] ?? null,
      })),
    [selectedFiles, uploadedImages]
  )

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [previews])

  useEffect(() => {
    if (state.success) {
      router.push("/galeri")
    }
  }, [state.success, router])

  function handleImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, 10)
    setSelectedFiles(files)
    setUploadedImages([])
    setUploadError(null)

    if (event.target.files && event.target.files.length > 10) {
      const dataTransfer = new DataTransfer()
      files.forEach((file) => dataTransfer.items.add(file))
      event.target.files = dataTransfer.files
    }
  }

  function handleRemoveImage(index: number) {
    const nextFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index)
    const nextUploadedImages = uploadedImages.filter((_, fileIndex) => fileIndex !== index)
    setSelectedFiles(nextFiles)
    setUploadedImages(nextUploadedImages)
    setUploadError(null)

    if (!imageInputRef.current) {
      return
    }

    const dataTransfer = new DataTransfer()
    nextFiles.forEach((file) => dataTransfer.items.add(file))
    imageInputRef.current.files = dataTransfer.files
  }

  async function uploadSelectedFiles() {
    if (selectedFiles.length === 0) {
      setUploadError("Pilih foto dulu.")
      return null
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const nextUploadedImages: UploadedImage[] = []

      for (const file of selectedFiles) {
        const body = new FormData()
        body.set("file", file)

        const response = await fetch("/api/admin/storage/upload", {
          method: "POST",
          body,
        })

        const payload = (await response.json().catch(() => null)) as
          | { error?: string; path?: string; url?: string }
          | null

        if (!response.ok || !payload?.path || !payload.url) {
          throw new Error(payload?.error ?? "Upload gagal diproses.")
        }

        nextUploadedImages.push({
          path: payload.path,
          url: payload.url,
        })
      }

      setUploadedImages(nextUploadedImages)
      return nextUploadedImages
    } catch (error) {
      setUploadedImages([])
      setUploadError(
        error instanceof Error ? error.message : "Upload gagal diproses."
      )
      return null
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSubmit(formData: FormData) {
    if (isUploading) {
      return
    }

    const images =
      uploadedImages.length === selectedFiles.length && uploadedImages.length > 0
        ? uploadedImages
        : await uploadSelectedFiles()

    if (!images || images.length === 0) {
      return
    }

    const payload = new FormData()
    payload.set("title", String(formData.get("title") ?? ""))
    payload.set("eventDate", String(formData.get("eventDate") ?? ""))

    images.forEach((image) => {
      payload.append("uploadedImages", JSON.stringify({ path: image.path }))
    })

    startTransition(() => {
      formAction(payload)
    })
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
          Tambah Kegiatan Galeri
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Satu kegiatan dapat memuat nama kegiatan, tanggal, dan banyak foto sekaligus.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <Field label="Nama Kegiatan">
              <Input
                name="title"
                placeholder="Contoh: Kajian Rutin Fakultas"
                className="h-11 px-4"
                required
              />
            </Field>

            <div className="space-y-4">
              <GalleryDateField name="eventDate" />
            </div>

            <Field label="Foto Kegiatan">
              <Input
                ref={imageInputRef}
                name="images"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/gif"
                required={selectedFiles.length === 0}
                onChange={handleImagesChange}
                disabled={isUploading}
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Bisa upload banyak foto sekaligus untuk satu kegiatan galeri. Maksimal 10 foto. Format: PNG, JPG, WEBP, GIF.
              </p>
              {previews.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/80"
                        aria-label={`Hapus ${preview.file.name}`}
                        disabled={isUploading}
                      >
                        <XIcon className="size-4" />
                      </button>
                      <div className="border-t border-slate-200 px-3 py-2 text-xs text-slate-600">
                        <p className="truncate font-medium text-slate-800">{preview.file.name}</p>
                        <p className="mt-1 text-slate-500">
                          {preview.uploaded ? "Siap dikirim" : "Belum diupload"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </Field>
          </div>

          {uploadError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{uploadError}</p>
            </div>
          ) : null}

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
              disabled={isUploading}
            >
              Batal
            </Button>
            <SubmitButton isUploading={isUploading} />
          </div>
        </form>
      </section>
    </div>
  )
}

function SubmitButton({ isUploading }: { isUploading: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="bg-[#3f679c] text-white hover:bg-[#355887]"
      disabled={pending || isUploading}
    >
      {isUploading ? (
        <>
          <LoaderCircleIcon className="size-4 animate-spin" />
          Mengunggah...
        </>
      ) : pending ? (
        "Menyimpan..."
      ) : (
        "Simpan Kegiatan"
      )}
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
