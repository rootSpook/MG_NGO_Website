import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ReportsHero } from "@/components/reports/reports-hero"
import { FeaturedReport } from "@/components/reports/featured-report"
import { ReportsGrid } from "@/components/reports/reports-grid"

export const metadata = {
  title: "Reports | Myasthenia Gravis Yaşam Derneği",
  description: "Access our research reports, publications, and downloadable resources about Myasthenia Gravis.",
}

export default function ReportsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <ReportsHero />
        <FeaturedReport />
        <ReportsGrid />
      </main>
      <Footer />
    </div>
  )
}
