"use client";

import { useEffect, useRef } from "react";
import type { ThemeColors, AdminLogoSettings } from "./page";

interface LivePreviewProps {
  theme: ThemeColors;
  logoSettings: AdminLogoSettings;
}

export default function LivePreview({ theme, logoSettings }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function postUpdate() {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "UPDATE_THEME", theme, logoSettings },
      "*"
    );
  }

  const handleIframeLoad = () => postUpdate();

  useEffect(() => {
    postUpdate();
  }, [theme, logoSettings]);

  return (
    <div className="w-full h-full min-h-[600px] border shadow-md rounded-lg overflow-hidden bg-background">
      <iframe
        ref={iframeRef}
        src="/"
        onLoad={handleIframeLoad}
        className="w-full h-full border-0 min-h-[600px]"
        title="Live Theme Preview"
      />
    </div>
  );
}
