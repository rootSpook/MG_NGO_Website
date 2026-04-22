"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Mail, User, Phone, MapPin } from "lucide-react";
import { submitVolunteerApplication } from "@/lib/firebase/services";

export default function VolunteerPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [motivation, setMotivation] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setErrorMsg("Lütfen KVKK Aydınlatma Metni'ni okuyup onaylayın.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      await submitVolunteerApplication({
        fullName,
        email,
        phone: phone || undefined,
        city: city || undefined,
        motivation,
      });
      setStatus("success");
      setFullName("");
      setEmail("");
      setPhone("");
      setCity("");
      setMotivation("");
      setAgreed(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="bg-teal-700 py-12 px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              Gönüllümüz Olun
            </h1>
            <p className="mt-4 text-teal-100 md:text-lg">
              Myasthenia Gravis topluluğuna katkıda bulunmak isteyen gönüllüleri
              bekliyoruz. Birlikte daha güçlüyüz.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 md:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-teal-700">
                Neden Gönüllü Olmalısınız?
              </h2>
              <p className="mb-6 leading-relaxed text-gray-700">
                Derneğimizde gönüllü olarak; etkinlik organizasyonu, hasta
                desteği, farkındalık kampanyaları ve idari çalışmalar gibi
                birçok alanda aktif rol alabilirsiniz.
              </p>
              <ul className="space-y-3 text-gray-700">
                {[
                  "Etkinlik ve organizasyon desteği",
                  "Hasta ve aile danışmanlığı",
                  "Sosyal medya ve iletişim",
                  "Farkındalık kampanyaları",
                  "İdari ve ofis desteği",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gray-100 p-6 md:p-8">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Başvuru Formu
              </h2>

              {status === "success" ? (
                <div className="rounded-lg border border-teal-200 bg-teal-50 px-5 py-6 text-center">
                  <p className="font-medium text-teal-700">
                    Başvurunuz alındı!
                  </p>
                  <p className="mt-1 text-sm text-teal-600">
                    En kısa sürede sizinle iletişime geçeceğiz.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 text-sm text-teal-600 underline"
                  >
                    Yeni başvuru yap
                  </button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ad Soyad"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-lg bg-gray-200 py-3 pl-10 pr-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="E-posta Adresiniz"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg bg-gray-200 py-3 pl-10 pr-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Telefon Numarası"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg bg-gray-200 py-3 pl-10 pr-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Şehir"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-lg bg-gray-200 py-3 pl-10 pr-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <textarea
                    placeholder="Neden gönüllü olmak istiyorsunuz?"
                    required
                    rows={4}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full resize-none rounded-lg bg-gray-200 px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />

                  {errorMsg && (
                    <p className="text-sm text-red-600">{errorMsg}</p>
                  )}

                  <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      KVKK Aydınlatma Metni&apos;ni okudum ve onaylıyorum.
                    </label>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="rounded-lg bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
                    >
                      {status === "loading" ? "Gönderiliyor…" : "Başvur"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
