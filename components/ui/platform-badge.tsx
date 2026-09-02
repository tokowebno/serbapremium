import type { Platform } from "@/types";
import { Monitor, Smartphone, Apple, Terminal, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const platformMeta: Record<Platform, { icon: typeof Monitor; label: string }> = {
  Windows: { icon: Monitor, label: "Windows" },
  macOS: { icon: Apple, label: "macOS" },
  Linux: { icon: Terminal, label: "Linux" },
  Android: { icon: Smartphone, label: "Android" },
  iOS: { icon: Smartphone, label: "iOS" },
  Web: { icon: Globe, label: "Web" },
};

export function PlatformBadge({ platform, className }: { platform: Platform; className?: string }) {
  const meta = platformMeta[platform];
  const Icon = meta?.icon ?? Monitor;
  const label = meta?.label ?? platform;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border-2 border-border bg-surface px-2 py-0.5 text-xs font-bold text-fg shadow-[1.5px_1.5px_0px_var(--shadow-color)]",
        className,
      )}
    >
      <Icon size={12} strokeWidth={2.5} />
      {label}
    </span>
  );
}

export function PlatformList({ platforms, className }: { platforms: Platform[]; className?: string }) {
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1.5", className)}>
      {platforms.map((p) => (
        <PlatformBadge key={p} platform={p} />
      ))}
    </span>
  );
}
