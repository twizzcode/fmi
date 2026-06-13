export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-slate-50 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-white shadow-sm ring-1 ring-slate-200" />
        <div className="aspect-video rounded-xl bg-white shadow-sm ring-1 ring-slate-200" />
        <div className="aspect-video rounded-xl bg-white shadow-sm ring-1 ring-slate-200" />
      </div>
      <div className="min-h-screen flex-1 rounded-xl bg-white shadow-sm ring-1 ring-slate-200 md:min-h-min" />
    </div>
  )
}
