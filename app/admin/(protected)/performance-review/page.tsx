"use client";

import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Users,
  ScrollText,
  Heart,
  Mail,
} from "lucide-react";

const activityItems = [
  {
    label: "Yönetim Kurulu Üyeleri",
    value: "—",
    icon: <Users className="h-5 w-5 text-[#2f80ed]" />,
  },
  {
    label: "Destekçiler",
    value: "—",
    icon: <Heart className="h-5 w-5 text-[#f2994a]" />,
  },
  {
    label: "İletişim Mesajları",
    value: "—",
    icon: <Mail className="h-5 w-5 text-[#27ae60]" />,
  },
  {
    label: "Tüzük Dökümanları",
    value: "—",
    icon: <ScrollText className="h-5 w-5 text-[#9b51e0]" />,
  },
  {
    label: "Aktif Kampanyalar",
    value: "—",
    icon: <BarChart3 className="h-5 w-5 text-[#2f80ed]" />,
  },
];

export default function AdminPerformanceReviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-gray-900">
          Performans Değerlendirmesi
        </h1>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-gray-800">
          Genel Performans Özeti
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Panel Yönetimi" value="Aktif" />
          <StatCard title="İçerik Güncelliği" value="Yüksek" />
          <StatCard title="Yönetilen Modül" value="10" />
          <StatCard title="Sistem Kullanımı" value="Düzenli" />
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-gray-800">
          İçerik Aktivitesi
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activityItems.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-2">
                {item.icon}
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-gray-800">
            Güçlü Yönler
          </h2>
          <div className="space-y-4">
            <ReviewItem text="Menü yönetimi ve içerik düzenlemesi etkin biçimde kullanılmaktadır" />
            <ReviewItem text="Yönetim kurulu ve destekçi bilgileri düzenli olarak güncellenmektedir" />
            <ReviewItem text="Kampanya ve bağış modülleri aktif olarak yönetilmektedir" />
            <ReviewItem text="Tema ve renk ayarları kurumsal kimlikle uyumlu tutulmaktadır" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-gray-800">
            Geliştirilebilecek Alanlar
          </h2>
          <div className="space-y-4">
            <SuggestionItem text="İletişim mesajlarına yanıt süreleri kısaltılabilir" />
            <SuggestionItem text="Kampanya içerikleri için daha sık güncelleme planlanabilir" />
            <SuggestionItem text="Raporlar modülü backend entegrasyonu ile zenginleştirilebilir" />
            <SuggestionItem text="Analitik veriler gerçek zamanlı takip için entegre edilebilir" />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-600">{title}</p>
      <div className="mt-3 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function ReviewItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
      <p className="text-sm leading-6 text-gray-700">{text}</p>
    </div>
  );
}

function SuggestionItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <p className="text-sm leading-6 text-gray-700">{text}</p>
    </div>
  );
}
