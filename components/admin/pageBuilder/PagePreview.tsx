"use client";

import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { PageSection } from "@/types/pageBuilder";

interface PagePreviewProps {
  sections: PageSection[];
}

/**
 * Renders the live draft inside the admin split-screen preview pane.
 * pointer-events-none prevents the admin from accidentally following links
 * while browsing the preview.
 */
export function PagePreview({ sections }: PagePreviewProps) {
  if (sections.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-gray-50 text-center">
        <p className="text-sm font-medium text-gray-400">Önizlenecek blok yok.</p>
        <p className="text-xs text-gray-300">Sol taraftan bir blok ekleyin.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#f4f4f4] pointer-events-none select-none">
      <BlockRenderer sections={sections} />
    </div>
  );
}
