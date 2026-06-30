"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { ImageIcon } from "lucide-react"

import {
  submitTestimonialAction,
  type TestimonialSubmissionActionState,
} from "@/app/(admin)/admin-space/tambah-konten/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageCropper } from "@/components/ui/image-cropper"

const initialState: TestimonialSubmissionActionState = {
  error: null,
  success: null,
}

export function TestimonialSubmissionForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [state, formAction] = useActionState(
    submitTestimonialAction,
    initialState
  )

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)
  const [cropperOpen, setCropperOpen] = useState(false)
  const [preview, setPreview] = useState<string>("")

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      setSelectedFile(null)
      setCroppedFile(null)
      setPreview("")
    }
  }, [state.success])

  useEffect(() => {
    if (croppedFile) {
      const objectUrl = URL.createObjectURL(croppedFile)
      setPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [croppedFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setCropperOpen(true)
    }
  }

  const handleCropComplete = (file: File) => {
    setCroppedFile(file)
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files
    }
  }

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Form Pengajuan Testimoni
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Isi form di bawah untuk mengajukan testimoni Anda. Admin akan meninjau
            sebelum mempublikasikan.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">
              Nama Lengkap
            </label>
            <Input name="name" placeholder="Nama Anda" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">
              Jabatan/Angkatan
            </label>
            <Input name="designation" placeholder="Ketua FMI 2024" required />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium text-slate-900">
            Testimoni
          </label>
          <Textarea
            name="quote"
            placeholder="Tulis testimoni Anda di sini..."
            rows={5}
            required
          />
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium text-slate-900">
            Foto Profil
          </label>
          
          {preview && (
            <div className="flex items-center gap-4">
              <div className="size-24 overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-50">
                <img
                  src={preview}
                  alt="Preview"
                  className="size-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedFile(null)
                  setCroppedFile(null)
                  setPreview("")
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
              >
                Ganti Foto
              </Button>
            </div>
          )}

          {!preview && (
            <>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <ImageIcon className="mr-2 size-4" />
                  Pilih Foto
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Foto akan dipotong sebelum diupload
              </p>
            </>
          )}

          <input
            ref={fileInputRef}
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
            required={!croppedFile}
          />
        </div>

        {state.error ? (
          <p className="mt-4 text-sm text-red-600">{state.error}</p>
        ) : null}
        {state.success ? (
          <p className="mt-4 text-sm text-emerald-600">{state.success}</p>
        ) : null}

        <div className="mt-5">
          <SubmitButton />
        </div>
      </form>

      <ImageCropper
        dialogOpen={cropperOpen}
        setDialogOpen={setCropperOpen}
        selectedFile={selectedFile}
        onCropComplete={handleCropComplete}
        aspect={1}
      />
    </>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="h-10 bg-[#3f679c] px-4 text-white hover:bg-[#355887]"
      disabled={pending}
    >
      {pending ? "Mengirim..." : "Ajukan Testimoni"}
    </Button>
  )
}
