import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ButtonLink } from "./button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 px-6 py-20 text-center ${className ?? ""}`}>
      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2">
        <Icon size={24} className="text-fg-muted" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {description && <p className="max-w-sm text-sm text-fg-muted">{description}</p>}
      {action && (
        <ButtonLink href={action.href} variant="secondary" className="mt-4">
          {action.label}
        </ButtonLink>
      )}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${className ?? ""}`}>
      <div className="max-w-xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase">{eyebrow}</p>
        )}
        <h2 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h2>
        {description && <p className="mt-2 text-[15px] leading-6 text-fg-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
