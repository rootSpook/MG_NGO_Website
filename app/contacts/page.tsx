// TO-DO: there are still some static info like email and phone number
// these need to be changed.

"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Mail, Phone, Home, Plus, Minus } from "lucide-react"
import { contactPageTemplate } from "@/lib/publicPagesContent"
import { submitContactMessage } from "@/lib/firebase/services"

const pageContent = contactPageTemplate

export default function ContactUsPage() {
  const [openFaq, setOpenFaq] = useState<number>(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? -1 : index)
  }

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
              <h1 className="text-4xl md:text-5xl font-bold text-teal-600 mb-6">{pageContent.title}</h1>
              <p className="text-gray-700 leading-relaxed mb-6">
                {pageContent.intro}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5" />
                  <span>{pageContent.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5" />
                  <span>{pageContent.phone}</span>
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
                  <div className="rounded-lg bg-teal-50 border border-teal-200 px-5 py-6 text-center">
                    <p className="text-teal-700 font-medium">Mesajınız iletildi!</p>
                    <p className="text-teal-600 text-sm mt-1">En kısa sürede geri dönüş yapacağız.</p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-4 text-sm text-teal-600 underline"
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
                      className="w-full px-4 py-3 bg-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        placeholder="E-posta Adresiniz"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <input
                      type="tel"
                      placeholder="Telefon Numarası"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                    <textarea
                      placeholder="Size nasıl yardımcı olabiliriz?"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
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
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-60"
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
            {/* Map Placeholder */}
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-200 rounded-lg overflow-hidden aspect-[4/3]">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <rect fill="#e8e8e8" width="400" height="300" />
                    <path d="M0 150 L400 150" stroke="#fff" strokeWidth="8" />
                    <path d="M200 0 L200 300" stroke="#fff" strokeWidth="6" />
                    <path d="M50 50 L350 250" stroke="#fff" strokeWidth="4" />
                    <path d="M100 0 L100 300" stroke="#fff" strokeWidth="3" />
                    <path d="M300 0 L300 300" stroke="#fff" strokeWidth="3" />
                    <path d="M0 80 L400 80" stroke="#fff" strokeWidth="3" />
                    <path d="M0 220 L400 220" stroke="#fff" strokeWidth="3" />
                    <circle cx="200" cy="150" r="12" fill="#ef4444" />
                    <circle cx="200" cy="150" r="6" fill="#fff" />
                    <text x="60" y="40" fontSize="10" fill="#666">Sanayi</text>
                    <text x="300" y="40" fontSize="10" fill="#666">Harem İstanbul</text>
                    <text x="320" y="100" fontSize="10" fill="#666">İSTANBUL</text>
                    <text x="150" y="180" fontSize="10" fill="#666">Sabanci Üniversitesi</text>
                    <text x="100" y="220" fontSize="10" fill="#666">DİZAYN ANTREPO</text>
                    <text x="50" y="260" fontSize="10" fill="#666">Tuzla Belediyesi</text>
                    <text x="300" y="260" fontSize="10" fill="#666">Kirazlı</text>
                    <text x="180" y="290" fontSize="10" fill="#666">Çayırova</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-teal-600 mb-4">Konumumuz</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Derneğimiz, MG topluluğunu etkinlikler, kaynaklar ve destek programlarıyla bir araya getirir.
                Bu merkezden yürüttüğümüz çalışmalarla farkındalığı artırmayı ve dayanışmayı güçlendirmeyi hedefliyoruz.
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
          <p className="text-teal-600 font-medium mb-1">SSS</p>
          <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-6">Sık Sorulan Sorular</h2>

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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
