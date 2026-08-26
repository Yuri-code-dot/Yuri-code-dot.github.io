import type { PeriodInfo } from "../types";

export const periods: PeriodInfo[] = [
  {
    slug: "renaissance",
    name: "Renaissance",
    yearRange: "1500–1660",
    description:
      "The rebirth of classical learning reshaped English letters — blank verse, the sonnet, and the public stage all found their form in this era.",
    accentDetail: "Blank verse & the birth of the public playhouse",
  },
  {
    slug: "neoclassical",
    name: "Neoclassical",
    yearRange: "1660–1785",
    description:
      "Order, wit, and satire governed the age of Dryden, Pope, and Swift — literature as a mirror held up to reason and society.",
    accentDetail: "Satire, the heroic couplet, and reasoned wit",
  },
  {
    slug: "romanticism",
    name: "Romanticism",
    yearRange: "1785–1830",
    description:
      "A revolt against reason's dominance — imagination, nature, and the sublime took center stage in poetry and the Gothic novel alike.",
    accentDetail: "The sublime, the Gothic, and the individual imagination",
  },
  {
    slug: "victorian",
    name: "Victorian",
    yearRange: "1830–1901",
    description:
      "The serialized novel became the era's great form, wrestling with industry, empire, class, and the shifting shape of the English home.",
    accentDetail: "The serialized novel and the industrial city",
  },
  {
    slug: "modernism",
    name: "Modernism",
    yearRange: "1901–1945",
    description:
      "Fractured time, interior consciousness, and formal experiment answered a world remade by war and rapid change.",
    accentDetail: "Stream of consciousness and fractured form",
  },
  {
    slug: "postmodernism",
    name: "Postmodernism",
    yearRange: "1945–1990",
    description:
      "Irony, metafiction, and skepticism toward grand narratives defined a literature increasingly aware of its own construction.",
    accentDetail: "Metafiction and the collapse of grand narrative",
  },
  {
    slug: "postcolonial",
    name: "Postcolonial",
    yearRange: "1950–present",
    description:
      "Writers from former colonies reclaimed language and form to examine empire, identity, migration, and independence.",
    accentDetail: "Reclaiming language after empire",
  },
  {
    slug: "contemporary",
    name: "Contemporary",
    yearRange: "1990–present",
    description:
      "A global, plural literature in conversation with digital life, diaspora, and an expanding sense of whose stories get told.",
    accentDetail: "A literature without a single center",
  },
];

export const periodBySlug = (slug: string) => periods.find((p) => p.slug === slug);
