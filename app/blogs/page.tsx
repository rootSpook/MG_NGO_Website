import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getPublishedBlogs } from "@/lib/publicContent";
import { getEditablePageContent } from "@/lib/publicPagesContent";

export const metadata = {
  title: "Bloglar | Myasthenia Gravis Yasam Dernegi",
  description:
    "Myasthenia Gravis topluluguna dair duyurular, etkinlik ozetleri ve bilgilendirici blog icerikleri.",
};

function formatDateTR(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogsPage() {
  const [blogs, pageContent] = await Promise.all([
    getPublishedBlogs(),
    getEditablePageContent("bloglar"),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <h1 className="mb-6 text-3xl font-bold text-[var(--theme-title-text,var(--primary))] md:text-4xl">
            {pageContent.title}
          </h1>

          <div className="space-y-6">
            {blogs.map((blog, index) => (
              <article
                key={blog.id}
                className={`rounded-lg p-5 md:p-7 ${
                  index % 2 === 1 ? "bg-[#d5d5d5]" : "bg-transparent"
                }`}
              >
                <div className="grid items-center gap-5 md:grid-cols-[320px_1fr]">
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="overflow-hidden rounded-md bg-gray-200"
                  >
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="h-[180px] w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                    />
                  </Link>

                  <div>
                    <p className="mb-3 text-sm text-gray-500">
                      {formatDateTR(blog.publishedAt)}
                    </p>
                    <Link href={`/blogs/${blog.slug}`}>
                      <h2 className="text-3xl font-bold leading-tight text-[var(--theme-title-text,var(--primary))] hover:underline md:text-5xl">
                        {blog.title}
                      </h2>
                    </Link>
                    {blog.excerpt && (
                      <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
                        {blog.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-4">
                      {blog.author && (
                        <span className="text-sm text-gray-500">{blog.author}</span>
                      )}
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Devamını oku →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {blogs.length === 0 && (
              <div className="rounded-lg bg-white p-10 text-center text-gray-600">
                {pageContent.emptyText}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
