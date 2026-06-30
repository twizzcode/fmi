"use client";

import Image from "next/image";
import type { Easing } from "framer-motion";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Camera,
  HeartHandshake,
  Landmark,
  Megaphone,
  PenTool,
  ShieldCheck,
  Users,
  Venus,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const easeTransition: Easing = [0.25, 0.1, 0.25, 1];
const iconMap = {
  users: Users,
  megaphone: Megaphone,
  "shield-check": ShieldCheck,
  mosque: Landmark,
  camera: Camera,
  venus: Venus,
  "pen-tool": PenTool,
  "heart-handshake": HeartHandshake,
  "book-open": BookOpen,
} as const;

interface Industry {
  name: string;
  description: string;
  detail?: string;
  detailParagraphs?: readonly string[];
  image?: string;
  imageAlt?: string;
  icon?:
    | "users"
    | "megaphone"
    | "shield-check"
    | "mosque"
    | "camera"
    | "venus"
    | "pen-tool"
    | "heart-handshake"
    | "book-open";
  url?: string;
}

interface Industries1Props {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  industryLabel: string;
  industries: Industry[];
  className?: string;
}

const Industries1 = ({
  className,
  title = "Industries",
  description,
  ctaLabel,
  ctaHref,
  industryLabel = "Overview",
  industries = [
    {
      name: "Healthcare",
      description:
        "Revolutionary medical solutions and digital health platforms that improve patient outcomes and streamline healthcare delivery.",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
      imageAlt: "Healthcare technology illustration",
      url: "https://shadcnblocks.com/blocks",
    },
    {
      name: "Fintech",
      description:
        "Cutting-edge financial technology solutions that transform banking, payments, and investment management for the digital age.",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
      imageAlt: "Financial technology illustration",
      url: "https://shadcnblocks.com/blocks",
    },
    {
      name: "E-commerce",
      description:
        "Comprehensive online retail platforms and marketplace solutions that drive sales and enhance customer experiences.",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
      imageAlt: "E-commerce platform illustration",
      url: "https://shadcnblocks.com/blocks",
    },
    {
      name: "Education",
      description:
        "Innovative learning management systems and educational technology that empower students and educators worldwide.",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg",
      imageAlt: "Educational technology illustration",
      url: "https://shadcnblocks.com/blocks",
    },
  ],
}: Industries1Props) => {
  return (
    <section className={cn("py-16", className)}>
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto mb-5 max-w-3xl text-center text-base leading-8 text-slate-600 md:text-lg">
            {description}
          </p>
        ) : null}
        {ctaLabel && ctaHref ? (
          <div className="mb-7 flex justify-center">
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#3f679c] underline underline-offset-4 transition-colors hover:text-[#2d4f79]"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="size-4" />
            </a>
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {industries.map((industry, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <button type="button" className="w-full cursor-pointer text-left">
                  <motion.div
                    className="group relative overflow-hidden rounded-[1.75rem] bg-slate-200"
                    whileHover="hover"
                    initial="initial"
                  >
                    <motion.div
                      variants={{
                        initial: {
                          opacity: 1,
                          pointerEvents: "auto",
                          clipPath: "inset(0% 0% 0% 0%)",
                        },
                        hover: {
                          opacity: 0,
                          pointerEvents: "none",
                          clipPath: "inset(0% 0% 100% 0%)",
                        },
                      }}
                      transition={{ duration: 0.4, ease: easeTransition }}
                      className="relative z-0 flex h-full min-h-120 flex-col items-center justify-center lg:min-h-144 xl:min-h-112"
                    >
                      {industry.image ? (
                        <div className="relative flex h-full w-full justify-center">
                          <Image
                            src={industry.image}
                            alt={industry.imageAlt ?? industry.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : industry.icon ? (
                        <div className="flex h-full w-full items-center justify-center bg-slate-200">
                          {(() => {
                            const Icon = iconMap[industry.icon!];
                            return <Icon className="size-14 text-[#3f679c]" />;
                          })()}
                        </div>
                      ) : null}
                      <h3 className="absolute bottom-10 text-lg font-medium text-slate-900">
                        {industry.name}
                      </h3>
                    </motion.div>

                    <motion.div
                      className="absolute inset-0 z-10 bg-[#2d4f79]"
                      variants={{
                        initial: { y: "100%" },
                        hover: { y: "0%" },
                      }}
                      transition={{ duration: 0.4, ease: easeTransition }}
                      style={{ willChange: "transform" }}
                    />

                    <motion.div
                      variants={{
                        initial: { opacity: 0, y: 20 },
                        hover: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.4, ease: easeTransition }}
                      className="absolute inset-0 z-20 flex min-h-120 flex-col items-center justify-center p-8 text-center text-white lg:min-h-144 xl:min-h-112"
                    >
                      <div className="space-y-3">
                        <p className="text-lg font-bold text-white">
                          {industry.name}
                        </p>
                        <p className="text-white/92">{industry.description}</p>
                      </div>
                      <p className="absolute bottom-8 text-sm font-semibold text-white/85 underline decoration-white/70 underline-offset-4">
                        Lihat lebih detail
                      </p>
                    </motion.div>

                    <motion.div
                      className="absolute top-4 right-4 z-30"
                      variants={{
                        initial: { opacity: 0.75, x: 0, y: 0 },
                        hover: { opacity: 1, x: 2, y: -2 },
                      }}
                      transition={{ duration: 0.3, ease: easeTransition }}
                    >
                      <ArrowUpRight className="size-5 text-slate-700 group-hover:text-white" />
                    </motion.div>
                  </motion.div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[calc(100svh-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto rounded-[1.5rem] p-0 sm:max-w-6xl">
                <div className="rounded-[1.5rem] bg-white p-8">
                  <DialogHeader className="gap-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#3f679c]">
                      {industryLabel}
                    </p>
                    <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                      {industry.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-6 space-y-4">
                    {(industry.detailParagraphs?.length
                      ? industry.detailParagraphs
                      : [industry.detail ?? industry.description]
                    ).map((paragraph) => (
                      <DialogDescription
                        key={paragraph}
                        className="text-base leading-8 text-slate-600"
                      >
                        {paragraph}
                      </DialogDescription>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Industries1 };
