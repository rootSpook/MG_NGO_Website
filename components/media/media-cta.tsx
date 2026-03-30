import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Download, Phone } from "lucide-react"
import Link from "next/link"

export function MediaCta() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Newsletter Signup */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <Mail className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Stay Updated</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter to receive the latest news, event updates, 
              and resources directly in your inbox.
            </p>

            <form className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              />
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Subscribe to Newsletter
              </Button>
            </form>

            <p className="text-xs text-gray-500 mt-3">
              By subscribing, you agree to receive email communications from us. 
              You can unsubscribe at any time.
            </p>
          </div>

          {/* Press Kit */}
          <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg p-6 md:p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Press & Media Kit</h3>
            </div>
            
            <p className="text-white/90 mb-6">
              Download our press kit containing logos, brand guidelines, fact sheets, 
              and high-resolution images for media use.
            </p>

            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white mb-6">
              <Download size={18} className="mr-2" />
              Download Press Kit
            </Button>

            <div className="border-t border-white/20 pt-6">
              <p className="text-sm text-white/80 mb-2">For media inquiries, contact:</p>
              <div className="flex items-center gap-2 text-white">
                <Mail size={16} />
                <span>press@mg.org.tr</span>
              </div>
              <div className="flex items-center gap-2 text-white mt-1">
                <Phone size={16} />
                <span>+90 000 000 00 00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Banner */}
        <div className="mt-8 bg-teal-50 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Have a story to share?
            </h3>
            <p className="text-gray-600">
              We&apos;d love to hear from you. Share your MG journey with our community.
            </p>
          </div>
          <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white whitespace-nowrap">
            <Link href="/contacts">
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
