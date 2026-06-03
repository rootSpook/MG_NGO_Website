"use client";

import { useRef, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageUploadField } from "@/components/admin/shared/ImageUploadField";
import type { AdminLogoSettings, LogoPosition, ThemeColors } from "./page";

interface LogoSettingsPanelProps {
  value: AdminLogoSettings;
  onChange: (next: AdminLogoSettings) => void;
  theme: ThemeColors;
}

// Canvas dimensions that mirror the real layout proportions
const HEADER_CANVAS = { w: 320, h: 80 };
const FOOTER_CANVAS = { w: 320, h: 100 };
const LOGO_SIZE = { w: 80, h: 40 };

interface DragCanvasProps {
  label: string;
  bg: string;
  canvasSize: { w: number; h: number };
  logoUrl: string;
  logoAlt: string;
  position: LogoPosition;
  onPositionChange: (pos: LogoPosition) => void;
}

function DragCanvas({
  label,
  bg,
  canvasSize,
  logoUrl,
  logoAlt,
  position,
  onPositionChange,
}: DragCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startOffset = useRef({ x: 0, y: 0 });

  // Clamp position so logo stays inside the canvas
  function clamp(pos: LogoPosition): LogoPosition {
    return {
      x: Math.max(0, Math.min(pos.x, canvasSize.w - LOGO_SIZE.w)),
      y: Math.max(0, Math.min(pos.y, canvasSize.h - LOGO_SIZE.h)),
    };
  }

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };

      const onMove = (mv: MouseEvent) => {
        if (!dragging.current) return;
        onPositionChange(
          clamp({ x: mv.clientX - startOffset.current.x, y: mv.clientY - startOffset.current.y })
        );
      };
      const onUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [position, onPositionChange, canvasSize]
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      dragging.current = true;
      startOffset.current = {
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      };

      const onMove = (mv: TouchEvent) => {
        if (!dragging.current) return;
        const t = mv.touches[0];
        onPositionChange(
          clamp({ x: t.clientX - startOffset.current.x, y: t.clientY - startOffset.current.y })
        );
      };
      const onEnd = () => {
        dragging.current = false;
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
      };
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchend", onEnd);
    },
    [position, onPositionChange, canvasSize]
  );

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <div
        ref={canvasRef}
        className="relative rounded-lg border-2 border-dashed border-gray-300 overflow-hidden select-none"
        style={{ width: canvasSize.w, height: canvasSize.h, background: bg, maxWidth: "100%" }}
      >
        {/* Grid guide lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          {[1, 2].map((i) => (
            <div
              key={`v${i}`}
              className="absolute top-0 bottom-0 border-l border-white"
              style={{ left: `${(i / 3) * 100}%` }}
            />
          ))}
          <div className="absolute left-0 right-0 border-t border-white" style={{ top: "50%" }} />
        </div>

        {logoUrl ? (
          <img
            src={logoUrl}
            alt={logoAlt}
            draggable={false}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            className="absolute object-contain cursor-grab active:cursor-grabbing"
            style={{
              left: position.x,
              top: position.y,
              width: LOGO_SIZE.w,
              height: LOGO_SIZE.h,
            }}
          />
        ) : (
          <div
            className="absolute flex items-center justify-center rounded border-2 border-dashed border-white/40 text-white/50 text-xs cursor-not-allowed"
            style={{
              left: position.x,
              top: position.y,
              width: LOGO_SIZE.w,
              height: LOGO_SIZE.h,
            }}
          >
            Logo
          </div>
        )}
      </div>
      <p className="text-[11px] text-gray-400">
        Konum: x={Math.round(position.x)}, y={Math.round(position.y)} — Logoyu sürükleyerek konumlandırın
      </p>
    </div>
  );
}

export function LogoSettingsPanel({ value, onChange, theme }: LogoSettingsPanelProps) {
  const set = <K extends keyof AdminLogoSettings>(key: K, val: AdminLogoSettings[K]) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Logo Ayarları</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Logo yükleyin ve Header / Footer içindeki konumunu belirleyin.
        </p>
      </div>

      {/* Upload */}
      <ImageUploadField
        label="Logo Görseli"
        value={value.logo_url}
        onChange={(url) => set("logo_url", url)}
        aspectClassName="aspect-[3/1]"
        hint="PNG veya SVG önerilir. Şeffaf arka plan için PNG/SVG kullanın."
      />

      {/* Alt text */}
      <div className="space-y-1.5">
        <Label htmlFor="logo_alt" className="font-medium">
          Logo Alt Metni (Erişilebilirlik)
        </Label>
        <Input
          id="logo_alt"
          value={value.logo_alt}
          onChange={(e) => set("logo_alt", e.target.value)}
          placeholder="Örn: MG Yaşam Derneği Logo"
        />
      </div>

      {/* Header canvas */}
      <DragCanvas
        label="Header (Üst) Logo Konumu"
        bg={theme.navbarBg || "#475569"}
        canvasSize={HEADER_CANVAS}
        logoUrl={value.logo_url}
        logoAlt={value.logo_alt}
        position={value.header_logo_position}
        onPositionChange={(pos) => set("header_logo_position", pos)}
      />

      {/* Manual coordinate inputs for header */}
      <div className="flex gap-3">
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Header X (px)</Label>
          <Input
            type="number"
            min={0}
            value={Math.round(value.header_logo_position.x)}
            onChange={(e) =>
              set("header_logo_position", {
                ...value.header_logo_position,
                x: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Header Y (px)</Label>
          <Input
            type="number"
            min={0}
            value={Math.round(value.header_logo_position.y)}
            onChange={(e) =>
              set("header_logo_position", {
                ...value.header_logo_position,
                y: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* Footer canvas */}
      <DragCanvas
        label="Footer (Alt) Logo Konumu"
        bg={theme.footerBg || "#18181b"}
        canvasSize={FOOTER_CANVAS}
        logoUrl={value.logo_url}
        logoAlt={value.logo_alt}
        position={value.footer_logo_position}
        onPositionChange={(pos) => set("footer_logo_position", pos)}
      />

      {/* Manual coordinate inputs for footer */}
      <div className="flex gap-3">
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Footer X (px)</Label>
          <Input
            type="number"
            min={0}
            value={Math.round(value.footer_logo_position.x)}
            onChange={(e) =>
              set("footer_logo_position", {
                ...value.footer_logo_position,
                x: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Footer Y (px)</Label>
          <Input
            type="number"
            min={0}
            value={Math.round(value.footer_logo_position.y)}
            onChange={(e) =>
              set("footer_logo_position", {
                ...value.footer_logo_position,
                y: Number(e.target.value),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
