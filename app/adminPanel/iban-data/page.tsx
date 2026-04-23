"use client";

import { useState } from "react";
import AdminShell from "@/components/adminPanel/AdminShell";
import { useAdminPanel } from "@/context/AdminPanelContext";
import { IbanDataItem } from "@/types/adminPanel";

function formatTurkishIban(value: string) {
  const cleaned = value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 26);

  let normalized = cleaned;

  if (!normalized.startsWith("TR")) {
    normalized = "TR" + normalized.replace(/^TR/, "");
  }

  normalized = normalized.slice(0, 26);

  return normalized.replace(/(.{4})/g, "$1 ").trim();
}

function isValidTurkishIban(value: string) {
  const cleaned = value.replace(/\s/g, "").toUpperCase();
  return /^TR\d{24}$/.test(cleaned);
}

export default function IbanDataPage() {
  const { ibanData, updateIbanData } = useAdminPanel();
  const [formData, setFormData] = useState<IbanDataItem>(ibanData);

  function handleChange<K extends keyof IbanDataItem>(
    key: K,
    value: IbanDataItem[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSave() {
    if (!isValidTurkishIban(formData.ibanNumber)) {
      alert("Please enter a valid Turkish IBAN number.");
      return;
    }

    updateIbanData(formData);
    alert("IBAN data updated successfully.");
  }

  const ibanIsValid = isValidTurkishIban(formData.ibanNumber);

  return (
    <AdminShell>
      <div className="rounded-[22px] bg-[#f3f3f3]">
        <h1 className="mb-6 text-center text-[48px] font-bold text-black">
          IBAN DATA
        </h1>

        <section className="rounded-[24px] bg-[#e8e8e8] p-6 shadow-md">
          <h2 className="text-[22px] font-semibold text-black">
            Bank Account Information
          </h2>

          <p className="mt-2 text-[15px] text-[#777]">
            Update the donation account details below. Changes will be reflected
            on the website immediately.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#666]">
                IBAN Number
              </label>

              <input
                value={formData.ibanNumber}
                onChange={(e) =>
                  handleChange("ibanNumber", formatTurkishIban(e.target.value))
                }
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                maxLength={32}
                className={`h-[52px] w-full rounded-[12px] bg-white px-4 text-[18px] outline-none shadow-sm ${
                  ibanIsValid ? "text-[#2f80ed]" : "text-[#eb5757]"
                }`}
              />

              <p className="mt-2 text-[13px] text-[#777]">
                Turkish IBAN format: TR + 24 digits. Total length must be 26
                characters.
              </p>

              {!ibanIsValid && (
                <p className="mt-1 text-[13px] text-[#eb5757]">
                  Please enter a valid Turkish IBAN number.
                </p>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#666]">
                  Bank Name
                </label>
                <input
                  value={formData.bankName}
                  onChange={(e) => handleChange("bankName", e.target.value)}
                  className="h-[52px] w-full rounded-[12px] bg-white px-4 outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#666]">
                  Account Holder Name
                </label>
                <input
                  value={formData.accountHolderName}
                  onChange={(e) =>
                    handleChange("accountHolderName", e.target.value)
                  }
                  className="h-[52px] w-full rounded-[12px] bg-white px-4 outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#666]">
                  Branch Name
                </label>
                <input
                  value={formData.branchName}
                  onChange={(e) => handleChange("branchName", e.target.value)}
                  className="h-[52px] w-full rounded-[12px] bg-white px-4 outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#666]">
                  BIC / SWIFT Code
                </label>
                <input
                  value={formData.bicSwiftCode}
                  onChange={(e) => handleChange("bicSwiftCode", e.target.value)}
                  className="h-[52px] w-full rounded-[12px] bg-white px-4 outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#666]">
                  Currency
                </label>
                <input
                  value={formData.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="h-[52px] w-full rounded-[12px] bg-white px-4 outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#666]">
                  Account Type
                </label>
                <input
                  value={formData.accountType}
                  onChange={(e) => handleChange("accountType", e.target.value)}
                  className="h-[52px] w-full rounded-[12px] bg-white px-4 outline-none shadow-sm"
                />
              </div>
            </div>

            <div className="rounded-[14px] bg-[#dce8f7] px-4 py-4 text-[14px] text-[#2f80ed]">
              ℹ Please double-check all account details before saving. Incorrect
              IBAN information may cause donation processing issues.
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="rounded-[12px] bg-[#27ae60] px-8 py-3 text-[18px] font-medium text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}