import Link from "next/link";
import type { CtaBannerBlockData } from "@/types/pageBuilder";

interface CtaBannerBlockProps {
  data: Record<string, unknown>;
}

const variantStyles = {
  teal: {
    section: "bg-teal-600",
    heading: "text-white",
    body: "text-teal-100",
    button: "bg-white text-teal-700 hover:bg-teal-50",
  },
  dark: {
    section: "bg-gray-900",
    heading: "text-white",
    body: "text-gray-300",
    button: "bg-teal-500 text-white hover:bg-teal-400",
  },
  light: {
    section: "bg-teal-50 border-y border-teal-100",
    heading: "text-teal-800",
    body: "text-teal-700",
    button: "bg-teal-600 text-white hover:bg-teal-700",
  },
} as const;

export function CtaBannerBlock({ data }: CtaBannerBlockProps) {
  const {
    heading,
    body,
    buttonLabel,
    buttonHref,
    variant = "teal",
  } = data as unknown as CtaBannerBlockData;

  const styles = variantStyles[variant] ?? variantStyles.teal;

  return (
    <section className={`w-full ${styles.section}`}>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-14 text-center md:flex-row md:justify-between md:text-left md:px-10">
        <div className="flex flex-col gap-2">
          {heading && (
            <h2 className={`text-2xl font-bold md:text-3xl ${styles.heading}`}>
              {heading}
            </h2>
          )}
          {body && (
            <p className={`max-w-xl text-base leading-relaxed ${styles.body}`}>
              {body}
            </p>
          )}
        </div>

        {buttonLabel && buttonHref && (
          <Link
            href={buttonHref}
            className={`shrink-0 rounded-full px-8 py-3 text-sm font-semibold shadow-md transition-colors ${styles.button}`}
          >
            {buttonLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
