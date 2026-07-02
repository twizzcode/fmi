import Link from "next/link"
import { headers } from "next/headers"
import { ArrowLeftIcon } from "lucide-react"

import { auth, getSessionUserRole } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { getAdminNewsArticleById } from "@/lib/news"

import { EditBeritaForm } from "./edit-berita-form"

type EditBeritaPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditBeritaPage({ params }: EditBeritaPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const role = session ? getSessionUserRole(session) : null
  const { id } = await params
  const newsItem = await getAdminNewsArticleById(
    id,
    role === "admin" || role === "developer" ? undefined : session?.user.id
  )

  if (!newsItem) {
    return (
      <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
            <Link href="/berita">
              <ArrowLeftIcon className="mr-2 size-4" />
              Kembali ke Berita
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Berita tidak ditemukan
          </h1>
        </section>
      </div>
    )
  }

  return <EditBeritaForm newsItem={newsItem} />
}
