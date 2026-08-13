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

const logoPadding = 0.16;

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
  const px = sizes[size];

  if (icon.logo) {
    return (
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-surface shadow-[var(--elev-1)] ring-1 ring-border/50",
          rounded && "rounded-[22%]",
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
          className="object-contain"
          style={{ width: "100%", height: "100%", padding: px * logoPadding }}
        />
      </span>
    );
  }

  const Icon = iconRegistry[icon.glyph] ?? iconFallback;
  const iconSize = Math.round(px * 0.44);
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center shadow-[var(--elev-1)] ring-1 ring-black/5", rounded && "rounded-[22%]", className)}
      style={{
        width: px,
        height: px,
        background: `linear-gradient(135deg, ${icon.from} 0%, ${icon.to} 100%)`,
      }}
      aria-hidden="true"
    >
      {/* highlight atas — kesan kaca pada ikon */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[inherit] bg-gradient-to-b from-white/25 to-transparent" />
      <Icon size={iconSize} className="text-white/90" strokeWidth={1.75} />
    </span>
  );
}