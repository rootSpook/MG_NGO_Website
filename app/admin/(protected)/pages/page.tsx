"use client";

import Link from "next/link";
import { NavigationIcon, ArrowRight, Info } from "lucide-react";

/**
 * Sayfa Yönetimi artık Menü Yönetimi içindeki blok editörüyle birleştirilmiştir.
 * Bu sayfa yalnızca yönlendirme amacıyla korunmaktadır.
 */
export default function PageManagementRedirectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sayfa Yönetimi</h1>
        <p className="mt-1 text-sm text-gray-500">Bu bölüm artık Menü Yönetimi ile birleştirildi.</p>
      </div>

      <div className="flex items-start gap-4 rounded-xl border border-blue-200 bg-blue-50 px-5 py-5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
        <div className="space-y-2">
          <p className="font-semibold text-blue-800">Sayfa editörü taşındı</p>
          <p className="text-sm text-blue-700">
            Tüm CMS sayfaları artık <strong>Menü Yönetimi → İçeriği Yönet</strong> yoluyla
            blok tabanlı editörden düzenlenmektedir.
            Her menü öğesinde <strong>"İçeriği Yönet"</strong> butonuna tıklayarak
            o sayfanın blok editörüne ulaşabilirsiniz.
          </p>
          <p className="text-sm text-blue-700">
            Yeni bir sayfa oluşturmak için Menü Yönetimi sayfasındaki{" "}
            <strong>"Yeni Sayfa Ekle"</strong> butonunu kullanın.
          </p>
        </div>
      </div>

      <Link
        href="/admin/menu"
        className="flex items-center justify-between rounded-xl border border-teal-200 bg-white px-5 py-4 shadow-sm hover:border-teal-400 hover:bg-teal-50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
            <NavigationIcon className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-teal-700">Menü Yönetimi</p>
            <p className="text-xs text-gray-400">Tüm sayfaları buradan yönetin</p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-teal-500" />
      </Link>
    </div>
  );
}
