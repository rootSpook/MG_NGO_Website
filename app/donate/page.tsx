import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getDonationPageData, getDonationIbanEntries, getDonationImpactItems } from "@/lib/publicContent";
import { getEditablePageContent } from "@/lib/publicPagesContent";
import { CopyButton } from "@/components/ui/CopyButton";
import { getImpactIcon } from "@/components/admin/shared/impactIcons";

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
  const [donateData, ibanEntries, pageContent, impactItems] = await Promise.all([
    getDonationPageData(),
    getDonationIbanEntries(),
    getEditablePageContent("bagis"),
    getDonationImpactItems(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-8 md:px-6 md:pt-10">
          <div className="grid items-start gap-8 md:grid-cols-[1fr_320px]">
            <div>
              <h1 className="max-w-xl text-4xl font-bold leading-tight text-[var(--theme-title-text,var(--primary))] md:text-6xl">
                {pageContent.title || donateData.title}
              </h1>
              <p className="mt-5 max-w-2xl text-gray-700">{pageContent.subtitle || donateData.subtitle}</p>

              {/* IBAN entries from Firestore */}
              <div className="mt-7 space-y-4">
                <h2 className="text-lg font-semibold text-[var(--theme-title-text,var(--primary))]">{pageContent.bankTransferTitle}</h2>
                <p className="text-sm text-gray-700">
                  {pageContent.bankTransferDescription}
                </p>

                {ibanEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg bg-white p-5 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-semibold text-primary">
                        {entry.bankName}
                      </span>
                      <span className="rounded-full bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {entry.currency}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold">Hesap Sahibi:</span> {entry.accountHolder}
                      </p>
                      <div className="flex items-center gap-2">
                        <p>
                          <span className="font-semibold">IBAN:</span>{" "}
                          <span className="font-mono">{entry.iban}</span>
                        </p>
                        <CopyButton text={entry.iban} />
                      </div>
                    </div>
                  </div>
                ))}

                {ibanEntries.length === 0 && (
                  <div className="rounded-lg bg-white p-5 shadow-sm text-sm text-gray-500">
                    Banka bilgisi henüz eklenmemiş.
                  </div>
                )}
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
                className="mt-3 h-10 w-full rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary"
              >
                Bagis Yap
              </button>
            </aside>
          </div>
        </section>

        <section className="bg-primary py-12">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="mb-7 text-3xl font-bold text-white md:text-5xl">
              {pageContent.campaignsTitle}
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
                    {campaign.imageUrl ? (
                      <img
                        src={campaign.imageUrl}
                        alt={campaign.title}
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 text-white">
                        <span className="text-xs font-medium uppercase tracking-wide">
                          Görsel yok
                        </span>
                      </div>
                    )}

                    <div className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {campaign.subtitle}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-gray-900">
                        {campaign.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">{campaign.description}</p>

                      <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                        <span>{formatCurrency(campaign.currentAmount)}</span>
                        <span>Hedef: {formatCurrency(campaign.targetAmount)}</span>
                      </div>

                      <Link
                        href={`/donate/${campaign.id}`}
                        className="mt-4 flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary/90"
                      >
                        Bağış Yap
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <h2 className="mb-8 text-3xl font-bold text-[var(--theme-title-text,var(--primary))] md:text-5xl">{pageContent.impactTitle}</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {impactItems.map((item) => {
              const Icon = getImpactIcon(item.icon);
              return (
                <article
                  key={item.id}
                  className="rounded-lg bg-white p-6 text-center shadow-sm"
                >
                  <Icon className="mx-auto h-11 w-11 text-black" />
                  <h3 className="mt-4 text-2xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                </article>
              );
            })}
            {impactItems.length === 0 && (
              <p className="rounded-lg border border-dashed border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-400 md:col-span-3">
                Etki kartı henüz eklenmedi.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
