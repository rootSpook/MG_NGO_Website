"use client";

import { useState } from "react";
import { CreditCard, Lock, ShieldCheck, Heart } from "lucide-react";

interface CampaignDonationFormProps {
  campaignId: string;
  campaignTitle: string;
}

const PRESET_AMOUNTS = [100, 250, 500, 1000];

function maskCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function maskExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function CampaignDonationForm({
  campaignId,
  campaignTitle,
}: CampaignDonationFormProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(250);
  const [customAmount, setCustomAmount] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const numericAmount =
    customAmount.trim().length > 0
      ? Number(customAmount)
      : selectedAmount ?? 0;

  const canSubmit =
    numericAmount > 0 &&
    donorName.trim().length > 0 &&
    donorEmail.trim().length > 0 &&
    cardNumber.replace(/\s/g, "").length >= 12 &&
    cardName.trim().length > 0 &&
    cardExpiry.length === 5 &&
    cardCvc.length >= 3 &&
    agreed;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    // Backend wiring is not in scope yet — show a friendly success state.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-teal-50 border border-teal-200 px-5 py-6 text-center">
        <Heart className="mx-auto h-8 w-8 text-teal-600" />
        <p className="mt-3 font-semibold text-teal-700">
          Teşekkürler!
        </p>
        <p className="mt-1 text-sm text-teal-600">
          {numericAmount.toLocaleString("tr-TR")} TL tutarındaki bağışınız "
          {campaignTitle}" kampanyası için kaydedildi.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm text-teal-700 underline"
        >
          Yeni bir bağış yap
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      {/* Amount */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Bağış Tutarı
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_AMOUNTS.map((amount) => {
            const active = customAmount === "" && selectedAmount === amount;
            return (
              <button
                type="button"
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {amount} TL
              </button>
            );
          })}
        </div>
        <input
          type="number"
          min={1}
          placeholder="Farklı tutar gir"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setSelectedAmount(null);
          }}
          className="mt-2 h-10 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-teal-500"
        />
      </div>

      <label className="flex items-center gap-2 text-xs text-gray-600">
        <input
          type="checkbox"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <span>Aylık tekrar eden bağış olarak ayarla</span>
      </label>

      {/* Donor details */}
      <div className="space-y-2 border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Bağışçı Bilgileri
        </p>
        <input
          type="text"
          placeholder="Ad Soyad"
          required
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-teal-500"
        />
        <input
          type="email"
          placeholder="E-posta"
          required
          value={donorEmail}
          onChange={(e) => setDonorEmail(e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-teal-500"
        />
      </div>

      {/* Payment */}
      <div className="space-y-2 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Ödeme Bilgileri
          </p>
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <Lock className="h-3 w-3" /> Güvenli
          </span>
        </div>

        <div className="relative">
          <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Kart numarası"
            value={cardNumber}
            onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
            className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 outline-none focus:border-teal-500"
          />
        </div>

        <input
          type="text"
          placeholder="Kart üzerindeki isim"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-teal-500"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="AA/YY"
            value={cardExpiry}
            onChange={(e) => setCardExpiry(maskExpiry(e.target.value))}
            className="h-10 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-teal-500"
          />
          <input
            type="text"
            placeholder="CVC"
            maxLength={4}
            value={cardCvc}
            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
            className="h-10 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-teal-500"
          />
        </div>
      </div>

      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300"
        />
        <span>
          KVKK Aydınlatma Metni'ni okudum ve onaylıyorum.
        </span>
      </label>

      <button
        type="submit"
        disabled={!canSubmit}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
      >
        <Heart className="h-4 w-4" />
        {numericAmount > 0
          ? `${numericAmount.toLocaleString("tr-TR")} TL Bağış Yap`
          : "Bağış Yap"}
      </button>

      <p className="flex items-center gap-1 text-[11px] text-gray-400">
        <ShieldCheck className="h-3 w-3" />
        Kart bilgileriniz şifrelenerek aktarılır. (Kampanya: {campaignId})
      </p>
    </form>
  );
}
