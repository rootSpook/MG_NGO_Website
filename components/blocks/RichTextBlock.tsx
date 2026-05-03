import { marked } from "marked";
import type { RichTextBlockData } from "@/types/pageBuilder";

interface RichTextBlockProps {
  data: Record<string, unknown>;
}

function parseMarkdown(md: string): string {
  if (!md?.trim()) return "";
  try {
    const html = marked.parse(md, { async: false });
    // Handle both string return type and Promise (if marked configuration defaults to async inside)
    return typeof html === 'string' ? html : md;
  } catch {
    return md;
  }
}

export function RichTextBlock({ data }: RichTextBlockProps) {
  const { markdown } = data as unknown as RichTextBlockData;

  if (!markdown?.trim()) return null;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6 md:py-14" suppressHydrationWarning>
      <article className="rounded-xl bg-white px-6 py-8 shadow-sm md:px-10 md:py-10" suppressHydrationWarning>
        <div
          className="
            prose prose-base max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:leading-8 prose-p:text-gray-700
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-gray-700
            prose-blockquote:border-primary prose-blockquote:text-gray-600
            prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:text-gray-100
          "
          dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
        />
      </article>
    </section>
  );
}
