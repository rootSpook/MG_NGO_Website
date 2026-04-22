import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MG_SECTIONS } from "@/lib/publicContent";

export const metadata = {
  title: "Myasthenia Gravis Hakkında | MG Yaşam Derneği",
  description:
    "Myasthenia Gravis hakkında kapsamlı bilgiye ulaşın: hastalık nedir, belirtileri, tedavi seçenekleri, riskli ilaçlar ve günlük yaşam önerileri.",
};

export default function MGLandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />

      <main className="flex-1">
        <section className="bg-teal-700 py-12 px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              Myasthenia Gravis
            </h1>
            <p className="mt-4 text-teal-100 md:text-lg">
              Hastalık hakkında bilmeniz gereken her şey — belirtilerden
              tedaviye, günlük yaşam ipuçlarına kadar.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 md:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MG_SECTIONS.map((section) => (
              <Link
                key={section.slug}
                href={`/mg/${section.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h2 className="mb-2 text-lg font-semibold text-teal-700 group-hover:underline">
                  {section.title}
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  {section.description}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-teal-600">
                  Devamını oku →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
