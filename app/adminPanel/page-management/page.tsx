"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import AdminShell from "@/components/adminPanel/AdminShell";
import { useAdminPanel } from "@/context/AdminPanelContext";
import { ManagedPageStatus, ManagedPageType } from "@/types/adminPanel";

function formatType(type: ManagedPageType) {
  return type === "donation" ? "Bağış" : "Sayfa";
}

function formatStatus(status: ManagedPageStatus) {
  if (status === "published") return "Yayınlandı";
  if (status === "draft") return "Taslak";
  return "Ekli Değil";
}

export default function PageManagementPage() {
  const { managedPages, addManagedPageToSite } = useAdminPanel();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [extraFilter, setExtraFilter] = useState("");

  const currentPages = managedPages.filter((page) => page.status !== "not-added");
  const availablePages = managedPages.filter((page) => page.status === "not-added");

  const filteredCurrentPages = useMemo(() => {
    return currentPages.filter((page) => {
      const matchesSearch =
        !searchTerm.trim() ||
        page.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || page.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || page.status === statusFilter;

      const matchesExtra =
        !extraFilter.trim() ||
        `${page.name} ${page.updatedAt}`
          .toLowerCase()
          .includes(extraFilter.toLowerCase());

      return matchesSearch && matchesType && matchesStatus && matchesExtra;
    });
  }, [currentPages, searchTerm, typeFilter, statusFilter, extraFilter]);

  return (
    <AdminShell>
      <div className="rounded-[22px] bg-[#f3f3f3]">
        <h1 className="mb-6 text-[44px] font-bold text-black">Sayfa Yönetimi</h1>

        <section className="rounded-[18px] bg-[#e8e8e8] p-6 shadow-md">
          <div className="mb-5 grid gap-3 md:grid-cols-[2fr_0.8fr_0.8fr_0.8fr_auto]">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#888]" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Sayfa Ara"
                className="h-[52px] w-full rounded-[12px] bg-white px-5 pr-12 outline-none shadow-sm"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-[52px] rounded-[12px] bg-white px-4 outline-none shadow-sm"
            >
              <option value="all">Tüm Türler</option>
              <option value="page">Sayfa</option>
              <option value="donation">Bağış</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[52px] rounded-[12px] bg-white px-4 outline-none shadow-sm"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="published">Yayınlandı</option>
              <option value="draft">Taslak</option>
            </select>

            <input
              value={extraFilter}
              onChange={(e) => setExtraFilter(e.target.value)}
              placeholder="Filtrele"
              className="h-[52px] rounded-[12px] bg-white px-4 outline-none shadow-sm"
            />

            <button
              type="button"
              className="rounded-full bg-[#27ae60] px-6 py-3 text-white"
            >
              + Yeni Sayfa Ekle
            </button>
          </div>

          <div className="grid grid-cols-[2fr_1.3fr_1.2fr_1.4fr_1fr] rounded-t-[10px] bg-[#d8d8d8] px-4 py-3 text-[14px] font-semibold">
            <div>Sayfa Adı</div>
            <div>Tür</div>
            <div>Durum</div>
            <div>Son Güncelleme</div>
            <div>İşlemler</div>
          </div>

          <div className="space-y-2">
            {filteredCurrentPages.map((page) => (
              <div
                key={page.id}
                className="grid grid-cols-[2fr_1.3fr_1.2fr_1.4fr_1fr] items-center rounded-[10px] bg-white px-4 py-4"
              >
                <div className="text-[17px] font-medium">{page.name}</div>
                <div>{formatType(page.type)}</div>
                <div>
                  <span
                    className={`rounded-[12px] px-5 py-2 text-white ${
                      page.status === "published"
                        ? "bg-[#27ae60]"
                        : "bg-[#f2994a]"
                    }`}
                  >
                    {formatStatus(page.status)}
                  </span>
                </div>
                <div>{page.updatedAt}</div>
                <div>
                  <Link
                    href={`/adminPanel/page-management/${page.id}/edit`}
                    className="rounded-[12px] bg-[#d8d8d8] px-5 py-2"
                  >
                    Düzenle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-8 border-[#d8d8d8]" />

        <h2 className="mb-4 text-[28px] font-bold text-black">Sayfalar</h2>

        <section className="rounded-[18px] bg-[#e8e8e8] p-6 shadow-md">
          <div className="space-y-2">
            {availablePages.map((page) => (
              <div
                key={page.id}
                className="grid grid-cols-[2fr_1.3fr_1.2fr_1.4fr_1fr] items-center rounded-[10px] bg-white px-4 py-4"
              >
                <div className="text-[17px] font-medium">{page.name}</div>
                <div>{formatType(page.type)}</div>
                <div>
                  <button
                    onClick={() => addManagedPageToSite(page.id)}
                    className="rounded-[12px] bg-[#2f80ed] px-8 py-2 text-white"
                  >
                    Ekle
                  </button>
                </div>
                <div>{page.updatedAt}</div>
                <div>
                  <Link
                    href={`/adminPanel/page-management/${page.id}/edit`}
                    className="rounded-[12px] bg-[#d8d8d8] px-5 py-2"
                  >
                    Düzenle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}