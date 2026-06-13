"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"

import { createNewsArticleAction, type NewsActionState } from "@/app/(admin)/admin-space/berita/actions"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const initialNewsActionState: NewsActionState = {
  error: null,
  success: null,
}

export function NewsForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [editorKey, setEditorKey] = useState(0)
  const [state, formAction] = useActionState(
    createNewsArticleAction,
    initialNewsActionState
  )

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      setEditorKey((current) => current + 1)
    }
  }, [state.success])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Tambah Berita</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Tulis metadata berita, unggah cover, lalu edit isi inti berita dengan
          editor rich text yang disimpan langsung ke database.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Judul Berita">
          <Input name="title" placeholder="Judul berita" className="h-11 px-4" />
        </Field>
        <Field label="Slug">
          <Input name="slug" placeholder="slug-berita" className="h-11 px-4" />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Kategori">
          <Input name="category" placeholder="Kategori" className="h-11 px-4" />
        </Field>
        <Field label="Penulis">
          <Input name="author" placeholder="Penulis" className="h-11 px-4" />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_13rem_10rem]">
        <Field label="Cover Berita">
          <Input
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="h-11"
          />
        </Field>
        <Field label="Tanggal Publikasi">
          <Input name="publishedAt" type="date" className="h-11 px-4" />
        </Field>
        <Field label="Views">
          <Input name="views" type="number" placeholder="Views" className="h-11 px-4" />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Ringkasan Berita">
          <Textarea
            name="excerpt"
            placeholder="Ringkasan berita"
            className="min-h-[8rem] px-4 py-4"
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Isi Inti Berita">
          <RichTextEditor
            key={editorKey}
            name="bodyJson"
            placeholder="Tulis isi inti berita..."
          />
        </Field>
      </div>

      {state.error ? <p className="mt-4 text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="mt-4 text-sm text-emerald-600">{state.success}</p> : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <SubmitButton
          label="Simpan Draft"
          pendingLabel="Menyimpan..."
          status="draft"
          variant="outline"
        />
        <SubmitButton
          label="Publikasikan"
          pendingLabel="Menyimpan..."
          status="published"
        />
      </div>
    </form>
  )
}

function SubmitButton({
  label,
  pendingLabel,
  status,
  variant = "default",
}: {
  label: string
  pendingLabel: string
  status: "draft" | "published"
  variant?: "default" | "outline"
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      name="status"
      value={status}
      variant={variant}
      className={
        variant === "outline"
          ? "h-10 px-4"
          : "h-10 bg-[#3f679c] px-4 text-white hover:bg-[#355887]"
      }
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
