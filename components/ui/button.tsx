import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "glass" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "btn-shine bg-accent text-accent-fg shadow-sm hover:bg-accent-hover",
  secondary:
    "bg-surface text-fg border border-border-strong/70 shadow-sm hover:bg-surface-2",
  ghost: "text-fg-muted hover:text-fg hover:bg-surface-2",
  glass: "glass text-fg hover:brightness-[1.03]",
  danger: "bg-discount text-white shadow-sm hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[15px]",
};

const squareSizes: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  square?: boolean;
  className?: string;
}

export interface ButtonProps extends ButtonBaseProps, ComponentProps<"button"> {
  href?: undefined;
}

export interface ButtonLinkProps extends ButtonBaseProps, ComponentProps<typeof Link> {
  href: string;
}

export function Button({ variant = "primary", size = "md", square, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], square ? squareSizes[size] : sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({ variant = "primary", size = "md", square, className, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], square ? squareSizes[size] : sizes[size], className)}
      {...props}
    />
  );
}

export function iconSize(size: Size): number {
  return size === "sm" ? 14 : size === "md" ? 16 : 18;
}
