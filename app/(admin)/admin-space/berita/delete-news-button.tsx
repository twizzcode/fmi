"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Trash2Icon } from "lucide-react"

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
  deleteNewsArticleAction,
  type NewsActionState,
} from "./actions"

const initialState: NewsActionState = {
  error: null,
  success: null,
}

export function DeleteNewsButton({ newsId }: { newsId: string }) {
  const [, formAction] = useActionState(deleteNewsArticleAction, initialState)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" size="icon-sm" aria-label="Hapus berita">
          <Trash2Icon className="size-4" />
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
    <Button type="submit" variant="destructive" size="sm" className="h-9 gap-1" disabled={pending}>
      <Trash2Icon className="h-3 w-3" />
      {pending ? "..." : "Hapus"}
    </Button>
  )
}
