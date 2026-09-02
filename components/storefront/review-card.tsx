import { BadgeCheck } from "lucide-react";
import type { Review } from "@/types";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-surface/80 p-5 shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
            {review.userName.charAt(0)}
          </span>
          <span className="text-sm font-semibold text-fg">{review.userName}</span>
          {review.verified && (
            <Badge tone="success">
              <BadgeCheck size={12} strokeWidth={2} />
              Terverifikasi
            </Badge>
          )}
        </div>
        <span className="text-xs font-medium tabular-nums text-fg-muted">
          {formatDate(review.date)}
        </span>
      </div>

      <Rating value={review.rating} showValue={false} size={13} />

      {review.title && <h4 className="text-sm font-semibold tracking-tight text-fg">{review.title}</h4>}
      <p className="text-sm font-normal leading-relaxed text-fg-muted">{review.content}</p>

      <p className="text-xs font-medium text-fg-faint">
        {review.helpfulCount} orang menganggap ulasan ini membantu
      </p>
    </article>
  );
}
