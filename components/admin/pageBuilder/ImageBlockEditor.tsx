"use client";

import type { ImageBlockData } from "@/types/pageBuilder";
import { ImageUploadField } from "@/components/admin/shared/ImageUploadField";

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

const selectCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

interface ImageBlockEditorProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export function ImageBlockEditor({ data, onChange }: ImageBlockEditorProps) {
  const d: ImageBlockData = {
    imageUrl: "",
    altText: "",
    caption: "",
    width: "container",
    alignment: "center",
    ...(data as Partial<ImageBlockData>),
  };

  function set<K extends keyof ImageBlockData>(key: K, value: ImageBlockData[K]) {
    onChange({ ...d, [key]: value });
  }

  return (
    <div className="space-y-4">
      {/* Image upload */}
      <ImageUploadField
        label="Görsel"
        value={d.imageUrl}
        onChange={(url) => set("imageUrl", url)}
        hint="Firebase Storage'a yüklenir. PNG, JPG, WebP desteklenir."
      />

      {/* Alt text */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Alt Metin <span className="text-gray-400 font-normal">(erişilebilirlik için)</span>
        </label>
        <input
          className={inputCls}
          placeholder="Görseli kısaca açıklayın"
          value={d.altText}
          onChange={(e) => set("altText", e.target.value)}
        />
      </div>

      {/* Caption */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Açıklama Yazısı <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
        </label>
        <input
          className={inputCls}
          placeholder="Görselin altında görünecek kısa açıklama"
          value={d.caption ?? ""}
          onChange={(e) => set("caption", e.target.value)}
        />
      </div>

      {/* Width + alignment */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Genişlik</label>
          <select
            className={selectCls}
            value={d.width}
            onChange={(e) => set("width", e.target.value as ImageBlockData["width"])}
          >
            <option value="narrow">Dar (640 px)</option>
            <option value="container">Normal (sayfa genişliği)</option>
            <option value="full">Tam ekran genişliği</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Hizalama</label>
          <select
            className={selectCls}
            value={d.alignment}
            onChange={(e) => set("alignment", e.target.value as ImageBlockData["alignment"])}
          >
            <option value="left">Sol</option>
            <option value="center">Orta</option>
            <option value="right">Sağ</option>
          </select>
        </div>
      </div>
    </div>
  );
}
