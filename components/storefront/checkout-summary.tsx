"use client";

import type { CartItem } from "@/types";
import { formatRupiah } from "@/lib/utils";

export function CheckoutSummary({
  items,
  subtotal,
  discount,
  showItems = true,
}: {
  items: CartItem[];
  subtotal: number;
  discount: number;
  showItems?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-[15px] font-semibold tracking-tight">Ringkasan Pembelian</h2>

      {showItems && (
        <ul className="mt-4 divide-y divide-border">
          {items.map((item) => (
            <li key={item.appId + item.platform} className="flex items-center justify-between gap-3 py-3">
              <span className="min-w-0 truncate text-sm">
                {item.name} <span className="text-fg-faint">· {item.platform}</span>
              </span>
              <span className="shrink-0 text-sm tabular-nums">{formatRupiah(item.price)}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-fg-muted">Subtotal</dt>
          <dd className="tabular-nums">{formatRupiah(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-fg-muted">Diskon</dt>
            <dd className="font-medium text-discount tabular-nums">-{formatRupiah(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatRupiah(Math.max(0, subtotal - discount))}</dd>
        </div>
      </dl>

      <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-[13px] leading-5 text-accent">
        Pembelian satu kali. Tidak ada langganan.
      </p>
    </div>
  );
}
