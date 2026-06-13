import { ServiceForm } from "@/components/admin/service-form"
import { ServiceManager } from "@/components/admin/service-manager"
import { getServicesWithImageUrls } from "@/lib/services"

export default async function AdminLayananPage() {
  const services = await getServicesWithImageUrls()

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
          Konten
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Kelola Layanan Kami
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Panel ini dipakai untuk mengatur kartu layanan yang tampil di homepage,
          termasuk urutan, teks, gambar, label tombol, dan link tujuan.
        </p>
      </section>

      <ServiceForm />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Daftar Layanan
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {services.length} layanan tersimpan.
          </p>
        </div>

        <ServiceManager services={services} />
      </section>
    </div>
  )
}
