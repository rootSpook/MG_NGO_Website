"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { EventItem } from "@/types/editorPanel";

type EventFormMode = "create" | "edit";

interface EventFormProps {
  mode: EventFormMode;
  initialData?: EventItem;
  onSubmit: (data: EventItem) => void;
  onClear?: () => void;
}

const typeOptions = [
  "Webinar",
  "Farkındalık",
  "Workshop",
  "Destek Grubu",
  "Konferans",
];

const venueOptions = [
  "Hastane",
  "STK Ofisi",
  "Konferans Salonu",
  "Online",
  "Üniversite Kampüsü",
  "Toplum Merkezi",
];

const monthOptions = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function getMonthNameFromDate(dateValue: string) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  return monthOptions[date.getMonth()] || "";
}

export default function EventForm({
  mode,
  initialData,
  onSubmit,
  onClear,
}: EventFormProps) {
  const initialForm = useMemo(
    () => ({
      id: initialData?.id ?? `event-${Date.now()}`,
      title: initialData?.title ?? "",
      date: initialData?.date ?? "",
      endDate: initialData?.endDate ?? "",
      location: initialData?.location ?? "",
      city: initialData?.city ?? "",
      venue: initialData?.venue ?? "",
      type: initialData?.type ?? "",
      capacity: initialData?.capacity ?? 0,
      isOnline: initialData?.isOnline ?? false,
      status: initialData?.status ?? "planned",
      attachmentUrl: initialData?.attachmentUrl ?? "",
      attachmentName: initialData?.attachmentName ?? "",
    }),
    [initialData]
  );

  const [formData, setFormData] = useState<EventItem>(initialForm);
  const [startMonth, setStartMonth] = useState(
    getMonthNameFromDate(initialData?.date ?? "")
  );
  const [endMonth, setEndMonth] = useState(
    getMonthNameFromDate(initialData?.endDate ?? "")
  );

  function handleChange<K extends keyof EventItem>(key: K, value: EventItem[K]) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleReset() {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
      setStartMonth(getMonthNameFromDate(initialData.date));
      setEndMonth(getMonthNameFromDate(initialData.endDate ?? ""));
    } else {
      setFormData({
        id: `event-${Date.now()}`,
        title: "",
        date: "",
        endDate: "",
        location: "",
        city: "",
        venue: "",
        type: "",
        capacity: 0,
        isOnline: false,
        status: "planned",
        attachmentUrl: "",
        attachmentName: "",
      });
      setStartMonth("");
      setEndMonth("");
    }

    onClear?.();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.city || !formData.type) {
      alert("Lütfen gerekli alanları doldurun.");
      return;
    }

    const locationValue =
      formData.isOnline || formData.city === "Online"
        ? "Online"
        : `${formData.city} ${formData.venue || "Etkinlik Alanı"}`;

    onSubmit({
      ...formData,
      location: locationValue,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[24px] bg-[#efefef] p-6 shadow-md"
    >
      <h2 className="mb-6 text-[22px] font-semibold text-black">Filtre</h2>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Etkinlik Adı
            </label>
            <input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Etkinlik adını girin"
              className="h-[48px] w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Şehir
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Şehir adını yazın (örn. İstanbul)"
              className="h-[48px] w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => {
                handleChange("date", e.target.value);
                setStartMonth(getMonthNameFromDate(e.target.value));
              }}
              className="h-[48px] w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Ay
            </label>
            <div className="relative">
              <select
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                className="h-[48px] w-full appearance-none rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
              >
                <option value="">Seçiniz</option>
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f80ed]" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              value={formData.endDate ?? ""}
              onChange={(e) => {
                handleChange("endDate", e.target.value);
                setEndMonth(getMonthNameFromDate(e.target.value));
              }}
              className="h-[48px] w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Ay
            </label>
            <div className="relative">
              <select
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                className="h-[48px] w-full appearance-none rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
              >
                <option value="">Seçiniz</option>
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f80ed]" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Kapasite
            </label>
            <input
              type="number"
              min={0}
              value={formData.capacity}
              onChange={(e) => handleChange("capacity", Number(e.target.value))}
              placeholder="Katılımcı kapasitesi"
              className="h-[48px] w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Tür
            </label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {typeOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 text-[14px]">
                  <input
                    type="radio"
                    name="eventType"
                    checked={formData.type === option}
                    onChange={() => handleChange("type", option)}
                    className="h-4 w-4 accent-[#2f80ed]"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Mekan
            </label>
            <div className="relative">
              <select
                value={formData.venue}
                onChange={(e) => handleChange("venue", e.target.value)}
                className="h-[48px] w-full appearance-none rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
              >
                <option value="">Seçiniz</option>
                {venueOptions.map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f80ed]" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Online
            </label>
            <div className="flex gap-8">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="online"
                  checked={formData.isOnline === true}
                  onChange={() => handleChange("isOnline", true)}
                  className="h-4 w-4 accent-[#2f80ed]"
                />
                <span>Evet</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="online"
                  checked={formData.isOnline === false}
                  onChange={() => handleChange("isOnline", false)}
                  className="h-4 w-4 accent-[#2f80ed]"
                />
                <span>Hayır</span>
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Durum
            </label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) =>
                  handleChange(
                    "status",
                    e.target.value as EventItem["status"]
                  )
                }
                className="h-[48px] w-full appearance-none rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
              >
                <option value="planned">Planlandı</option>
                <option value="active">Aktif</option>
                <option value="done">Tamamlandı</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f80ed]" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Konum Açıklaması
            </label>
            <input
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Örn. İstanbul Toplum Merkezi"
              className="h-[48px] w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              PDF Dosyası
            </label>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  handleChange("attachmentUrl", String(reader.result ?? ""));
                  handleChange("attachmentName", file.name);
                };
                reader.readAsDataURL(file);
              }}
              className="block w-full text-[14px] text-[#333]"
            />
            {formData.attachmentUrl && (
              <div className="mt-2 flex items-center justify-between rounded-lg bg-white px-3 py-2 text-[13px] text-[#555]">
                <a href={formData.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-teal-700 underline">
                  {formData.attachmentName || "PDF dosyasını görüntüle"}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    handleChange("attachmentUrl", "");
                    handleChange("attachmentName", "");
                  }}
                  className="text-red-600"
                >
                  Sil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end gap-4">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-[#4a4a4a] bg-white px-8 py-3 text-[15px] font-medium text-[#333]"
        >
          Temizle
        </button>

        <button
          type="submit"
          className="rounded-full bg-[#27ae60] px-10 py-3 text-[15px] font-semibold text-white"
        >
          {mode === "create" ? "EKLE" : "KAYDET"}
        </button>
      </div>
    </form>
  );
}
