"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { LogoSettings } from "@/lib/firebase/types";
import { useTenantServices } from "@/lib/firebase/hooks/useTenantServices";

const LogoContext = createContext<LogoSettings | null>(null);

/**
 * LogoProvider mirrors the NavProvider pattern.
 * The root server layout fetches logoSettings once and passes it as
 * `initialSettings`. After hydration the provider also listens for live
 * admin preview events so the iframe preview updates instantly.
 */
export function LogoProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings: LogoSettings | null;
}) {
  const [settings, setSettings] = useState<LogoSettings | null>(initialSettings);
  const { getLogoSettings } = useTenantServices();

  // Re-fetch after hydration to pick up any changes saved since the server render
  useEffect(() => {
    getLogoSettings()
      .then((s) => { if (s) setSettings(s); })
      .catch(() => { /* keep server-fetched value on error */ });
  }, [getLogoSettings]);

  // React to live admin preview pushes (ThemeListener fires this event)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<LogoSettings>).detail;
      if (detail) setSettings(detail);
    };
    window.addEventListener("logo-settings-update", handler);
    return () => window.removeEventListener("logo-settings-update", handler);
  }, []);

  return <LogoContext.Provider value={settings}>{children}</LogoContext.Provider>;
}

export function useLogo(): LogoSettings | null {
  return useContext(LogoContext);
}
