"use client";

import { useEffect, useState } from "react";
import { ImageUploadWithUrl } from "@/components/admin/shared/ImageUploadWithUrl";
import { getAdminSiteSettings, updateAdminSiteSettings } from "@/lib/firebase/adminServices";
import { revalidatePublicPathAction } from "@/app/admin/actions";

export default function BrandingPage() {
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    getAdminSiteSettings()
      .then((s) => setLogoUrl(s.logoUrl ?? ""))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      await updateAdminSiteSettings({ logoUrl: logoUrl || null });
      await revalidatePublicPathAction("/");
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-lg space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-32 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Logosu</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sitenin başlığında görünecek logoyu yükleyin. Boş bırakılırsa varsayılan SVG logo gösterilir.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <ImageUploadWithUrl
          label="Logo"
          value={logoUrl}
          onChange={setLogoUrl}
          placeholder="https://…"
          previewClassName="h-14 w-auto max-w-[240px] object-contain"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {status === "success" && (
          <span className="text-sm text-green-600">Logo kaydedildi.</span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-500">Hata oluştu, tekrar deneyin.</span>
        )}
      </div>
    </div>
  );
}
