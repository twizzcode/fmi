import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { DynamicBreadcrumb } from "@/components/admin/dynamic-breadcrumb"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { eq } from "drizzle-orm"

import { auth, getSessionUserRole } from "@/lib/auth"
import {
  adminOrigin,
  appOrigin,
  canAccessAdmin,
  isAdminHost,
} from "@/lib/app-config"
import { db, schema } from "@/lib/db"
import { resolveUserImage } from "@/lib/user-image"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session) {
    redirect(`${appOrigin}/login?redirectTo=${encodeURIComponent(adminOrigin)}`)
  }

  if (!canAccessAdmin(getSessionUserRole(session))) {
    redirect(appOrigin)
  }

  if (!isAdminHost(requestHeaders.get("host"))) {
    redirect(adminOrigin)
  }

  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, session.user.id),
  })
  const avatar = user ? await resolveUserImage(user) : session.user.image ?? ""

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar
          user={{
            name: session.user.name,
            email: session.user.email,
            avatar: avatar ?? "",
            role: getSessionUserRole(session) ?? "user",
          }}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 bg-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex min-w-0 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <DynamicBreadcrumb adminOrigin={adminOrigin} />
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
