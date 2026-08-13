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
      className={cn("marquee relative overflow-hidden py-6 select-none", className)}
      aria-hidden="true"
    >
      <div className="marquee-track items-center gap-3 pr-3">
        {items.map((c, i) => (
          <span
            key={`${c.id}-${i}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-medium text-fg-muted"
          >
            <c.icon size={14} className="text-accent" />
            {c.name}
            <span className="text-fg-faint tabular-nums">{c.count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
