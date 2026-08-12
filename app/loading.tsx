import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="tk-container pt-28 pb-20">
      <Skeleton className="h-12 w-72" />
      <Skeleton className="mt-4 h-4 w-96 max-w-full" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
