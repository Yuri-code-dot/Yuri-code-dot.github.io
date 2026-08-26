import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import type { Book } from "../../types";
import { authorBySlug } from "../../data/authors";
import { periodBySlug } from "../../data/periods";

export function HeroCarousel({ books }: { books: Book[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive((i) => (i + 1) % books.length), [books.length]);

  useEffect(() => {
    if (paused || books.length <= 1) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [paused, next, books.length]);

  if (books.length === 0) return null;
  const book = books[active];
  const author = authorBySlug(book.authorSlug);
  const period = periodBySlug(book.period);

  return (
    <section
      className="relative h-[78vh] min-h-[520px] w-full overflow-hidden sm:h-[85vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background layers — crossfade */}
      {books.map((b, i) => (
        <div
          key={b.slug}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          {b.cover && (
            <img
              src={b.cover.url}
              alt=""
              className="h-full w-full object-cover object-top blur-[1px] scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-14 sm:px-6 sm:pb-20 lg:px-10">
        <div key={book.slug} className="max-w-xl animate-fade-up">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-bronze-bright">
            {author?.name} · {book.publicationYear}
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
            {book.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {period && (
              <span className="rounded-full border border-bronze/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-bronze-bright">
                {period.name}
              </span>
            )}
            <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ivory-dim">
              {book.genre.replace("-", " ")}
            </span>
          </div>
          <p className="mt-4 line-clamp-3 max-w-lg text-sm leading-relaxed text-ivory-dim sm:text-base">
            {book.description}
          </p>
          <Link
            to={`/library/${book.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-wine px-5 py-3 font-medium text-ivory shadow-lg shadow-wine/20 transition-colors hover:bg-wine-bright"
          >
            <BookOpen size={17} />
            Read Now
          </Link>
        </div>
      </div>

      {/* Carousel indicators */}
      {books.length > 1 && (
        <div className="absolute bottom-5 right-4 z-10 flex gap-1.5 sm:right-6 lg:right-10">
          {books.map((b, i) => (
            <button
              key={b.slug}
              onClick={() => setActive(i)}
              aria-label={`Show ${b.title}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === active ? "w-7 bg-bronze" : "w-3 bg-ivory/25 hover:bg-ivory/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
