import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InstagramIcon,
  Linkedin01Icon,
  TiktokIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";

const companyLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang FMI", href: "/tentang-fmiunnes" },
  { label: "Susunan Pengurus", href: "/struktur" },
  { label: "Kontak", href: "/kontak" },
];

const resourceLinks = [
  { label: "Kenali LDJ", href: "/lembaga-dakwah-jurusan" },
  { label: "Galeri", href: "/galeri-fmiunnes" },
  { label: "Program Kerja", href: "#" },
  { label: "Kolaborasi", href: "/kontak" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/fmiunnes",
    icon: InstagramIcon,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@fmiunnes",
    icon: TiktokIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/fmi-fmipa-unnes",
    icon: Linkedin01Icon,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@fmifmipaunnes3415",
    icon: YoutubeIcon,
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-blue-200/20 bg-[linear-gradient(135deg,#5c84b9_0%,#3f679c_55%,#2f537f_100%)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_0.8fr_0.8fr_0.9fr]">
          <div className="max-w-md space-y-5">
            <Image
              src="/images/logo-fmi-putih.png"
              alt="Logo FMI"
              width={56}
              height={56}
              className="h-14 w-auto object-contain"
            />
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                FMI FMIPA UNNES
              </h2>
              <p className="text-sm leading-7 text-white/82">
                Forum Mahasiswa Islam FMIPA UNNES adalah ruang pembinaan,
                kolaborasi, dan pengembangan diri mahasiswa di lingkungan fakultas.
              </p>
              <p className="text-sm leading-7 text-white/82">
                Mushola Baitul Alim FMIPA, Kampus Sekaran, Universitas Negeri
                Semarang, Gunungpati, Kota Semarang.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <div className="space-y-3 text-sm text-white/76">
              {companyLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block transition hover:font-semibold hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <div className="space-y-3 text-sm text-white/76">
              {resourceLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block transition hover:font-semibold hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Follow us</h3>
            <div className="space-y-3 text-sm text-white/76">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 transition hover:font-semibold hover:text-white"
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={20}
                    strokeWidth={1.8}
                    className="text-white"
                  />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/20 pt-8 text-sm text-white/72 md:flex-row md:items-center md:justify-between">
          <p>Copyright © 2026 fmiunnes. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link href="#" className="transition hover:font-semibold hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="transition hover:font-semibold hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="transition hover:font-semibold hover:text-white">
              Cookies Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
