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
    <div className="glass-card rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-sm backdrop-blur-md">
      <h2 className="text-base font-bold tracking-tight text-fg">
        {t.checkout.orderSummary || "Ringkasan Pembelian"}
      </h2>

      {showItems && (
        <ul className="mt-4 divide-y divide-border/60">
          {items.map((item) => (
            <li key={item.appId + item.platform} className="flex items-center justify-between gap-3 py-3">
              <span className="min-w-0 truncate text-sm font-semibold text-fg">
                {item.name} <span className="text-xs font-normal text-fg-muted">({item.platform})</span>
              </span>
              <span className="shrink-0 text-sm font-bold tabular-nums text-fg">{formatPrice(item.price, lang)}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-4 space-y-2.5 border-t border-border/70 pt-4 text-sm font-medium">
        <div className="flex justify-between">
          <dt className="text-fg-muted">{t.checkout.subtotal || "Subtotal"}</dt>
          <dd className="tabular-nums text-fg">{formatPrice(subtotal, lang)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-fg-muted">{t.checkout.discount || "Diskon"}</dt>
            <dd className="font-bold text-discount tabular-nums">-{formatPrice(discount, lang)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-border/70 pt-3 text-lg font-bold text-fg">
          <dt>{t.checkout.total || "Total Bayar"}</dt>
          <dd className="tabular-nums text-accent">{formatPrice(Math.max(0, subtotal - discount), lang)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-accent/20 bg-accent-soft px-3 py-2 text-xs font-medium text-fg">
        <Zap size={15} strokeWidth={2.5} className="text-accent shrink-0" />
        <span>{t.checkout.buyOnceNote || "Pembelian satu kali. Tanpa biaya langganan."}</span>
      </div>
    </div>
  );
}
