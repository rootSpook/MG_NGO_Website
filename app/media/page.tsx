import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MediaHero } from "@/components/media/media-hero"
import { FeaturedMedia } from "@/components/media/featured-media"
import { MediaGrid } from "@/components/media/media-grid"
import { MediaGallery } from "@/components/media/media-gallery"
import { MediaCta } from "@/components/media/media-cta"

export const metadata = {
  title: "Media | Myasthenia Gravis Yaşam Derneği",
  description: "Stay updated with our latest news, events, gallery, and media coverage about Myasthenia Gravis awareness.",
}

export default function MediaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <MediaHero />
        <FeaturedMedia />
        <MediaGrid />
        <MediaGallery />
        <MediaCta />
      </main>
      <Footer />
    </div>
  )
}
