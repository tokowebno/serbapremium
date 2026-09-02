import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const controlClass =
  "w-full rounded-md border-2 border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-fg placeholder:text-fg-faint shadow-[2px_2px_0px_var(--shadow-color)] transition-all duration-100 ease-out focus:border-border focus:shadow-[4px_4px_0px_var(--shadow-color)] focus:-translate-x-0.5 focus:-translate-y-0.5 focus:outline-none";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(controlClass, "appearance-none pr-9 cursor-pointer", className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlClass, "min-h-24 resize-y", className)} {...props} />;
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-bold tracking-tight text-fg">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs font-medium text-fg-muted">{hint}</p>}
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-13 shrink-0 items-center rounded-sm border-2 border-border transition-colors duration-150 shadow-[2px_2px_0px_var(--shadow-color)]",
        checked ? "bg-accent" : "bg-surface-2",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-xs border-2 border-border bg-white shadow-[1px_1px_0px_var(--shadow-color)] transition-transform duration-150",
          checked ? "translate-x-[24px]" : "translate-x-[2px]",
        )}
      />
    </button>
  );
}
