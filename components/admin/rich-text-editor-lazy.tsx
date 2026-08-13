"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

function EditorSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full rounded-lg bg-slate-200" />
      <Skeleton className="h-64 w-full rounded-lg bg-slate-200" />
    </div>
  )
}

export const RichTextEditorLazy = dynamic(
  () => import("@/components/editor/rich-text-editor").then((m) => ({ default: m.RichTextEditor })),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
)
