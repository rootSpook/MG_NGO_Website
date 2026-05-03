import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Download, Phone } from "lucide-react"
import Link from "next/link"
import { MediaPageData } from "@/lib/publicContent"

interface MediaCtaProps {
  data: MediaPageData["cta"]
}

export function MediaCta({ data }: MediaCtaProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Newsletter Signup */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{data.newsletterTitle}</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {data.newsletterDescription}
            </p>

            <form className="space-y-3">
              <Input
                type="email"
                placeholder={data.newsletterInputPlaceholder}
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
              <Button className="w-full bg-primary hover:bg-primary text-white">
                {data.newsletterButtonLabel}
              </Button>
            </form>

            <p className="text-xs text-gray-500 mt-3">
              {data.newsletterNote}
            </p>
          </div>

          {/* Press Kit */}
          <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg p-6 md:p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">{data.pressTitle}</h3>
            </div>
            
            <p className="text-white/90 mb-6">
              {data.pressDescription}
            </p>

            <Button className="w-full bg-secondary/500 hover:bg-primary text-white mb-6">
              <Download size={18} className="mr-2" />
              {data.pressButtonLabel}
            </Button>

            <div className="border-t border-white/20 pt-6">
              <p className="text-sm text-white/80 mb-2">Basın ve medya iletişimi için:</p>
              <div className="flex items-center gap-2 text-white">
                <Mail size={16} />
                <span>{data.pressEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-white mt-1">
                <Phone size={16} />
                <span>{data.pressPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Banner */}
        <div className="mt-8 bg-secondary/50 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {data.bannerTitle}
            </h3>
            <p className="text-gray-600">
              {data.bannerDescription}
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary text-white whitespace-nowrap">
            <Link href={data.bannerButtonHref}>
              {data.bannerButtonLabel}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
