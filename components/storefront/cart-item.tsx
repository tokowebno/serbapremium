"use client";

import { X } from "lucide-react";
import type { CartItem } from "@/types";
import { AppIcon } from "@/components/ui/app-icon";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "./providers";
import type { Platform } from "@/types";

const platforms: Platform[] = ["Android", "iOS", "Windows", "macOS", "Linux", "Web"];

export function CartItemRow({ item }: { item: CartItem }) {
  const { remove } = useCart();
  return (
    <div className="flex items-center gap-4 py-4">
      <AppIcon icon={item.icon} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-black tracking-tight text-fg">{item.name}</p>
        <p className="text-xs font-semibold text-fg-muted">
          Lisensi digital · <span className="rounded-xs border border-border bg-surface-2 px-1 text-fg">{item.platform}</span>
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
          className="h-8 rounded-sm border-2 border-border bg-surface px-2 text-xs font-bold text-fg shadow-[1px_1px_0px_var(--shadow-color)] outline-none"
        >
          {platforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <span className="w-24 text-right text-base font-black tabular-nums text-fg">{formatRupiah(item.price)}</span>
      <button
        onClick={() => remove(item.appId, item.platform)}
        aria-label={`Hapus ${item.name} dari keranjang`}
        className="rounded-sm border-2 border-border bg-surface-2 p-1.5 text-fg shadow-[1.5px_1.5px_0px_var(--shadow-color)] transition-all hover:bg-discount hover:text-white active:translate-x-0.5 active:translate-y-0.5"
      >
        <X size={15} strokeWidth={2.5} />
      </button>
    </div>
  );
}
