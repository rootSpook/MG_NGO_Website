"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
} from "lucide-react";

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
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
          collapsed ? "w-18" : "w-60"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
          {!collapsed && (
            <span className="text-sm font-bold text-teal-700">Admin Panel</span>
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
                    ? "bg-teal-50 text-teal-700"
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
          {!collapsed && (
            <p className="mb-2 truncate px-3 text-xs text-gray-400">
              {user?.email}
            </p>
          )}
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
        <header className="flex h-14 items-center border-b border-gray-200 bg-white px-6">
          <span className="text-sm font-semibold text-gray-700">
            {navItems.find((i) =>
              i.href === "/admin"
                ? pathname === "/admin"
                : pathname === i.href || pathname.startsWith(i.href + "/")
            )?.label ?? "Admin Panel"}
          </span>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
