"use client";

import { X } from "lucide-react";
import type { CartItem } from "@/types";
import { AppIcon } from "@/components/ui/app-icon";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./providers";
import { useTranslation } from "./i18n-provider";
import type { Platform } from "@/types";

const platforms: Platform[] = ["Android", "iOS", "Windows", "macOS", "Linux", "Web"];

export function CartItemRow({ item }: { item: CartItem }) {
  const { remove } = useCart();
  const { lang, t } = useTranslation();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border/70 last:border-b-0">
      <AppIcon icon={item.icon} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold tracking-tight text-fg">{item.name}</p>
        <p className="text-xs font-medium text-fg-muted mt-0.5">
          {t.product.lifetime || "Lisensi digital"} · <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] text-fg font-medium ring-1 ring-border/50">{item.platform}</span>
        </p>
      </div>
      <div className="hidden sm:block">
        <label className="sr-only" htmlFor={`platform-${item.appId}`}>
          Platform untuk {item.name}
        </label>
        <select
          id={`platform-${item.appId}`}
          value={item.platform}
          onChange={() => {}}
          className="h-8 rounded-full border border-border/80 bg-surface/80 px-2.5 text-xs font-medium text-fg shadow-xs outline-none"
        >
          {platforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <span className="w-28 text-right text-base font-bold tabular-nums text-fg">{formatPrice(item.price, lang)}</span>
      <button
        onClick={() => remove(item.appId, item.platform)}
        aria-label={`Hapus ${item.name} dari keranjang`}
        className="rounded-full p-2 text-fg-muted transition-colors hover:bg-rose-500/10 hover:text-rose-600 active:scale-95"
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
