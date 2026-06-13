"use client"

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"

import {
  createServiceAction,
  type ServiceActionState,
} from "@/app/(admin)/admin-space/layanan/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const initialServiceActionState: ServiceActionState = {
  error: null,
  success: null,
}

export function ServiceForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(
    createServiceAction,
    initialServiceActionState
  )

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
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
        <Input name="title" placeholder="Judul layanan" />
        <Input name="buttonLabel" placeholder="Label tombol" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_11rem]">
        <Input name="href" placeholder="/kontak atau https://..." />
        <Input name="sortOrder" type="number" placeholder="Urutan" />
      </div>

      <div className="mt-4">
        <Input
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
        />
      </div>

      <div className="mt-4">
        <Textarea
          name="description"
          placeholder="Tulis deskripsi singkat layanan di sini"
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
