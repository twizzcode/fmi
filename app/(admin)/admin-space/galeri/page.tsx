import { GalleryForm } from "@/components/admin/gallery-form"
import { GalleryManager } from "@/components/admin/gallery-manager"
import { getAdminGalleryItems } from "@/lib/gallery"
import { isSupabaseStorageConfigured } from "@/lib/supabase/config"

export default async function AdminGaleriPage() {
  const isConfigured = isSupabaseStorageConfigured()
  const items = isConfigured ? await getAdminGalleryItems() : []

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
          Media
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Kelola Galeri
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Upload foto galeri, atur tanggal kegiatan dengan calendar picker, dan
          kelola tiap item melalui card modal.
        </p>
      </section>

      {!isConfigured ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 shadow-sm">
          Lengkapi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
          dan `SUPABASE_SERVICE_ROLE_KEY` agar upload storage bisa dipakai.
        </section>
      ) : null}

      <GalleryForm disabled={!isConfigured} />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Daftar Galeri
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {items.length} file ditemukan di bucket galeri.
          </p>
        </div>

        <GalleryManager items={items} />
      </section>
    </div>
  )
}
