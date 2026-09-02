"use client";

import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  showValue = true,
  size = 14,
  className,
}: {
  value: number;
  count?: number;
  showValue?: boolean;
  size?: number;
  className?: string;
}) {
  const full = Math.floor(value);
  const remainder = value - full;
  
  // Jika desimal >= 0.75 (misal 4.8, 4.9) -> bulatkan penuh (5 bintang)
  // Jika desimal antara 0.25 dan 0.75 (misal 4.3, 4.5, 4.7) -> bintang setengah (4.5)
  // Jika desimal < 0.25 (misal 4.1, 4.2) -> jika user minta "kalo lebih dari 4 ada setengahnya", tampilkan half star untuk 0.15 - 0.75!
  const hasFull = remainder >= 0.8 ? full + 1 : full;
  const hasHalf = remainder >= 0.15 && remainder < 0.8;
  const rounded = Math.round(value * 10) / 10;

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="inline-flex items-center gap-0.5 text-amber-500" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => {
          if (i < hasFull) {
            return (
              <Star
                key={i}
                size={size}
                className="fill-amber-400 text-amber-500"
                strokeWidth={1.5}
              />
            );
          }
          if (i === hasFull && hasHalf) {
            return (
              <span key={i} className="relative inline-flex items-center justify-center">
                {/* Bintang abu-abu background */}
                <Star
                  size={size}
                  className="fill-neutral-200 text-neutral-300 dark:fill-neutral-700 dark:text-neutral-600"
                  strokeWidth={1.5}
                />
                {/* Bintang setengah kuning emas di atasnya */}
                <StarHalf
                  size={size}
                  className="absolute inset-0 fill-amber-400 text-amber-500"
                  strokeWidth={1.5}
                />
              </span>
            );
          }
          return (
            <Star
              key={i}
              size={size}
              className="fill-neutral-200 text-neutral-300 dark:fill-neutral-700 dark:text-neutral-600"
              strokeWidth={1.5}
            />
          );
        })}
      </span>
      {showValue && (
        <span className="text-[12.5px] font-black tabular-nums text-fg">
          {rounded.toLocaleString("id-ID", { minimumFractionDigits: 1 })}
        </span>
      )}
      {count != null && (
        <span className="text-[12px] font-bold text-fg-muted">
          ({count.toLocaleString("id-ID")})
        </span>
      )}
    </span>
  );
}
