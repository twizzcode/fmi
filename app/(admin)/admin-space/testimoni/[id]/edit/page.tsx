"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { ImageUpIcon, ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

import { updateTestimonialAction, type TestimonialActionState } from "@/app/(admin)/admin-space/testimoni/actions"
import { Button } from "@/components/ui/button"
import { ImageCropper } from "@/components/ui/image-cropper"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { TestimonialView } from "@/lib/testimonials"

const initialTestimonialActionState: TestimonialActionState = {
  error: null,
  success: null,
}

type EditTestimoniPageProps = {
  params: Promise<{ id: string }>
}

export default function EditTestimoniPage({ params }: EditTestimoniPageProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [testimonial, setTestimonial] = useState<TestimonialView | null>(null)
  const [loading, setLoading] = useState(true)
  const [replaceImage, setReplaceImage] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)
  const [state, formAction] = useActionState(
    updateTestimonialAction,
    initialTestimonialActionState
  )

  useEffect(() => {
    async function loadTestimonial() {
      const resolvedParams = await params
      const response = await fetch("/api/admin/testimonials")

      if (!response.ok) {
        setLoading(false)
        return
      }

      const items: TestimonialView[] = await response.json()
      const item = items.find((entry) => entry.id === resolvedParams.id) ?? null

      setTestimonial(item)
      setPreviewUrl(item?.imageUrl ?? "")
      setLoading(false)
    }

    loadTestimonial()
  }, [params])

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      router.push("/testimoni")
    }
  }, [state.success, router])

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== testimonial?.imageUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl, testimonial?.imageUrl])

  function handleFileSelection(file: File | null) {
    if (!file) {
      return
    }

    setSelectedFile(file)
    setCropDialogOpen(true)
  }

  function handleCropComplete(nextCroppedFile: File) {
    if (previewUrl && previewUrl !== testimonial?.imageUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setCroppedFile(nextCroppedFile)
    setPreviewUrl(URL.createObjectURL(nextCroppedFile))
    setReplaceImage(true)
    setSelectedFile(null)
  }

  function clearCurrentImageState() {
    if (previewUrl && previewUrl !== testimonial?.imageUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setPreviewUrl("")
    setReplaceImage(true)
    setSelectedFile(null)
    setCroppedFile(null)
  }

  function handleRemoveSelectedImage() {
    clearCurrentImageState()

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function handleReplaceImage() {
    clearCurrentImageState()
    fileInputRef.current?.click()
  }

  async function handleSubmit(formData: FormData) {
    if (replaceImage && croppedFile) {
      formData.set("image", croppedFile)
      formData.set("replaceImage", "on")
    }

    return formAction(formData)
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  if (!testimonial) {
    return (
      <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
            <Link href="/testimoni">
              <ArrowLeftIcon className="mr-2 size-4" />
              Kembali ke Testimoni
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Testimoni tidak ditemukan
          </h1>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href="/testimoni">
            <ArrowLeftIcon className="mr-2 size-4" />
            Kembali ke Testimoni
          </Link>
        </Button>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
          Konten
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Edit Testimoni
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Isi nama, jabatan, kutipan, lalu unggah foto untuk ditampilkan di halaman publik.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={testimonial.id} />

          <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-4">
              {previewUrl ? (
                <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img
                    src={previewUrl}
                    alt="Preview testimoni"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="space-y-3">
                <input type="hidden" name="replaceImage" value={replaceImage ? "on" : "off"} />
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null
                    handleFileSelection(file)
                  }}
                />
                {!previewUrl ? (
                  <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageUpIcon className="size-4" />
                      Upload foto
                    </Button>
                  </div>
                ) : null}
                {previewUrl ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full"
                      onClick={handleRemoveSelectedImage}
                    >
                      Hapus
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleReplaceImage}
                    >
                      Upload ulang
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Nama Lengkap
                </label>
                <Input
                  name="name"
                  defaultValue={testimonial.name}
                  placeholder="Masukkan nama lengkap"
                  className="h-11 px-3"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Jabatan
                </label>
                <Input
                  name="designation"
                  defaultValue={testimonial.designation}
                  placeholder="Masukkan jabatan"
                  className="h-11 px-3"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Testimoni / Kesan Pesan
                </label>
                <Textarea
                  name="quote"
                  defaultValue={testimonial.quote}
                  placeholder="Tulis isi testimoni"
                  className="min-h-[12rem] px-4 py-4"
                  required
                />
              </div>
            </div>
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
              onClick={() => router.push("/testimoni")}
            >
              Batal
            </Button>
            <SubmitButton />
          </div>
        </form>
      </section>

      <ImageCropper
        dialogOpen={cropDialogOpen}
        setDialogOpen={setCropDialogOpen}
        selectedFile={selectedFile}
        onCropComplete={handleCropComplete}
        aspect={1}
      />
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
