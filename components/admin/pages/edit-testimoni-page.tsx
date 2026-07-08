import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { getRequestSession, getSessionUserRole } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { getTestimonialById } from "@/lib/testimonials"

import { EditTestimoniForm } from "@/components/admin/edit-testimoni-form"

type EditTestimoniPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditTestimoniPage({ params }: EditTestimoniPageProps) {
  const session = await getRequestSession()
  const role = session ? getSessionUserRole(session) : null
  const { id } = await params
  const testimonial = await getTestimonialById(
    id,
    role === "admin" || role === "developer" ? undefined : session?.user.id
  )

  if (!testimonial) {
    return (
      <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
            <Link href="/workspace/testimoni">
              <ArrowLeftIcon className="mr-2 size-4" />
              Kembali ke Testimoni
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Testimoni tidak ditemukan
          </h1>
        </section>
      </div>
    )
  }

  return <EditTestimoniForm testimonial={testimonial} />
}
