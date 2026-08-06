/**
 * Monastic festival calendar for Monastery360.
 *
 * Every fact here is carried over from the sourced monastery content in
 * src/data/monasteries.ts (see CREDITS.md for source links).
 *
 * IMPORTANT: no Gregorian dates are given. These festivals follow the Tibetan
 * lunar calendar, so their position in the western year shifts annually —
 * inventing "15 Feb 2026" would be fabrication. Where the sourced material
 * gives a traditional window (e.g. "February to March, during Losar") it is
 * quoted as a window; where it gives a lunar-calendar position, that is quoted
 * instead. The UI tells visitors to confirm exact dates locally.
 */

export interface Festival {
  id: string
  name: string
  monasteryId: string
  monasteryName: string
  /** Traditional timing as documented — never a specific calendar date. */
  timing: string
  /** How the timing is anchored, shown as a small qualifier in the UI. */
  timingBasis: "lunar" | "seasonal"
  summary: string
  detail: string
  image: string
}

export const festivals: Festival[] = [
  {
    id: "bumchu",
    name: "Bumchu",
    monasteryId: "tashiding",
    monasteryName: "Tashiding Monastery",
    timing: "Fourteenth and fifteenth days of the first month",
    timingBasis: "lunar",
    summary:
      "A sacred vase of holy water is opened, and its level read as a prophecy for the year ahead.",
    detail:
      "Held at Sikkim's holiest monastery, Bumchu centres on a sealed vase of holy water opened once a year. The level of water inside is read as a forecast: full foretells prosperity, low foretells hardship. The approach to the monastery is lined with mani stone slabs, each hand-carved with mantras.",
    image: "/vr-assets/tashiding-monastery.jpg",
  },
  {
    id: "losar",
    name: "Losar — Tibetan New Year",
    monasteryId: "rumtek",
    monasteryName: "Rumtek Monastery",
    timing: "February to March",
    timingBasis: "seasonal",
    summary:
      "Masked Cham dances fill the courtyard as monks enact the subjugation of obstructive forces.",
    detail:
      "Rumtek's open forecourt hosts masked Cham dances during the Tibetan new year, with monks in elaborate costume performing the subjugation of obstructive forces. The monastery is the principal seat of the Karma Kagyu order, and the courtyard is open to visitors during festival days.",
    image: "/vr-assets/rumtek-monastery.jpg",
  },
  {
    id: "cham",
    name: "Cham & Singhe Chaam",
    monasteryId: "enchey",
    monasteryName: "Enchey Monastery",
    timing: "December to January",
    timingBasis: "seasonal",
    summary:
      "The masked Cham, danced to dispel obstructive forces, alongside the Singhe Chaam snow lion dance.",
    detail:
      "Enchey is best known for its festival dances: the masked Cham, performed to dispel obstructive forces, and the Singhe Chaam or snow lion dance. Both are performed in the monastery's courtyard by monks of the Nyingma order.",
    image: "/vr-assets/enchey-monastery.jpg",
  },
  {
    id: "pang-lhabsol",
    name: "Pang Lhabsol",
    monasteryId: "enchey",
    monasteryName: "Enchey Monastery",
    timing: "Follows the Tibetan lunar calendar",
    timingBasis: "lunar",
    summary:
      "A distinctly Sikkimese festival honouring Kanchenjunga as the state's guardian deity.",
    detail:
      "Pang Lhabsol venerates Mount Kanchenjunga as Sikkim's protective deity — a rare instance of a mountain itself being honoured as a guardian. It is among the most distinctly Sikkimese observances in the Buddhist calendar.",
    image: "/vr-assets/enchey-monastery.jpg",
  },
]
