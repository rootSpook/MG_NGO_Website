"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Download, FileText, Calendar, Search } from "lucide-react"

const categories = [
  "All",
  "Annual Reports",
  "Research",
  "Medical Guidelines",
  "Community",
]

const reports = [
  {
    id: 1,
    title: "Understanding Myasthenia Gravis: A Patient Guide",
    summary: "A comprehensive guide for patients and families about living with MG, including treatment options and daily management strategies.",
    date: "December 2024",
    category: "Medical Guidelines",
    pages: 32,
    format: "PDF",
  },
  {
    id: 2,
    title: "2024 Research Partnerships Summary",
    summary: "Overview of our collaborative research initiatives with leading neurological institutions across Turkey.",
    date: "November 2024",
    category: "Research",
    pages: 24,
    format: "PDF",
  },
  {
    id: 3,
    title: "Community Impact Report Q3 2024",
    summary: "Quarterly report on community events, support group activities, and patient outreach programs.",
    date: "October 2024",
    category: "Community",
    pages: 18,
    format: "PDF",
  },
  {
    id: 4,
    title: "MG Awareness Month Campaign Results",
    summary: "Analysis of our June awareness campaign including reach, engagement, and key outcomes.",
    date: "August 2024",
    category: "Community",
    pages: 16,
    format: "PDF",
  },
  {
    id: 5,
    title: "Treatment Advances in Myasthenia Gravis 2024",
    summary: "Latest developments in MG treatment options including new therapies and clinical trial results.",
    date: "July 2024",
    category: "Research",
    pages: 28,
    format: "PDF",
  },
  {
    id: 6,
    title: "Annual Report 2023",
    summary: "Complete annual report covering all organizational activities, financial summary, and strategic goals.",
    date: "January 2024",
    category: "Annual Reports",
    pages: 52,
    format: "PDF",
  },
]

export function ReportsGrid() {
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
          All Reports
        </h2>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search reports..."
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
                  <span>{report.pages} pages</span>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <Download size={16} className="mr-2" />
                  Download {report.format}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reports found matching your criteria.</p>
          </div>
        )}

        {/* Load More */}
        {filteredReports.length > 0 && (
          <div className="text-center mt-10">
            <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
              Load More Reports
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
