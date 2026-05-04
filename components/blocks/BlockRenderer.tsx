import type { PageSection } from "@/types/pageBuilder";
import { HeroBlock } from "./HeroBlock";
import { RichTextBlock } from "./RichTextBlock";
import { CtaBannerBlock } from "./CtaBannerBlock";
import { EventGridBlock } from "./EventGridBlock";
import { ReportListBlock } from "./ReportListBlock";
import { TeamGridBlock } from "./TeamGridBlock";
import { FaqAccordionBlock } from "./FaqAccordionBlock";
import { StatsBarBlock } from "./StatsBarBlock";

function renderBlock(section: PageSection) {
  switch (section.type) {
    case "hero":
      return <HeroBlock key={section.id} data={section.data} />;
    case "rich-text":
      return <RichTextBlock key={section.id} data={section.data} />;
    case "cta-banner":
      return <CtaBannerBlock key={section.id} data={section.data} />;
    case "event-grid":
      return <EventGridBlock key={section.id} data={section.data} />;
    case "report-list":
      return <ReportListBlock key={section.id} data={section.data} />;
    case "team-grid":
      return <TeamGridBlock key={section.id} data={section.data} />;
    case "faq-accordion":
      return <FaqAccordionBlock key={section.id} data={section.data} />;
    case "stats-bar":
      return <StatsBarBlock key={section.id} data={section.data} />;
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
