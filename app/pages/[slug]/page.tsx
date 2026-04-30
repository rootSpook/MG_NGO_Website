import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { getPublishedContentByType, getContentBySlug } from "@/lib/firebase/services";
import type { PageBlockData } from "@/types/pageBuilder";

interface CmsPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-render all published CMS pages that carry block sections.
 * Falls back to an empty array so the build never fails on a cold Firestore.
 */
export async function generateStaticParams() {
  try {
    const pages = await getPublishedContentByType("page");
    return pages
      .filter((p) => {
        const pd = p.pageData as Record<string, unknown> | null;
        return pd && Array.isArray(pd.sections) && (pd.sections as unknown[]).length > 0;
      })
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CmsPageProps) {
  const { slug } = await params;
  const page = await getContentBySlug(slug);
  if (!page) return { title: "Sayfa Bulunamadı" };
  return {
    title: `${page.title} | MG Yaşam Derneği`,
    description: page.excerpt ?? page.seoDescription ?? undefined,
  };
}

export default async function CmsPage({ params }: CmsPageProps) {
  const { slug } = await params;

  const page = await getContentBySlug(slug);

  if (!page) notFound();

  const blockData = page.pageData as unknown as PageBlockData | null;

  // If this page exists but has no block sections yet, show a graceful empty state.
  if (!blockData?.sections?.length) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Bu sayfanın içeriği henüz yayınlanmamış.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />
      <main className="flex-1">
        <BlockRenderer sections={blockData.sections} />
      </main>
      <Footer />
    </div>
  );
}
