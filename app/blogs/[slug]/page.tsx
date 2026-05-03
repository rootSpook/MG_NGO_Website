import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/publicContent";
import { marked } from "marked";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

function formatDateTR(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function parseMarkdown(md: string): string {
  if (!md) return "";
  try {
    return marked.parse(md, { async: false }) as string;
  } catch {
    return md;
  }
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return { title: "Blog Bulunamadi" };
  }

  return {
    title: `${blog.title} | Blog Yazısı`,
    description: blog.excerpt,
  };
}

export async function generateStaticParams() {
  const blogs = await getPublishedBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Prefer the rich bodyMarkdown content; fall back to excerpt paragraphs
  const hasRichContent = blog.bodyMarkdown && blog.bodyMarkdown.trim().length > 0;
  const bodyHtml = hasRichContent
    ? parseMarkdown(blog.bodyMarkdown)
    : blog.content.map((p) => `<p>${p}</p>`).join("");

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />

      <main className="flex-1">
        {/* Cover image with title overlay */}
        <section className="mx-auto max-w-6xl px-4 pb-0 pt-6 md:px-6 md:pt-8">
          <div className="relative overflow-hidden rounded-md">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="h-[320px] w-full object-cover md:h-[420px]"
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10">
              <p className="mb-3 text-sm text-white/90 md:text-base">
                {formatDateTR(blog.publishedAt)}
              </p>
              <h1 className="max-w-2xl text-3xl font-bold leading-tight text-teal-100 md:text-6xl">
                {blog.title}
              </h1>
              {blog.author && (
                <p className="mt-3 text-sm text-white/80">{blog.author}</p>
              )}
            </div>
          </div>
        </section>

        {/* Article body */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6 md:pt-10">
          <article className="rounded-md bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
            {hasRichContent ? (
              <div
                className="prose prose-base max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-p:text-gray-700 prose-p:leading-8
                  prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-li:text-gray-700
                  prose-blockquote:border-teal-400 prose-blockquote:text-gray-600
                  prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-gray-900 prose-pre:text-gray-100"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            ) : (
              <div className="space-y-6 text-[15px] leading-8 text-gray-700 md:text-base">
                {blog.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
            {((blog.attachments && blog.attachments.length > 0) || blog.attachmentUrl) && (
              <div className="mt-8 rounded-lg border border-teal-100 bg-teal-50 p-4">
                <p className="text-sm font-semibold text-teal-800">Ek Dosyalar</p>
                <ul className="mt-3 space-y-2">
                  {(blog.attachments && blog.attachments.length > 0
                    ? blog.attachments
                    : [{ id: "legacy", name: blog.attachmentName || "Ek dosya", url: blog.attachmentUrl ?? "" }]
                  ).map((entry) => (
                    <li key={entry.id}>
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={entry.name || true}
                        className="inline-flex items-center gap-2 rounded-md border border-teal-200 bg-white px-3 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-100"
                      >
                        📎 {entry.name || "Dosya"}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
