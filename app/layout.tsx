import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { appUrl, createAppUrl } from "@/lib/app-config";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const siteName = "FMI FMIPA UNNES";
const siteDescription = "Website resmi Forum Mahasiswa Islam FMIPA UNNES untuk informasi berita, galeri, struktur organisasi, dan profil lembaga.";
const defaultOgImage = createAppUrl("/images/logo-fmi-hitam.png").toString();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: appUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: defaultOgImage,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/images/logo-fmi-hitam.png",
    apple: "/images/logo-fmi-hitam.png",
    shortcut: "/images/logo-fmi-hitam.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("h-full scroll-smooth", "font-sans", geist.variable)}>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
