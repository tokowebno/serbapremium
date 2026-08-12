import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Banner } from "@/types";
import { cn } from "@/lib/utils";

const tones: Record<Banner["tone"], string> = {
  accent: "bg-[#0f5a43] text-[#f2f7f4]",
  graphite: "bg-[#22211d] text-[#ecebe7]",
  warm: "bg-[#4a3826] text-[#f5efe7]",
};

export function PromoBanner({ banner, className }: { banner: Banner; className?: string }) {
  return (
    <Link
      href={banner.href}
      className={cn(
        "group flex flex-col gap-2 rounded-xl px-6 py-7 transition-shadow hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:px-8",
        tones[banner.tone],
        className,
      )}
    >
      <div>
        <h3 className="text-xl font-semibold tracking-tight">{banner.title}</h3>
        <p className="mt-1 max-w-lg text-sm leading-6 opacity-80">{banner.description}</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium opacity-90 transition-transform group-hover:translate-x-0.5">
        {banner.cta}
        <ArrowRight size={15} />
      </span>
    </Link>
  );
}
