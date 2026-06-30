import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { UpdateProfileForm } from "@/components/admin/update-profile-form"
import { auth, getSessionUserRole } from "@/lib/auth"
import { db, schema } from "@/lib/db"
import { resolveUserImage } from "@/lib/user-image"

export default async function MyAccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, session.user.id),
  })

  if (!user) {
    redirect("/login")
  }

  const imageUrl = await resolveUserImage(user)

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
          Akun Saya
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Profil & Pengaturan
        </h1>
        <p className="mt-2 text-slate-600">
          Update informasi profil Anda yang akan ditampilkan di sistem
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <UpdateProfileForm user={{ ...user, image: imageUrl }} />
      </section>
    </div>
  )
}
