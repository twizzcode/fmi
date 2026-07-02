import { and, desc, eq, ilike, or, sql } from "drizzle-orm"
import { SearchIcon } from "lucide-react"

import { MemberFilterTabs } from "@/components/admin/member-filter-tabs"
import { MemberRoleActions } from "@/components/admin/member-role-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminPagination } from "@/components/admin/admin-pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db, schema } from "@/lib/db"
import { type UserRole } from "@/lib/db/schema"

const roleLabelMap: Record<UserRole, string> = {
  user: "User",
  staff: "Staff",
  admin: "Admin",
  developer: "Developer",
  alumni: "Alumni",
}

const roleBadgeClassMap: Record<UserRole, string> = {
  user: "border-slate-200 bg-slate-100 text-slate-700",
  staff: "border-amber-200 bg-amber-50 text-amber-700",
  admin: "border-emerald-200 bg-emerald-50 text-emerald-700",
  developer: "border-violet-200 bg-violet-50 text-violet-700",
  alumni: "border-sky-200 bg-sky-50 text-sky-700",
}

function formatDate(date: Date) {
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function createQueryString({
  q,
  tab,
  page,
}: {
  q?: string
  tab?: string
  page?: string
}) {
  const params = new URLSearchParams()

  if (q) {
    params.set("q", q)
  }

  if (tab && tab !== "all") {
    params.set("tab", tab)
  }

  if (page && page !== "1") {
    params.set("page", page)
  }

  return params.toString()
}

export default async function AdminAnggotaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tab?: string; page?: string }>
}) {
  const params = await searchParams
  const query = params.q?.trim() ?? ""
  const currentTab = params.tab?.trim() || "all"
  const currentPage = Number(params.page) || 1
  const itemsPerPage = 10

  const searchFilter = query
    ? or(
        ilike(schema.users.email, `%${query}%`),
        ilike(schema.users.name, `%${query}%`)
      )
    : undefined
  const roleFilter = currentTab !== "all" ? eq(schema.users.role, currentTab as UserRole) : undefined
  const whereClause =
    searchFilter && roleFilter
      ? and(searchFilter, roleFilter)
      : searchFilter ?? roleFilter

  const [countResult, users] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(schema.users).where(whereClause),
    db
      .select()
      .from(schema.users)
      .where(whereClause)
      .orderBy(desc(schema.users.createdAt))
      .limit(itemsPerPage)
      .offset((Math.max(1, currentPage) - 1) * itemsPerPage),
  ])

  const totalUsers = countResult[0]?.count ?? 0
  const totalPages = Math.ceil(totalUsers / itemsPerPage)
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1
  const paginatedUsers =
    safeCurrentPage === currentPage
      ? users
      : await db
          .select()
          .from(schema.users)
          .where(whereClause)
          .orderBy(desc(schema.users.createdAt))
          .limit(itemsPerPage)
          .offset((safeCurrentPage - 1) * itemsPerPage)

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
              Keanggotaan
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Data Anggota
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Kelola role semua akun login dari satu halaman. Cari anggota,
              cek status verifikasi, lalu ubah role sesuai akses yang dibutuhkan.
            </p>
          </div>

          <form className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl" action="/anggota">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                name="q"
                defaultValue={query}
                placeholder="Cari email atau nama anggota"
                className="h-11 rounded-xl border-slate-200 pl-10"
              />
            </div>
            <Button type="submit" className="h-11 rounded-xl bg-[#3f679c] text-white hover:bg-[#355887]">
              Cari
            </Button>
          </form>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Semua akun login</h2>
              <p className="mt-1 text-sm text-slate-500">
               {totalUsers} akun ditemukan{query ? ` untuk "${query}"` : ""}.
             </p>

          </div>
          <MemberFilterTabs currentTab={currentTab} />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="px-4 py-3">Nama</TableHead>
                <TableHead className="px-4 py-3">Email</TableHead>
                <TableHead className="px-4 py-3">Role</TableHead>
                <TableHead className="px-4 py-3">Status</TableHead>
                <TableHead className="px-4 py-3">Terdaftar</TableHead>
                <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">Belum ada akun yang cocok</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Coba ubah kata kunci pencarian atau filter tab yang dipilih.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-4 py-4 align-top">
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="mt-1 text-xs text-slate-500">ID: {user.id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-slate-600">{user.email}</TableCell>
                    <TableCell className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${roleBadgeClassMap[user.role]}`}
                      >
                        {roleLabelMap[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={user.emailVerified ? "rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700" : "rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"}
                      >
                        {user.emailVerified ? "Terverifikasi" : "Belum verifikasi"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-slate-600">{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="px-4 py-4 text-right">
                      <div className="flex justify-end">
                        <MemberRoleActions
                          userId={user.id}
                          email={user.email}
                          role={user.role}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6">
          <AdminPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            getHref={(page) =>
              `/anggota?${createQueryString({ q: query, tab: currentTab, page: String(page) })}`
            }
          />
        </div>
      </section>
    </div>
  )
}
