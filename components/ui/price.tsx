"use client";

import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { useTranslation } from "@/components/storefront/i18n-provider";

export function Price({
  value,
  original,
  size = "md",
  className,
}: {
  value: number;
  original?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { lang } = useTranslation();
  const textSize = size === "lg" ? "text-2xl sm:text-3xl" : size === "md" ? "text-lg sm:text-xl" : "text-[15px]";
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className={cn("font-black tracking-tight tabular-nums text-fg", textSize)}>
        {formatPrice(value, lang)}
      </span>
      {original && original > value && (
        <>
          <span className="text-[13px] font-semibold text-fg-muted line-through tabular-nums decoration-2">
            {formatPrice(original, lang)}
          </span>
          <span className="rounded-sm border-2 border-border bg-discount px-1.5 py-0.2 text-[11px] font-black text-white shadow-[1px_1px_0px_var(--shadow-color)]">
            -{discountPercent(original, value)}%
          </span>
        </>
      )}
    </span>
  );
}
