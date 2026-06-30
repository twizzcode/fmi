"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandYoutube,
  IconChevronRight,
  IconWorld,
} from "@tabler/icons-react"
import { useState } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface CardFlipProps {
  title?: string
  nickname?: string
  role?: string
  major?: string
  entryYear?: string
  quote?: string
  imageSrc?: string
  imageAlt?: string
  imagePosition?: string
  imageScale?: number
  socials?: {
    instagram?: string
    tiktok?: string
    youtube?: string
    linkedin?: string
    github?: string
    website?: string
  }
}

export default function CardFlip({
  title = "Design Systems",
  nickname = "Design",
  role = "Explore the fundamentals",
  major = "Design Systems",
  entryYear = "2025",
  quote = "Tumbuh bersama gerak organisasi yang sehat, hangat, dan berdampak.",
  imageSrc = "/images/foto bersama.jpg",
  imageAlt = "Card image",
  imagePosition = "50% 50%",
  imageScale = 1,
  socials,
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const socialItems = [
    {
      key: "instagram",
      href: socials?.instagram,
      icon: <IconBrandInstagram className="h-5 w-5" />,
      tooltip: "Instagram",
    },
    {
      key: "tiktok",
      href: socials?.tiktok,
      icon: <IconBrandTiktok className="h-5 w-5" />,
      tooltip: "TikTok",
    },
    {
      key: "youtube",
      href: socials?.youtube,
      icon: <IconBrandYoutube className="h-5 w-5" />,
      tooltip: "YouTube",
    },
    {
      key: "linkedin",
      href: socials?.linkedin,
      icon: <IconBrandLinkedin className="h-5 w-5" />,
      tooltip: "LinkedIn",
    },
    {
      key: "github",
      href: socials?.github,
      icon: <IconBrandGithub className="h-5 w-5" />,
      tooltip: "GitHub",
    },
    {
      key: "website",
      href: socials?.website,
      icon: <IconWorld className="h-5 w-5" />,
      tooltip: "Website",
    },
  ].filter((item) => item.href)

  return (
    <div
      className="group relative aspect-[3/4] w-full [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative h-full w-full [transform-style:preserve-3d]",
          "transition-all duration-700",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 h-full w-full overflow-hidden rounded-[28px]",
            "[backface-visibility:hidden] [transform:rotateY(0deg)]",
            "shadow-[0_16px_60px_rgba(63,103,156,0.22)]",
            "transition-all duration-700 group-hover:shadow-[0_26px_80px_rgba(63,103,156,0.28)]",
            isFlipped ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="relative h-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="320px"
              className="object-cover"
              style={{
                objectPosition: imagePosition,
                transform: `scale(${imageScale})`,
              }}
            />

            <div className="absolute inset-x-0 bottom-0 h-[15%] bg-[rgba(58,95,146,0.86)]" />
            <div className="absolute inset-x-0 bottom-[15%] h-[25%] bg-[linear-gradient(180deg,rgba(84,128,184,0)_0%,rgba(77,121,176,0.3)_40%,rgba(58,95,146,0.86)_100%)]" />

            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="max-w-[88%] space-y-1.5">
                <h3 className="text-[1.55rem] font-semibold leading-tight tracking-tight text-white">
                  {title}
                </h3>
                <p className="text-sm font-medium text-white/72">{role}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "absolute inset-0 flex h-full w-full flex-col rounded-[28px] border border-[#27466f]/15 bg-[linear-gradient(180deg,#f7fbff_0%,#edf4fb_100%)] p-6 shadow-[0_16px_60px_rgba(63,103,156,0.12)]",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
            "transition-all duration-700 group-hover:shadow-[0_26px_80px_rgba(148,163,184,0.2)]",
            isFlipped ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold leading-snug tracking-tight text-[#18365e]">
                  {title}
                </h3>
                {nickname ? (
                  <div className="text-sm font-medium text-[#5a7da9]">
                    {nickname}
                  </div>
                ) : null}
                <div className="h-px w-full bg-[#d5e3f4]" />
              </div>

              <div className="space-y-2 text-sm leading-6 text-slate-700">
                <DetailRow label="Jabatan" value={role} />
                <DetailRow label="Jurusan" value={major} />
                <DetailRow label="Angkatan" value={entryYear} />
              </div>

              {quote ? (
                <blockquote className="text-sm leading-6 text-slate-600 italic">
                  &quot;{quote}&quot;
                </blockquote>
              ) : null}
            </div>

            <div className="mt-auto space-y-4 pt-5">
              <div className="h-px bg-[#d5e3f4]" />
              {socialItems.length > 0 ? (
                <TooltipProvider delayDuration={100}>
                  <div className="flex flex-wrap items-center gap-3">
                    {socialItems.map((item) => (
                      <InfoIcon
                        key={item.key}
                        icon={item.icon}
                        tooltip={item.tooltip}
                        href={item.href}
                      />
                    ))}
                  </div>
                </TooltipProvider>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <IconChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#3f679c]" />
      <p>
        <span className="font-semibold text-[#3f679c]">{label} :</span> {value}
      </p>
    </div>
  )
}

function InfoIcon({
  icon,
  tooltip,
  href,
}: {
  icon: ReactNode
  tooltip: string
  href?: string
}) {
  const content = (
    <div className="inline-flex h-8 w-8 items-center justify-center text-[#3f679c] transition hover:-translate-y-0.5 hover:text-[#27466f]">
      {icon}
    </div>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href ?? "#"} target="_blank" rel="noreferrer" aria-label={tooltip}>
          {content}
        </Link>
      </TooltipTrigger>
      <TooltipContent sideOffset={8}>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
