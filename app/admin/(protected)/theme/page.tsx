"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import LivePreview from "./LivePreview";

export interface ThemeColors {
  navbarBg: string;
  primary: string;
  titleText: string;
  footerBg: string;
  footerText: string;
}

const DEFAULT_THEME: ThemeColors = {
  navbarBg: "#475569", // slate-600
  primary: "#1d4ed8", // buttons and active elements
  titleText: "#000000",
  footerBg: "#18181b", // zinc-900
  footerText: "#ffffff",
};

const COLOR_LABELS: Record<keyof ThemeColors, string> = {
  navbarBg: "Menü Arka Planı",
  primary: "Butonlar ve Aktif Öğeler",
  titleText: "Başlık Metin Rengi",
  footerBg: "Alt Kısım Arka Planı",
  footerText: "Footer Metin Rengi",
};

export default function ThemeSettingsPage() {
  const [theme, setTheme] = useState<ThemeColors>(DEFAULT_THEME);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadTheme() {
      try {
        const docRef = doc(db, "settings", "site");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().theme) {
          const savedTheme = docSnap.data().theme;
          setTheme({
            ...DEFAULT_THEME,
            ...savedTheme,
            footerText: savedTheme.footerText ?? savedTheme.primaryHover ?? DEFAULT_THEME.footerText,
          });
        }
      } catch (err) {
        console.error("Failed to load theme settings", err);
      } finally {
        setFetching(false);
      }
    }
    loadTheme();
  }, []);

  const handleChange = (key: keyof ThemeColors, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "settings", "site");
      
      try {
        await updateDoc(docRef, { theme });
      } catch (e: any) {
        if (e.code === "not-found") {
          await setDoc(docRef, { theme });
        } else {
          throw e;
        }
      }

      alert("Theme saved successfully!");
    } catch (err) {
      console.error("Failed to save theme:", err);
      alert("Failed to save theme.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <p className="text-muted-foreground animate-pulse">Loading theme...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-4rem)]">
      {/* Sidebar Controls */}
      <div className="w-full md:w-[350px] border-r bg-card p-6 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tema Ayarları</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Web sitenizin renklerini buradan yönetebilirsiniz.
          </p>
          
          <div className="space-y-4 border-b pb-6">
            <Label htmlFor="reference-image">Referans Görsel veya Logo</Label>
            <Input
              id="reference-image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setReferenceImage(URL.createObjectURL(f));
              }}
            />
            {referenceImage && (
              <div className="mt-4 rounded-md overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={referenceImage} alt="Reference Preview" className="w-full h-auto object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5 flex-1 mt-2">
          {Object.entries(theme).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="font-medium">
                {COLOR_LABELS[key as keyof ThemeColors]}
              </Label>
              <div className="flex items-center gap-3">
                <input
                  id={key}
                  type="color"
                  value={value}
                  onChange={(e) => handleChange(key as keyof ThemeColors, e.target.value)}
                  className="w-12 h-12 p-1 border rounded cursor-pointer shrink-0 bg-background"
                />
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(key as keyof ThemeColors, e.target.value)}
                  className="uppercase font-mono"
                  pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t mt-4 mb-8">
          <Button onClick={handleSave} disabled={loading} size="lg" className="w-full font-semibold">
            {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </Button>
        </div>
      </div>

      {/* Live Preview Area */}
      <div className="flex-1 p-4 md:p-8 bg-muted/30 overflow-y-auto h-[calc(100vh-4rem)]">
        <LivePreview theme={theme} />
      </div>
    </div>
  );
}
