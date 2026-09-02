import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-sm border border-border/40 bg-surface-3", className)} aria-hidden="true" />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border-2 border-border bg-surface p-5 shadow-[4px_4px_0px_var(--shadow-color)]">
      <Skeleton className="h-14 w-14 rounded-md border-2 border-border" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="mt-2 h-6 w-1/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-md border-2 border-border" />
      ))}
    </div>
  );
}
