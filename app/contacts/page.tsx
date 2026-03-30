"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Mail, Phone, Home, Plus, Minus } from "lucide-react"

const faqItems = [
  {
    question: "How can I support the MG community?",
    answer:
      "You can support the MG community in many ways. You may contribute through donations, volunteer in our initiatives, participate in community events, or help raise awareness about MG. Every form of support helps us strengthen the community and create a positive impact.",
  },
  {
    question: "How can I become a volunteer?",
    answer:
      "To become a volunteer, you can fill out our volunteer application form on our website or contact us directly. We welcome individuals who want to contribute their time and skills to support our community initiatives.",
  },
  {
    question: "How can I participate in community events?",
    answer:
      "You can participate in our community events by checking our events calendar on the website or following our social media channels for announcements. Registration for events is typically available online.",
  },
  {
    question: "How will donations be used?",
    answer:
      "Donations are used to fund our community programs, awareness campaigns, support services for MG patients, research initiatives, and operational costs to maintain our organization and its activities.",
  },
]

export default function ContactUsPage() {
  const [openFaq, setOpenFaq] = useState<number>(0)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? -1 : index)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Contact Section */}
        <section className="py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Left - Contact Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-teal-600 mb-6">Contact Us</h1>
              <p className="text-gray-700 leading-relaxed mb-6">
                We are here to support and connect the MG community.
                <br />
                If you have questions, would like to volunteer, collaborate, or
                <br />
                learn more about our initiatives, feel free to reach out to us.
                <br />
                Our team will be happy to help.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5" />
                  <span>info@MG.org.tr</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5" />
                  <span>+90 000000000</span>
                </div>
              </div>
            </div>

            {/* Right - Contact Form */}
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Get in Touch</h2>
                <p className="text-gray-600 text-sm mb-6">
                  Send us a message and we will respond as soon as possible. Your voice and participation
                  are important to our community.
                </p>

                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full pl-12 pr-4 py-3 bg-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 bg-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />

                  <textarea
                    placeholder="How can we help?"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                      <span>I have read and agree to the KVKK Information Notice.</span>
                    </label>

                    <button
                      type="submit"
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Map & Location Section */}
        <section className="py-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            {/* Map Placeholder */}
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-200 rounded-lg overflow-hidden aspect-[4/3]">
                <img
                  src="https://maps.googleapis.com/maps/api/staticmap?center=40.8667,29.3667&zoom=12&size=600x450&maptype=roadmap&markers=color:red%7C40.8667,29.3667&key=placeholder"
                  alt="Map showing location in Tuzla, Istanbul"
                  className="w-full h-full object-cover opacity-0"
                />
                <div className="w-full h-full flex items-center justify-center bg-gray-300 -mt-full" style={{ marginTop: "-100%" }}>
                  <div className="text-center">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <svg viewBox="0 0 400 300" className="w-full h-full">
                        {/* Simple map representation */}
                        <rect fill="#e8e8e8" width="400" height="300" />
                        {/* Roads */}
                        <path d="M0 150 L400 150" stroke="#fff" strokeWidth="8" />
                        <path d="M200 0 L200 300" stroke="#fff" strokeWidth="6" />
                        <path d="M50 50 L350 250" stroke="#fff" strokeWidth="4" />
                        <path d="M100 0 L100 300" stroke="#fff" strokeWidth="3" />
                        <path d="M300 0 L300 300" stroke="#fff" strokeWidth="3" />
                        <path d="M0 80 L400 80" stroke="#fff" strokeWidth="3" />
                        <path d="M0 220 L400 220" stroke="#fff" strokeWidth="3" />
                        {/* Location marker */}
                        <circle cx="200" cy="150" r="12" fill="#ef4444" />
                        <circle cx="200" cy="150" r="6" fill="#fff" />
                        {/* Area labels */}
                        <text x="60" y="40" fontSize="10" fill="#666">Sanayi</text>
                        <text x="300" y="40" fontSize="10" fill="#666">Harem Istanbul</text>
                        <text x="320" y="100" fontSize="10" fill="#666">ISTANBUL</text>
                        <text x="150" y="180" fontSize="10" fill="#666">Sabanci Üniversitesi</text>
                        <text x="100" y="220" fontSize="10" fill="#666">DIZAYN ANTREPO</text>
                        <text x="50" y="260" fontSize="10" fill="#666">Tuzla Belediyesi</text>
                        <text x="300" y="260" fontSize="10" fill="#666">Kirazlı</text>
                        <text x="180" y="290" fontSize="10" fill="#666">Çayırova</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-teal-600 mb-4">Our Location</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our organization works to connect and support the MG community through
                initiatives, events, and resources. From here, we coordinate programs that aim to
                improve awareness, support networks, and community engagement.
              </p>

              <div className="flex items-start gap-3 text-gray-700">
                <Home className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>Orta Mahalle, Üniversite Caddesi No:27 Tuzla, 34956 İstanbul</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <p className="text-teal-600 font-medium mb-1">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  {openFaq === index ? (
                    <Minus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 text-sm">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
