/**
 * Table cell.
 * - "yes"/"no" render a Check/X icon; `note` is a short caveat beside it.
 *   A bare Check is a complete answer, prefer it over restating the feature.
 * - "partial" renders a Minus and REQUIRES a note; a bare "partial" says nothing.
 * - "text" renders plain muted text, no icon. Use for facts that aren't
 *   yes/no ("Annual contract", "Not published"). When the competitor
 *   publishes no number, write "Not published"; never guess.
 * Never mirror phrasing across the two columns; asymmetry reads human.
 */
export type CompareCell =
  | { v: "yes"; note?: string }
  | { v: "no"; note?: string }
  | { v: "partial"; note: string }
  | { v: "text"; text: string };

export type CompareRow = {
  feature: string;
  pipe0: CompareCell;
  competitor: CompareCell;
};

/** A tab of comparison rows ("Platform", "Automation", "Pricing"). */
export type CompareGroup = {
  label: string;
  rows: CompareRow[];
};

/**
 * Difference block. Titles are concrete noun phrases ("Point-in-time
 * recovery"), not verb marketing ("Recover with confidence"). Every body
 * carries at least one specific: a number, a product name, or a link.
 */
export type DifferenceCard = {
  title: string;
  body: string;
  link?: { label: string; href: string };
};

/**
 * One comparison page. Copy rules:
 * - Headings are plain strings in one typeface; no italic-serif highlight
 *   on comparison pages.
 * - heroSubtitle never ends in a formula sentence ("Here is the factual
 *   comparison." is banned); end on the sharpest concrete claim, and vary
 *   the structure per competitor.
 * - differences.cards: vary the count per competitor (2 to 4). Identical
 *   skeletons across pages are the AI tell.
 * - theirEdge.points are real, verifiable strengths. pickThem must survive
 *   being read aloud to a prospect's face; no backhanded compliments.
 * - FAQ questions are phrased like searches; yes/no questions get answers
 *   that start with Yes or No; vary answer lengths.
 * - No em dashes, no "seamless"/"supercharge"/"game-changer", no
 *   rule-of-three sentence rhythm.
 */
export type CompareConfig = {
  slug: string;
  competitor: string;
  /** Rendered as title.absolute; include both brand names. */
  metaTitle: string;
  metaDescription: string;
  /** Line for llms.txt; falls back to metaDescription. */
  llmsLine?: string;
  heroSubtitle: string;
  table: {
    groups: CompareGroup[];
    /** e.g. "Verified July 2026 against Clay's public docs and pricing page." */
    footnote?: string;
  };
  differences: {
    heading: string;
    cards: DifferenceCard[];
  };
  theirEdge: {
    intro: string;
    points: string[];
    pickThem: string;
    pickUs: string;
  };
  faqs: { q: string; a: string }[];
  related?: { label: string; href: string }[];
  cta: { title: string; subtitle?: string };
};
