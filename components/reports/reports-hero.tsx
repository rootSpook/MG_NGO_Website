import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ReportsPageData } from "@/lib/publicContent"

interface ReportsHeroProps {
  data: ReportsPageData["hero"]
}

export function ReportsHero({ data }: ReportsHeroProps) {
  return (
    <section className="relative bg-gradient-to-r from-slate-700 to-slate-600 py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative max-w-6xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight size={16} />
          <span className="text-white">{data.breadcrumbCurrent}</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-bold text-teal-400 mb-4">
          {data.title}
        </h1>
        <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">
          {data.description}
        </p>
      </div>
    </section>
  )
}
