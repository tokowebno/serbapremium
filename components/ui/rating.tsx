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
  const hasHalf = value - full >= 0.25 && value - full < 0.75;
  const rounded = Math.round(value * 10) / 10;

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="inline-flex items-center gap-0.5 text-star" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) =>
          i < full ? (
            <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
          ) : i === full && hasHalf ? (
            <span key={i} className="relative inline-flex">
              <Star size={size} className="text-border-strong" fill="currentColor" strokeWidth={0} />
              <StarHalf
                size={size}
                className="absolute inset-0"
                fill="currentColor"
                strokeWidth={0}
              />
            </span>
          ) : (
            <Star key={i} size={size} className="text-border-strong" fill="currentColor" strokeWidth={0} />
          ),
        )}
      </span>
      {showValue && (
        <span className="text-[13px] font-medium tabular-nums text-fg">
          {rounded.toLocaleString("id-ID", { minimumFractionDigits: 1 })}
        </span>
      )}
      {count != null && <span className="text-[13px] text-fg-muted">{count.toLocaleString("id-ID")} ulasan</span>}
    </span>
  );
}
