import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import Image from "next/image"

import { cn } from "@/lib/utils"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"a"> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  description: string
  href: string
  cta: string
  image?: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  image,
  ...props
}: BentoCardProps) => (
  <a
    key={name}
    href={href}
    className={cn(
      "group relative col-span-3 flex h-full min-h-[24rem] flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-background transition-colors duration-300 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "dark:bg-background transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
      className
    )}
    {...props}
  >
    <div>{background}</div>
    {image ? (
      <div className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white" />
        </div>
      </div>
    ) : null}
    <div className="relative z-10 p-5">
      <div className="pointer-events-none flex transform-gpu flex-col gap-2 transition-all duration-300 lg:group-hover:-translate-y-6">
        <Icon className="h-12 w-12 origin-left transform-gpu text-[#3f679c] transition-all duration-300 ease-in-out group-hover:scale-75 group-hover:!text-white" />
        <h3 className="text-xl font-semibold text-[#3f679c] transition-colors duration-300 group-hover:!text-white">
          {name}
        </h3>
        <p className="max-w-lg text-sm leading-7 text-neutral-500 transition-colors duration-300 group-hover:!text-white/88">
          {description}
        </p>
      </div>

      <div
        className={cn(
          "pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden"
        )}
      >
        <span className="inline-flex items-center text-sm font-semibold text-[#3f679c] transition-colors duration-300 group-hover:!text-white">
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 transition-colors duration-300 rtl:rotate-180" />
        </span>
      </div>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 z-10 hidden w-full translate-y-8 transform-gpu flex-row items-center p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex"
      )}
    >
      <span className="inline-flex items-center text-sm font-semibold text-[#3f679c] transition-colors duration-300 group-hover:!text-white">
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 transition-colors duration-300 rtl:rotate-180" />
      </span>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu bg-transparent transition-all duration-300 group-hover:bg-[#3f679c]/82 group-hover:dark:bg-neutral-800/10" />
  </a>
)

export { BentoCard, BentoGrid }
