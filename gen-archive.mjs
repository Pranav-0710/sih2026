import fs from "fs";
const raw = JSON.parse(fs.readFileSync("archive-raw.json", "utf8"));
const NAMES = {
  rumtek: "Rumtek Monastery",
  pemayangtse: "Pemayangtse Monastery",
  tashiding: "Tashiding Monastery",
  enchey: "Enchey Monastery",
};

const categorise = (t) => {
  const s = t.toLowerCase();
  if (/mural|wall art|painting|fresco|thangka|thanka/.test(s)) return "Mural & Painting";
  if (/statue|deity|buddha|rinpoche|guru|idol/.test(s)) return "Statue & Iconography";
  if (/prayer.?wheel|mask|cham|bell|lamp|ritual|inscription/.test(s)) return "Ritual Object";
  if (/chorten|stupa/.test(s)) return "Chorten & Stupa";
  if (/interior|prayer hall|lhakhang|shrine|altar/.test(s)) return "Interior & Shrine";
  return "Architecture";
};

// Keep any trailing sequence number — these are distinct photographs in a
// series, and stripping it made twenty different images share one title.
const tidy = (t) => {
  const seq = t.match(/(\d{2})$/);
  let s = t
    .replace(/[_]+/g, " ")
    .replace(/\s*\d{2}$/, "")
    .replace(/\((\d+)\)/, "")
    .replace(/,?\s*(East|West|North|South) Sikkim/i, "")
    .replace(/\s*in Gangtok district/i, "")
    .replace(/\s*,\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
  if (seq) s += ` (${parseInt(seq[1], 10)})`;
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const seen = new Set();
const items = raw
  .filter((r) => r.thumb)
  .map((r, i) => ({
    id: `${r.monasteryId}-${i}`,
    title: tidy(r.title),
    monasteryId: r.monasteryId,
    monasteryName: NAMES[r.monasteryId],
    category: categorise(r.title + " " + (r.desc || "")),
    image: r.thumb,
    sourceUrl: r.page,
    license: r.license,
    author: (r.artist || "Unknown").replace(/"/g, "'"),
    description: (r.desc || "").replace(/"/g, "'"),
  }))
  .filter((x) => {
    if (seen.has(x.sourceUrl)) return false;
    seen.add(x.sourceUrl);
    return true;
  });

const cats = {};
items.forEach((i) => (cats[i.category] = (cats[i.category] || 0) + 1));
console.error("items:", items.length, "| unique titles:", new Set(items.map((i) => i.title)).size);
console.error("categories:", JSON.stringify(cats));

const out = `/**
 * Digital archive of Sikkim monastery heritage imagery.
 *
 * Every item is a real, freely-licensed file from Wikimedia Commons, pulled
 * with its license and author metadata intact — nothing here is invented.
 * Images are served from Commons' own thumbnail service and each entry links
 * back to its source page, which is how the CC BY / CC BY-SA attribution
 * requirement is met. See CREDITS.md.
 *
 * Generated from the Commons API rather than hand-written, so it can be
 * regenerated as more material is released under a free licence.
 */

export interface ArchiveItem {
  id: string
  title: string
  monasteryId: string
  monasteryName: string
  category: string
  image: string
  sourceUrl: string
  license: string
  author: string
  description: string
}

export const archiveCategories = ${JSON.stringify(["All", ...Object.keys(cats).sort()], null, 2)}

export const archiveItems: ArchiveItem[] = ${JSON.stringify(items, null, 2)}
`;
fs.writeFileSync("src/data/archive.ts", out);
console.error("wrote src/data/archive.ts");
