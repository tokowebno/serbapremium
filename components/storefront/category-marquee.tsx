import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

/**
 * Strip kategori berjalan horizontal — berhenti saat cursor di atasnya.
 * Konten digandakan dua kali agar loop mulus (translateX -50%).
 */
export function CategoryMarquee({ className }: { className?: string }) {
  const cats = api.categories.withCount().filter((c) => c.count > 0);
  const items = [...cats, ...cats]; // duplikat untuk loop mulus

  return (
    <div
      className={cn("marquee relative overflow-hidden border-y-2 border-border bg-surface-2 py-4 select-none", className)}
      aria-hidden="true"
    >
      <div className="marquee-track items-center gap-3 pr-3">
        {items.map((c, i) => (
          <span
            key={`${c.id}-${i}`}
            className="flex shrink-0 items-center gap-2 rounded-sm border-2 border-border bg-surface px-3.5 py-1.5 text-[13px] font-bold text-fg shadow-[2px_2px_0px_var(--shadow-color)]"
          >
            <c.icon size={15} strokeWidth={2.5} className="text-accent-blue dark:text-accent" />
            {c.name}
            <span className="rounded-xs border border-border bg-surface-2 px-1 py-0.2 text-[10px] font-black tabular-nums text-fg-muted">
              {c.count}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
