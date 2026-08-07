/**
 * Content for the Sikkim Game Corner.
 *
 * As with stories.ts, every fact here already exists in `monasteries.ts` or
 * `festivals.ts` — founding years, name translations and festival meanings
 * are reused rather than restated from memory, so the games can't drift out
 * of sync with the tour content or teach something the rest of the site
 * contradicts.
 */

export interface TimelineEntry {
  id: string
  name: string
  year: number
  /** Shown after the round, explaining the date. */
  note: string
  image: string
}

/**
 * Founding years match the figures used in MonasteryShowcase and the
 * histories in monasteries.ts. Pemayangtse is dated to 1705 — its formal
 * establishment on the present hilltop — rather than the c.1650 Tsangkhang
 * shrine that preceded it, which is the same convention used elsewhere in
 * the app.
 */
export const timelineEntries: TimelineEntry[] = [
  {
    id: "tashiding",
    name: "Tashiding",
    year: 1641,
    note: "Founded by Ngadak Sempa Chempo Phunshok Rigzing of the Nyingma school.",
    image: "/vr-assets/tashiding-monastery.jpg",
  },
  {
    id: "pemayangtse",
    name: "Pemayangtse",
    year: 1705,
    note: "Established on its present hilltop by Chogyal Chakdor Namgyal, succeeding the c.1650 Tsangkhang shrine.",
    image: "/vr-assets/pemayangtse-monastery.jpg",
  },
  {
    id: "rumtek",
    name: "Rumtek",
    year: 1734,
    note: "Built by the 9th Karmapa under the fourth Chogyal — later rebuilt by the 16th Karmapa, completed 1966.",
    image: "/vr-assets/rumtek-monastery.jpg",
  },
  {
    id: "enchey",
    name: "Enchey",
    year: 1909,
    note: "Constructed under the rule of Sidkeong Tulku, in a Chinese pagoda style.",
    image: "/vr-assets/enchey-monastery.jpg",
  },
]

export interface MantraPair {
  id: string
  term: string
  meaning: string
}

/** Terms and translations as given in the monastery and festival content. */
export const mantraPairs: MantraPair[] = [
  { id: "pemayangtse", term: "Pemayangtse", meaning: "Perfect Sublime Lotus" },
  { id: "tashiding", term: "Tashiding", meaning: "The Devoted Central Glory" },
  { id: "enchey", term: "Enchey", meaning: "The Solitary Temple" },
  { id: "thongwa", term: "Thongwa Rangdrol", meaning: "The Saviour by Mere Sight" },
  { id: "zangdok", term: "Zangdok Palri", meaning: "Padmasambhava's Celestial Palace" },
  { id: "singhe", term: "Singhe Chaam", meaning: "The Snow Lion Dance" },
  { id: "bumchu", term: "Bumchu", meaning: "The Sacred Vase Ritual" },
  { id: "losar", term: "Losar", meaning: "Tibetan New Year" },
  { id: "kora", term: "Kora", meaning: "The Circuit Walked Clockwise" },
  { id: "tatshang", term: "Ta-tshang", meaning: "The Pure Monks" },
]
