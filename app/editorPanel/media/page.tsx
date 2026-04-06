"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { ChevronRight, ImagePlus, Upload, X } from "lucide-react";
import EditorShell from "@/components/editorPanel/EditorShell";
import { useEditorPanel } from "@/context/EditorPanelContext";
import { MediaItem, MediaVisibility } from "@/types/editorPanel";

const pageOptions = [
  { key: "home-slider", label: "Ana Sayfa Slider" },
  { key: "about-gallery", label: "Hakkımızda Galerisi" },
  { key: "blog-gallery", label: "Bloglar Galerisi" },
  { key: "report-gallery", label: "Raporlar Galerisi" },
  { key: "media-gallery", label: "Medya Galerisi" },
];

interface PendingImage {
  id: string;
  fileName: string;
  previewUrl: string;
}

export default function MediaPage() {
  const { media, addMedia, deleteMedia } = useEditorPanel();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedPageKey, setSelectedPageKey] = useState("home-slider");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["etkinlik"]);
  const [visibility, setVisibility] = useState<MediaVisibility>("public");
  const [featured, setFeatured] = useState(false);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  const selectedPageMedia = useMemo(
    () => media.filter((item) => item.pageKey === selectedPageKey),
    [media, selectedPageKey]
  );

  function resetDraft() {
    setTitle("");
    setDescription("");
    setTagInput("");
    setTags(["etkinlik"]);
    setVisibility("public");
    setFeatured(false);
    setPendingImages([]);
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const nextItems: PendingImage[] = Array.from(files).map((file) => ({
      id: `pending-${Date.now()}-${Math.random()}`,
      fileName: file.name,
      previewUrl: URL.createObjectURL(file),
    }));

    setPendingImages((prev) => [...prev, ...nextItems]);
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function removePendingImage(id: string) {
    setPendingImages((prev) => prev.filter((item) => item.id !== id));
  }

  function addTag() {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((item) => item !== tag));
  }

  function handleAddMedia() {
    if (!selectedPageKey) {
      alert("Lütfen bir sayfa seçin.");
      return;
    }

    if (pendingImages.length === 0) {
      alert("Lütfen en az bir görsel yükleyin.");
      return;
    }

    pendingImages.forEach((image, index) => {
      const newItem: MediaItem = {
        id: `media-${Date.now()}-${index}`,
        pageKey: selectedPageKey,
        title:
          title.trim() || `${getSelectedPageLabel(selectedPageKey)} ${selectedPageMedia.length + index + 1}`,
        description: description.trim(),
        tags,
        visibility,
        featured,
        imageUrl: image.previewUrl,
        createdAt: new Date().toISOString(),
      };

      addMedia(newItem);
    });

    resetDraft();
  }

  return (
    <EditorShell>
      <div className="mx-auto max-w-[1180px]">
        <h1 className="mb-8 text-[52px] font-bold text-black">Medya Yükleme</h1>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
          <section>
            <h2 className="mb-4 text-[22px] font-semibold text-black">Sayfa Seçimi</h2>

            <div className="space-y-3">
              {pageOptions.map((page) => {
                const isActive = selectedPageKey === page.key;

                return (
                  <button
                    key={page.key}
                    onClick={() => setSelectedPageKey(page.key)}
                    className={`flex w-full items-center justify-between rounded-[16px] px-5 py-4 text-left shadow-sm transition ${
                      isActive
                        ? "bg-[#dfe8f5] text-[#2f80ed]"
                        : "bg-[#e8e8e8] text-[#222] hover:bg-[#e2e2e2]"
                    }`}
                  >
                    <span className="text-[18px] font-medium">{page.label}</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </section>

          <section
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex min-h-[250px] flex-col items-center justify-center rounded-[24px] bg-[#dfe8f5] p-8 text-center shadow-sm"
          >
            <Upload className="mb-4 h-10 w-10 text-[#7a7a7a]" />
            <p className="text-[24px] font-semibold text-black">
              Dosyaları buraya sürükleyip bırakın
            </p>
            <p className="my-4 text-[18px] text-[#333]">veya</p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full bg-[#27ae60] px-6 py-3 text-[16px] font-semibold text-white"
            >
              + Dosya Seçin
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
          </section>
        </div>

        <div className="mt-10 border-t border-[#d7d7d7] pt-8">
          <h2 className="mb-4 text-[22px] font-semibold text-black">Medya Detayları</h2>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.9fr]">
            <section>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-[15px] font-medium text-black">
                    Başlık
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ana Sayfa Slider 1"
                    className="h-[48px] w-full rounded-[12px] bg-[#e8e8e8] px-4 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[15px] font-medium text-black">
                    Açıklama
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Opsiyonel açıklama"
                    rows={3}
                    className="w-full rounded-[12px] bg-[#e8e8e8] px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[15px] font-medium text-black">
                    Etiketler
                  </label>

                  <div className="rounded-[12px] bg-[#e8e8e8] px-3 py-3">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-2 rounded-full bg-[#d6d6d6] px-3 py-1 text-[13px] text-[#222]"
                        >
                          {tag}
                          <button onClick={() => removeTag(tag)} type="button">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row">
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="+ Etiket Ekle"
                        className="h-[42px] flex-1 rounded-[10px] bg-[#f3f3f3] px-4 outline-none"
                      />

                      <button
                        type="button"
                        onClick={addTag}
                        className="rounded-[10px] bg-[#d6d6d6] px-4 py-2 text-[14px] text-[#444]"
                      >
                        Ekle
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-[15px] font-medium text-black">
                    Görünürlük
                  </label>

                  <div className="flex gap-8">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="visibility"
                        checked={visibility === "public"}
                        onChange={() => setVisibility("public")}
                        className="h-4 w-4 accent-[#2f80ed]"
                      />
                      <span>Herkese Açık</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="visibility"
                        checked={visibility === "private"}
                        onChange={() => setVisibility("private")}
                        className="h-4 w-4 accent-[#2f80ed]"
                      />
                      <span>Özel</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[15px] text-black">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4 accent-[#2f80ed]"
                    />
                    <span>Öne Çıkar</span>
                  </label>
                </div>

                <div className="pt-6 text-[14px] text-[#555]">
                  {pendingImages.length} dosya yüklemeye hazır.
                </div>
              </div>
            </section>

            <section>
              <div className="grid grid-cols-2 gap-4">
                {selectedPageMedia.map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-[16px] bg-[#e8e8e8] shadow-sm"
                  >
                    <button
                      onClick={() => deleteMedia(item.id)}
                      className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1 shadow"
                      type="button"
                    >
                      <X className="h-4 w-4 text-[#222]" />
                    </button>

                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-[140px] w-full object-cover"
                    />
                  </div>
                ))}

                {pendingImages.map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-[16px] bg-[#e8e8e8] shadow-sm"
                  >
                    <button
                      onClick={() => removePendingImage(item.id)}
                      className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1 shadow"
                      type="button"
                    >
                      <X className="h-4 w-4 text-[#222]" />
                    </button>

                    <img
                      src={item.previewUrl}
                      alt={item.fileName}
                      className="h-[140px] w-full object-cover"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-[140px] flex-col items-center justify-center rounded-[16px] bg-[#dfe8f5] text-center shadow-sm"
                >
                  <ImagePlus className="mb-2 h-8 w-8 text-[#7a7a7a]" />
                  <span className="text-[20px] font-semibold text-[#222]">Ekle</span>
                </button>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetDraft}
                  className="rounded-full border border-[#4c4c4c] bg-white px-8 py-3 text-[15px] font-medium text-[#333]"
                >
                  Sil
                </button>

                <button
                  type="button"
                  onClick={handleAddMedia}
                  className="rounded-full bg-[#27ae60] px-8 py-3 text-[15px] font-semibold text-white"
                >
                  Ekle
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </EditorShell>
  );
}

function getSelectedPageLabel(pageKey: string) {
  return pageOptions.find((page) => page.key === pageKey)?.label ?? "Medya";
}