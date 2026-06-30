"use client"

import { useActionState } from "react"
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
import { Trash2Icon } from "lucide-react"

type TestimonialActionState = {
  error: string | null
  success: string | null
}

export function DeleteTestimonialButton({
  id,
  name,
  action,
}: {
  id: string
  name: string
  action: (previousState: TestimonialActionState, formData: FormData) => Promise<TestimonialActionState>
}) {
  const [, formAction] = useActionState(action, { error: null, success: null })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon-sm" type="button">
          <Trash2Icon className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus testimoni?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{name}</span>
            <span className="mt-1 block">
              Testimoni dan foto terkait di storage akan ikut dihapus permanen.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="id" value={id} />
            <Button type="submit" variant="destructive">
              Hapus
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
