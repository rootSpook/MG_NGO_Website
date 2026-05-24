"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getSiteSettings } from "@/lib/firebase/services";

const LogoContext = createContext<string | null>(null);

export function LogoProvider({
  children,
  initialLogoUrl,
}: {
  children: ReactNode;
  initialLogoUrl: string | null;
}) {
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);

  useEffect(() => {
    getSiteSettings()
      .then((s) => setLogoUrl(s?.logoUrl ?? null))
      .catch(() => {});
  }, []);

  return <LogoContext.Provider value={logoUrl}>{children}</LogoContext.Provider>;
}

export function useLogo(): string | null {
  return useContext(LogoContext);
}
