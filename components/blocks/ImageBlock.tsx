import Image from "next/image";
import type { ImageBlockData } from "@/types/pageBuilder";

interface ImageBlockProps {
  data: Record<string, unknown>;
}

const widthClasses: Record<ImageBlockData["width"], string> = {
  full: "w-full",
  container: "mx-auto max-w-6xl px-4 md:px-6",
  narrow: "mx-auto max-w-2xl px-4 md:px-6",
};

const alignClasses: Record<ImageBlockData["alignment"], string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

export function ImageBlock({ data }: ImageBlockProps) {
  const d: ImageBlockData = {
    imageUrl: "",
    altText: "",
    caption: "",
    width: "container",
    alignment: "center",
    ...(data as Partial<ImageBlockData>),
  };

  if (!d.imageUrl) return null;

  const isFullWidth = d.width === "full";

  return (
    <section className="py-8">
      <div className={widthClasses[d.width]}>
        <figure className={`flex flex-col ${alignClasses[d.alignment]}`}>
          {isFullWidth ? (
            // Full-width: use regular img so it spans the viewport edge-to-edge
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={d.imageUrl}
              alt={d.altText}
              className="w-full object-cover"
            />
          ) : (
            <Image
              src={d.imageUrl}
              alt={d.altText}
              width={1200}
              height={675}
              className="h-auto w-full rounded-lg object-cover shadow-sm"
            />
          )}
          {d.caption && (
            <figcaption className="mt-2 text-sm text-gray-500 italic">
              {d.caption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}
