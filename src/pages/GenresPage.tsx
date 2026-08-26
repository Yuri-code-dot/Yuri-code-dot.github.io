import { Link } from "react-router-dom";
import { genres } from "../data/genres";
import { books } from "../data/books";

export function GenresPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-bronze">Discover</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ivory sm:text-4xl">Genres</h1>
      <p className="mt-2 max-w-xl text-sm text-ivory-faint">
        Forms of literary writing, from the novel to literary theory.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {genres.map((genre) => {
          const count = books.filter((b) => b.genre === genre.slug).length;
          return (
            <Link
              key={genre.slug}
              to={`/library?genre=${genre.slug}`}
              className="group flex items-start justify-between gap-3 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-bronze/50 hover:bg-surface-raised"
            >
              <div>
                <h2 className="font-display text-base font-semibold text-ivory group-hover:text-bronze-bright">
                  {genre.name}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ivory-faint">{genre.description}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-ivory-faint/70">{count}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
