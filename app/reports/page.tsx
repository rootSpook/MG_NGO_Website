import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ReportsHero } from "@/components/reports/reports-hero"
import { FeaturedReport } from "@/components/reports/featured-report"
import { ReportsGrid } from "@/components/reports/reports-grid"
import { getReportsPageData } from "@/lib/publicContent"

export const metadata = {
  title: "Raporlar | Myasthenia Gravis Yaşam Derneği",
  description: "Myasthenia Gravis hakkında araştırma raporlarına, yayınlara ve indirilebilir kaynaklara erişin.",
}

export default async function ReportsPage() {
  const reportsData = await getReportsPageData()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <ReportsHero data={reportsData.hero} />
        <FeaturedReport data={reportsData.featured} />
        <ReportsGrid
          title={reportsData.listSectionTitle}
          categories={reportsData.categories}
          reports={reportsData.reports}
          searchPlaceholder={reportsData.searchPlaceholder}
          emptyStateText={reportsData.emptyStateText}
          loadMoreLabel={reportsData.loadMoreLabel}
        />
      </main>
      <Footer />
    </div>
  )
}
