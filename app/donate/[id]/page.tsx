import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getDonationCampaignById, getDonationPageData } from "@/lib/publicContent";
import { CampaignDonationForm } from "@/components/donate/CampaignDonationForm";
import Link from "next/link";

interface CampaignDonationPageProps {
  params: Promise<{ id: string }>;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function generateMetadata({ params }: CampaignDonationPageProps) {
  const { id } = await params;
  const campaign = await getDonationCampaignById(id);
  if (!campaign) return { title: "Kampanya Bulunamadı" };
  return {
    title: `${campaign.title} | Bağış | MG Yaşam Derneği`,
    description: campaign.description,
  };
}

export default async function CampaignDonationPage({ params }: CampaignDonationPageProps) {
  const { id } = await params;
  const campaign = await getDonationCampaignById(id);
  if (!campaign) notFound();

  // Pull the monthly message from the donation page settings so the layout
  // stays consistent with the campaigns list page.
  const donationData = await getDonationPageData();

  const progress = Math.min(
    100,
    campaign.targetAmount > 0
      ? (campaign.currentAmount / campaign.targetAmount) * 100
      : 0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-5 text-sm text-gray-500">
            <Link href="/donate" className="hover:text-teal-600 hover:underline">
              Bağış Yap
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{campaign.title}</span>
          </nav>

          <div className="grid items-start gap-8 md:grid-cols-[1.1fr_360px]">
            {/* Campaign info */}
            <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {campaign.imageUrl ? (
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="h-64 w-full object-cover md:h-80"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 text-sm font-medium uppercase tracking-wide text-white md:h-80">
                  {campaign.title}
                </div>
              )}

              <div className="p-6 md:p-8">
                {campaign.subtitle && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                    {campaign.subtitle}
                  </p>
                )}
                <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                  {campaign.title}
                </h1>

                <div className="mt-5">
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-teal-600"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                    <span>{formatCurrency(campaign.currentAmount)}</span>
                    <span>Hedef: {formatCurrency(campaign.targetAmount)}</span>
                  </div>
                </div>

                {campaign.description && (
                  <div className="mt-6 space-y-3 text-gray-700 leading-relaxed">
                    {campaign.description.split("\n").map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                )}

                <p className="mt-6 text-xs text-gray-400">
                  {donationData.monthlyMessage}
                </p>
              </div>
            </article>

            {/* Donation form */}
            <aside className="rounded-2xl bg-white p-5 shadow-sm md:sticky md:top-6">
              <h2 className="mb-4 text-lg font-semibold text-teal-700">
                Bu kampanyaya bağış yap
              </h2>
              <CampaignDonationForm
                campaignId={campaign.id}
                campaignTitle={campaign.title}
              />
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
