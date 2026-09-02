import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ButtonLink } from "./button";
import { Reveal } from "./reveal";

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
    <div
      className={`glass-card flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-border/80 bg-surface/80 px-6 py-16 text-center shadow-sm backdrop-blur-md ${
        className ?? ""
      }`}
    >
      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent ring-1 ring-accent/20">
        <Icon size={26} strokeWidth={1.8} />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-fg">{title}</h3>
      {description && <p className="max-w-sm text-sm font-normal text-fg-muted">{description}</p>}
      {action && (
        <ButtonLink href={action.href} variant="secondary" className="mt-4 rounded-full">
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
    <Reveal className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${className ?? ""}`}>
      <div className="max-w-xl">
        {eyebrow && (
          <div className="mb-2">
            <span className="inline-block rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold tracking-wide text-accent uppercase">
              {eyebrow}
            </span>
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">{title}</h2>
        {description && <p className="mt-1.5 text-sm font-normal leading-relaxed text-fg-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
