import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MediaHero } from "@/components/media/media-hero"
import { FeaturedMedia } from "@/components/media/featured-media"
import { MediaGrid } from "@/components/media/media-grid"
import { MediaGallery } from "@/components/media/media-gallery"
import { MediaCta } from "@/components/media/media-cta"
import { getMediaPageData } from "@/lib/publicContent"

export const metadata = {
  title: "Medya | Myasthenia Gravis Yaşam Derneği",
  description: "Myasthenia Gravis farkındalığına dair güncel haberler, etkinlikler, galeri içerikleri ve medya paylaşımlarını takip edin.",
}

export default async function MediaPage() {
  const mediaData = await getMediaPageData()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <MediaHero data={mediaData.hero} />
        <FeaturedMedia data={mediaData.featured} />
        <MediaGrid
          title={mediaData.listSectionTitle}
          categories={mediaData.categories}
          items={mediaData.items}
          loadMoreLabel={mediaData.loadMoreLabel}
        />
        <MediaGallery
          title={mediaData.gallery.title}
          viewAllLabel={mediaData.gallery.viewAllLabel}
          images={mediaData.gallery.images}
        />
        <MediaCta data={mediaData.cta} />
      </main>
      <Footer />
    </div>
  )
}
