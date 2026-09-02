import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "discount" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-fg border-border",
  accent: "bg-accent text-accent-fg border-border font-bold",
  discount: "bg-discount text-white border-border font-bold",
  success: "bg-accent-yellow text-black border-border font-bold",
  warning: "bg-accent-orange text-black border-border font-bold",
  danger: "bg-discount text-white border-border font-bold",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border-2 px-2 py-0.5 text-[11px] font-bold tracking-tight shadow-[1.5px_1.5px_0px_var(--shadow-color)] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
