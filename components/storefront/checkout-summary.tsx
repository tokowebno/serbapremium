"use client";

import type { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Zap } from "lucide-react";
import { useTranslation } from "./i18n-provider";

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
  const { lang, t } = useTranslation();

  return (
    <div className="rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
      <h2 className="text-base font-black tracking-tight uppercase text-fg">
        {t.checkout.orderSummary || "Ringkasan Pembelian"}
      </h2>

      {showItems && (
        <ul className="mt-4 divide-y-2 divide-border">
          {items.map((item) => (
            <li key={item.appId + item.platform} className="flex items-center justify-between gap-3 py-3">
              <span className="min-w-0 truncate text-sm font-bold text-fg">
                {item.name} <span className="text-xs font-semibold text-fg-muted">({item.platform})</span>
              </span>
              <span className="shrink-0 text-sm font-black tabular-nums text-fg">{formatPrice(item.price, lang)}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-4 space-y-2.5 border-t-2 border-border pt-4 text-sm font-bold">
        <div className="flex justify-between">
          <dt className="text-fg-muted">{t.checkout.subtotal || "Subtotal"}</dt>
          <dd className="tabular-nums text-fg">{formatPrice(subtotal, lang)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-fg-muted">{t.checkout.discount || "Diskon"}</dt>
            <dd className="font-black text-discount tabular-nums">-{formatPrice(discount, lang)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t-2 border-border pt-3 text-lg font-black text-fg">
          <dt>{t.checkout.total || "Total Bayar"}</dt>
          <dd className="tabular-nums">{formatPrice(Math.max(0, subtotal - discount), lang)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center gap-2 rounded-sm border-2 border-border bg-accent px-3 py-2 text-xs font-black text-black shadow-[2px_2px_0px_var(--shadow-color)]">
        <Zap size={15} strokeWidth={3} className="fill-current" />
        <span>{t.checkout.buyOnceNote || "Pembelian satu kali. Tanpa biaya langganan."}</span>
      </div>
    </div>
  );
}
