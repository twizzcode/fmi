"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import {
  BookOpen,
  Building2,
  Camera,
  Coins,
  HandHeart,
  Megaphone,
  MoonStar,
  Users,
  type LucideIcon,
} from "lucide-react";
import { departmentProfiles } from "@/lib/site-data";
import { BlurFade } from "@/components/ui/blur-fade";

const departmentIcons: Record<string, LucideIcon> = {
  "Pengurus Harian": Users,
  Syiar: Megaphone,
  Kaderisasi: BookOpen,
  "Dewan Kemakmuran Masjid": Building2,
  Hujanmed: Camera,
  Annisa: MoonStar,
  "Dana Sosial": HandHeart,
  Pembinaan: Coins,
};

const SLOT_CLASSES = [
  "xl:opacity-65 xl:scale-[0.94]",
  "xl:opacity-100 xl:scale-100",
  "xl:opacity-100 xl:scale-100",
  "xl:opacity-100 xl:scale-100",
  "xl:opacity-65 xl:scale-[0.94]",
];

export function HomeDepartmentsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleDepartments = useMemo(() => {
    return Array.from({ length: 5 }, (_, offset) => {
      const index =
        (activeIndex - 1 + offset + departmentProfiles.length) %
        departmentProfiles.length;
      return departmentProfiles[index];
    });
  }, [activeIndex]);

  const handleAutoplay = useEffectEvent(() => {
    setActiveIndex((current) => (current + 1) % departmentProfiles.length);
  });

  useEffect(() => {
    const intervalId = window.setInterval(handleAutoplay, 4200);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <BlurFade inView className="mb-12 text-center md:mb-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3f679c]">
            Departemen FMI
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Kenal lebih dekat dengan departemen yang ada di FMI.
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600 md:text-lg">
            Setiap departemen punya fokus gerak yang saling melengkapi, mulai
            dari penguatan organisasi, syiar, pembinaan, media, hingga
            kepedulian sosial di lingkungan FMIPA UNNES.
          </p>
        </div>
      </BlurFade>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-24 bg-gradient-to-r from-white via-white/92 to-transparent xl:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-24 bg-gradient-to-l from-white via-white/92 to-transparent xl:block" />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[0.55fr_1fr_1fr_1fr_0.55fr]">
          {visibleDepartments.map((department, index) => {
            const Icon = departmentIcons[department.name] ?? Users;
            const isEdgeCard = index === 0 || index === visibleDepartments.length - 1;

            return (
              <BlurFade
                key={`${department.name}-${activeIndex}-${index}`}
                inView
                delay={0.04 + index * 0.04}
                className={SLOT_CLASSES[index]}
              >
                <div className="overflow-hidden xl:px-0">
                  <article className="group relative flex h-full min-h-[20rem] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(148,163,184,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(63,103,156,0.2)]">
                    <div className="relative z-10 flex h-full flex-col justify-between p-6 text-left">
                      <div className="space-y-4 transition-all duration-300 group-hover:-translate-y-2">
                        <Icon className="h-10 w-10 text-[#3f679c] transition-colors duration-300 group-hover:text-white" />
                        <h3 className="text-xl font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-white">
                          {department.name}
                        </h3>
                      </div>

                      <p className="mt-6 text-sm leading-7 text-transparent opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-white/88 group-hover:opacity-100">
                        {department.description}
                      </p>
                    </div>

                    <div className="pointer-events-none absolute inset-0 bg-[#3f679c] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {isEdgeCard ? (
                      <div
                        className={`pointer-events-none absolute inset-0 z-10 hidden xl:block ${
                          index === 0
                            ? "bg-gradient-to-r from-white via-white/72 to-transparent"
                            : "bg-gradient-to-l from-white via-white/72 to-transparent"
                        }`}
                      />
                    ) : null}
                  </article>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
