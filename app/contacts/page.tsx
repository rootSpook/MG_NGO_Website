"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Mail, Phone, Home, Plus, Minus, MapPin } from "lucide-react"
import { contactPageTemplate } from "@/lib/publicPagesContent"
import { getContentBySlug, getSiteSettings, submitContactMessage } from "@/lib/firebase/services"
import { mergeEditablePageData } from "@/lib/pageContentConfig"

const initialEditableContent = mergeEditablePageData(
  "iletisim",
  contactPageTemplate as unknown as Record<string, unknown>
)

type ContactPageState = {
  title: string
  intro: string
  locationTitle: string
  locationIntro: string
  faqTitle: string
  email: string
  phone: string
  location: string
  faq: typeof contactPageTemplate.faq
}

export default function ContactUsPage() {
  const [pageContent, setPageContent] = useState<ContactPageState>({
    title: initialEditableContent.title,
    intro: initialEditableContent.intro,
    locationTitle: initialEditableContent.locationTitle,
    locationIntro: initialEditableContent.locationIntro,
    faqTitle: initialEditableContent.faqTitle,
    email: contactPageTemplate.email,
    phone: contactPageTemplate.phone,
    location: contactPageTemplate.location,
    faq: contactPageTemplate.faq,
  })
  const [openFaq, setOpenFaq] = useState<number>(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    async function loadPageContent() {
      try {
        const [item, settings] = await Promise.all([
          getContentBySlug("iletisim"),
          getSiteSettings(),
        ])
        const editable = mergeEditablePageData(
          "iletisim",
          item?.pageData as Record<string, unknown> | null | undefined
        )
        const structured = item?.pageData as Partial<typeof contactPageTemplate> & {
          contactEmail?: string
          contactPhone?: string
          addressText?: string
        } | undefined
        setPageContent({
          title: editable.title,
          intro: editable.intro,
          locationTitle: editable.locationTitle,
          locationIntro: editable.locationIntro,
          faqTitle: editable.faqTitle,
          // Prefer admin-edited values from pageData, fall back to settings, then seed
          email:
            structured?.contactEmail ||
            settings?.contactEmail ||
            contactPageTemplate.email,
          phone:
            structured?.contactPhone ||
            settings?.contactPhone ||
            contactPageTemplate.phone,
          location:
            structured?.addressText ||
            settings?.addressText ||
            contactPageTemplate.location,
          faq: structured?.faq ?? contactPageTemplate.faq,
        })
      } catch {
        setPageContent((prev) => prev)
      }
    }

    loadPageContent()
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? -1 : index)
  }

  // Generate a Google Maps embed URL based on the editable address.
  const mapEmbedUrl = useMemo(() => {
    const query = encodeURIComponent(pageContent.location || "İstanbul, Türkiye")
    return `https://www.google.com/maps?q=${query}&output=embed`
  }, [pageContent.location])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!agreed) {
      setErrorMsg("Lütfen KVKK Aydınlatma Metni'ni okuyup onaylayın.")
      return
    }
    setStatus("loading")
    setErrorMsg("")
    try {
      await submitContactMessage({
        senderName: name,
        senderEmail: email,
        senderPhone: phone || undefined,
        subject: "Web Sitesi İletişim Formu",
        messageBody: message,
      })
      setStatus("success")
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
      setAgreed(false)
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin.")
    }
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
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--theme-title-text,var(--primary))] mb-6">{pageContent.title}</h1>
              <p className="text-gray-700 leading-relaxed mb-6">
                {pageContent.intro}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5" />
                  <a href={`mailto:${pageContent.email}`} className="hover:text-teal-600">
                    {pageContent.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5" />
                  <a href={`tel:${pageContent.phone.replace(/\s+/g, "")}`} className="hover:text-teal-600">
                    {pageContent.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Right - Contact Form */}
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Bize Yazın</h2>
                <p className="text-gray-600 text-sm mb-6">
                  Mesajınızı bize iletin, en kısa sürede geri dönüş yapalım. Katılımınız ve geri bildiriminiz
                  topluluğumuz için çok değerli.
                </p>

                {status === "success" ? (
                  <div className="rounded-lg bg-secondary/50 border border-primary px-5 py-6 text-center">
                    <p className="text-primary font-medium">Mesajınız iletildi!</p>
                    <p className="text-primary text-sm mt-1">En kısa sürede geri dönüş yapacağız.</p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-4 text-sm text-primary underline"
                    >
                      Yeni mesaj gönder
                    </button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Ad Soyad"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        placeholder="E-posta Adresiniz"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <input
                      type="tel"
                      placeholder="Telefon Numarası"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    <textarea
                      placeholder="Size nasıl yardımcı olabiliriz?"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />

                    {errorMsg && (
                      <p className="text-sm text-red-600">{errorMsg}</p>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span>KVKK Aydınlatma Metni'ni okudum ve onaylıyorum.</span>
                      </label>

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary transition-colors disabled:opacity-60"
                      >
                        {status === "loading" ? "Gönderiliyor…" : "Gönder"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Map & Location Section */}
        <section className="py-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            {/* Map embed — refreshes when the admin updates the address */}
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-200 rounded-lg overflow-hidden aspect-[4/3] relative">
                <iframe
                  key={pageContent.location}
                  title="Konum haritası"
                  src={mapEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 rounded-md bg-white/85 px-3 py-1.5 text-xs text-gray-700 backdrop-blur">
                  <MapPin className="h-3.5 w-3.5 text-teal-600" />
                  <span className="truncate">{pageContent.location}</span>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--theme-title-text,var(--primary))] mb-4">{pageContent.locationTitle}</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {pageContent.locationIntro}
              </p>

              <div className="flex items-start gap-3 text-gray-700">
                <Home className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>{pageContent.location}</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <p className="text-primary font-medium mb-1">SSS</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--theme-title-text,var(--primary))] mb-6">{pageContent.faqTitle}</h2>

          <div className="space-y-3">
            {pageContent.faq.map((item, index) => (
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
            {pageContent.faq.length === 0 && (
              <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center text-sm text-gray-400">
                Henüz SSS eklenmedi.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
