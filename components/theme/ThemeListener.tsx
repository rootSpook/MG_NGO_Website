"use client";

import { useEffect } from "react";

export function ThemeListener() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || event.data.type !== "UPDATE_THEME") return;

      const { theme, logoSettings } = event.data;

      if (theme) {
        if (theme.navbarBg)  document.body.style.setProperty("--theme-navbar-bg",  theme.navbarBg);
        if (theme.primary)   document.body.style.setProperty("--primary",           theme.primary);
        if (theme.titleText) document.body.style.setProperty("--theme-title-text",  theme.titleText);
        if (theme.footerBg)  document.body.style.setProperty("--theme-footer-bg",   theme.footerBg);
        if (theme.footerText)document.body.style.setProperty("--theme-footer-text", theme.footerText);
      }

      if (logoSettings) {
        // Encode the logo settings as a JSON CSS custom property so Header/Footer
        // can read and re-render without a full page reload during preview.
        document.body.setAttribute(
          "data-logo-settings",
          JSON.stringify(logoSettings)
        );
        // Dispatch a custom event so client components can react reactively
        window.dispatchEvent(
          new CustomEvent("logo-settings-update", { detail: logoSettings })
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
