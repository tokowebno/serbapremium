import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends ComponentProps<"div"> {
  hover?: boolean;
}

export function GlassCard({ hover, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl",
        hover && "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}
