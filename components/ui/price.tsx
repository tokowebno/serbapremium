import { cn, discountPercent, formatRupiah } from "@/lib/utils";

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
  const textSize = size === "lg" ? "text-2xl" : size === "md" ? "text-[17px]" : "text-sm";
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-semibold tracking-tight tabular-nums", textSize)}>{formatRupiah(value)}</span>
      {original && original > value && (
        <>
          <span className="text-[13px] text-fg-faint line-through tabular-nums">
            {formatRupiah(original)}
          </span>
          <span className="text-xs font-semibold text-discount">-{discountPercent(original, value)}%</span>
        </>
      )}
    </span>
  );
}
