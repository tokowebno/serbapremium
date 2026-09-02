import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends ComponentProps<"div"> {
  hover?: boolean;
}

export function GlassCard({ hover, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border-2 border-border bg-surface shadow-[4px_4px_0px_var(--shadow-color)]",
        hover && "transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_var(--shadow-color)]",
        className,
      )}
      {...props}
    />
  );
}
