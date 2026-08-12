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
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-surface shadow-sm",
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
      className={cn("relative inline-flex shrink-0 items-center justify-center shadow-sm", rounded && "rounded-[22%]", className)}
      style={{
        width: px,
        height: px,
        background: `linear-gradient(135deg, ${icon.from} 0%, ${icon.to} 100%)`,
      }}
      aria-hidden="true"
    >
      <Icon size={iconSize} className="text-white/90" strokeWidth={1.75} />
    </span>
  );
}