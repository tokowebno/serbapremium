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
        <p className="truncate text-sm font-semibold tracking-tight">{item.name}</p>
        <p className="text-[13px] text-fg-muted">
          Lisensi satu perangkat · <span className="text-fg">{item.platform}</span>
        </p>
      </div>
      <div className="hidden sm:block">
        <label className="sr-only" htmlFor={`platform-${item.appId}`}>
          Platform untuk {item.name}
        </label>
        <select
          id={`platform-${item.appId}`}
          value={item.platform}
          onChange={(e) => {
            /* ponytail: ganti platform = ganti item — backend akan menangani ini */
            void e;
          }}
          className="h-8 rounded-md border border-border bg-surface px-2 text-[13px] outline-none"
        >
          {platforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <span className="w-24 text-right text-sm font-semibold tabular-nums">{formatRupiah(item.price)}</span>
      <button
        onClick={() => remove(item.appId, item.platform)}
        aria-label={`Hapus ${item.name} dari keranjang`}
        className="rounded-md p-1.5 text-fg-faint transition-colors hover:bg-discount-soft hover:text-discount"
      >
        <X size={16} />
      </button>
    </div>
  );
}
