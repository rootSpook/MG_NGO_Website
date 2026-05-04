"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import { MediaListItem } from "@/lib/publicContent"

interface MediaGridProps {
  title: string
  categories: string[]
  items: MediaListItem[]
  loadMoreLabel: string
}

export function MediaGrid({ title, categories, items, loadMoreLabel }: MediaGridProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredMedia = items.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  )

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--theme-title-text,var(--primary))] mb-8">
          {title}
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              {/* Image */}
              <div className={`h-48 ${item.imageClass} flex items-center justify-center relative overflow-hidden`}>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Content */}
              <div className="p-5">
                <Badge variant="outline" className="mb-3 text-xs text-primary border-primary">
                  {item.category}
                </Badge>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[var(--theme-title-text,var(--primary))] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {item.date}
                  </span>
                  <span>{item.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-10">
          <Button variant="outline" className="border-primary text-primary hover:bg-secondary/50">
            {loadMoreLabel}
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
