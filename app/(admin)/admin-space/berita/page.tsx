import { NewsForm } from "@/components/admin/news-form"
import { NewsManager } from "@/components/admin/news-manager"
import { getAdminNewsArticles } from "@/lib/news"

export default async function AdminBeritaPage() {
  const items = await getAdminNewsArticles()

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
          Konten
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Kelola Berita
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Ruang admin untuk menulis, mengedit, menerbitkan, dan mengatur artikel berita FMI.
        </p>
      </section>

      <NewsForm />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Daftar Berita</h2>
          <p className="mt-1 text-sm text-slate-500">{items.length} berita tersimpan.</p>
        </div>
        <NewsManager items={items} />
      </section>
    </div>
  )
}
