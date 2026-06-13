"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ImageUpIcon, LoaderCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type StorageUploadPanelProps = {
  bucket: string
  disabled?: boolean
}

export function StorageUploadPanel({
  bucket,
  disabled = false,
}: StorageUploadPanelProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    setMessage(null)
    setError(null)

    const file = formData.get("file")

    if (!(file instanceof File) || file.size === 0) {
      setError("Pilih file gambar terlebih dulu.")
      return
    }

    const body = new FormData()
    body.set("file", file)

    startTransition(async () => {
      const response = await fetch("/api/admin/storage/upload", {
        method: "POST",
        body,
      })

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; message?: string }
        | null

      if (!response.ok) {
        setError(payload?.error ?? "Upload gagal diproses.")
        return
      }

      setMessage(payload?.message ?? "File berhasil diunggah.")
      formRef.current?.reset()
      router.refresh()
    })
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#3f679c]/10 text-[#3f679c]">
          <ImageUpIcon className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Upload ke bucket {bucket}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            File dikirim ke Supabase Storage melalui endpoint admin yang
            memeriksa session dan role.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <Input
          name="file"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          disabled={disabled || isPending}
        />
        <Button
          type="submit"
          className="h-10 bg-[#3f679c] px-4 text-white hover:bg-[#355887]"
          disabled={disabled || isPending}
        >
          {isPending ? (
            <>
              <LoaderCircleIcon className="size-4 animate-spin" />
              Mengunggah
            </>
          ) : (
            "Upload"
          )}
        </Button>
      </div>

      {message ? (
        <p className="mt-4 text-sm text-emerald-600">{message}</p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
    </form>
  )
}
