"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Save, RotateCcw, GripVertical } from "lucide-react";
import {
  DEFAULT_NAV_ITEMS,
  getNavConfig,
  saveNavConfig,
  type NavItem,
} from "@/lib/firebase/navServices";

export default function MenuManagementPage() {
  const [items, setItems] = useState<NavItem[]>(DEFAULT_NAV_ITEMS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getNavConfig()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function toggleVisibility(key: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, isVisible: !item.isVisible } : item
      )
    );
    setSaved(false);
  }

  function moveItem(index: number, direction: "up" | "down") {
    const next = [...items];
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    next.forEach((item, i) => { item.sortOrder = i + 1; });
    setItems(next);
    setSaved(false);
  }

  function handleReset() {
    setItems(DEFAULT_NAV_ITEMS.map((item, i) => ({ ...item, sortOrder: i + 1 })));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveNavConfig(items);
      setSaved(true);
    } catch (err) {
      console.error(err);
      alert("Kaydetme sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  const visibleCount = items.filter((i) => i.isVisible).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menü Yönetimi</h1>
          <p className="mt-1 text-sm text-gray-500">
            Siteнin gezinti menüsündeki bağlantıların görünürlüğünü ve sırasını yönetin.
            Değişiklikler kaydedildiğinde tüm ziyaretçilere anında yansır.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            Varsayılan
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Kaydediliyor…" : saved ? "Kaydedildi ✓" : "Kaydet"}
          </button>
        </div>
      </div>

      {/* Summary banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <span className="font-semibold">{visibleCount}</span> / {items.length} menü öğesi görünür durumda.
        {visibleCount === 0 && (
          <span className="ml-2 font-medium text-red-600">
            Uyarı: Tüm öğeler gizlendi. Ziyaretçiler hiçbir sayfaya erişemeyecek!
          </span>
        )}
      </div>

      {/* Nav items list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.key}
              className={`flex items-center gap-4 rounded-xl border px-4 py-3 shadow-sm transition-colors ${
                item.isVisible
                  ? "border-gray-200 bg-white"
                  : "border-gray-100 bg-gray-50 opacity-60"
              }`}
            >
              {/* Drag handle / order buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                  className="rounded p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"
                  title="Yukarı taşı"
                >
                  <GripVertical className="h-4 w-4 rotate-90" />
                </button>
                <button
                  onClick={() => moveItem(index, "down")}
                  disabled={index === items.length - 1}
                  className="rounded p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"
                  title="Aşağı taşı"
                >
                  <GripVertical className="h-4 w-4 -rotate-90" />
                </button>
              </div>

              {/* Order badge */}
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                {index + 1}
              </span>

              {/* Label & href */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  {item.label}
                  {item.isDonateButton && (
                    <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-700">
                      Buton
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400">{item.href}</p>
              </div>

              {/* Visibility status */}
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  item.isVisible
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {item.isVisible ? "Görünür" : "Gizli"}
              </span>

              {/* Toggle button */}
              <button
                onClick={() => toggleVisibility(item.key)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  item.isVisible
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-green-200 text-green-600 hover:bg-green-50"
                }`}
              >
                {item.isVisible ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Gizle
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Göster
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Help text */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="font-semibold mb-1">Önemli Notlar:</p>
        <ul className="list-disc list-inside space-y-1 text-amber-700">
          <li>Gizlenen menü öğeleri gezinti çubuğundan kaldırılır, ancak URL ile doğrudan erişim yine de mümkündür.</li>
          <li>Bir modülü tamamen devre dışı bırakmak için hem menüden gizleyin hem de içerik yayınlamayı durdurun.</li>
          <li>Sıralama değişiklikleri "Kaydet" düğmesine basıldıktan sonra uygulanır.</li>
        </ul>
      </div>
    </div>
  );
}
