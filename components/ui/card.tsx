import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group rounded-[2rem] border border-black/5 bg-white shadow-[0_16px_60px_rgba(148,163,184,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(148,163,184,0.2)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}
