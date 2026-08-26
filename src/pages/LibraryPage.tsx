import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { books } from "../data/books";
import { genres } from "../data/genres";
import { periods } from "../data/periods";
import { BookCard } from "../components/library/BookCard";
import { EmptyState } from "../components/ui/Primitives";

export function LibraryPage() {
  const [searchParams] = useSearchParams();
  const [genreFilter, setGenreFilter] = useState<string | null>(searchParams.get("genre"));
  const [periodFilter, setPeriodFilter] = useState<string | null>(searchParams.get("period"));

  useEffect(() => {
    setGenreFilter(searchParams.get("genre"));
    setPeriodFilter(searchParams.get("period"));
  }, [searchParams]);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      if (genreFilter && b.genre !== genreFilter) return false;
      if (periodFilter && b.period !== periodFilter) return false;
      return true;
    });
  }, [genreFilter, periodFilter]);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-bronze">Browse</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ivory sm:text-4xl">Library</h1>
      <p className="mt-2 max-w-xl text-sm text-ivory-faint">
        The full catalogue, filterable by genre and literary period.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip active={genreFilter === null} onClick={() => setGenreFilter(null)}>
          All genres
        </FilterChip>
        {genres.map((g) => (
          <FilterChip key={g.slug} active={genreFilter === g.slug} onClick={() => setGenreFilter(g.slug)}>
            {g.name}
          </FilterChip>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <FilterChip active={periodFilter === null} onClick={() => setPeriodFilter(null)} tone="bronze">
          All periods
        </FilterChip>
        {periods.map((p) => (
          <FilterChip key={p.slug} active={periodFilter === p.slug} onClick={() => setPeriodFilter(p.slug)} tone="bronze">
            {p.name}
          </FilterChip>
        ))}
      </div>

      <div className="mt-8">
        {filtered.length === 0 ? (
          <EmptyState title="Nothing found in this shelf." message="Try another genre or literary period." />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filtered.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
  tone = "wine",
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  tone?: "wine" | "bronze";
}) {
  const activeClasses = tone === "wine" ? "border-wine bg-wine/15 text-wine-bright" : "border-bronze bg-bronze/15 text-bronze-bright";
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
        active ? activeClasses : "border-border text-ivory-faint hover:border-ivory-faint hover:text-ivory-dim"
      }`}
    >
      {children}
    </button>
  );
}
