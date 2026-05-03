"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Download, FileText, Calendar, Search } from "lucide-react"
import { ReportListItem } from "@/lib/publicContent"

interface ReportsGridProps {
  title: string
  categories: string[]
  reports: ReportListItem[]
  searchPlaceholder: string
  emptyStateText: string
  loadMoreLabel: string
}

export function ReportsGrid({
  title,
  categories,
  reports,
  searchPlaceholder,
  emptyStateText,
  loadMoreLabel,
}: ReportsGridProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReports = reports.filter((report) => {
    const matchesCategory = activeCategory === "All" || report.category === activeCategory
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-8">
          {title}
        </h2>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  activeCategory === category
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Report Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                <FileText className="w-12 h-12 text-white/70" />
              </div>

              {/* Report Content */}
              <div className="p-5">
                <Badge variant="outline" className="mb-3 text-xs text-teal-600 border-teal-600">
                  {report.category}
                </Badge>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {report.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {report.summary}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {report.date}
                  </span>
                  <span>•</span>
                  <span>{report.pages} sayfa</span>
                </div>

                {report.fileUrl ? (
                  <Button asChild size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Download size={16} className="mr-2" />
                      İndir {report.format}
                    </a>
                  </Button>
                ) : (
                  <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    <Download size={16} className="mr-2" />
                    İndir {report.format}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{emptyStateText}</p>
          </div>
        )}

        {/* Load More */}
        {filteredReports.length > 0 && (
          <div className="text-center mt-10">
            <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
              {loadMoreLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
