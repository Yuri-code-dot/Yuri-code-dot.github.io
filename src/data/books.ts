import type { Book } from "../types";
import { commonsImage } from "./sources";

export const books: Book[] = [
  {
    slug: "frankenstein",
    title: "Frankenstein; or, The Modern Prometheus",
    authorSlug: "mary-shelley",
    publicationYear: 1818,
    genre: "novel",
    period: "romanticism",
    language: "English",
    subjectSlugs: ["womens-writing"],
    description:
      "A young scientist's experiment gives rise to a creature that forces him to confront creation, responsibility, and humanity — a novel that founded modern science fiction while interrogating the limits of Romantic ambition.",
    themes: ["Creation and responsibility", "Isolation", "The limits of ambition", "Nature vs. artifice"],
    cover: {
      url: commonsImage.maryShelleyPortrait,
      alt: "Portrait of Mary Shelley, author of Frankenstein",
      sourceId: "npg-rothwell-shelley",
    },
    sourceId: "project-gutenberg",
    readingUrl: "https://www.gutenberg.org/ebooks/84",
    license: "Public Domain",
    relatedBookSlugs: ["mrs-dalloway"],
    featured: true,
  },
  {
    slug: "pride-and-prejudice",
    title: "Pride and Prejudice",
    authorSlug: "jane-austen",
    publicationYear: 1813,
    genre: "novel",
    period: "romanticism",
    language: "English",
    subjectSlugs: ["womens-writing"],
    description:
      "Elizabeth Bennet's sharp wit and Mr. Darcy's wounded pride collide across a novel that turns the marriage plot into a study of self-knowledge, class, and first impressions.",
    themes: ["Marriage and economics", "Pride and self-perception", "Social class", "Irony as judgment"],
    cover: {
      url: commonsImage.prideAndPrejudiceTitlePage,
      alt: "Title page of the first edition of Pride and Prejudice, 1813",
      sourceId: "lilly-library-austen",
    },
    sourceId: "project-gutenberg",
    readingUrl: "https://www.gutenberg.org/ebooks/1342",
    license: "Public Domain",
    featured: true,
  },
  {
    slug: "great-expectations",
    title: "Great Expectations",
    authorSlug: "charles-dickens",
    publicationYear: 1861,
    genre: "novel",
    period: "victorian",
    language: "English",
    subjectSlugs: [],
    description:
      "Pip's rise from a blacksmith's forge into unexplained wealth becomes Dickens's meditation on class, guilt, and the false promises of gentility in Victorian England.",
    themes: ["Class mobility", "Guilt and redemption", "Appearance vs. reality"],
    cover: {
      url: commonsImage.dickensPortrait,
      alt: "Portrait of Charles Dickens, author of Great Expectations",
      sourceId: "npg-maclise-dickens",
    },
    sourceId: "project-gutenberg",
    readingUrl: "https://www.gutenberg.org/ebooks/1400",
    license: "Public Domain",
    featured: true,
  },
  {
    slug: "mrs-dalloway",
    title: "Mrs Dalloway",
    authorSlug: "virginia-woolf",
    publicationYear: 1925,
    genre: "novel",
    period: "modernism",
    language: "English",
    subjectSlugs: ["womens-writing"],
    description:
      "A single June day in London, following Clarissa Dalloway's preparations for a party and Septimus Warren Smith's unraveling, told through a stream of consciousness that moves freely between minds and moments.",
    themes: ["Time and memory", "War trauma", "The interior life", "The texture of a single day"],
    cover: {
      url: commonsImage.woolfPortrait,
      alt: "Portrait of Virginia Woolf, author of Mrs Dalloway",
      sourceId: "npg-beresford-woolf",
    },
    sourceId: "wikisource",
    readingUrl: "https://en.wikisource.org",
    license: "Public Domain",
    relatedBookSlugs: ["frankenstein"],
  },
  {
    slug: "hamlet",
    title: "Hamlet, Prince of Denmark",
    authorSlug: "william-shakespeare",
    publicationYear: 1603,
    genre: "drama",
    period: "renaissance",
    language: "English",
    subjectSlugs: [],
    description:
      "A prince, a ghost, and a court rotten with concealment — Hamlet's delay has been read as philosophy, pathology, and performance for over four centuries.",
    themes: ["Revenge and delay", "Appearance vs. reality", "Mortality", "Madness, real or performed"],
    cover: {
      url: commonsImage.shakespearePortrait,
      alt: "The Chandos portrait, believed to depict William Shakespeare",
      sourceId: "npg-chandos-shakespeare",
    },
    sourceId: "project-gutenberg",
    readingUrl: "https://www.gutenberg.org/ebooks/1524",
    license: "Public Domain",
  },
  {
    slug: "dickinson-poems",
    title: "Poems",
    authorSlug: "emily-dickinson",
    publicationYear: 1890,
    genre: "poetry",
    period: "victorian",
    language: "English",
    subjectSlugs: ["american-literature", "womens-writing"],
    description:
      "Published posthumously, Dickinson's poems compress mortality, faith, and perception into short, unresolved lines that broke from the metrical conventions of her time.",
    themes: ["Mortality", "Faith and doubt", "Solitude", "Perception"],
    cover: {
      url: commonsImage.dickinsonPortrait,
      alt: "Daguerreotype of Emily Dickinson, author of Poems",
      sourceId: "yale-dickinson",
    },
    sourceId: "project-gutenberg",
    readingUrl: "https://www.gutenberg.org/ebooks/12242",
    license: "Public Domain",
  },
];

export const bookBySlug = (slug: string) => books.find((b) => b.slug === slug);
export const booksByAuthor = (authorSlug: string) => books.filter((b) => b.authorSlug === authorSlug);
export const booksBySubject = (subjectSlug: string) => books.filter((b) => b.subjectSlugs.includes(subjectSlug));
export const featuredBooks = () => books.filter((b) => b.featured);
