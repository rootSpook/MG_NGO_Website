import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Kullanım Şartları | MG Yaşam Derneği",
  description:
    "Myasthenia Gravis Yaşam Derneği web sitesi kullanım şartları ve koşulları.",
};

const sections = [
  {
    title: "1. Kabul",
    body: "Bu web sitesini kullanarak, aşağıda belirtilen kullanım şartlarını kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız lütfen siteyi kullanmayınız.",
  },
  {
    title: "2. Kullanım Amacı",
    body: "Bu site, Myasthenia Gravis Yaşam Derneği'nin tanıtımı, faaliyetleri hakkında bilgi paylaşımı ve toplulukla iletişim kurulması amacıyla hizmet vermektedir. Site içerikleri yalnızca bilgilendirme amaçlıdır; tıbbi tavsiye niteliği taşımaz.",
  },
  {
    title: "3. Fikri Mülkiyet",
    body: "Sitede yer alan tüm metin, görsel, logo ve diğer içerikler Myasthenia Gravis Yaşam Derneği'ne aittir. İzin alınmadan ticari amaçla kopyalanamaz, dağıtılamaz veya değiştirilemez.",
  },
  {
    title: "4. Sorumluluk Reddi",
    body: "Derneğimiz, sitede yer alan bilgilerin doğruluğu ve güncelliği için azami özeni göstermektedir. Ancak bu bilgilerin eksiksiz veya hatasız olduğunu garanti etmez. Siteyi kullanımdan kaynaklanabilecek doğrudan veya dolaylı zararlardan derneğimiz sorumlu tutulamaz.",
  },
  {
    title: "5. Harici Bağlantılar",
    body: "Sitede üçüncü taraf web sitelerine yönlendiren bağlantılar bulunabilir. Bu bağlantılar yalnızca kullanıcı kolaylığı amacıyla eklenmiş olup derneğimiz söz konusu sitelerin içeriklerinden sorumlu değildir.",
  },
  {
    title: "6. Değişiklikler",
    body: "Derneğimiz, kullanım şartlarını önceden bildirimde bulunmaksızın değiştirme hakkını saklı tutar. Güncel şartlar her zaman bu sayfada yayımlanacaktır.",
  },
  {
    title: "7. Uygulanacak Hukuk",
    body: "Bu kullanım şartları Türkiye Cumhuriyeti hukukuna tabidir. Anlaşmazlıklarda İstanbul mahkemeleri yetkilidir.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="bg-primary py-12 px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              Kullanım Şartları
            </h1>
            <p className="mt-3 text-primary-foreground/80">Son güncelleme: Ocak 2025</p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 md:px-6">
          <div className="space-y-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="mb-3 text-lg font-semibold text-[var(--theme-title-text,var(--primary))]">
                  {s.title}
                </h2>
                <p className="leading-relaxed text-gray-700">{s.body}</p>
              </div>
            ))}
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
