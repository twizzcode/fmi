"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { CheckIcon, XIcon, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  publishNewsAction,
  unpublishNewsAction,
  deleteNewsAdminAction,
  type NewsAdminActionState,
} from "./actions"

const initialState: NewsAdminActionState = {
  error: null,
  success: null,
}

export function PublishNewsButton({ newsId }: { newsId: string }) {
  const [_state, formAction] = useActionState(
    publishNewsAction,
    initialState
  )

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={newsId} />
      <PublishSubmitButton />
    </form>
  )
}

function PublishSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="sm"
      variant="outline"
      className="h-8 gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      disabled={pending}
    >
      <CheckIcon className="h-3 w-3" />
      {pending ? "..." : "Publish"}
    </Button>
  )
}

export function UnpublishNewsButton({ newsId }: { newsId: string }) {
  const [_state, formAction] = useActionState(
    unpublishNewsAction,
    initialState
  )

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={newsId} />
      <UnpublishSubmitButton />
    </form>
  )
}

function UnpublishSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="sm"
      variant="outline"
      className="h-8 gap-1 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
      disabled={pending}
    >
      <XIcon className="h-3 w-3" />
      {pending ? "..." : "Unpublish"}
    </Button>
  )
}

export function DeleteNewsButton({ newsId }: { newsId: string }) {
  const [_state, formAction] = useActionState(
    deleteNewsAdminAction,
    initialState
  )

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" size="sm" variant="destructive" className="h-8 gap-1">
          <Trash2Icon className="h-3 w-3" />
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus berita?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan menghapus berita dan cover terkait secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="id" value={newsId} />
            <DeleteSubmitButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function DeleteSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="sm"
      variant="destructive"
      className="h-8 gap-1"
      disabled={pending}
    >
      <Trash2Icon className="h-3 w-3" />
      {pending ? "..." : "Hapus"}
    </Button>
  )
}
