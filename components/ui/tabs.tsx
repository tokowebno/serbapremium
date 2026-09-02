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
        "flex gap-1 overflow-x-auto rounded-full bg-surface-2/80 p-1 shadow-[inset_0_0_0_1px_var(--border)] backdrop-blur-md no-scrollbar",
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
            "rounded-full px-4 py-1.5 text-[13px] font-medium whitespace-nowrap transition-all duration-200",
            active === t.id
              ? "bg-surface text-fg shadow-sm ring-1 ring-border"
              : "text-fg-muted hover:text-fg hover:bg-surface/50",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
