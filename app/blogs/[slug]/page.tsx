import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/publicContent";

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

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Bulunamadi",
    };
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

  const currentBlog = blog!;

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-0 pt-6 md:px-6 md:pt-8">
          <div className="relative overflow-hidden rounded-md">
            <img
              src={currentBlog.coverImage}
              alt={currentBlog.title}
              className="h-[320px] w-full object-cover md:h-[420px]"
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10">
              <p className="mb-3 text-sm text-white/90 md:text-base">
                {formatDateTR(currentBlog.publishedAt)}
              </p>
              <h1 className="max-w-2xl text-3xl font-bold leading-tight text-teal-100 md:text-6xl">
                {currentBlog.title}
              </h1>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6 md:pt-10">
          <article className="rounded-md bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
            <div className="space-y-6 text-[15px] leading-8 text-gray-700 md:text-base">
              {currentBlog.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
