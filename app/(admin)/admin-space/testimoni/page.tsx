import { TestimonialForm } from "@/components/admin/testimonial-form"
import { TestimonialManager } from "@/components/admin/testimonial-manager"
import { getTestimonialsWithImageUrls } from "@/lib/testimonials"

export default async function AdminTestimoniPage() {
  const testimonials = await getTestimonialsWithImageUrls()

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
          Konten
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Kelola Testimoni
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Panel ini dipakai untuk menambahkan testimoni berisi foto, nama,
          jabatan, dan kutipan yang akan dipakai pada section testimoni di
          halaman utama.
        </p>
      </section>

      <TestimonialForm />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Daftar Testimoni
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {testimonials.length} testimoni tersimpan.
          </p>
        </div>

        <TestimonialManager testimonials={testimonials} />
      </section>
    </div>
  )
}
