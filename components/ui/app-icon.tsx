"use client";

import { useState } from "react";
import type { AppIconConfig } from "@/types";
import { iconRegistry, iconFallback } from "./icon-registry";
import { cn } from "@/lib/utils";

const sizes = {
  xs: 24,
  sm: 32,
  md: 44,
  lg: 56,
  xl: 72,
  "2xl": 96,
};

const logoPadding = 0.14;

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
  const px = sizes[size] || 44;

  if (icon.logo && !imgFailed) {
    return (
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden border-2 border-border bg-surface shadow-[2px_2px_0px_var(--shadow-color)]",
          rounded && "rounded-md",
          className,
        )}
        style={{ width: px, height: px }}
        aria-hidden="true"
      >
        <img
          src={`/logos/${icon.logo}`}
          alt=""
          width={px}
          height={px}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="object-contain"
          style={{ width: "100%", height: "100%", padding: Math.round(px * logoPadding) }}
        />
      </span>
    );
  }

  const Icon = iconRegistry[icon.glyph] ?? iconFallback;
  const iconSize = Math.round(px * 0.48);
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center border-2 border-border shadow-[2px_2px_0px_var(--shadow-color)]",
        rounded && "rounded-md",
        className,
      )}
      style={{
        width: px,
        height: px,
        backgroundColor: icon.from || "#0a0a0a",
      }}
      aria-hidden="true"
    >
      <Icon size={iconSize} className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" strokeWidth={2.5} />
    </span>
  );
}