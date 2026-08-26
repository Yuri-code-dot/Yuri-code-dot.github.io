import { Link } from "react-router-dom";
import { periods } from "../data/periods";

export function PeriodsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-bronze">Discover</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ivory sm:text-4xl">Literary Periods</h1>
      <p className="mt-2 max-w-xl text-sm text-ivory-faint">
        Movements and eras that shaped how English-language literature was written and read.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {periods.map((period) => (
          <Link
            key={period.slug}
            to={`/periods/${period.slug}`}
            className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-bronze/50 hover:bg-surface-raised"
          >
            <p className="font-mono text-xs uppercase tracking-wide text-bronze">{period.yearRange}</p>
            <h2 className="mt-1.5 font-display text-xl font-semibold text-ivory group-hover:text-bronze-bright">
              {period.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ivory-faint">{period.description}</p>
            <p className="mt-3 font-mono text-[11px] italic text-ivory-faint/70">{period.accentDetail}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
