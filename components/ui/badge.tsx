import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "discount" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-fg-muted border-border",
  accent: "bg-accent-soft text-accent border-accent/25 font-semibold",
  discount: "bg-discount-soft text-discount border-discount/25 font-semibold",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 font-semibold",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 font-semibold",
  danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25 font-semibold",
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
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-tight",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
