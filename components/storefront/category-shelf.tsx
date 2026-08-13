import Link from "next/link";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

/**
 * Kategori — floating system control horizontal.
 * Komposisi baru: glass shelf scrollable, bukan grid kartu.
 */
export function CategoryShelf({ className }: { className?: string }) {
  const cats = api.categories.withCount().filter((c) => c.count > 0);

  return (
    <div className={cn("no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 sm:mx-0 sm:px-0", className)}>
      {cats.map((c) => {
        const Icon = c.icon;
        return (
          <Link
            key={c.id}
            href={`/kategori/${c.slug}`}
            className="mat-func group flex shrink-0 items-center gap-2.5 rounded-full py-2 pr-5 pl-2.5 transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] hover:shadow-[var(--elev-2)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/70">
              <Icon size={15} strokeWidth={1.75} className="text-fg-muted transition-colors duration-[var(--dur-base)] group-hover:text-accent" />
            </span>
            <span className="text-[13.5px] font-medium whitespace-nowrap">{c.name}</span>
            <span className="text-xs text-fg-faint tabular-nums">{c.count}</span>
          </Link>
        );
      })}
    </div>
  );
}
