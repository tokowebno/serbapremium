import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

/**
 * Tabel admin responsif: tabel di desktop, kartu di mobile.
 * Ponytail: tanpa sorting/pagination generik — tambahkan saat data sungguhan masuk.
 */
export function DataTable<T>({ columns, rows, empty }: { columns: Column<T>[]; rows: T[]; empty?: ReactNode }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface">
        {empty ?? <p className="px-6 py-12 text-center text-sm text-fg-muted">Tidak ada data.</p>}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--elev-1)]">
      {/* Desktop */}
      <table className="hidden w-full text-sm md:table">
        <thead>
          <tr className="border-b border-border bg-surface-2/60 text-left">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn("px-4 py-3 text-xs font-semibold tracking-wide text-fg-muted", c.className)}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i} className="transition-colors hover:bg-surface-2/40">
              {columns.map((c) => (
                <td key={c.key} className={cn("px-4 py-3 align-middle", c.className)}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <ul className="divide-y divide-border md:hidden">
        {rows.map((row, i) => (
          <li key={i} className="px-4 py-4">
            <div className="grid gap-2">
              {columns.map((c) => (
                <div key={c.key} className="flex items-baseline justify-between gap-3">
                  <span className="shrink-0 text-xs font-medium text-fg-faint">{c.header}</span>
                  <span className="min-w-0 text-right text-[13px]">{c.render(row)}</span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}