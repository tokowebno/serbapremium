import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "glass" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]";

const variants: Record<Variant, string> = {
  primary:
    "btn-shine bg-accent text-accent-fg shadow-[var(--elev-1)] hover:bg-accent-hover hover:shadow-[var(--elev-2)]",
  secondary:
    "mat-func text-fg shadow-[var(--elev-1)] hover:bg-surface-2 hover:border-[var(--border-strong)] hover:shadow-[var(--elev-2)]",
  ghost: "text-fg-muted hover:text-fg hover:bg-surface-2/80",
  glass: "mat-func text-fg hover:brightness-[1.04] shadow-[var(--elev-1)] hover:shadow-[var(--elev-2)]",
  danger: "bg-[var(--discount)] text-white shadow-[var(--elev-1)] hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
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

/** Tombol ikon floating — kontrol kaca bulat untuk aksi kecil. */
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
        "mat-func inline-flex items-center justify-center rounded-full text-fg-muted transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] hover:text-fg hover:shadow-[var(--elev-2)] active:scale-95",
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
  return size === "sm" ? 14 : size === "lg" ? 18 : 16;
}
