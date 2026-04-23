"use client";

import { useState } from "react";
import AdminShell from "@/components/adminPanel/AdminShell";
import { useAdminPanel } from "@/context/AdminPanelContext";
import { ContactDetailsItem } from "@/types/adminPanel";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUrl(url: string) {
  if (!url.trim()) return true;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function ContactDetailsPage() {
  const { contactDetails, updateContactDetails } = useAdminPanel();
  const [formData, setFormData] =
    useState<ContactDetailsItem>(contactDetails);

  function handleChange<K extends keyof ContactDetailsItem>(
    key: K,
    value: ContactDetailsItem[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSave() {
    if (!formData.address.trim()) {
      alert("Please enter the address.");
      return;
    }

    if (!isValidEmail(formData.emailAddress)) {
      alert("Please enter a valid email address.");
      return;
    }

    const socialUrls = [
      formData.facebook,
      formData.instagram,
      formData.twitter,
      formData.linkedin,
      formData.youtube,
    ];

    const hasInvalidUrl = socialUrls.some((url) => !isValidUrl(url));

    if (hasInvalidUrl) {
      alert("Please enter valid social media URLs.");
      return;
    }

    updateContactDetails(formData);
    alert("Contact details updated successfully.");
  }

  return (
    <AdminShell>
      <div className="rounded-[22px] bg-[#f3f3f3]">
        <h1 className="mb-6 text-center text-[48px] font-bold text-black">
          CONTACT DETAILS
        </h1>

        <section className="rounded-[24px] bg-[#e8e8e8] p-6 shadow-md">
          <h2 className="text-[22px] font-semibold text-black">
            Contact Information
          </h2>

          <div className="mt-5 space-y-5">
            <div className="grid gap-5 md:grid-cols-[2fr_0.8fr_0.7fr]">
              <InputField
                label="Address"
                value={formData.address}
                onChange={(value) => handleChange("address", value)}
              />

              <InputField
                label="City"
                value={formData.city}
                onChange={(value) => handleChange("city", value)}
              />

              <InputField
                label="Postal Code"
                value={formData.postalCode}
                onChange={(value) => handleChange("postalCode", value)}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(value) => handleChange("phoneNumber", value)}
              />

              <InputField
                label="Email Address"
                value={formData.emailAddress}
                onChange={(value) => handleChange("emailAddress", value)}
                isInvalid={
                  formData.emailAddress.length > 0 &&
                  !isValidEmail(formData.emailAddress)
                }
              />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[24px] bg-[#e8e8e8] p-6 shadow-md">
          <h2 className="text-[22px] font-semibold text-black">
            Social Media Links
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <InputField
              label="Facebook"
              value={formData.facebook}
              onChange={(value) => handleChange("facebook", value)}
              isInvalid={!isValidUrl(formData.facebook)}
            />

            <InputField
              label="Instagram"
              value={formData.instagram}
              onChange={(value) => handleChange("instagram", value)}
              isInvalid={!isValidUrl(formData.instagram)}
            />

            <InputField
              label="Twitter / X"
              value={formData.twitter}
              onChange={(value) => handleChange("twitter", value)}
              isInvalid={!isValidUrl(formData.twitter)}
            />

            <InputField
              label="LinkedIn"
              value={formData.linkedin}
              onChange={(value) => handleChange("linkedin", value)}
              isInvalid={!isValidUrl(formData.linkedin)}
            />

            <InputField
              label="YouTube"
              value={formData.youtube}
              onChange={(value) => handleChange("youtube", value)}
              isInvalid={!isValidUrl(formData.youtube)}
            />
          </div>
        </section>

        <section className="mt-6 rounded-[24px] bg-[#e8e8e8] p-6 shadow-md">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-[12px] bg-[#27ae60] px-8 py-3 text-[18px] font-medium text-white"
            >
              Save Changes
            </button>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function InputField({
  label,
  value,
  onChange,
  isInvalid = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-medium text-[#666]">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[52px] w-full rounded-[12px] bg-white px-4 outline-none shadow-sm ${
          isInvalid ? "border border-[#eb5757] text-[#eb5757]" : ""
        }`}
      />

      {isInvalid && (
        <p className="mt-1 text-[12px] text-[#eb5757]">
          Please enter a valid value.
        </p>
      )}
    </div>
  );
}