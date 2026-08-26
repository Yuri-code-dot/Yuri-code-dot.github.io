import type { ReactNode } from "react";

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "bronze" | "wine" }) {
  const toneClasses = {
    default: "border-border text-ivory-dim",
    bronze: "border-bronze/40 text-bronze-bright",
    wine: "border-wine/50 text-wine-bright",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${toneClasses}`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-10">
      <div>
        {eyebrow && (
          <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.2em] text-bronze">{eyebrow}</p>
        )}
        <h2 className="font-display text-2xl font-semibold text-ivory sm:text-3xl">{title}</h2>
        {description && <p className="mt-1.5 max-w-xl text-sm text-ivory-faint">{description}</p>}
      </div>
      {action && <div className="hidden shrink-0 sm:block">{action}</div>}
    </div>
  );
}

export function Divider() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />;
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-16 text-center">
      <p className="font-display text-lg italic text-ivory-dim">{title}</p>
      <p className="max-w-sm text-sm text-ivory-faint">{message}</p>
    </div>
  );
}

export function LoadingRail() {
  return (
    <div className="flex gap-4 overflow-hidden px-4 sm:px-6 lg:px-10">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-36 shrink-0 sm:w-44">
          <div className="aspect-[2/3] animate-pulse rounded-md bg-surface-raised" />
          <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-surface-raised" />
          <div className="mt-1.5 h-2.5 w-1/2 animate-pulse rounded bg-surface-raised" />
        </div>
      ))}
    </div>
  );
}
