import {
  Heart, HeartHandshake, Pill, ScanSearch, Stethoscope, Activity, BookOpen,
  GraduationCap, HandHeart, Hospital, LifeBuoy, Megaphone, MessageCircle,
  Microscope, ShieldCheck, Sparkles, Users, Lightbulb, Smile, Globe,
  Star, HandCoins, ClipboardList, Brain, Rocket, type LucideIcon,
} from "lucide-react";

/**
 * Server-safe icon registry used by both admin editors and public pages.
 * Keep this module free of "use client" so it can be imported by RSCs.
 */
export const IMPACT_ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  "heart-handshake": HeartHandshake,
  pill: Pill,
  "scan-search": ScanSearch,
  stethoscope: Stethoscope,
  activity: Activity,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  "hand-heart": HandHeart,
  hospital: Hospital,
  "life-buoy": LifeBuoy,
  megaphone: Megaphone,
  "message-circle": MessageCircle,
  microscope: Microscope,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  users: Users,
  lightbulb: Lightbulb,
  smile: Smile,
  globe: Globe,
  star: Star,
  "hand-coins": HandCoins,
  "clipboard-list": ClipboardList,
  brain: Brain,
  rocket: Rocket,
};

export const ICON_KEYS = Object.keys(IMPACT_ICONS);

export function getImpactIcon(name: string | undefined | null): LucideIcon {
  if (!name) return Sparkles;
  return IMPACT_ICONS[name] ?? Sparkles;
}
