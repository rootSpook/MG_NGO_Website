import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Gizlilik Politikası | MG Yaşam Derneği",
  description:
    "Myasthenia Gravis Yaşam Derneği kişisel veri işleme ve gizlilik politikası (KVKK).",
};

const sections = [
  {
    title: "1. Veri Sorumlusu",
    body: "Myasthenia Gravis Yaşam Derneği olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla hareket etmekteyiz. Kişisel verileriniz, derneğimiz tarafından aşağıda açıklanan amaçlar ve yöntemler çerçevesinde işlenmektedir.",
  },
  {
    title: "2. İşlenen Kişisel Veriler",
    body: "Web sitemiz aracılığıyla; iletişim formları ve gönüllü başvuru formları üzerinden ad-soyad, e-posta adresi, telefon numarası ve ikamet şehri bilgileri toplanmaktadır. Bunların yanı sıra, teknik altyapı kapsamında IP adresi ve tarayıcı bilgileri de işlenebilmektedir.",
  },
  {
    title: "3. Kişisel Verilerin İşlenme Amaçları",
    body: "Toplanan kişisel veriler; iletişim taleplerinizin karşılanması, gönüllü başvurularının değerlendirilmesi, dernek faaliyetleri hakkında bilgilendirme yapılması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.",
  },
  {
    title: "4. Kişisel Verilerin Aktarımı",
    body: "Kişisel verileriniz, açık rızanız olmaksızın üçüncü taraflara aktarılmamaktadır. Verilerin işlenmesinde yalnızca hizmet alınan teknik altyapı sağlayıcıları (bulut depolama, e-posta servisi gibi) veri işleyen sıfatıyla yer almakta olup bu sağlayıcılar gizlilik yükümlülükleriyle bağlıdır.",
  },
  {
    title: "5. Veri Saklama Süresi",
    body: "Kişisel verileriniz, işlenme amacının ortadan kalkmasının ardından veya yasal saklama sürelerinin dolmasıyla birlikte silinmekte, yok edilmekte ya da anonim hale getirilmektedir.",
  },
  {
    title: "6. İlgili Kişi Hakları",
    body: "KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmesi hâlinde düzeltilmesini isteme ve belirli koşullar altında silinmesini ya da yok edilmesini talep etme haklarına sahipsiniz.",
  },
  {
    title: "7. İletişim",
    body: "Kişisel verilerinizle ilgili her türlü soru ve talebiniz için iletişim formu aracılığıyla veya info@mg.org.tr e-posta adresi üzerinden derneğimizle iletişime geçebilirsiniz.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="bg-primary py-12 px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              Gizlilik Politikası
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
