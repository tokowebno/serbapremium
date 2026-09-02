import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
}

export function Tabs({
  items,
  active,
  onChange,
  className,
}: {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex gap-1.5 overflow-x-auto rounded-md border-2 border-border bg-surface-2 p-1.5 shadow-[2px_2px_0px_var(--shadow-color)] no-scrollbar",
        className,
      )}
    >
      {items.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "rounded-sm px-3.5 py-1.5 text-[13px] font-bold whitespace-nowrap transition-all duration-100",
            active === t.id
              ? "border-2 border-border bg-accent text-accent-fg shadow-[2px_2px_0px_var(--shadow-color)]"
              : "border-2 border-transparent text-fg-muted hover:border-border hover:bg-surface hover:text-fg",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
