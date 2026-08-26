import { sources } from "../../data/sources";

/** Small, unobtrusive credit line for an image — links to the source's canonical page. */
export function SourceCredit({ sourceId, className = "" }: { sourceId: string; className?: string }) {
  const source = sources[sourceId];
  if (!source) return null;

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block font-mono text-[10px] uppercase tracking-wide text-ivory-faint/70 transition-colors hover:text-bronze ${className}`}
    >
      {source.attribution ?? source.name}
    </a>
  );
}
