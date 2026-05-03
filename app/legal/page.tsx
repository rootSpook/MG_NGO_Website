import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Yasal Uyarı | MG Yaşam Derneği",
  description:
    "Myasthenia Gravis Yaşam Derneği web sitesine ilişkin yasal uyarı ve sorumluluk bildirimi.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="bg-primary py-12 px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              Yasal Uyarı
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 md:px-6">
          <div className="space-y-8 text-gray-700">
            <div>
              <h2 className="mb-3 text-lg font-semibold text-[var(--theme-title-text,var(--primary))]">
                Kuruluş Bilgileri
              </h2>
              <p className="leading-relaxed">
                Myasthenia Gravis Yaşam Derneği, Türkiye Cumhuriyeti
                Dernekler Kanunu çerçevesinde kurulmuş ve faaliyet gösteren
                bir sivil toplum kuruluşudur. Dernek, kâr amacı gütmemekte
                olup tüm faaliyetlerini üyelerinin ve toplumun yararına
                yürütmektedir.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-[var(--theme-title-text,var(--primary))]">
                Tıbbi Sorumluluk Reddi
              </h2>
              <p className="leading-relaxed">
                Bu web sitesinde yer alan bilgiler yalnızca genel bilgilendirme
                amacıyla sunulmaktadır. Söz konusu içerikler tıbbi tavsiye,
                tanı veya tedavi önerisi niteliği taşımamaktadır. Sağlık
                durumunuzla ilgili her türlü sorun için mutlaka bir sağlık
                profesyoneline danışınız. Derneğimiz, bu bilgilerin kullanımı
                sonucunda ortaya çıkabilecek hiçbir zarar veya kayıptan sorumlu
                tutulamaz.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-[var(--theme-title-text,var(--primary))]">
                İçerik Doğruluğu
              </h2>
              <p className="leading-relaxed">
                Sitede yayımlanan içeriklerin doğru ve güncel olması için
                gerekli özen gösterilmektedir; ancak bu içeriklerin hatasız
                veya eksiksiz olduğu garanti edilmemektedir. Derneğimiz,
                önceden bildirimde bulunmaksızın içerikleri güncelleme,
                değiştirme veya kaldırma hakkını saklı tutar.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-[var(--theme-title-text,var(--primary))]">
                Bağış ve Mali Şeffaflık
              </h2>
              <p className="leading-relaxed">
                Yapılan bağışlar dernek tüzüğünde belirtilen amaçlar
                doğrultusunda kullanılmaktadır. Derneğimiz, yasal yükümlülükler
                çerçevesinde mali tablolarını düzenli olarak yayımlamaktadır.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-[var(--theme-title-text,var(--primary))]">
                İletişim
              </h2>
              <p className="leading-relaxed">
                Bu sayfada yer alan bilgilerle ilgili sorularınız için{" "}
                <Link
                  href="/contacts"
                  className="text-primary hover:underline"
                >
                  iletişim formumuzu
                </Link>{" "}
                kullanabilirsiniz.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-primary">
              ← Ana sayfaya dön
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
