import type { GenreInfo } from "../types";

export const genres: GenreInfo[] = [
  { slug: "novel", name: "Novel", description: "Extended prose fiction, the dominant form of the modern literary marketplace." },
  { slug: "poetry", name: "Poetry", description: "Language patterned by rhythm, form, and image rather than plot." },
  { slug: "drama", name: "Drama", description: "Text written for performance — dialogue, stage direction, and live embodiment." },
  { slug: "short-story", name: "Short Story", description: "Compressed prose fiction built around a single effect or turn." },
  { slug: "essay", name: "Essay", description: "Prose reasoning through an idea, argument, or observation." },
  { slug: "biography", name: "Biography", description: "The written account of a life, told by another." },
  { slug: "autobiography", name: "Autobiography", description: "A life recounted by the person who lived it." },
  { slug: "criticism", name: "Literary Criticism", description: "Analysis and evaluation of literary works and their contexts." },
  { slug: "theory", name: "Theory", description: "Frameworks for reading — structuralist, feminist, postcolonial, and beyond." },
];

export const genreBySlug = (slug: string) => genres.find((g) => g.slug === slug);
