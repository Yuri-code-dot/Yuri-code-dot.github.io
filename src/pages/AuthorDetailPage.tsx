import { useParams, Link } from "react-router-dom";
import { authorBySlug } from "../data/authors";
import { books } from "../data/books";
import { periodBySlug } from "../data/periods";
import { subjectBySlug } from "../data/subjects";
import { BookCard } from "../components/library/BookCard";
import { SourceCredit } from "../components/ui/SourceCredit";
import { EmptyState } from "../components/ui/Primitives";

export function AuthorDetailPage() {
  const { slug } = useParams();
  const author = slug ? authorBySlug(slug) : undefined;

  if (!author) {
    return (
      <div className="mx-auto max-w-[1000px] px-4 py-16 sm:px-6 lg:px-10">
        <EmptyState title="Author not found." message="This writer isn't in the catalogue yet." />
      </div>
    );
  }

  const works = books.filter((b) => author.workSlugs.includes(b.slug));
  const period = periodBySlug(author.period);

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-10">
      <Link to="/authors" className="text-xs font-mono uppercase tracking-wide text-ivory-faint hover:text-bronze-bright">
        ← Authors
      </Link>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        {author.portrait && (
          <div className="w-40 shrink-0 overflow-hidden rounded-lg border border-border sm:w-52">
            <img src={author.portrait.url} alt={author.portrait.alt} className="w-full object-cover" />
            <div className="bg-surface px-2 py-1.5">
              <SourceCredit sourceId={author.portrait.sourceId} />
            </div>
          </div>
        )}
        <div>
          <h1 className="font-display text-3xl font-bold text-ivory sm:text-4xl">{author.name}</h1>
          <p className="mt-1 font-mono text-sm text-ivory-faint">
            {author.birthYear}–{author.deathYear ?? "present"} · {author.nationality}
          </p>
          {period && (
            <span className="mt-3 inline-block rounded-full border border-bronze/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-bronze-bright">
              {period.name}
            </span>
          )}
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory-dim">{author.biography}</p>
        </div>
      </div>

      <div className="mt-10 border-t border-border/70 pt-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ivory">Major Works</h2>
        {works.length === 0 ? (
          <EmptyState title="No works catalogued yet." message="Works by this author will appear here as they're added." />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
            {works.map((b) => (
              <BookCard key={b.slug} book={b} />
            ))}
          </div>
        )}
      </div>

      {author.subjectSlugs.length > 0 && (
        <div className="mt-10 border-t border-border/70 pt-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-ivory">Curriculum Connections</h2>
          <div className="flex flex-wrap gap-2">
            {author.subjectSlugs.map((s) => {
              const subject = subjectBySlug(s);
              if (!subject) return null;
              return (
                <Link
                  key={s}
                  to={`/curriculum/${s}`}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-ivory-dim transition-colors hover:border-bronze/50 hover:text-bronze-bright"
                >
                  {subject.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {author.externalLinks && author.externalLinks.length > 0 && (
        <div className="mt-10 border-t border-border/70 pt-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-ivory">External Resources</h2>
          <ul className="space-y-1.5 text-sm">
            {author.externalLinks.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-bronze-bright hover:underline">
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
