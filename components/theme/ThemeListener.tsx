"use client";

import { useEffect } from "react";

export function ThemeListener() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message has our specific action type and payload
      if (event.data && event.data.type === "UPDATE_THEME" && event.data.theme) {
        const { theme } = event.data;
        if (theme.navbarBg) document.documentElement.style.setProperty("--theme-navbar-bg", theme.navbarBg);
        if (theme.primary) document.documentElement.style.setProperty("--primary", theme.primary);
        if (theme.titleText) document.documentElement.style.setProperty("--theme-title-text", theme.titleText);
        if (theme.footerBg) document.documentElement.style.setProperty("--theme-footer-bg", theme.footerBg);
        if (theme.footerText) document.documentElement.style.setProperty("--theme-footer-text", theme.footerText);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
