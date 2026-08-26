import { Link } from "react-router-dom";
import { authors } from "../data/authors";
import { SourceCredit } from "../components/ui/SourceCredit";

export function AuthorsPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-bronze">Discover</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ivory sm:text-4xl">Authors</h1>
      <p className="mt-2 max-w-xl text-sm text-ivory-faint">
        The writers behind the catalogue — portraits and biography drawn from public-domain archives.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {authors.map((author) => (
          <Link key={author.slug} to={`/authors/${author.slug}`} className="group">
            <div className="aspect-square overflow-hidden rounded-full border border-border bg-surface-raised">
              {author.portrait && (
                <img
                  src={author.portrait.url}
                  alt={author.portrait.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <p className="mt-3 text-center font-display text-sm font-semibold text-ivory group-hover:text-bronze-bright">
              {author.name}
            </p>
            <p className="text-center font-mono text-[10px] uppercase tracking-wide text-ivory-faint">
              {author.birthYear}–{author.deathYear ?? "present"}
            </p>
            {author.portrait && (
              <div className="mt-1 text-center">
                <SourceCredit sourceId={author.portrait.sourceId} />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
