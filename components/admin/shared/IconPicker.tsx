"use client";

import { IMPACT_ICONS, ICON_KEYS, getImpactIcon } from "./impactIcons";

// Re-export the registry helpers so existing client-side imports keep working.
export { IMPACT_ICONS, ICON_KEYS, getImpactIcon };

interface IconPickerProps {
  value?: string;
  onChange: (next: string) => void;
  label?: string;
}

/** Compact picker that shows a grid of available icons. */
export function IconPicker({ value, onChange, label = "Sembol" }: IconPickerProps) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </label>
      )}
      <div className="grid grid-cols-8 gap-1.5 rounded-lg border border-gray-200 bg-white p-2">
        {ICON_KEYS.map((key) => {
          const Icon = IMPACT_ICONS[key];
          const isActive = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              title={key}
              className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
                isActive
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
      {value && (
        <p className="mt-1 text-[11px] text-gray-400">
          Seçili sembol: <span className="font-mono">{value}</span>
        </p>
      )}
    </div>
  );
}
