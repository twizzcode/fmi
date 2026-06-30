import type { Metadata } from "next"
import { headers } from "next/headers"
import { eq } from "drizzle-orm"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { auth } from "@/lib/auth"
import { db, schema } from "@/lib/db"
import { resolveUserImage } from "@/lib/user-image"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    locale: "id_ID",
  },
}

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const user = session
    ? await db.query.users.findFirst({
        where: eq(schema.users.id, session.user.id),
      })
    : null
  const initialUserImage = user ? await resolveUserImage(user) : session?.user.image ?? null

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader initialUserImage={initialUserImage} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
