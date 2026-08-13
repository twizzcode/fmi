"use client"

import { useActionState, useEffect, useRef, useState, startTransition, useMemo } from "react"
import { useFormStatus } from "react-dom"
import { ImagesIcon, PlusIcon, LoaderCircleIcon, XIcon } from "lucide-react"
import Image from "next/image"

import {
  createGalleryEntryAction,
  type GalleryActionState,
} from "@/app/(admin)/admin-space/workspace/galeri/actions"
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

type UploadedImage = {
  path: string
  url: string
}

const initialGalleryActionState: GalleryActionState = {
  error: null,
  success: null,
}

export function GalleryForm({ disabled = false }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
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
    if (state.success) {
      requestAnimationFrame(() => {
        formRef.current?.reset()
        setSelectedFiles([])
        setUploadedImages([])
        setUploadError(null)
        setOpen(false)
      })
    }
  }, [state.success])

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
    const nextFiles = selectedFiles.filter((_, i) => i !== index)
    const nextUploaded = uploadedImages.filter((_, i) => i !== index)
    setSelectedFiles(nextFiles)
    setUploadedImages(nextUploaded)
    setUploadError(null)

    if (imageInputRef.current) {
      const dataTransfer = new DataTransfer()
      nextFiles.forEach((file) => dataTransfer.items.add(file))
      imageInputRef.current.files = dataTransfer.files
    }
  }

  async function uploadSelectedFiles() {
    if (selectedFiles.length === 0) {
      return []
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
      uploadedImages.length === selectedFiles.length
        ? uploadedImages
        : await uploadSelectedFiles()

    if (images === null) {
      return
    }

    if (images.length === 0) {
      setUploadError("Upload minimal satu foto galeri.")
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
          <form ref={formRef} action={handleSubmit} className="flex flex-col">
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
                    disabled={disabled || isUploading}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-900">
                    Foto Kegiatan
                  </label>
                  <Input
                    ref={imageInputRef}
                    name="images"
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleImagesChange}
                    disabled={disabled || isUploading}
                  />
                  <p className="text-xs leading-5 text-slate-500">
                    Bisa upload banyak foto sekaligus untuk satu kegiatan
                    galeri. Maksimal 10 foto.
                  </p>

                  {previews.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                        Preview {uploadedImages.length > 0 ? "(Sudah Upload)" : "(Belum Upload)"}
                      </p>
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {previews.map((preview, index) => (
                          <div
                            key={index}
                            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                          >
                            <div className="relative aspect-square">
                              <Image
                                src={preview.url}
                                alt={`Preview ${index + 1}`}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              disabled={isUploading}
                              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XIcon className="size-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <GalleryDateField name="eventDate" disabled={disabled || isUploading} />
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
                {uploadError ? (
                  <p className="text-sm text-red-600">{uploadError}</p>
                ) : null}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isUploading}>
                Batal
              </Button>
              <SubmitButton disabled={disabled || isUploading} isUploading={isUploading} />
            </DialogFooter>
          </form>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}

function SubmitButton({ disabled = false, isUploading = false }: { disabled?: boolean; isUploading?: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="bg-[#3f679c] text-white hover:bg-[#355887]"
      disabled={disabled || pending || isUploading}
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
