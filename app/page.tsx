import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Newspaper, Heart } from "lucide-react"
import { getHomePageData } from "@/lib/publicPagesContent"
import { getSupportersForPublic } from "@/lib/publicContent"

export default async function HomePage() {
  const [homeContent, supporters] = await Promise.all([
    getHomePageData(),
    getSupportersForPublic(),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-teal-600 to-teal-700 py-20 md:py-32">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {homeContent.hero.title}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              {homeContent.hero.description}
            </p>
            <Button asChild size="lg" className="bg-white text-teal-700 hover:bg-gray-100">
              <Link href={homeContent.hero.ctaHref}>
                {homeContent.hero.ctaLabel}
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-teal-600 mb-6">
                  {homeContent.about.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {homeContent.about.description}
                </p>
                <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Link href={homeContent.about.ctaHref}>{homeContent.about.ctaLabel}</Link>
                </Button>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-48 md:w-64 md:h-64">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <path
                      d="M100 20 C150 20, 180 70, 180 100 C180 150, 130 180, 100 180 C50 180, 20 130, 20 100 C20 50, 70 20, 100 20"
                      fill="none"
                      stroke="#0D9488"
                      strokeWidth="8"
                      className="opacity-30"
                    />
                    <path
                      d="M100 40 L100 80 M80 100 L120 100 M100 120 L100 160"
                      stroke="#0D9488"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-teal-600 text-center mb-12">
              Kaynaklarımızı Keşfedin
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Reports Card */}
              <Link href={homeContent.quickLinks[0].href} className="group">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                    <FileText className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {homeContent.quickLinks[0].title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {homeContent.quickLinks[0].description}
                  </p>
                </div>
              </Link>

              {/* Media Card */}
              <Link href={homeContent.quickLinks[1].href} className="group">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                    <Newspaper className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {homeContent.quickLinks[1].title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {homeContent.quickLinks[1].description}
                  </p>
                </div>
              </Link>

              {/* Donate Card */}
              <Link href={homeContent.quickLinks[2].href} className="group">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                    <Heart className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {homeContent.quickLinks[2].title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {homeContent.quickLinks[2].description}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
        {/* Supporters Section — only rendered when data exists in Firestore */}
        {supporters.length > 0 && (
          <section className="py-12 border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-6">
              <p className="text-center text-sm font-medium uppercase tracking-widest text-gray-400 mb-8">
                Destekçilerimiz
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {supporters.map((s) =>
                  s.logoUrl ? (
                    <a
                      key={s.id}
                      href={s.websiteUrl || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-60 hover:opacity-100 transition-opacity"
                      title={s.name}
                    >
                      <img
                        src={s.logoUrl}
                        alt={s.name}
                        className="h-10 w-auto max-w-[120px] object-contain"
                      />
                    </a>
                  ) : (
                    <span
                      key={s.id}
                      className="text-sm font-semibold text-gray-400"
                    >
                      {s.name}
                    </span>
                  )
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
