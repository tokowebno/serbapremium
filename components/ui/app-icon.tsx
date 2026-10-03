"use client";

import { useState } from "react";
import type { AppIconConfig } from "@/types";
import { iconRegistry, iconFallback } from "./icon-registry";
import { cn } from "@/lib/utils";

const sizes = {
  "2xs": 18,
  xs: 24,
  sm: 32,
  md: 46,
  lg: 58,
  xl: 74,
  "2xl": 96,
};

export function AppIcon({
  icon,
  size = "md",
  rounded = true,
  className,
}: {
  icon: AppIconConfig;
  size?: keyof typeof sizes;
  rounded?: boolean;
  className?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const px = sizes[size] || 46;

  // Apple iOS squircle corner radius ratio
  const borderRadius = rounded ? Math.round(px * 0.225) : 0;

  if (icon.logo && !imgFailed) {
    return (
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden transition-all duration-200 select-none",
          "bg-white/95 dark:bg-slate-900/90",
          "border border-black/[0.08] dark:border-white/[0.14]",
          "shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]",
          className,
        )}
        style={{
          width: px,
          height: px,
          borderRadius: borderRadius || undefined,
        }}
        aria-hidden="true"
      >
        {/* Specular gloss top reflection (iOS 27 Liquid Glass sheen) */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent"
          style={{ borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }}
        />

        {/* Clean Logo Image with safe internal breathing room so it is NEVER cut off */}
        <img
          src={`/logos/${icon.logo}`}
          alt=""
          width={px}
          height={px}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="relative z-10 h-full w-full object-contain p-[14%] transition-transform duration-200"
        />
      </span>
    );
  }

  const Icon = iconRegistry[icon.glyph] ?? iconFallback;
  const iconSize = Math.round(px * 0.46);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden transition-all duration-200 select-none",
        "border border-black/[0.08] dark:border-white/[0.14]",
        "shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]",
        className,
      )}
      style={{
        width: px,
        height: px,
        borderRadius: borderRadius || undefined,
        background: `linear-gradient(145deg, ${icon.from || "#0ea5e9"} 0%, ${icon.to || "#0369a1"} 100%)`,
      }}
      aria-hidden="true"
    >
      {/* Specular gloss top reflection */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 via-white/15 to-transparent"
        style={{ borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }}
      />
      <Icon size={iconSize} className="relative z-10 text-white drop-shadow-xs" strokeWidth={1.8} />
    </span>
  );
}