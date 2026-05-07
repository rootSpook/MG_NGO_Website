"use client";

import { useEffect, useRef, useState } from "react";
import { UserCircle2, Camera, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/firebase/AuthContext";
import { uploadImage } from "@/lib/firebase/storageUtils";
import { updateStaffPhotoURL, getStaffMember } from "@/lib/firebase/adminServices";

export default function AdminMyDetailsPage() {
  const { user } = useAuth();
  const [staffPhoto, setStaffPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.uid) {
      getStaffMember(user.uid).then((data) => {
        if (data?.photoURL) setStaffPhoto(data.photoURL);
      });
    }
  }, [user?.uid]);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      await updateStaffPhotoURL(user.uid, url);
      setStaffPhoto(url);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Photo upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bilgilerim</h1>
        <p className="mt-1 text-sm text-gray-500">
          Profil bilgilerinizi buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Photo */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">
            Profil Fotoğrafı
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              {staffPhoto ? (
                <img
                  src={staffPhoto}
                  alt="Profil fotoğrafı"
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-primary/10"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <UserCircle2 className="h-10 w-10 text-primary/50" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary/90 disabled:opacity-60"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                {uploading ? "Yükleniyor…" : "Fotoğraf Değiştir"}
              </button>
              <p className="mt-1.5 text-xs text-gray-400">
                PNG, JPG veya WEBP. Maks. 5 MB.
              </p>
              {saved && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Fotoğraf kaydedildi
                </p>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        {/* Account Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">
            Hesap Bilgileri
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <div className="flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600">
                {user?.email ?? "—"}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Kullanıcı ID
              </label>
              <div className="flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 font-mono text-xs text-gray-400">
                {user?.uid ?? "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
