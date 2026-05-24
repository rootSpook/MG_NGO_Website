"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/firebase/AuthContext";
import {
  LayoutDashboard,
  Home,
  Users,
  Heart,
  Mail,
  ScrollText,
  BarChart2,
  CreditCard,
  LogOut,
  Menu,
  X,
  NavigationIcon,
  Palette,
  Bell,
  UserCircle2,
  CalendarDays,
  ChartNoAxesColumn,
  ImageIcon,
} from "lucide-react";

const EXTRA_PAGE_LABELS: Record<string, string> = {
  "/admin/my-details": "Bilgilerim",
  "/admin/calendar": "Takvim",
  "/admin/performance-review": "Performans Değerlendirmesi",
};

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Ana Sayfa İçeriği", href: "/admin/homepage", icon: Home },
  { label: "Menü Yönetimi", href: "/admin/menu", icon: NavigationIcon },
  { label: "Yönetim Kurulu", href: "/admin/board-members", icon: Users },
  { label: "Destekçiler", href: "/admin/supporters", icon: Heart },
  { label: "İletişim Mesajları", href: "/admin/contacts", icon: Mail },
  { label: "Tüzük", href: "/admin/bylaws", icon: ScrollText },
  { label: "Raporlar", href: "/admin/reports", icon: BarChart2 },
  { label: "IBAN Bilgileri", href: "/admin/iban", icon: CreditCard },
  { label: "Tema & Renkler", href: "/admin/theme", icon: Palette },
  { label: "Site Logosu", href: "/admin/branding", icon: ImageIcon },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [staffPhoto, setStaffPhoto] = useState<string | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setStaffPhoto(localUrl);
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
          collapsed ? "w-18" : "w-60"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
          {!collapsed && (
            <span className="text-sm font-bold text-primary">Admin Panel</span>
          )}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-secondary/50 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 px-2 py-4">
          <div className={`flex ${collapsed ? "justify-center" : "items-center gap-3 px-3 mb-3"}`}>
            <label
              htmlFor="admin-photo-upload"
              className="relative cursor-pointer"
              title="Fotoğrafı değiştir"
            >
              {staffPhoto ? (
                <img
                  src={staffPhoto}
                  alt="Profil"
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {user?.email?.[0]?.toUpperCase() ?? "A"}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-white">✎</span>
            </label>
            <input
              id="admin-photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              ref={fileInputRef}
            />
            {!collapsed && (
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            )}
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
          <span className="text-sm font-semibold text-gray-700">
            {EXTRA_PAGE_LABELS[pathname] ??
              navItems.find((i) =>
                i.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === i.href || pathname.startsWith(i.href + "/")
              )?.label ??
              "Admin Panel"}
          </span>

          <div ref={profileRef} className="relative flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
              aria-label="Bildirimler"
            >
              <Bell className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              type="button"
            >
              <UserCircle2 className="h-5 w-5 text-gray-400" />
              <span className="max-w-[120px] truncate">{user?.email ?? "Admin"}</span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-[220px] rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                <Link
                  href="/admin/my-details"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserCircle2 className="h-4 w-4 text-gray-400" />
                  <span>Bilgilerim</span>
                </Link>
                <Link
                  href="/admin/calendar"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  <span>Takvim</span>
                </Link>
                <Link
                  href="/admin/performance-review"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ChartNoAxesColumn className="h-4 w-4 text-gray-400" />
                  <span>Performans Değerlendirmesi</span>
                </Link>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
