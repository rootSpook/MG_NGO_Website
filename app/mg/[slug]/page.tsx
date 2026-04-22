import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getMGPageContent, MG_SECTIONS } from "@/lib/publicContent";

interface MGDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MGDetailPageProps) {
  const { slug } = await params;
  const page = await getMGPageContent(slug);
  if (!page) return { title: "Sayfa Bulunamadı" };
  return {
    title: `${page.title} | MG Yaşam Derneği`,
    description: page.body.slice(0, 160),
  };
}

export function generateStaticParams() {
  return MG_SECTIONS.map((s) => ({ slug: s.slug }));
}

export default async function MGDetailPage({ params }: MGDetailPageProps) {
  const { slug } = await params;
  const page = await getMGPageContent(slug);

  if (!page) notFound();

  const currentIndex = MG_SECTIONS.findIndex((s) => s.slug === slug);
  const prev = currentIndex > 0 ? MG_SECTIONS[currentIndex - 1] : null;
  const next =
    currentIndex < MG_SECTIONS.length - 1
      ? MG_SECTIONS[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/mg" className="hover:text-teal-600">
              Myasthenia Gravis
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{page!.title}</span>
          </nav>

          <article className="rounded-xl bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
            <h1 className="mb-6 text-3xl font-bold text-teal-700 md:text-4xl">
              {page!.title}
            </h1>
            <div className="prose prose-teal max-w-none text-gray-700">
              {page!.body.split("\n\n").map((paragraph, i) => (
                <p key={i} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <div className="mt-8 flex items-center justify-between">
            {prev ? (
              <Link
                href={`/mg/${prev.slug}`}
                className="text-sm font-medium text-teal-600 hover:underline"
              >
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/mg/${next.slug}`}
                className="text-sm font-medium text-teal-600 hover:underline"
              >
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/mg" className="text-sm text-gray-500 hover:text-teal-600">
              ← Tüm konulara dön
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
