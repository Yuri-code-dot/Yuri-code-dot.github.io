import type { Subject } from "../types";

// Curriculum is organized Semester → Paper → Subject, matching the department
// document. Only subjects with populated content are given full detail pages
// for now; the rest exist as structural placeholders so new semesters and
// papers can be added without changing the data shape.

export const subjects: Subject[] = [
  {
    slug: "modern-european-drama",
    name: "Modern European Drama",
    paperCode: "Major-9",
    semester: 5,
    description:
      "Drama from continental Europe that broke with realism and inherited tragedy — Ibsen, Chekhov, Brecht, and the theatre of the absurd.",
    authorSlugs: [],
    bookSlugs: [],
    externalResources: [{ label: "Internet Archive drama collection", url: "https://archive.org" }],
  },
  {
    slug: "american-literature",
    name: "American Literature",
    paperCode: "Major-10",
    semester: 5,
    description:
      "From the transcendentalists to modernist fracture, American literature's central argument has been with the idea of America itself.",
    authorSlugs: ["emily-dickinson"],
    bookSlugs: ["dickinson-poems"],
    externalResources: [{ label: "Project Gutenberg — American authors", url: "https://www.gutenberg.org" }],
  },
  {
    slug: "postcolonial-literature",
    name: "Post Colonial Literature",
    paperCode: "Major-11",
    semester: 5,
    description:
      "Writers from former colonies reclaiming language, form, and history in the aftermath of empire.",
    authorSlugs: [],
    bookSlugs: [],
  },
  {
    slug: "womens-writing",
    name: "Women's Writing",
    paperCode: "Major-12",
    semester: 5,
    description:
      "Fiction, poetry, and essay by women writers across three centuries — from the Gothic imagination of Mary Shelley to Virginia Woolf's insistence on a room, and money, of one's own.",
    authorSlugs: ["mary-shelley", "jane-austen", "virginia-woolf", "emily-dickinson"],
    bookSlugs: ["frankenstein", "pride-and-prejudice", "mrs-dalloway", "dickinson-poems"],
    criticism: [
      "A Room of One's Own — Virginia Woolf's foundational essay on women, economics, and authorship.",
    ],
    supplementaryReading: [{ title: "A Vindication of the Rights of Woman — Mary Wollstonecraft" }],
    externalResources: [{ label: "Wikisource — Women's Writing collection", url: "https://en.wikisource.org" }],
  },
  {
    slug: "partition-literature",
    name: "Partition Literature",
    paperCode: "Major-17",
    semester: 6,
    description: "Fiction and testimony written in the wake of the 1947 Partition of British India.",
    authorSlugs: [],
    bookSlugs: [],
  },
  {
    slug: "modern-indian-writing-translation",
    name: "Modern Indian Writing in English Translation",
    paperCode: "Major-18",
    semester: 6,
    description: "Contemporary Indian-language literature read in English translation, across regions and forms.",
    authorSlugs: [],
    bookSlugs: [],
  },
  {
    slug: "indian-diaspora-literature",
    name: "Literature of the Indian Diaspora",
    paperCode: "Major-19",
    semester: 6,
    description: "Writing by authors of Indian origin living and working outside India.",
    authorSlugs: [],
    bookSlugs: [],
  },
  {
    slug: "literary-theory",
    name: "Literary Theory",
    paperCode: "Major-20",
    semester: 6,
    description: "The frameworks — structuralist, psychoanalytic, feminist, postcolonial — through which texts are read.",
    authorSlugs: [],
    bookSlugs: [],
  },
];

export const subjectBySlug = (slug: string) => subjects.find((s) => s.slug === slug);
export const subjectsBySemester = (semester: number) => subjects.filter((s) => s.semester === semester);
export const semesters = () => Array.from(new Set(subjects.map((s) => s.semester))).sort((a, b) => a - b);
