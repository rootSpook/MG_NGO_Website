import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getAboutPageData } from "@/lib/publicPagesContent";

export const metadata = {
  title: "Amacımız ve Vizyonumuz | MG Yaşam Derneği",
  description:
    "Myasthenia Gravis Yaşam Derneği'nin vizyonu, misyonu ve kuruluş amaçları.",
};

export default async function VisionPage() {
  const about = await getAboutPageData();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="bg-teal-700 py-12 px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <nav className="mb-4 text-sm text-teal-200">
              <Link href="/about" className="hover:text-white">
                Hakkımızda
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Amacımız ve Vizyonumuz</span>
            </nav>
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              Amacımız ve Vizyonumuz
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 md:px-6">
          <div className="space-y-12">
            <div>
              <h2 className="mb-5 text-2xl font-bold text-teal-700 md:text-3xl">
                Vizyonumuz
              </h2>
              <ul className="space-y-3">
                {about.vision.map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-700">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-teal-600" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-5 text-2xl font-bold text-teal-700 md:text-3xl">
                Misyonumuz
              </h2>
              <ul className="space-y-3">
                {about.mission.map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-700">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-teal-600" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/about"
              className="text-sm text-gray-500 hover:text-teal-600"
            >
              ← Hakkımızda sayfasına dön
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
