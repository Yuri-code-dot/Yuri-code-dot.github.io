import { HeroCarousel } from "../components/home/HeroCarousel";
import { ContentRail } from "../components/home/ContentRail";
import { books, featuredBooks } from "../data/books";
import { subjects } from "../data/subjects";
import { Link } from "react-router-dom";

export function HomePage() {
  const romanticism = books.filter((b) => b.period === "romanticism");
  const poetry = books.filter((b) => b.genre === "poetry" || b.genre === "drama");
  const womensWriting = subjects.find((s) => s.slug === "womens-writing");
  const womensWritingBooks = womensWriting ? books.filter((b) => womensWriting.bookSlugs.includes(b.slug)) : [];

  return (
    <div>
      <HeroCarousel books={featuredBooks()} />

      <div className="mx-auto max-w-[1600px] divide-y divide-border/50">
        <ContentRail
          eyebrow="Just Added"
          title="Latest Additions"
          description="Recently catalogued works, ready to read."
          books={books}
        />

        <ContentRail
          eyebrow="Curriculum Spotlight"
          title="Women's Writing — Major-12"
          description="Fiction, poetry, and essay by women writers across three centuries."
          books={womensWritingBooks}
        />

        <ContentRail
          eyebrow="Literary Period"
          title="Romanticism"
          description="Imagination, nature, and the sublime — the age of Shelley, Austen, and the Gothic novel."
          books={romanticism}
        />

        <ContentRail
          eyebrow="Form"
          title="Poetry & Drama"
          description="Language shaped by rhythm, form, and the demands of the stage."
          books={poetry}
        />
      </div>

      {/* Curriculum teaser strip */}
      <section className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="rounded-xl border border-border bg-gradient-to-br from-surface to-surface-raised p-6 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-bronze">Organized by Curriculum</p>
          <h2 className="mt-2 max-w-lg font-display text-2xl font-semibold text-ivory sm:text-3xl">
            Every text connects to a semester, a paper, and a subject.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-ivory-faint">
            Browse the library the way your coursework actually runs — from Semester V's Women's Writing and
            American Literature through Semester VI's Literary Theory and the Indian Diaspora.
          </p>
          <Link
            to="/curriculum"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-bronze/40 px-5 py-2.5 text-sm font-medium text-bronze-bright transition-colors hover:bg-bronze/10"
          >
            Browse the Curriculum →
          </Link>
        </div>
      </section>
    </div>
  );
}
