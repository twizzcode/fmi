"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, ImageUpIcon } from "lucide-react"
import Link from "next/link"

import { updateNewsArticleAction, type NewsActionState } from "@/app/(admin)/admin-space/berita/actions"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { ImageCropper } from "@/components/ui/image-cropper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { NewsArticle } from "@/lib/news"

const initialNewsActionState: NewsActionState = {
  error: null,
  success: null,
}

type EditBeritaPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function EditBeritaPage({ params }: EditBeritaPageProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editorKey, setEditorKey] = useState(0)
  const [newsItem, setNewsItem] = useState<NewsArticle | null>(null)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [replaceImage, setReplaceImage] = useState(false)
  const [preview, setPreview] = useState("")
  const [state, formAction] = useActionState(
    updateNewsArticleAction,
    initialNewsActionState
  )

  useEffect(() => {
    async function loadNews() {
      const resolvedParams = await params
      const response = await fetch(`/api/news/${resolvedParams.id}`)
      if (response.ok) {
        const data = await response.json()
        setNewsItem(data)
        setTitle(data.title)
        setSlug(data.slug)
        setPreview(data.imageUrl)
      }
    }
    loadNews()
  }, [params])

  useEffect(() => {
    if (state.success) {
      router.push("/berita")
    }
  }, [state.success, router])

  useEffect(() => {
    if (croppedFile) {
      const objectUrl = URL.createObjectURL(croppedFile)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [croppedFile])

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function handleTitleChange(value: string) {
    setTitle(value)
    setSlug(generateSlug(value))
  }

  function handleFileSelection(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setCropDialogOpen(true)
    }
  }

  function handleCropComplete(croppedFile: File) {
    setCroppedFile(croppedFile)
    setReplaceImage(true)
  }

  function handleRemoveSelectedImage() {
    setSelectedFile(null)
    setCroppedFile(null)
    setPreview("")
    setReplaceImage(true)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function handleReplaceImage() {
    handleRemoveSelectedImage()
    fileInputRef.current?.click()
  }

  async function handleSubmit(formData: FormData) {
    if (replaceImage && croppedFile) {
      formData.set('image', croppedFile)
      formData.set('replaceImage', 'on')
    }
    return formAction(formData)
  }

  if (!newsItem) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href="/berita">
            <ArrowLeftIcon className="mr-2 size-4" />
            Kembali ke Berita
          </Link>
        </Button>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
          Workplace
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Edit Berita
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Perbarui metadata, cover, dan isi inti berita.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={newsItem.id} />
          
          <div className="grid gap-6 md:grid-cols-[320px_minmax(0,1fr)]">
            <div className="space-y-4">
              {preview ? (
                <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img
                    src={preview}
                    alt="Preview cover berita"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="space-y-3">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileSelection}
                />
                {!preview ? (
                  <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageUpIcon className="size-4" />
                      Upload cover
                    </Button>
                  </div>
                ) : null}
                {preview ? (
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
              <Field label="Judul Berita">
                <Input
                  name="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Judul berita"
                  className="h-11 px-4"
                  required
                />
              </Field>

              <input type="hidden" name="slug" value={slug} />

              <Field label="Kategori">
                <Input
                  name="category"
                  defaultValue={newsItem.category}
                  placeholder="Kategori"
                  className="h-11 px-4"
                  required
                />
              </Field>

              <Field label="Tanggal Publikasi">
                <Input
                  name="publishedAt"
                  type="date"
                  defaultValue={newsItem.dateISO}
                  className="h-11 px-4"
                  required
                />
              </Field>

              <Field label="Ringkasan Berita">
                <Textarea
                  name="excerpt"
                  defaultValue={newsItem.excerpt}
                  placeholder="Ringkasan berita"
                  className="min-h-[8rem] px-4 py-4"
                  required
                />
              </Field>
            </div>
          </div>

          <Field label="Isi Inti Berita">
            <RichTextEditor
              key={editorKey}
              name="bodyJson"
              initialValue={newsItem.bodyJson}
              placeholder="Tulis isi inti berita..."
            />
          </Field>

          {state.error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{state.error}</p>
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/berita")}
            >
              Batal
            </Button>
            <SubmitButton
              label="Simpan"
              pendingLabel="Menyimpan..."
            />
          </div>
        </form>
      </section>

      <ImageCropper
        dialogOpen={cropDialogOpen}
        setDialogOpen={setCropDialogOpen}
        selectedFile={selectedFile}
        onCropComplete={handleCropComplete}
        aspect={16 / 9}
      />
    </div>
  )
}

function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string
  pendingLabel: string
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      name="status"
      value="draft"
      className="h-10 bg-[#3f679c] px-4 text-white hover:bg-[#355887]"
      disabled={pending}
    >
      {pending ? pendingLabel : label}
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
