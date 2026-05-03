"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }

  return (
    <button
      type="button"
      title="Kopyala"
      onClick={handleCopy}
      className="rounded p-1 text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-teal-600" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
