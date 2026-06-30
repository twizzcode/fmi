"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { ImageIcon } from "lucide-react"

import {
  createServiceAction,
  type ServiceActionState,
} from "@/app/(admin)/admin-space/layanan/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageCropper } from "@/components/ui/image-cropper"

const initialServiceActionState: ServiceActionState = {
  error: null,
  success: null,
}

export function ServiceForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [state, formAction] = useActionState(
    createServiceAction,
    initialServiceActionState
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
            Tambah Layanan
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Kelola kartu layanan yang tampil di homepage lengkap dengan gambar,
            judul, deskripsi, tombol, dan link tujuan.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input name="title" placeholder="Judul layanan" required />
          <Input name="buttonLabel" placeholder="Label tombol" required />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_11rem]">
          <Input name="href" placeholder="/kontak atau https://..." required />
          <Input name="sortOrder" type="number" placeholder="Urutan" />
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium text-slate-900">
            Gambar Layanan
          </label>

          {preview && (
            <div className="flex items-center gap-4">
              <div className="h-32 w-48 overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-50">
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
                Ganti Gambar
              </Button>
            </div>
          )}

          {!preview && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <ImageIcon className="mr-2 size-4" />
                Pilih Gambar
              </Button>
              <p className="text-xs text-slate-500">
                Gambar akan dipotong sebelum diupload
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

        <div className="mt-4">
          <Textarea
            name="description"
            placeholder="Tulis deskripsi singkat layanan di sini"
            required
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
        aspect={4 / 3}
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
      {pending ? "Menyimpan..." : "Simpan Layanan"}
    </Button>
  )
}
