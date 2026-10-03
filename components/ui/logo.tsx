"use client";

import { cn } from "@/lib/utils";

export function TexasAiIcon({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-105",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <img
        src="/logos/app-logo.png"
        alt="Logo"
        width={size}
        height={size}
        className="w-full h-full object-contain dark:hidden select-none"
        loading="eager"
        decoding="async"
      />
      <img
        src="/logos/app-logo-white.png"
        alt="Logo"
        width={size}
        height={size}
        className="w-full h-full object-contain hidden dark:block select-none"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

export function TexasAiLogo({
  className,
  iconSize = 28,
  textSize = "text-[16px]",
}: {
  className?: string;
  iconSize?: number;
  textSize?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 select-none", className)}>
      <TexasAiIcon size={iconSize} />
      <span className={cn("font-bold tracking-tight text-fg flex items-center", textSize)}>
        <span>Texas</span>
        <span className="text-accent ml-0.5 font-extrabold">AI</span>
      </span>
    </span>
  );
}

export const TokonoIcon = TexasAiIcon;
export const TokonoLogo = TexasAiLogo;
export const SerbaPremiumIcon = TexasAiIcon;
export const SerbaPremiumLogo = TexasAiLogo;
export const GPTlunaIcon = TexasAiIcon;
export const GPTlunaLogo = TexasAiLogo;
export const LogoIcon = TexasAiIcon;
export const Logo = TexasAiLogo;
