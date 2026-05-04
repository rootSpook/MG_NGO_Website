import type { StatsBarBlockData } from "@/types/pageBuilder";

interface StatsBarBlockProps {
  data: Record<string, unknown>;
}

export function StatsBarBlock({ data }: StatsBarBlockProps) {
  const { stats = [] } = data as unknown as StatsBarBlockData;

  if (stats.length === 0) return null;

  return (
    <section className="bg-teal-600 py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="rounded-lg bg-white/10 px-4 py-6 text-center text-white">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
