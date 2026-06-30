"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { ImageUpIcon, PlusIcon } from "lucide-react"

import {
  createTestimonialAction,
  type TestimonialActionState,
} from "@/app/(admin)/admin-space/testimoni/actions"
import { Button } from "@/components/ui/button"
import { ImageCropper } from "@/components/ui/image-cropper"
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

const initialTestimonialActionState: TestimonialActionState = {
  error: null,
  success: null,
}

export function TestimonialForm() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3f679c] text-white hover:bg-[#355887]">
          <PlusIcon className="size-4" />
          Tambah Testimoni
        </Button>
      </DialogTrigger>
      {open ? <CreateDialogContent onClose={() => setOpen(false)} /> : null}
    </Dialog>
  )
}

function CreateDialogContent({ onClose }: { onClose: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [state, formAction] = useActionState(
    createTestimonialAction,
    initialTestimonialActionState
  )

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      onClose()
    }
  }, [onClose, state.success])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function handleFileSelection(file: File | null) {
    if (!file) {
      return
    }

    setSelectedFile(file)
    setCropDialogOpen(true)
  }

  function handleCropComplete(nextCroppedFile: File) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setCroppedFile(nextCroppedFile)
    setPreviewUrl(URL.createObjectURL(nextCroppedFile))
    setSelectedFile(null)
  }

  async function handleSubmit(formData: FormData) {
    if (croppedFile) {
      formData.set("image", croppedFile)
    }

    return formAction(formData)
  }

  return (
    <DialogContent className="sm:!max-w-4xl h-[62vh] max-h-[62vh] overflow-hidden rounded-2xl p-0">
      <form ref={formRef} action={handleSubmit} className="flex h-full flex-col">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Tambah Testimoni</DialogTitle>
          <DialogDescription>
            Isi nama, jabatan, kutipan, lalu unggah foto untuk ditampilkan di
            halaman publik.
          </DialogDescription>
        </DialogHeader>

        <div className="grid flex-1 gap-5 overflow-y-auto px-6 py-2">
          <div className="grid gap-4 md:grid-cols-[240px_minmax(0,1fr)]">
            <div className="space-y-3">
              <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview testimoni"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm text-slate-400">
                    Preview foto akan terisi setelah upload
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-900">
                  <ImageUpIcon className="size-4 text-[#3f679c]" />
                  Upload foto
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(event) =>
                    handleFileSelection(event.target.files?.[0] ?? null)
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-900">
                  Nama Lengkap
                </label>
                <Input
                  name="name"
                  placeholder="Masukkan nama lengkap"
                  className="h-11 px-3"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-900">
                  Jabatan
                </label>
                <Input
                  name="designation"
                  placeholder="Masukkan jabatan"
                  className="h-11 px-3"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-900">
                  Testimoni / Kesan Pesan
                </label>
                <Textarea
                  name="quote"
                  placeholder="Tulis isi testimoni"
                  className="min-h-[12rem] px-4 py-4"
                />
              </div>
            </div>
          </div>

          {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-emerald-600">{state.success}</p> : null}
        </div>

        <DialogFooter className="mx-0 mb-0 rounded-b-2xl">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
          <SubmitButton label="Simpan Testimoni" pendingLabel="Menyimpan..." />
        </DialogFooter>
      </form>

      <ImageCropper
        dialogOpen={cropDialogOpen}
        setDialogOpen={setCropDialogOpen}
        selectedFile={selectedFile}
        onCropComplete={handleCropComplete}
        aspect={1}
      />
    </DialogContent>
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
      className="bg-[#3f679c] text-white hover:bg-[#355887]"
      disabled={pending}
    >
      {pending ? pendingLabel : label}
    </Button>
  )
}
