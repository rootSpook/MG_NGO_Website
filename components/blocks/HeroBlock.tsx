import Link from "next/link";
import type { HeroBlockData } from "@/types/pageBuilder";

interface HeroBlockProps {
  data: Record<string, unknown>;
}

export function HeroBlock({ data }: HeroBlockProps) {
  const { title, subtitle, imageUrl, ctaLabel, ctaHref, overlayDark } =
    data as unknown as HeroBlockData;

  const hasImage = Boolean(imageUrl);

  return (
    <section
      className={`relative overflow-hidden ${hasImage ? "min-h-85 md:min-h-105" : "bg-primary py-20"}`}
    >
      {/* Background image */}
      {hasImage && (
        <>
          <img
            src={imageUrl}
            alt={title ?? ""}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className={`absolute inset-0 ${overlayDark ? "bg-black/55" : "bg-black/35"}`}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col justify-center px-6 py-16 md:px-10 md:py-24">
        {title && (
          <h1
            className={`max-w-2xl text-4xl font-bold leading-tight md:text-5xl ${
              hasImage ? "text-white" : "text-white"
            }`}
          >
            {title}
          </h1>
        )}

        {subtitle && (
          <p
            className={`mt-4 max-w-xl text-lg leading-relaxed ${
              hasImage ? "text-white/85" : "text-primary-foreground/90"
            }`}
          >
            {subtitle}
          </p>
        )}

        {ctaLabel && ctaHref && (
          <div className="mt-8">
            <Link
              href={ctaHref}
              className="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary shadow-md transition-colors hover:bg-secondary/50"
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
