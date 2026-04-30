import type { PageSection, BlockType } from "@/types/pageBuilder";
import { HeroBlock } from "./HeroBlock";
import { RichTextBlock } from "./RichTextBlock";
import { CtaBannerBlock } from "./CtaBannerBlock";

// Placeholder for blocks implemented in later steps
function ComingSoon({ type }: { type: BlockType }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="my-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center text-sm text-gray-400">
      Block type <span className="font-mono font-semibold text-gray-600">"{type}"</span> is not yet rendered.
    </div>
  );
}

function renderBlock(section: PageSection) {
  switch (section.type) {
    case "hero":
      return <HeroBlock key={section.id} data={section.data} />;
    case "rich-text":
      return <RichTextBlock key={section.id} data={section.data} />;
    case "cta-banner":
      return <CtaBannerBlock key={section.id} data={section.data} />;
    case "event-grid":
    case "report-list":
    case "team-grid":
    case "faq-accordion":
    case "stats-bar":
      return <ComingSoon key={section.id} type={section.type} />;
    default:
      return null;
  }
}

interface BlockRendererProps {
  sections: PageSection[];
}

export function BlockRenderer({ sections }: BlockRendererProps) {
  const visible = [...sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col">
      {visible.map(renderBlock)}
    </div>
  );
}
