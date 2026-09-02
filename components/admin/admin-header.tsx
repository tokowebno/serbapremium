import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-border pb-4", className)}>
      <div>
        <h1 className="text-2xl font-black tracking-tight text-fg sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm font-medium text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function AdminToolbar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex flex-wrap items-center gap-3", className)}>{children}</div>
  );
}

export function AdminSearchInput({
  value,
  onChange,
  placeholder = "Cari…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={cn(
        "h-10 w-full max-w-xs rounded-md border-2 border-border bg-surface px-3.5 text-[13px] font-bold text-fg shadow-[2px_2px_0px_var(--shadow-color)] outline-none placeholder:text-fg-faint focus:shadow-[3px_3px_0px_var(--shadow-color)]",
        className,
      )}
    />
  );
}

export function AdminSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 cursor-pointer rounded-md border-2 border-border bg-surface px-3 text-[13px] font-bold text-fg shadow-[2px_2px_0px_var(--shadow-color)] outline-none focus:shadow-[3px_3px_0px_var(--shadow-color)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
