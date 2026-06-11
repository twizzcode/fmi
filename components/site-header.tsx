"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LogIn, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/berita", label: "Berita" },
  { href: "/galeri-fmiunnes", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
];

const aboutItems = [
  { href: "/tentang-fmiunnes", label: "Tentang FMI" },
  { href: "/struktur-fmiunnes", label: "Struktur Organisasi" },
  { href: "/tentang-ldj", label: "Tentang LDJ" },
];

const mockUser: { name: string; initials: string; email: string } | null = null;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const pathname = usePathname();
  const isAboutActive = aboutItems.some((item) => item.href === pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/images/logo-fmi-hitam.png"
            alt="Logo FMI"
            width={44}
            height={44}
            priority
            className="h-11 w-auto object-contain"
          />
          <div className="min-w-0 -space-y-1">
            <p className="truncate text-sm font-bold tracking-tight text-slate-900 sm:text-base">
              Forum Mahasiswa Islam FMIPA
            </p>
            <p className="truncate text-[13px] font-medium tracking-tight text-slate-500 sm:text-sm">
              Universitas Negeri Semarang
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <nav className="flex h-11 items-center gap-6">
            <Link
              href="/"
              className={`group relative inline-flex h-11 w-20 items-center justify-center text-sm font-medium transition-colors duration-300 ${
                pathname === "/"
                  ? "text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Beranda
              <span
                className={`absolute right-0 bottom-0 left-0 h-[3px] rounded-full bg-[#3f679c] transition duration-300 ${
                  pathname === "/"
                    ? "scale-x-100 opacity-100"
                    : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60"
                }`}
              />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`group relative inline-flex h-11 w-20 items-center justify-center gap-1 bg-transparent text-sm font-medium outline-none transition-colors duration-300 ${
                  isAboutActive
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Tentang</span>
                <ChevronDown className="h-4 w-4 transition duration-300 group-data-[state=open]:rotate-180" />
                <span
                  className={`absolute right-0 bottom-0 left-0 h-[3px] rounded-full bg-[#3f679c] transition duration-300 ${
                    isAboutActive
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60"
                  }`}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                sideOffset={8}
                className="mt-1 min-w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              >
                {aboutItems.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className={`rounded-xl px-3 py-2.5 text-sm ${
                      pathname === item.href
                        ? "bg-blue-50 font-medium text-slate-900"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navItems
              .filter((item) => item.href !== "/")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative inline-flex h-11 w-20 items-center justify-center text-sm font-medium transition-colors duration-300 ${
                    pathname === item.href
                      ? "text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute right-0 bottom-0 left-0 h-[3px] rounded-full bg-[#3f679c] transition duration-300 ${
                      pathname === item.href
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60"
                    }`}
                  />
                </Link>
              ))}
          </nav>

          {mockUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-900 shadow-sm outline-none transition hover:border-slate-300 hover:bg-slate-50">
                {mockUser.initials}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="min-w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {mockUser.name}
                  </p>
                  <p className="text-xs text-slate-500">{mockUser.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="#"
              aria-label="Pintu Masuk"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <LogIn className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">

          <button
            type="button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-blue-200 hover:text-blue-600 lg:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-200/80 bg-white/96 px-4 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link
              href="/"
                className={`rounded-2xl border-l-2 px-4 py-3.5 text-sm font-medium transition ${
                  pathname === "/"
                    ? "border-[#3f679c] bg-blue-50 text-slate-900"
                    : "border-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              onClick={() => setOpen(false)}
            >
              Beranda
            </Link>

            <div className="rounded-2xl border-l-2 border-transparent px-4 py-2">
              <button
                type="button"
                className={`flex w-full items-center justify-between py-1.5 text-left text-sm font-medium transition ${
                  isAboutActive
                    ? "text-slate-900"
                    : "text-slate-700 hover:text-slate-900"
                }`}
                onClick={() => setAboutOpen((value) => !value)}
              >
                <span>Tentang</span>
                <ChevronDown
                  className={`h-4 w-4 transition duration-300 ${
                    aboutOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`mt-2 flex flex-col gap-2 overflow-hidden pl-3 transition-all duration-300 ${
                  aboutOpen || isAboutActive
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {aboutItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-xl border-l-2 px-3 py-2.5 text-sm font-medium transition ${
                      pathname === item.href
                        ? "border-[#3f679c] bg-blue-50 text-slate-900"
                        : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {navItems
              .filter((item) => item.href !== "/")
              .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl border-l-2 px-4 py-3.5 text-sm font-medium transition ${
                  pathname === item.href
                    ? "border-[#3f679c] bg-blue-50 text-slate-900"
                    : "border-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-2">
              {mockUser ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3f679c] text-sm font-semibold text-white">
                      {mockUser.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {mockUser.name}
                      </p>
                      <p className="text-xs text-slate-500">{mockUser.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="#"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Pintu Masuk</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
