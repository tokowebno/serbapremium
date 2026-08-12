import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  hint,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-fg-muted">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        {(delta || hint) && (
          <p className={cn("mt-1 text-xs", delta ? "text-success" : "text-fg-faint")}>
            {delta ?? hint}
          </p>
        )}
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2">
        <Icon size={18} strokeWidth={1.75} className="text-fg-muted" />
      </span>
    </div>
  );
}
