import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="border-b border-blue-200/20 bg-[linear-gradient(135deg,#5c84b9_0%,#3f679c_55%,#2f537f_100%)] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/75">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-white/88 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
