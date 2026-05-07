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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Medya Yükleme</h1>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-800">Sayfa Seçimi</h2>

            <div className="space-y-3">
              {pageOptions.map((page) => {
                const isActive = selectedPageKey === page.key;

                return (
                  <button
                    key={page.key}
                    onClick={() => setSelectedPageKey(page.key)}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition ${
                      isActive
                        ? "bg-blue-50 text-primary"
                        : "bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-sm font-medium">{page.label}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </section>

          <section
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center shadow-sm"
          >
            <Upload className="mb-4 h-10 w-10 text-gray-400" />
            <p className="text-lg font-semibold text-gray-900">
              Dosyaları buraya sürükleyip bırakın
            </p>
            <p className="my-4 text-sm text-gray-600">veya</p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
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

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">Medya Detayları</h2>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.9fr]">
            <section>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Başlık
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ana Sayfa Slider 1"
                    className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Açıklama
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Opsiyonel açıklama"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Etiketler
                  </label>

                  <div className="rounded-lg border border-gray-300 px-3 py-3">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-900"
                        >
                          {tag}
                          <button onClick={() => removeTag(tag)} type="button">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row">
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="+ Etiket Ekle"
                        className="h-10 flex-1 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary"
                      />

                      <button
                        type="button"
                        onClick={addTag}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                      >
                        Ekle
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-900">
                    Görünürlük
                  </label>

                  <div className="flex gap-8">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="visibility"
                        checked={visibility === "public"}
                        onChange={() => setVisibility("public")}
                        className="h-4 w-4 accent-primary"
                      />
                      <span>Herkese Açık</span>
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="visibility"
                        checked={visibility === "private"}
                        onChange={() => setVisibility("private")}
                        className="h-4 w-4 accent-primary"
                      />
                      <span>Özel</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-900">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span>Öne Çıkar</span>
                  </label>
                </div>

                <div className="pt-6 text-sm text-gray-600">
                  {pendingImages.length} dosya yüklemeye hazır.
                </div>
              </div>
            </section>

            <section>
              <div className="grid grid-cols-2 gap-4">
                {selectedPageMedia.map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-lg bg-gray-200 shadow-sm"
                  >
                    <button
                      onClick={() => deleteMedia(item.id)}
                      className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1 shadow"
                      type="button"
                    >
                      <X className="h-4 w-4 text-gray-900" />
                    </button>

                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-28 w-full object-cover"
                    />
                  </div>
                ))}

                {pendingImages.map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-lg bg-gray-200 shadow-sm"
                  >
                    <button
                      onClick={() => removePendingImage(item.id)}
                      className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1 shadow"
                      type="button"
                    >
                      <X className="h-4 w-4 text-gray-900" />
                    </button>

                    <img
                      src={item.previewUrl}
                      alt={item.fileName}
                      className="h-28 w-full object-cover"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-28 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-center shadow-sm hover:bg-gray-100"
                >
                  <ImagePlus className="mb-2 h-6 w-6 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Ekle</span>
                </button>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetDraft}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Sil
                </button>

                <button
                  type="button"
                  onClick={handleAddMedia}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Ekle
                </button>
              </div>
            </section>
          </div>
        </section>
      </div>
    </EditorShell>
  );
}

function getSelectedPageLabel(pageKey: string) {
  return pageOptions.find((page) => page.key === pageKey)?.label ?? "Medya";
}