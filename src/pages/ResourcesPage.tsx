import { sources } from "../data/sources";

export function ResourcesPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-bronze">Directory</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ivory sm:text-4xl">Resources</h1>
      <p className="mt-2 max-w-xl text-sm text-ivory-faint">
        Open-access and public-domain archives referenced throughout the library.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {Object.values(sources)
          .filter((s) => s.accessType === "public-domain" || s.accessType === "open-access")
          .filter((s) => !s.id.startsWith("npg-") && s.id !== "yale-dickinson" && s.id !== "lilly-library-austen")
          .map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border bg-surface p-4 transition-colors hover:border-bronze/50"
            >
              <p className="font-display font-semibold text-ivory">{source.name}</p>
              <p className="mt-1 text-xs text-ivory-faint">{source.license}</p>
            </a>
          ))}
      </div>
    </div>
  );
}

export function SourcesCreditsPage() {
  const allSources = Object.values(sources);
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-bronze">Transparency</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ivory sm:text-4xl">Sources & Credits</h1>
      <p className="mt-2 max-w-xl text-sm text-ivory-faint">
        Every image and text in this library traces back to a documented, public-domain or open-access source.
        Individual item licenses vary — always confirm the specific item's terms before reuse.
      </p>

      <div className="mt-8 divide-y divide-border/70 border-y border-border/70">
        {allSources.map((source) => (
          <div key={source.id} className="py-4">
            <p className="font-display font-medium text-ivory">{source.name}</p>
            {source.attribution && <p className="mt-0.5 text-sm text-ivory-dim">{source.attribution}</p>}
            <p className="mt-0.5 font-mono text-xs uppercase tracking-wide text-bronze">{source.license}</p>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-xs text-ivory-faint hover:text-bronze-bright hover:underline"
            >
              {source.url}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
