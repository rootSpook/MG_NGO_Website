import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Calendar } from "lucide-react"

export function FeaturedReport() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-8">
          Featured Report
        </h2>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Report Cover Image */}
            <div className="relative h-64 md:h-auto bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center p-8">
              <div className="text-center">
                <FileText className="w-20 h-20 text-white/80 mx-auto mb-4" />
                <div className="text-white/90 text-sm">Annual Report 2024</div>
              </div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                  New
                </Badge>
              </div>
            </div>

            {/* Report Details */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <Badge variant="outline" className="w-fit mb-3 text-teal-600 border-teal-600">
                Annual Report
              </Badge>
              
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Myasthenia Gravis Yaşam Derneği 2024 Annual Report
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our comprehensive annual report covering community initiatives, research partnerships, 
                awareness campaigns, and the impact we&apos;ve made together in supporting those affected 
                by Myasthenia Gravis throughout Turkey.
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  January 2025
                </span>
                <span>•</span>
                <span>48 Pages</span>
                <span>•</span>
                <span>PDF Format</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Download size={18} className="mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                  Read Online
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
