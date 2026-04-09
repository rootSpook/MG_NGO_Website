"use client";

import {
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  Megaphone,
  CalendarCheck2,
} from "lucide-react";
import EditorShell from "@/components/editorPanel/EditorShell";
import { useEditorPanel } from "@/context/EditorPanelContext";

export default function PerformanceReviewPage() {
  const { blogs, events, announcements, media } = useEditorPanel();

  const publishedBlogs = blogs.filter((item) => item.status === "published").length;
  const draftBlogs = blogs.filter((item) => item.status === "draft").length;
  const plannedEvents = events.filter((item) => item.status === "planned").length;
  const publishedAnnouncements = announcements.filter(
    (item) => item.status === "published"
  ).length;
  const totalMedia = media.length;

  const activityItems = [
    {
      label: "Yayınlanan blog yazıları",
      value: publishedBlogs,
      icon: <FileText className="h-5 w-5 text-[#2f80ed]" />,
    },
    {
      label: "Taslak blog yazıları",
      value: draftBlogs,
      icon: <Clock3 className="h-5 w-5 text-[#f2994a]" />,
    },
    {
      label: "Planlanan etkinlikler",
      value: plannedEvents,
      icon: <CalendarCheck2 className="h-5 w-5 text-[#27ae60]" />,
    },
    {
      label: "Yayınlanan duyurular",
      value: publishedAnnouncements,
      icon: <Megaphone className="h-5 w-5 text-[#9b51e0]" />,
    },
    {
      label: "Toplam medya içeriği",
      value: totalMedia,
      icon: <BarChart3 className="h-5 w-5 text-[#2f80ed]" />,
    },
  ];

  return (
    <EditorShell>
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 flex items-center gap-3">
          <BarChart3 className="h-10 w-10 text-[#2f80ed]" />
          <h1 className="text-[52px] font-bold text-black">
            Performans Değerlendirmesi
          </h1>
        </div>

        <section className="rounded-[24px] bg-[#e8e8e8] p-6 shadow-md">
          <h2 className="mb-5 text-[24px] font-semibold text-black">
            Genel Performans Özeti
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="İçerik Üretimi" value="Yüksek" />
            <StatCard title="Güncellik" value="Aktif" />
            <StatCard title="Yönetilen Modül" value="5" />
            <StatCard title="Panel Kullanımı" value="Düzenli" />
          </div>
        </section>

        <section className="mt-7 rounded-[24px] bg-[#e8e8e8] p-6 shadow-md">
          <h2 className="mb-5 text-[24px] font-semibold text-black">
            İçerik Aktivitesi
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activityItems.map((item) => (
              <div
                key={item.label}
                className="rounded-[18px] bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  {item.icon}
                  <span className="text-[15px] text-[#666]">{item.label}</span>
                </div>
                <div className="text-[32px] font-bold text-black">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[24px] bg-[#e8e8e8] p-6 shadow-md">
            <h2 className="mb-5 text-[24px] font-semibold text-black">
              Güçlü Yönler
            </h2>

            <div className="space-y-4">
              <ReviewItem text="Panel üzerinde farklı içerik türlerini yönetebilme" />
              <ReviewItem text="Etkinlik ve blog içeriklerinde düzenli güncelleme" />
              <ReviewItem text="Takvim ve medya alanlarında aktif kullanım" />
              <ReviewItem text="Duyuru yönetiminde hedef kitle odaklı planlama" />
            </div>
          </div>

          <div className="rounded-[24px] bg-[#e8e8e8] p-6 shadow-md">
            <h2 className="mb-5 text-[24px] font-semibold text-black">
              Geliştirilebilecek Alanlar
            </h2>

            <div className="space-y-4">
              <SuggestionItem text="İçerikler için daha fazla kategorik ayrım eklenebilir" />
              <SuggestionItem text="Medya öğeleri için gelişmiş filtreleme eklenebilir" />
              <SuggestionItem text="Duyurular için tarih bazlı planlama daha ayrıntılı hale getirilebilir" />
              <SuggestionItem text="Analitik özetler backend entegrasyonu sonrası gerçek verilerle güçlendirilebilir" />
            </div>
          </div>
        </section>
      </div>
    </EditorShell>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-white p-5 shadow-sm">
      <p className="text-[15px] text-[#666]">{title}</p>
      <div className="mt-3 text-[30px] font-bold text-black">{value}</div>
    </div>
  );
}

function ReviewItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[16px] bg-white p-4 shadow-sm">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#27ae60]" />
      <p className="text-[15px] leading-6 text-[#444]">{text}</p>
    </div>
  );
}

function SuggestionItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[16px] bg-white p-4 shadow-sm">
      <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#f2994a]" />
      <p className="text-[15px] leading-6 text-[#444]">{text}</p>
    </div>
  );
}