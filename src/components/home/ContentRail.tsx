import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Book } from "../../types";
import { BookCard } from "../library/BookCard";
import { SectionHeading, EmptyState } from "../ui/Primitives";

export function ContentRail({
  eyebrow,
  title,
  description,
  books,
  emptyMessage = "Nothing found in this shelf yet.",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  books: Book[];
  emptyMessage?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="py-8">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          books.length > 0 ? (
            <div className="flex gap-2">
              <button
                onClick={() => scroll(-1)}
                aria-label={`Scroll ${title} left`}
                className="rounded-full border border-border p-2 text-ivory-dim transition-colors hover:border-bronze hover:text-bronze"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll(1)}
                aria-label={`Scroll ${title} right`}
                className="rounded-full border border-border p-2 text-ivory-dim transition-colors hover:border-bronze hover:text-bronze"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ) : undefined
        }
      />

      {books.length === 0 ? (
        <div className="mt-4 px-4 sm:px-6 lg:px-10">
          <EmptyState title="Nothing found in this shelf." message={emptyMessage} />
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="rail-scroll mt-4 flex gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-6 lg:px-10"
        >
          {books.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}
