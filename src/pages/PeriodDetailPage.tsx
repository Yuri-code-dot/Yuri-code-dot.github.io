import { useParams, Link } from "react-router-dom";
import { periodBySlug } from "../data/periods";
import { books } from "../data/books";
import { BookCard } from "../components/library/BookCard";
import { EmptyState } from "../components/ui/Primitives";

export function PeriodDetailPage() {
  const { slug } = useParams();
  const period = slug ? periodBySlug(slug) : undefined;

  if (!period) {
    return (
      <div className="mx-auto max-w-[1000px] px-4 py-16 sm:px-6 lg:px-10">
        <EmptyState title="Period not found." message="This literary period isn't catalogued yet." />
      </div>
    );
  }

  const periodBooks = books.filter((b) => b.period === period.slug);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10">
      <Link to="/periods" className="text-xs font-mono uppercase tracking-wide text-ivory-faint hover:text-bronze-bright">
        ← Periods
      </Link>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-bronze">{period.yearRange}</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ivory sm:text-4xl">{period.name}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ivory-dim">{period.description}</p>
      <p className="mt-2 font-mono text-xs italic text-bronze-bright">{period.accentDetail}</p>

      <div className="mt-10 border-t border-border/70 pt-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ivory">Works from this period</h2>
        {periodBooks.length === 0 ? (
          <EmptyState title="Nothing found in this shelf." message="Works from this period will appear here as they're added." />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {periodBooks.map((b) => (
              <BookCard key={b.slug} book={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
