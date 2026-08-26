// English Literature Library — core data model
// Designed to move from static data to a real API/database without
// touching component code. Every entity carries a stable `slug` for
// routing and a `sourceId` linking to attribution records.

export type LiteraryPeriod =
  | "renaissance"
  | "neoclassical"
  | "romanticism"
  | "victorian"
  | "modernism"
  | "postmodernism"
  | "contemporary"
  | "postcolonial";

export type Genre =
  | "novel"
  | "poetry"
  | "drama"
  | "short-story"
  | "essay"
  | "biography"
  | "autobiography"
  | "criticism"
  | "theory";

export type AccessType = "public-domain" | "open-access" | "external-link";

/** Attribution record — every image or text asset traces back to one of these. */
export interface Source {
  id: string;
  name: string; // e.g. "Wikimedia Commons"
  url: string; // canonical file/description page, not the raw asset URL
  license: string; // e.g. "Public Domain (PD-old-100-expired)"
  attribution?: string; // credit line to display, e.g. "Richard Rothwell, National Portrait Gallery"
  accessType: AccessType;
}

/** An image asset with its provenance attached at the point of use. */
export interface Asset {
  url: string; // direct hotlink (Wikimedia Special:FilePath or similar stable URL)
  alt: string;
  sourceId: string; // references Source.id
  width?: number;
  height?: number;
}

export interface Author {
  slug: string;
  name: string;
  birthYear: number;
  deathYear?: number;
  period: LiteraryPeriod;
  nationality?: string;
  biography: string; // short-form, 2-4 sentences
  portrait?: Asset;
  genres: Genre[];
  workSlugs: string[]; // Book.slug[]
  subjectSlugs: string[]; // Subject.slug[] — curriculum connections
  externalLinks?: { label: string; url: string }[];
}

export interface Book {
  slug: string;
  title: string;
  authorSlug: string;
  publicationYear: number;
  genre: Genre;
  period: LiteraryPeriod;
  language: string;
  subjectSlugs: string[]; // curriculum connections
  description: string;
  themes?: string[];
  cover?: Asset;
  sourceId: string; // where the reading text itself comes from
  readingUrl?: string; // external link to full text (Gutenberg/Wikisource/etc.)
  license: string;
  relatedBookSlugs?: string[];
  featured?: boolean; // eligible for homepage hero
}

export interface Subject {
  slug: string;
  name: string; // e.g. "Women's Writing"
  paperCode: string; // e.g. "Major-12"
  semester: number;
  description: string;
  authorSlugs: string[];
  bookSlugs: string[];
  criticism?: string[];
  supplementaryReading?: { title: string; url?: string }[];
  externalResources?: { label: string; url: string }[];
}

export interface PeriodInfo {
  slug: LiteraryPeriod;
  name: string;
  yearRange: string;
  description: string;
  accentDetail: string; // one distinguishing visual/textual motif for this period's card
}

export interface GenreInfo {
  slug: Genre;
  name: string;
  description: string;
}

export interface ResourceLink {
  id: string;
  title: string;
  category:
    | "open-access"
    | "public-domain"
    | "archive"
    | "journal"
    | "database"
    | "university"
    | "external-library"
    | "research";
  description: string;
  url: string;
  sourceId: string;
}
