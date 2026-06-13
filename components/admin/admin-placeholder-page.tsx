import type { ReactNode } from "react"

type AdminPlaceholderPageProps = {
  title: string
  description: string
  eyebrow?: string
  actions?: ReactNode
}

export function AdminPlaceholderPage({
  title,
  description,
  eyebrow = "Admin",
  actions,
}: AdminPlaceholderPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
          {eyebrow}
        </p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-4 w-24 rounded bg-slate-100" />
          <div className="mt-4 h-16 rounded-lg bg-slate-50" />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-4 w-28 rounded bg-slate-100" />
          <div className="mt-4 h-16 rounded-lg bg-slate-50" />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-4 w-20 rounded bg-slate-100" />
          <div className="mt-4 h-16 rounded-lg bg-slate-50" />
        </div>
      </section>

      <section className="flex min-h-[22rem] flex-1 flex-col rounded-xl border border-dashed border-slate-300 bg-white p-6 shadow-sm">
        <div className="max-w-xl">
          <h2 className="text-lg font-semibold text-slate-900">Ruang kerja kosong</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Halaman ini sudah siap dipakai sebagai fondasi. Struktur route, layout
            admin, dan navigasinya sudah terhubung.
          </p>
        </div>
        <div className="mt-6 flex-1 rounded-xl bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]" />
      </section>
    </div>
  )
}
