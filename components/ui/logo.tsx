import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function SerbaPremiumIcon({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-surface-2 text-fg shadow-xs ring-1 ring-border/80 transition-transform duration-200 group-hover:scale-105",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Zap size={Math.round(size * 0.55)} className="fill-current stroke-current" strokeWidth={1.5} />
    </span>
  );
}

export function SerbaPremiumLogo({
  className,
  iconSize = 28,
  textSize = "text-[16px]",
}: {
  className?: string;
  iconSize?: number;
  textSize?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 select-none", className)}>
      <SerbaPremiumIcon size={iconSize} />
      <span className={cn("font-bold tracking-tight text-fg", textSize)}>
        Serba<span className="text-accent">Premium</span>
      </span>
    </span>
  );
}
