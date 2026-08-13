import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends ComponentProps<"div"> {
  hover?: boolean;
}

export function GlassCard({ hover, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "mat-strong rounded-[var(--radius-xl)]",
        hover && "transition-all duration-[var(--dur-base)] hover:shadow-[var(--elev-2)] hover:-translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}
