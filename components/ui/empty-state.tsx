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
      className={`flex flex-col items-center justify-center gap-2.5 rounded-lg border-2 border-border bg-surface px-6 py-16 text-center shadow-[4px_4px_0px_var(--shadow-color)] ${
        className ?? ""
      }`}
    >
      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-md border-2 border-border bg-accent-yellow shadow-[2px_2px_0px_var(--shadow-color)]">
        <Icon size={26} className="text-black" strokeWidth={2.2} />
      </div>
      <h3 className="text-xl font-extrabold tracking-tight text-fg">{title}</h3>
      {description && <p className="max-w-sm text-sm font-medium text-fg-muted">{description}</p>}
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
    <Reveal className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${className ?? ""}`}>
      <div className="max-w-xl">
        {eyebrow && (
          <div className="mb-2.5">
            <span className="inline-block rounded-xs border-1.5 border-border bg-fg px-2 py-0.5 text-[11px] font-black tracking-wider text-bg uppercase shadow-[1px_1px_0px_var(--shadow-color)]">
              {eyebrow}
            </span>
          </div>
        )}
        <h2 className="text-2xl font-black tracking-tight text-fg sm:text-[32px] sm:leading-tight">{title}</h2>
        {description && <p className="mt-1.5 text-[15px] font-medium leading-6 text-fg-muted">{description}</p>}
      </div>
      {action}
    </Reveal>
  );
}
