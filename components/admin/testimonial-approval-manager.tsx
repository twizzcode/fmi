"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { CheckIcon, XIcon } from "lucide-react"

import type { TestimonialView } from "@/lib/testimonials"
import {
  approveTestimonialAction,
  rejectTestimonialAction,
  type TestimonialApprovalActionState,
} from "@/app/(admin)/admin-space/testimoni/approval-actions"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const initialState: TestimonialApprovalActionState = {
  error: null,
  success: null,
}

export function TestimonialApprovalManager({
  testimonials,
}: {
  testimonials: TestimonialView[]
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Foto</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Jabatan</TableHead>
            <TableHead>Testimoni</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                      N/A
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-slate-600">{item.designation}</TableCell>
              <TableCell className="max-w-xs">
                <p className="line-clamp-2 text-sm text-slate-600">{item.quote}</p>
              </TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell className="text-xs text-slate-500">
                {new Date(item.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {item.status === "pending" && (
                    <>
                      <ApproveButton testimonialId={item.id} />
                      <RejectButton testimonialId={item.id} />
                    </>
                  )}
                  {item.status === "rejected" && (
                    <ApproveButton testimonialId={item.id} />
                  )}
                  {item.status === "approved" && (
                    <RejectButton testimonialId={item.id} />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
        <CheckIcon className="h-3 w-3" />
        Disetujui
      </span>
    )
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
        <XIcon className="h-3 w-3" />
        Ditolak
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
      Pending
    </span>
  )
}

function ApproveButton({ testimonialId }: { testimonialId: string }) {
  const [_state, formAction] = useActionState(
    approveTestimonialAction,
    initialState
  )

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={testimonialId} />
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

function RejectButton({ testimonialId }: { testimonialId: string }) {
  const [_state, formAction] = useActionState(
    rejectTestimonialAction,
    initialState
  )

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={testimonialId} />
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
