import { Link } from "react-router-dom";
import type { Book } from "../../types";
import { authorBySlug } from "../../data/authors";

export function BookCard({ book }: { book: Book }) {
  const author = authorBySlug(book.authorSlug);

  return (
    <Link
      to={`/library/${book.slug}`}
      className="group w-36 shrink-0 sm:w-44"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-border bg-surface-raised shadow-lg shadow-black/30 transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-bronze/50">
        {book.cover ? (
          <img
            src={book.cover.url}
            alt={book.cover.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              e.currentTarget.parentElement?.classList.add("cover-fallback");
            }}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <span className="p-3 font-mono text-[10px] uppercase tracking-wider text-bronze-bright">Read now →</span>
        </div>
      </div>
      <div className="mt-2.5 space-y-0.5">
        <p className="line-clamp-2 font-display text-sm font-semibold leading-snug text-ivory group-hover:text-bronze-bright">
          {book.title}
        </p>
        <p className="truncate text-xs text-ivory-faint">{author?.name}</p>
        <p className="font-mono text-[10px] uppercase tracking-wide text-ivory-faint/70">
          {book.publicationYear} · {book.genre.replace("-", " ")}
        </p>
      </div>
    </Link>
  );
}
