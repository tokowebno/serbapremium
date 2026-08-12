import { BadgeCheck } from "lucide-react";
import type { Review } from "@/types";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-col gap-2.5 rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-[13px] font-semibold">
            {review.userName.charAt(0)}
          </span>
          <span className="text-sm font-medium">{review.userName}</span>
          {review.verified && (
            <Badge tone="success">
              <BadgeCheck size={12} />
              Pembelian terverifikasi
            </Badge>
          )}
        </div>
        <span className="text-xs text-fg-faint">{formatDate(review.date)}</span>
      </div>

      <Rating value={review.rating} showValue={false} size={13} />

      {review.title && <h4 className="text-sm font-semibold tracking-tight">{review.title}</h4>}
      <p className="text-sm leading-6 text-fg-muted">{review.content}</p>

      <p className="text-xs text-fg-faint">
        {review.helpfulCount} orang menganggap ini membantu
      </p>
    </article>
  );
}
