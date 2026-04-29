"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Newspaper,
  CalendarDays,
  Megaphone,
  Mail,
  Users,
  Home,
  FileText,
  ScrollText,
  BarChart2,
  CreditCard,
  Navigation,
  AlertTriangle,
} from "lucide-react";
import { getAdminDashboardStats, AdminDashboardStats } from "@/lib/firebase/adminServices";
import { useAuth } from "@/lib/firebase/AuthContext";

const statCards = (s: AdminDashboardStats) => [
  {
    label: "Blog Yazısı",
    value: s.totalBlogs,
    sub: `${s.publishedBlogs} yayında`,
    icon: Newspaper,
    color: "bg-blue-50 text-blue-700",
  },
  {
    label: "Etkinlik",
    value: s.totalEvents,
    sub: "toplam",
    icon: CalendarDays,
    color: "bg-green-50 text-green-700",
  },
  {
    label: "Duyuru",
    value: s.totalAnnouncements,
    sub: "toplam",
    icon: Megaphone,
    color: "bg-yellow-50 text-yellow-700",
  },
  {
    label: "Yeni Mesaj",
    value: s.pendingMessages,
    sub: "cevaplanmadı",
    icon: Mail,
    color: "bg-red-50 text-red-700",
  },
  {
    label: "Gönüllü Başvurusu",
    value: s.pendingVolunteers,
    sub: "bekliyor",
    icon: Users,
    color: "bg-purple-50 text-purple-700",
  },
];

const quickLinks = [
  { label: "Ana Sayfa İçeriği", href: "/admin/homepage", icon: Home, color: "bg-teal-50 hover:bg-teal-100 text-teal-700" },
  { label: "Menü Yönetimi", href: "/admin/menu", icon: Navigation, color: "bg-violet-50 hover:bg-violet-100 text-violet-700" },
  { label: "Yönetim Kurulu", href: "/admin/board-members", icon: Users, color: "bg-blue-50 hover:bg-blue-100 text-blue-700" },
  { label: "Destekçiler", href: "/admin/supporters", icon: Users, color: "bg-green-50 hover:bg-green-100 text-green-700" },
  { label: "İletişim Mesajları", href: "/admin/contacts", icon: Mail, color: "bg-red-50 hover:bg-red-100 text-red-700" },
  { label: "Sayfa Yönetimi", href: "/admin/pages", icon: FileText, color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700" },
  { label: "Tüzük", href: "/admin/bylaws", icon: ScrollText, color: "bg-orange-50 hover:bg-orange-100 text-orange-700" },
  { label: "Raporlar", href: "/admin/reports", icon: BarChart2, color: "bg-slate-50 hover:bg-slate-100 text-slate-700" },
  { label: "IBAN Bilgileri", href: "/admin/iban", icon: CreditCard, color: "bg-yellow-50 hover:bg-yellow-100 text-yellow-700" },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    getAdminDashboardStats()
      .then((data) => {
        setStats(data);
        setPermissionError(false);
      })
      .catch((err: unknown) => {
        const code = (err as { code?: string })?.code;
        if (code === "permission-denied") {
          setPermissionError(true);
        } else {
          // Use warn so Turbopack dev overlay is not triggered
          console.warn("[Admin] Dashboard stats unavailable:", (err as Error)?.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Site içeriklerine genel bakış</p>
      </div>

      {/* Firestore permissions error — shown when cloud rules deny access */}
      {permissionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-red-800">
                Firestore erişim hatası — Eksik izinler
              </p>
              <p className="text-red-700">
                Giriş yapılan hesap ({user?.email}) için Firestore&apos;da
                gerekli yetki belgesi bulunamadı veya kurallar henüz yayınlanmadı.
              </p>
              <p className="font-medium text-red-800 mt-2">Çözüm adımları:</p>
              <ol className="list-decimal list-inside space-y-1 text-red-700">
                <li>
                  <strong>Firebase Console → Firestore Database</strong> bölümüne gidin.
                </li>
                <li>
                  <code className="rounded bg-red-100 px-1 font-mono">staff</code>{" "}
                  koleksiyonunda giriş yaptığınız Firebase Auth UID&apos;iniz ile
                  bir belge oluşturun.
                </li>
                <li>
                  Belgeye{" "}
                  <code className="rounded bg-red-100 px-1 font-mono">role: &quot;admin&quot;</code>{" "}
                  alanı ekleyin.
                </li>
                <li>
                  Firestore güvenlik kurallarını dağıtın:{" "}
                  <code className="rounded bg-red-100 px-1 font-mono">
                    firebase deploy --only firestore:rules
                  </code>
                </li>
              </ol>
              <p className="text-xs text-red-500 mt-1">
                Auth UID: <code className="font-mono">{user?.uid}</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-200" />
            ))
          : stats &&
            statCards(stats).map(({ label, value, sub, icon: Icon, color }) => (
              <div
                key={label}
                className={`rounded-xl p-5 shadow-sm ${color.split(" ")[0]}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                  <Icon className={`h-5 w-5 ${color.split(" ")[1]}`} />
                </div>
                <p className={`mt-2 text-3xl font-bold ${color.split(" ")[1]}`}>
                  {value}
                </p>
                <p className="mt-1 text-xs text-gray-500">{sub}</p>
              </div>
            ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Hızlı Erişim</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(({ label, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl p-4 font-medium transition ${color}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Editor panel shortcut */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-1 text-base font-semibold text-gray-800">
          Editör Paneli
        </h2>
        <p className="mb-3 text-sm text-gray-500">
          Blog yazıları, etkinlikler, duyurular ve medya için editör panelini kullanın.
        </p>
        <Link
          href="/editorPanel/dashboard"
          className="inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Editör Paneline Git →
        </Link>
      </div>
    </div>
  );
}
