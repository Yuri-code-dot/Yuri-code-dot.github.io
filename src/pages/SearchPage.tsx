import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { books } from "../data/books";
import { authors } from "../data/authors";
import { BookCard } from "../components/library/BookCard";
import { EmptyState } from "../components/ui/Primitives";

const SUGGESTIONS = [
  "Women's Writing",
  "Shakespeare",
  "Victorian Literature",
  "Postcolonial Literature",
  "American Literature",
  "Modern European Drama",
];

export function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return { books: [], authors: [] };
    const q = query.toLowerCase();
    return {
      books: books.filter((b) => b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)),
      authors: authors.filter((a) => a.name.toLowerCase().includes(q)),
    };
  }, [query]);

  const hasQuery = query.trim().length > 0;
  const hasResults = results.books.length > 0 || results.authors.length > 0;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10">
      <div className="relative">
        <SearchIcon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ivory-faint" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books, authors, subjects..."
          className="w-full rounded-lg border border-border bg-surface py-3.5 pl-12 pr-4 text-ivory placeholder:text-ivory-faint focus:border-bronze focus:outline-none"
        />
      </div>

      {!hasQuery && (
        <div className="mt-6 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-ivory-faint transition-colors hover:border-bronze/50 hover:text-bronze-bright"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {hasQuery && !hasResults && (
        <div className="mt-10">
          <EmptyState title="Nothing found in this shelf." message="Try another author, subject, or literary period." />
        </div>
      )}

      {results.books.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-ivory">Books</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {results.books.map((b) => (
              <BookCard key={b.slug} book={b} />
            ))}
          </div>
        </div>
      )}

      {results.authors.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-ivory">Authors</h2>
          <div className="flex flex-wrap gap-3">
            {results.authors.map((a) => (
              <Link key={a.slug} to={`/authors/${a.slug}`} className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-ivory hover:border-bronze/50">
                {a.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
