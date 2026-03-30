"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"

const categories = [
  "All",
  "News",
  "Events",
  "Press",
  "Announcements",
]

const mediaItems = [
  {
    id: 1,
    title: "New Treatment Center Opens in Istanbul",
    excerpt: "A specialized MG treatment center has been inaugurated at Sabancı University Hospital, offering comprehensive care.",
    date: "March 8, 2025",
    category: "News",
    image: "bg-gradient-to-br from-blue-400 to-blue-600",
    readTime: "3 min read",
  },
  {
    id: 2,
    title: "Spring Community Gathering 2025",
    excerpt: "Join us for our annual spring gathering bringing together patients, families, and medical professionals.",
    date: "March 5, 2025",
    category: "Events",
    image: "bg-gradient-to-br from-green-400 to-green-600",
    readTime: "2 min read",
  },
  {
    id: 3,
    title: "Partnership with European MG Foundation",
    excerpt: "We are excited to announce our new partnership to expand research collaboration across Europe.",
    date: "February 28, 2025",
    category: "Press",
    image: "bg-gradient-to-br from-purple-400 to-purple-600",
    readTime: "4 min read",
  },
  {
    id: 4,
    title: "Updated Patient Resources Available",
    excerpt: "New downloadable guides and resources are now available in Turkish for patients and caregivers.",
    date: "February 20, 2025",
    category: "Announcements",
    image: "bg-gradient-to-br from-orange-400 to-orange-600",
    readTime: "2 min read",
  },
  {
    id: 5,
    title: "Dr. Ayşe Yılmaz Joins Advisory Board",
    excerpt: "Renowned neurologist Dr. Ayşe Yılmaz brings decades of MG expertise to our medical advisory board.",
    date: "February 15, 2025",
    category: "News",
    image: "bg-gradient-to-br from-teal-400 to-teal-600",
    readTime: "3 min read",
  },
  {
    id: 6,
    title: "Volunteer Training Program Launch",
    excerpt: "Applications are now open for our comprehensive volunteer training program starting in April.",
    date: "February 10, 2025",
    category: "Announcements",
    image: "bg-gradient-to-br from-pink-400 to-pink-600",
    readTime: "2 min read",
  },
]

export function MediaGrid() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredMedia = mediaItems.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  )

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-8">
          Latest Updates
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
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

        {/* Media Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              {/* Image */}
              <div className={`h-48 ${item.image} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Content */}
              <div className="p-5">
                <Badge variant="outline" className="mb-3 text-xs text-teal-600 border-teal-600">
                  {item.category}
                </Badge>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
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
          <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
            Load More
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
