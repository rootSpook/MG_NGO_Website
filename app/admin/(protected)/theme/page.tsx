"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTenantFirebase } from "@/lib/firebase/TenantFirebaseContext";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { revalidatePublicPathAction } from "@/app/admin/actions";
import LivePreview from "./LivePreview";
import { LogoSettingsPanel } from "./LogoSettingsPanel";

export interface ThemeColors {
  navbarBg: string;
  primary: string;
  titleText: string;
  footerBg: string;
  footerText: string;
}

export interface LogoPosition {
  x: number;
  y: number;
}

export interface AdminLogoSettings {
  logo_url: string;
  header_logo_position: LogoPosition;
  footer_logo_position: LogoPosition;
  logo_alt: string;
}

const DEFAULT_THEME: ThemeColors = {
  navbarBg: "#475569",
  primary: "#1d4ed8",
  titleText: "#000000",
  footerBg: "#18181b",
  footerText: "#ffffff",
};

const DEFAULT_LOGO: AdminLogoSettings = {
  logo_url: "",
  header_logo_position: { x: 0, y: 0 },
  footer_logo_position: { x: 0, y: 0 },
  logo_alt: "Logo",
};

const COLOR_LABELS: Record<keyof ThemeColors, string> = {
  navbarBg: "Menü Arka Planı",
  primary: "Butonlar ve Aktif Öğeler",
  titleText: "Başlık Metin Rengi",
  footerBg: "Alt Kısım Arka Planı",
  footerText: "Footer Metin Rengi",
};

type ActiveTab = "colors" | "logo";

export default function ThemeSettingsPage() {
  const { db } = useTenantFirebase();
  const [theme, setTheme] = useState<ThemeColors>(DEFAULT_THEME);
  const [logoSettings, setLogoSettings] = useState<AdminLogoSettings>(DEFAULT_LOGO);
  const [activeTab, setActiveTab] = useState<ActiveTab>("colors");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const docRef = doc(db, "settings", "site");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.theme) {
            const savedTheme = data.theme;
            setTheme({
              ...DEFAULT_THEME,
              ...savedTheme,
              footerText: savedTheme.footerText ?? savedTheme.primaryHover ?? DEFAULT_THEME.footerText,
            });
          }
          if (data.logoSettings) {
            setLogoSettings({ ...DEFAULT_LOGO, ...data.logoSettings });
          }
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setFetching(false);
      }
    }
    loadSettings();
  }, [db]);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "settings", "site");
      const payload = { theme, logoSettings };

      try {
        await updateDoc(docRef, payload);
      } catch (e: unknown) {
        if ((e as { code?: string }).code === "not-found") {
          await setDoc(docRef, payload);
        } else {
          throw e;
        }
      }

      await revalidatePublicPathAction("/");
      alert("Ayarlar başarıyla kaydedildi!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <p className="text-muted-foreground animate-pulse">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-4rem)]">
      {/* Sidebar Controls */}
      <div className="w-full md:w-[380px] border-r bg-card flex flex-col overflow-y-auto max-h-[calc(100vh-4rem)]">
        {/* Tab switcher */}
        <div className="flex border-b shrink-0">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "colors"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("colors")}
          >
            Renkler
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "logo"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("logo")}
          >
            Logo
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6 flex-1">
          {activeTab === "colors" && (
            <>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Renk Ayarları</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Web sitenizin renklerini buradan yönetebilirsiniz.
                </p>
              </div>
              <div className="space-y-5 flex-1">
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
                        onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                        className="w-12 h-12 p-1 border rounded cursor-pointer shrink-0 bg-background"
                      />
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                        className="uppercase font-mono"
                        pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "logo" && (
            <LogoSettingsPanel
              value={logoSettings}
              onChange={setLogoSettings}
              theme={theme}
            />
          )}

          <div className="pt-4 border-t mt-auto mb-4">
            <Button onClick={handleSave} disabled={loading} size="lg" className="w-full font-semibold">
              {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </div>
        </div>
      </div>

      {/* Live Preview Area */}
      <div className="flex-1 p-4 md:p-8 bg-muted/30 overflow-y-auto h-[calc(100vh-4rem)]">
        <LivePreview theme={theme} logoSettings={logoSettings} />
      </div>
    </div>
  );
}
