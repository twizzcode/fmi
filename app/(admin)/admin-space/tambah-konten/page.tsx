import { TestimonialSubmissionForm } from "@/components/admin/testimonial-submission-form"

export default function TambahKontenPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
          Pengajuan Konten
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Tambah Konten Testimoni
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Ajukan testimoni Anda untuk ditampilkan di website. Testimoni akan
          ditinjau oleh admin sebelum dipublikasikan.
        </p>
      </section>

      <TestimonialSubmissionForm />
    </div>
  )
}
