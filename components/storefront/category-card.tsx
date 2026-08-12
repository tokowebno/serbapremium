import Link from "next/link";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

export function CategoryCard({
  category,
  count,
  className,
}: {
  category: Category;
  count?: number;
  className?: string;
}) {
  const Icon = category.icon;
  return (
    <Link
      href={`/kategori/${category.slug}`}
      className={cn(
        "glass-card glass-card-hover group flex flex-col gap-3 rounded-xl p-5",
        className,
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 transition-colors group-hover:bg-accent-soft">
        <Icon size={20} strokeWidth={1.75} className="text-fg-muted transition-colors group-hover:text-accent" />
      </span>
      <div>
        <h3 className="text-[15px] font-semibold tracking-tight">{category.name}</h3>
        {count != null && <p className="mt-0.5 text-[13px] text-fg-muted">{count} aplikasi</p>}
      </div>
    </Link>
  );
}
