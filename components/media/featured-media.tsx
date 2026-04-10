import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight, Play } from "lucide-react"
import { MediaPageData } from "@/lib/publicContent"

interface FeaturedMediaProps {
  data: MediaPageData["featured"]
}

export function FeaturedMedia({ data }: FeaturedMediaProps) {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-8">
          {data.sectionTitle}
        </h2>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Featured Image */}
            <div className="relative h-64 md:h-96 bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10 text-center p-6">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-colors">
                  <Play className="w-10 h-10 text-white ml-1" fill="white" />
                </div>
                <p className="text-white text-sm">{data.videoLabel}</p>
              </div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                  {data.badgeLabel}
                </Badge>
              </div>
            </div>

            {/* Featured Content */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <Badge variant="outline" className="w-fit mb-3 text-teal-600 border-teal-600">
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
                <span>{data.readTime}</span>
              </div>

              <Button className="w-fit bg-teal-600 hover:bg-teal-700 text-white">
                {data.actionLabel}
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
