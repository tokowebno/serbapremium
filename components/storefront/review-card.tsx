import { BadgeCheck } from "lucide-react";
import type { Review } from "@/types";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border-2 border-border bg-surface p-5 shadow-[4px_4px_0px_var(--shadow-color)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-accent-yellow text-sm font-black text-black shadow-[1.5px_1.5px_0px_var(--shadow-color)]">
            {review.userName.charAt(0)}
          </span>
          <span className="text-sm font-bold text-fg">{review.userName}</span>
          {review.verified && (
            <Badge tone="success">
              <BadgeCheck size={12} strokeWidth={2.5} />
              Terverifikasi
            </Badge>
          )}
        </div>
        <span className="rounded-xs border border-border bg-surface-2 px-1.5 py-0.5 text-xs font-bold tabular-nums text-fg-muted">
          {formatDate(review.date)}
        </span>
      </div>

      <Rating value={review.rating} showValue={false} size={14} />

      {review.title && <h4 className="text-sm font-black tracking-tight text-fg">{review.title}</h4>}
      <p className="text-sm font-medium leading-relaxed text-fg-muted">{review.content}</p>

      <p className="text-xs font-bold text-fg-faint">
        {review.helpfulCount} orang menganggap ulasan ini membantu
      </p>
    </article>
  );
}
