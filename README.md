# English Literature Library

**Powered by Tensoramax Lab**

A cinematic, dark-first, mobile-first literature discovery platform for English
Literature students — organized around real department curriculum (Semester →
Paper → Subject → Author → Work), built with real public-domain imagery and
transparent source attribution throughout.

This is Phase 1–6 of the project: visual system, homepage, library, curriculum,
authors, literary periods, genres, and book detail pages. The LLM Librarian
(Phase 11) is **not implemented** — the data architecture is prepared for it,
but no chatbot exists in this build.

## Stack

- React 19 + TypeScript + Vite 7
- Tailwind CSS 4 (CSS-first config via `@theme` in `src/index.css` — no
  `tailwind.config.js`)
- React Router 6 for client-side routing
- lucide-react for icons
- Zero backend — all content is static TypeScript data in `src/data/`,
  structured so it can move to a real API/database later without touching
  component code

## Getting started (Termux / phone-only workflow)

```bash
cd english-lit-library
npm install
npm run dev        # local dev server
npm run build       # production build → dist/
npm run preview     # preview the production build
```

If `npm run dev` is slow or flaky over a mobile connection, `npm run build`
followed by `npm run preview` is often more stable on constrained networks.

## Project structure

```
src/
  types/index.ts       — the entire data model (Book, Author, Subject, Source…)
  data/                 — static content: sources.ts, periods.ts, genres.ts,
                          authors.ts, books.ts, subjects.ts
  components/
    layout/              — Header, Footer, Layout
    home/                — HeroCarousel, ContentRail
    library/             — BookCard
    ui/                  — Primitives (Badge, SectionHeading, EmptyState,
                          LoadingRail), Accordion, SourceCredit
  pages/                 — one file per route
  App.tsx                — router wiring
```

## Data architecture

Every entity (`Book`, `Author`, `Subject`) carries a stable `slug` for routing
and references a `Source` record for attribution. The curriculum relationship
the spec calls out —

```
Semester → Paper → Subject → Authors → Works → Resources
```

— is modeled directly: `Subject.bookSlugs` / `Subject.authorSlugs` link
outward, and `Book.subjectSlugs` / `Author.subjectSlugs` link back. This is
the same shape the future LLM Librarian will need to query, so no
restructuring should be required to wire it in later — it becomes a
retrieval layer over `src/data/`, not a rebuild of it.

To move from static data to a real API: replace the array exports in
`src/data/*.ts` with fetch calls (or a small data-loading hook) that return
the same shapes. Components never import raw arrays directly except through
the exported lookup functions (`bookBySlug`, `authorBySlug`, etc.), so that's
the seam to swap.

## Image sourcing & attribution

All portraits and book-identity imagery in this build are real, public-domain
assets from Wikimedia Commons, credited via the National Portrait Gallery
(London), Yale University's Todd-Bingham Collection, and the Lilly Library
(Indiana University). Every image traces to a `Source` record in
`src/data/sources.ts` with its license and canonical URL — visible on hover
via `SourceCredit` and listed in full on `/resources/sources`.

The current set covers six flagship author/book pairs (Shelley, Austen,
Dickens, Woolf, Shakespeare, Dickinson) as a proof of the real-imagery
pipeline. Expanding the catalogue means adding more `Source` records and
`Asset` references in the same shape — the pattern is established, not
one-off.

**Before adding new images:** confirm the specific Commons file's license on
its file page — don't assume every item from a given repository shares the
same rights.

## What's next (not built yet)

- Phase 7: full reading interface (chapter navigation, reading modes — Day /
  Night / Parchment / Sepia / Focus / High Contrast — font/width/spacing
  controls)
- Phase 8: real search backend/indexing (current `/search` is a simple
  client-side substring match over in-memory data)
- Phase 9: expanded Sources & Attribution directory
- Phase 11: LLM Librarian — retrieval over the curriculum graph above

## Deploying to GitHub Pages

Update `base` in `vite.config.ts` to match your repo name if deploying to a
project page (e.g. `/english-lit-library/`), then:

```bash
npm run build
# push dist/ to a gh-pages branch, or use a GitHub Action
```

---

© 2026 English Literature Library · Powered by Tensoramax Lab
