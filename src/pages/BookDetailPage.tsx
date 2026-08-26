import { useParams, Link } from "react-router-dom";
import { BookOpen, ExternalLink } from "lucide-react";
import { bookBySlug, books } from "../data/books";
import { authorBySlug } from "../data/authors";
import { periodBySlug } from "../data/periods";
import { subjectBySlug } from "../data/subjects";
import { sources } from "../data/sources";
import { BookCard } from "../components/library/BookCard";
import { SourceCredit } from "../components/ui/SourceCredit";
import { EmptyState } from "../components/ui/Primitives";

export function BookDetailPage() {
  const { slug } = useParams();
  const book = slug ? bookBySlug(slug) : undefined;

  if (!book) {
    return (
      <div className="mx-auto max-w-[1000px] px-4 py-16 sm:px-6 lg:px-10">
        <EmptyState title="This book isn't on the shelf." message="It may have been moved, or hasn't been catalogued yet." />
      </div>
    );
  }

  const author = authorBySlug(book.authorSlug);
  const period = periodBySlug(book.period);
  const readingSource = sources[book.sourceId];
  const relatedBooks = books.filter((b) => book.relatedBookSlugs?.includes(b.slug));
  const subjects = book.subjectSlugs.map(subjectBySlug).filter(Boolean);

  return (
    <div>
      {/* Cinematic header */}
      <div className="relative overflow-hidden">
        {book.cover && (
          <div className="absolute inset-0">
            <img src={book.cover.url} alt="" className="h-full w-full scale-110 object-cover object-top blur-md opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/95 to-ink/60" />
          </div>
        )}
        <div className="relative mx-auto flex max-w-[1000px] flex-col gap-6 px-4 py-12 sm:flex-row sm:items-end sm:px-6 sm:py-16 lg:px-10">
          {book.cover && (
            <div className="w-40 shrink-0 overflow-hidden rounded-md border border-border shadow-2xl shadow-black/50 sm:w-56">
              <img src={book.cover.url} alt={book.cover.alt} className="w-full object-cover" />
            </div>
          )}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-bronze-bright">
              {author?.name} · {book.publicationYear}
            </p>
            <h1 className="mt-1.5 font-display text-3xl font-bold leading-tight text-ivory sm:text-4xl lg:text-5xl">
              {book.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {period && (
                <span className="rounded-full border border-bronze/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-bronze-bright">
                  {period.name}
                </span>
              )}
              <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ivory-dim">
                {book.genre.replace("-", " ")}
              </span>
              <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ivory-dim">
                {book.language}
              </span>
            </div>
            {book.readingUrl && (
              <a
                href={book.readingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-wine px-5 py-3 font-medium text-ivory shadow-lg shadow-wine/20 transition-colors hover:bg-wine-bright"
              >
                <BookOpen size={17} />
                Read Now
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-10">
        <Section title="About the Work">
          <p className="max-w-2xl text-sm leading-relaxed text-ivory-dim">{book.description}</p>
        </Section>

        {author && (
          <Section title="Author">
            <Link
              to={`/authors/${author.slug}`}
              className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-bronze/50"
            >
              {author.portrait && (
                <img src={author.portrait.url} alt="" className="h-14 w-14 rounded-full object-cover" />
              )}
              <div>
                <p className="font-display font-semibold text-ivory">{author.name}</p>
                <p className="font-mono text-xs text-ivory-faint">
                  {author.birthYear}–{author.deathYear ?? "present"}
                </p>
              </div>
            </Link>
          </Section>
        )}

        {period && (
          <Section title="Literary Context">
            <p className="max-w-2xl text-sm leading-relaxed text-ivory-dim">
              Written during the <strong className="text-ivory">{period.name}</strong> ({period.yearRange}),
              a period defined by {period.accentDetail.toLowerCase()}. {period.description}
            </p>
          </Section>
        )}

        {book.themes && book.themes.length > 0 && (
          <Section title="Themes">
            <div className="flex flex-wrap gap-2">
              {book.themes.map((theme) => (
                <span key={theme} className="rounded-full border border-border px-3 py-1 text-xs text-ivory-dim">
                  {theme}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Signature element: curriculum lineage thread */}
        {subjects.length > 0 && (
          <Section title="Curriculum Connections">
            <div className="space-y-3">
              {subjects.map((subject) => {
                if (!subject) return null;
                return (
                  <Link
                    key={subject.slug}
                    to={`/curriculum/${subject.slug}`}
                    className="group block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-bronze/50"
                  >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-wide text-ivory-faint">
                      <span>Semester {subject.semester}</span>
                      <LineageArrow />
                      <span>{subject.paperCode}</span>
                      <LineageArrow />
                      <span className="text-bronze-bright">{subject.name}</span>
                      <LineageArrow />
                      <span>{author?.name}</span>
                      <LineageArrow />
                      <span className="text-ivory">{book.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Section>
        )}

        {relatedBooks.length > 0 && (
          <Section title="Related Works">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
              {relatedBooks.map((b) => (
                <BookCard key={b.slug} book={b} />
              ))}
            </div>
          </Section>
        )}

        <Section title="Sources & Attribution">
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-ivory-dim">
                <span className="text-ivory-faint">Reading text: </span>
                {readingSource?.name}
              </p>
              <p className="mt-1 text-ivory-dim">
                <span className="text-ivory-faint">License: </span>
                {book.license}
              </p>
              {book.readingUrl && (
                <a
                  href={book.readingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-bronze-bright hover:underline"
                >
                  View original source <ExternalLink size={12} />
                </a>
              )}
            </div>
            {book.cover && (
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-ivory-faint">Cover / portrait image:</p>
                <SourceCredit sourceId={book.cover.sourceId} className="mt-1 block" />
              </div>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}

function LineageArrow() {
  return <span className="text-bronze/50">→</span>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 border-t border-border/70 pt-6 first:mt-0 first:border-t-0 first:pt-0">
      <h2 className="mb-4 font-display text-lg font-semibold text-ivory">{title}</h2>
      {children}
    </div>
  );
}
