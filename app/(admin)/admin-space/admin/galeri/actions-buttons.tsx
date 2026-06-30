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
  approveGalleryAction,
  rejectGalleryAction,
  deleteGalleryAdminAction,
  type GalleryAdminActionState,
} from "./actions"

const initialState: GalleryAdminActionState = {
  error: null,
  success: null,
}

export function ApproveGalleryButton({ galleryId }: { galleryId: string }) {
  const [_state, formAction] = useActionState(
    approveGalleryAction,
    initialState
  )

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={galleryId} />
      <ApproveSubmitButton />
    </form>
  )
}

function ApproveSubmitButton() {
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
      {pending ? "..." : "Setuju"}
    </Button>
  )
}

export function RejectGalleryButton({ galleryId }: { galleryId: string }) {
  const [_state, formAction] = useActionState(
    rejectGalleryAction,
    initialState
  )

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={galleryId} />
      <RejectSubmitButton />
    </form>
  )
}

function RejectSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="sm"
      variant="outline"
      className="h-8 gap-1 border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
      disabled={pending}
    >
      <XIcon className="h-3 w-3" />
      {pending ? "..." : "Tolak"}
    </Button>
  )
}

export function DeleteGalleryButton({ galleryId }: { galleryId: string }) {
  const [_state, formAction] = useActionState(
    deleteGalleryAdminAction,
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
          <AlertDialogTitle>Hapus galeri?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan menghapus cover dan semua foto galeri secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="id" value={galleryId} />
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
