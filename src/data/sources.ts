import type { Source } from "../types";

// Every image/text asset in the library traces back to one of these records.
// Wikimedia Commons file URLs use the stable Special:FilePath redirect,
// which resolves to the current original file regardless of filename history.

const commonsFilePath = (filename: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;

export const sources: Record<string, Source> = {
  "wikimedia-commons": {
    id: "wikimedia-commons",
    name: "Wikimedia Commons",
    url: "https://commons.wikimedia.org",
    license: "Varies by file — see individual attribution",
    accessType: "public-domain",
  },
  "project-gutenberg": {
    id: "project-gutenberg",
    name: "Project Gutenberg",
    url: "https://www.gutenberg.org",
    license: "Public Domain (US)",
    accessType: "public-domain",
  },
  wikisource: {
    id: "wikisource",
    name: "Wikisource",
    url: "https://en.wikisource.org",
    license: "Public Domain / CC BY-SA (transcription)",
    accessType: "public-domain",
  },
  "npg-rothwell-shelley": {
    id: "npg-rothwell-shelley",
    name: "National Portrait Gallery, London (via Wikimedia Commons)",
    url: "https://commons.wikimedia.org/wiki/File:RothwellMaryShelley.jpg",
    license: "Public Domain (PD-old-100-expired)",
    attribution: "Richard Rothwell, 1840 — National Portrait Gallery, London",
    accessType: "public-domain",
  },
  "npg-maclise-dickens": {
    id: "npg-maclise-dickens",
    name: "National Portrait Gallery, London (via Wikimedia Commons)",
    url: "https://commons.wikimedia.org/wiki/File:Charles_Dickens_by_Daniel_Maclise.jpg",
    license: "Public Domain (PD-old-100-expired)",
    attribution: "Daniel Maclise, 1839 — National Portrait Gallery, London",
    accessType: "public-domain",
  },
  "npg-beresford-woolf": {
    id: "npg-beresford-woolf",
    name: "National Portrait Gallery, London (via Wikimedia Commons)",
    url: "https://commons.wikimedia.org/wiki/File:George_Charles_Beresford_-_Virginia_Woolf_in_1902.jpg",
    license: "Public Domain (PD-old-100-expired)",
    attribution: "George Charles Beresford, 1902 — National Portrait Gallery, London",
    accessType: "public-domain",
  },
  "npg-chandos-shakespeare": {
    id: "npg-chandos-shakespeare",
    name: "National Portrait Gallery, London (via Wikimedia Commons)",
    url: "https://commons.wikimedia.org/wiki/File:William_Shakespeare_Chandos_Portrait.jpg",
    license: "Public Domain (PD-old-100-expired)",
    attribution: "Attributed to John Taylor, c. 1600–1610 — the Chandos portrait, National Portrait Gallery, London",
    accessType: "public-domain",
  },
  "yale-dickinson": {
    id: "yale-dickinson",
    name: "Todd-Bingham Picture Collection, Yale University (via Wikimedia Commons)",
    url: "https://commons.wikimedia.org/wiki/File:Emily_Dickinson_daguerreotype_(Restored_and_cropped).jpg",
    license: "Public Domain",
    attribution: "Daguerreotype, c. 1847 — Yale University Manuscripts & Archives",
    accessType: "public-domain",
  },
  "lilly-library-austen": {
    id: "lilly-library-austen",
    name: "Lilly Library, Indiana University (via Wikimedia Commons)",
    url: "https://commons.wikimedia.org/wiki/File:PrideAndPrejudiceTitlePage.jpg",
    license: "Public Domain",
    attribution: "Title page, first edition, T. Egerton, London, 1813",
    accessType: "public-domain",
  },
};

/** Direct hotlink helper for the confirmed Commons filenames used in this build. */
export const commonsImage = {
  maryShelleyPortrait: commonsFilePath("RothwellMaryShelley.jpg"),
  dickensPortrait: commonsFilePath("Charles Dickens by Daniel Maclise.jpg"),
  woolfPortrait: commonsFilePath("George Charles Beresford - Virginia Woolf in 1902.jpg"),
  shakespearePortrait: commonsFilePath("William Shakespeare Chandos Portrait.jpg"),
  dickinsonPortrait: commonsFilePath("Emily Dickinson daguerreotype (Restored and cropped).jpg"),
  prideAndPrejudiceTitlePage: commonsFilePath("PrideAndPrejudiceTitlePage.jpg"),
};
