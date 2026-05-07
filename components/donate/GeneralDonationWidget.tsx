"use client";

import { useState } from "react";
import { CreditCard, Lock, ShieldCheck, Heart } from "lucide-react";

interface GeneralDonationWidgetProps {
  monthlyMessage: string;
}

const PRESET_AMOUNTS = [100, 200, 500];

function maskCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function maskExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

// ─── Inline payment form ──────────────────────────────────────────────────────
interface PaymentFormProps {
  amount: number;
  onBack: () => void;
}

function PaymentForm({ amount, onBack }: PaymentFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    cardNumber.replace(/\s/g, "").length >= 12 &&
    cardName.trim().length > 0 &&
    cardExpiry.length === 5 &&
    cardCvc.length >= 3 &&
    agreed;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-teal-200 bg-teal-50 px-5 py-8 text-center">
        <Heart className="mx-auto h-8 w-8 text-teal-600" />
        <p className="mt-3 font-semibold text-teal-700">Teşekkürler!</p>
        <p className="mt-1 text-sm text-teal-600">
          {amount.toLocaleString("tr-TR")} TL tutarındaki bağışınız kaydedildi.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-sm text-teal-700 underline"
        >
          Yeni bir bağış yap
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-primary hover:underline"
        >
          ← Geri dön
        </button>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {amount.toLocaleString("tr-TR")} TL
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* Donor details */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Bağışçı Bilgileri
          </p>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Ad"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-primary"
            />
            <input
              type="text"
              placeholder="Soyad"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-primary"
            />
          </div>
          <input
            type="email"
            placeholder="E-posta"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-primary"
          />
        </div>

        {/* Payment details */}
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
              className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 outline-none focus:border-primary"
            />
          </div>

          <input
            type="text"
            placeholder="Kart üzerindeki isim"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-primary"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="AA/YY"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(maskExpiry(e.target.value))}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-primary"
            />
            <input
              type="text"
              placeholder="CVC"
              maxLength={4}
              value={cardCvc}
              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
              className="h-10 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-primary"
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
          <span>KVKK Aydınlatma Metni'ni okudum ve onaylıyorum.</span>
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Heart className="h-4 w-4" />
          {amount.toLocaleString("tr-TR")} TL Bağış Yap
        </button>

        <p className="flex items-center gap-1 text-[11px] text-gray-400">
          <ShieldCheck className="h-3 w-3" />
          Kart bilgileriniz şifrelenerek aktarılır.
        </p>
      </form>
    </div>
  );
}

// ─── Amount selector (initial view) ──────────────────────────────────────────
export function GeneralDonationWidget({ monthlyMessage }: GeneralDonationWidgetProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const numericAmount =
    customAmount.trim().length > 0
      ? Number(customAmount)
      : selectedAmount ?? 0;

  if (showPaymentForm && numericAmount > 0) {
    return (
      <PaymentForm
        amount={numericAmount}
        onBack={() => setShowPaymentForm(false)}
      />
    );
  }

  return (
    <div className="rounded-xl bg-[#e5e5e5] p-4 shadow-sm">
      <div className="grid grid-cols-3 gap-2">
        {PRESET_AMOUNTS.map((amount) => {
          const active = customAmount === "" && selectedAmount === amount;
          return (
            <button
              key={amount}
              type="button"
              onClick={() => {
                setSelectedAmount(amount);
                setCustomAmount("");
              }}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-white"
                  : "bg-[#d9d9d9] text-gray-700 hover:bg-gray-300"
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
        placeholder="Farklı Tutar Gir"
        value={customAmount}
        onChange={(e) => {
          setCustomAmount(e.target.value);
          setSelectedAmount(null);
        }}
        className="mt-3 h-10 w-full rounded-md bg-[#d9d9d9] px-3 text-sm outline-none focus:bg-white"
      />

      <p className="mt-3 text-xs text-gray-600">{monthlyMessage}</p>

      <button
        type="button"
        disabled={numericAmount <= 0}
        onClick={() => setShowPaymentForm(true)}
        className="mt-3 h-10 w-full rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {numericAmount > 0
          ? `${numericAmount.toLocaleString("tr-TR")} TL Bağış Yap`
          : "Bağış Yap"}
      </button>
    </div>
  );
}
