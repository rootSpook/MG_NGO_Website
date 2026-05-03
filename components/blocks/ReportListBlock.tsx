import { FileText, Download } from "lucide-react";
import type { ReportListBlockData } from "@/types/pageBuilder";

interface ReportListBlockProps {
  data: Record<string, unknown>;
}

export function ReportListBlock({ data }: ReportListBlockProps) {
  const { reports = [] } = data as unknown as ReportListBlockData;

  if (reports.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <article
            key={report.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
              <FileText className="h-10 w-10 text-white/70" />
            </div>
            <div className="p-5">
              {report.category && (
                <span className="mb-2 inline-block rounded-full border border-teal-200 px-2 py-0.5 text-[11px] font-medium text-teal-700">
                  {report.category}
                </span>
              )}
              <h3 className="text-base font-semibold text-gray-900">{report.title}</h3>
              {report.year && (
                <p className="mt-1 text-xs text-gray-500">{report.year}</p>
              )}
              {report.excerpt && (
                <p className="mt-3 line-clamp-3 text-sm text-gray-600">{report.excerpt}</p>
              )}
              {report.fileUrl && (
                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  <Download className="h-4 w-4" />
                  PDF İndir
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
