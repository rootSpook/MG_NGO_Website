"use client";

import { useEffect, useRef } from "react";
import { ThemeColors } from "./page";

interface LivePreviewProps {
  theme: ThemeColors;
}

export default function LivePreview({ theme }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "UPDATE_THEME", theme },
        "*"
      );
    }
  };

  useEffect(() => {
    handleIframeLoad();
  }, [theme]);

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