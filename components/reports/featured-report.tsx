import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Calendar } from "lucide-react"
import { ReportsPageData } from "@/lib/publicContent"

interface FeaturedReportProps {
  data: ReportsPageData["featured"]
}

export function FeaturedReport({ data }: FeaturedReportProps) {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--theme-title-text,var(--primary))] mb-8">
          {data.sectionTitle}
        </h2>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Report Cover Image */}
            <div className="relative h-64 md:h-auto bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center p-8">
              <div className="text-center">
                <FileText className="w-20 h-20 text-white/80 mx-auto mb-4" />
                <div className="text-white/90 text-sm">{data.coverCaption}</div>
              </div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                  {data.badgeLabel}
                </Badge>
              </div>
            </div>

            {/* Report Details */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <Badge variant="outline" className="w-fit mb-3 text-primary border-primary">
                {data.category}
              </Badge>
              
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                {data.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {data.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {data.date}
                </span>
                <span>•</span>
                <span>{data.pagesLabel}</span>
                <span>•</span>
                <span>{data.formatLabel}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-primary hover:bg-primary text-white">
                  <Download size={18} className="mr-2" />
                  {data.downloadLabel}
                </Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-secondary/50">
                  {data.readOnlineLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
