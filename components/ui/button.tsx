import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "glass" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-md font-bold whitespace-nowrap select-none border-2 border-border transition-all duration-[120ms] ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_var(--shadow-color)] disabled:pointer-events-none disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0px_var(--shadow-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-fg shadow-[3px_3px_0px_var(--shadow-color)] hover:bg-accent-hover hover:shadow-[5px_5px_0px_var(--shadow-color)]",
  secondary:
    "bg-surface text-fg shadow-[3px_3px_0px_var(--shadow-color)] hover:bg-surface-2 hover:shadow-[5px_5px_0px_var(--shadow-color)]",
  ghost:
    "border-transparent bg-transparent text-fg shadow-none hover:border-border hover:bg-surface-2 hover:shadow-[3px_3px_0px_var(--shadow-color)] active:shadow-[1px_1px_0px_var(--shadow-color)]",
  glass:
    "bg-accent-yellow text-black shadow-[3px_3px_0px_var(--shadow-color)] hover:bg-yellow-300 hover:shadow-[5px_5px_0px_var(--shadow-color)]",
  danger:
    "bg-discount text-white shadow-[3px_3px_0px_var(--shadow-color)] hover:bg-discount/90 hover:shadow-[5px_5px_0px_var(--shadow-color)]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] tracking-tight",
  md: "h-10 px-4 text-sm tracking-tight",
  lg: "h-12 px-6 text-[15px] tracking-tight",
};

const squareSizes: Record<Size, string> = {
  sm: "h-8 w-8 p-0",
  md: "h-10 w-10 p-0",
  lg: "h-12 w-12 p-0",
};

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  square?: boolean;
  loading?: boolean;
  className?: string;
}

export interface ButtonProps extends ButtonBaseProps, ComponentProps<"button"> {
  href?: undefined;
}

export interface ButtonLinkProps extends ButtonBaseProps, ComponentProps<typeof Link> {
  href: string;
}

export function Button({
  variant = "primary",
  size = "md",
  square,
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], square ? squareSizes[size] : sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  square,
  loading,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], square ? squareSizes[size] : sizes[size], className)}
      aria-disabled={loading}
      {...props}
    >
      {loading && <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" />}
      {children}
    </Link>
  );
}

/** Tombol ikon tactile — gaya Neo-Brutalist dengan border tebal dan hard shadow. */
export function IconButton({
  label,
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { label: string; size?: Size }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-md border-2 border-border bg-surface text-fg shadow-[2px_2px_0px_var(--shadow-color)] transition-all duration-[120ms] ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--shadow-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        size === "sm" ? "h-8 w-8" : size === "lg" ? "h-11 w-11" : "h-10 w-10",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function iconSize(size: Size): number {
  return size === "sm" ? 14 : size === "md" ? 16 : 18;
}
