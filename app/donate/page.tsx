import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getDonationPageData } from "@/lib/publicContent";
import { HeartHandshake, Pill, ScanSearch } from "lucide-react";

export const metadata = {
  title: "Bagis Yap | Myasthenia Gravis Yasam Dernegi",
  description:
    "Topluluk calismalari, farkindalik projeleri ve hasta destek programlari icin bagista bulunun.",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function DonatePage() {
  const donateData = await getDonationPageData();

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-8 md:px-6 md:pt-10">
          <div className="grid items-start gap-8 md:grid-cols-[1fr_320px]">
            <div>
              <h1 className="max-w-xl text-4xl font-bold leading-tight text-teal-700 md:text-6xl">
                {donateData.title}
              </h1>
              <p className="mt-5 max-w-2xl text-gray-700">{donateData.subtitle}</p>

              <div className="mt-7 rounded-lg bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-teal-700">Banka Havalesi ile Bagis</h2>
                <p className="mt-3 text-sm text-gray-700">
                  Bagislariniz dernek faaliyetleri, hasta destek programlari ve farkindalik
                  calismalari icin kullanilir.
                </p>

                <div className="mt-4 space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Banka:</span> {donateData.bankName}
                  </p>
                  <p>
                    <span className="font-semibold">Hesap Adi:</span> {donateData.accountName}
                  </p>
                  <p>
                    <span className="font-semibold">IBAN:</span> {donateData.iban}
                  </p>
                  <p>
                    <span className="font-semibold">SWIFT:</span> {donateData.swiftCode}
                  </p>
                </div>
              </div>
            </div>

            <aside className="rounded-xl bg-[#e5e5e5] p-4 shadow-sm">
              <div className="grid grid-cols-3 gap-2">
                {[100, 200, 500].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className="rounded-md bg-[#d9d9d9] px-3 py-2 text-sm font-medium text-gray-700"
                  >
                    {amount} TL
                  </button>
                ))}
              </div>

              <input
                type="number"
                placeholder="Farkli Tutar Gir"
                className="mt-3 h-10 w-full rounded-md bg-[#d9d9d9] px-3 text-sm outline-none"
              />

              <p className="mt-3 text-xs text-gray-600">{donateData.monthlyMessage}</p>
              <button
                type="button"
                className="mt-3 h-10 w-full rounded-md bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
              >
                Bagis Yap
              </button>
            </aside>
          </div>
        </section>

        <section className="bg-teal-600 py-12">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="mb-7 text-3xl font-bold text-white md:text-5xl">
              Aktif Kampanyalar
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              {donateData.campaigns.map((campaign) => {
                const progress = Math.min(
                  100,
                  (campaign.currentAmount / campaign.targetAmount) * 100
                );

                return (
                  <article
                    key={campaign.id}
                    className="overflow-hidden rounded-lg bg-white shadow-sm"
                  >
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      className="h-44 w-full object-cover"
                    />

                    <div className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                        {campaign.subtitle}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-gray-900">
                        {campaign.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">{campaign.description}</p>

                      <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-teal-600"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                        <span>{formatCurrency(campaign.currentAmount)}</span>
                        <span>Hedef: {formatCurrency(campaign.targetAmount)}</span>
                      </div>

                      <button
                        type="button"
                        className="mt-4 h-10 w-full rounded-md bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
                      >
                        Bagis Yap
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <h2 className="mb-8 text-3xl font-bold text-teal-700 md:text-5xl">Etkiniz</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-lg bg-white p-6 text-center shadow-sm">
              <Pill className="mx-auto h-11 w-11 text-black" />
              <h3 className="mt-4 text-2xl font-semibold text-gray-900">Tibbi Erisim</h3>
              <p className="mt-2 text-sm text-gray-600">
                Hastalarin ihtiyac duydugu tedavi ve ilaclara ulasmasina katki saglar.
              </p>
            </article>

            <article className="rounded-lg bg-white p-6 text-center shadow-sm">
              <HeartHandshake className="mx-auto h-11 w-11 text-black" />
              <h3 className="mt-4 text-2xl font-semibold text-gray-900">Hasta Destegi</h3>
              <p className="mt-2 text-sm text-gray-600">
                Destek gruplari ve danismanlik hizmetlerini finanse eder.
              </p>
            </article>

            <article className="rounded-lg bg-white p-6 text-center shadow-sm">
              <ScanSearch className="mx-auto h-11 w-11 text-black" />
              <h3 className="mt-4 text-2xl font-semibold text-gray-900">Farkindalik</h3>
              <p className="mt-2 text-sm text-gray-600">
                Toplumda erken tani bilincini ve dogru bilgi erisimini guclendirir.
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
