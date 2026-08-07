/**
 * Narrated story tours for the Monastery360 virtual experience.
 *
 * Every factual claim below is drawn from the sourced content already in
 * `monasteries.ts` (itself referenced to Wikipedia and Sikkim tourism
 * material — see CREDITS.md). Nothing here introduces history, dates or
 * attributions that aren't in that file. The chapters re-sequence those
 * facts into a narrative arc; they do not add to them.
 *
 * Where tradition is being reported rather than fact — Padmasambhava's
 * arrow, Druptob Karpo's flight, the Bumchu prophecy — the wording keeps
 * the attribution ("is said to", "in local tradition") rather than stating
 * it flatly. That distinction matters for a heritage-preservation project.
 */

export interface StoryChapter {
  id: string
  /** Short chapter heading, shown above the narration. */
  title: string
  /** Narration text. Also what gets spoken when narration is enabled. */
  text: string
  /**
   * Ken Burns focal point as a percentage of the image, and how far to
   * zoom toward it. The camera drifts toward this point over the chapter.
   */
  focus: { x: number; y: number }
  scale: number
}

export interface MonasteryStory {
  monasteryId: string
  title: string
  subtitle: string
  chapters: StoryChapter[]
}

export const stories: MonasteryStory[] = [
  {
    monasteryId: "rumtek",
    title: "A Lineage in Exile",
    subtitle: "How a ruined monastery became the seat of a school in exile",
    chapters: [
      {
        id: "rumtek-1",
        title: "1734",
        text: "The first monastery at Rumtek was built in 1734 by Wangchuk Dorje, the ninth Karmapa, under the patronage of Gyurmed Namgyal, the fourth Chogyal of Sikkim.",
        focus: { x: 50, y: 45 },
        scale: 1.0,
      },
      {
        id: "rumtek-2",
        title: "Ruin",
        text: "Over the following two centuries it declined. By the 1950s the monastery had fallen almost entirely into ruin.",
        focus: { x: 35, y: 55 },
        scale: 1.08,
      },
      {
        id: "rumtek-3",
        title: "1959",
        text: "When the sixteenth Karmapa fled Tibet in 1959, following the Chinese occupation, he chose this ruined site as his seat in exile — and began rebuilding it from the ground up.",
        focus: { x: 60, y: 40 },
        scale: 1.12,
      },
      {
        id: "rumtek-4",
        title: "1966",
        text: "Construction was completed in 1966. The sacred relics and ritual objects carried out of Tibet were installed in the new shrine that same year.",
        focus: { x: 50, y: 42 },
        scale: 1.05,
      },
      {
        id: "rumtek-5",
        title: "The Golden Stupa",
        text: "Behind the main shrine stands the Golden Stupa, gilded and set with semi-precious stones, holding the relics of the sixteenth Karmapa. It remains a focus of pilgrimage for Kagyu practitioners.",
        focus: { x: 72, y: 38 },
        scale: 1.15,
      },
      {
        id: "rumtek-6",
        title: "The Courtyard",
        text: "Each year at Losar, the Tibetan new year, the open forecourt fills with masked Cham dancers in elaborate costume, enacting the subjugation of obstructive forces.",
        focus: { x: 28, y: 62 },
        scale: 1.1,
      },
    ],
  },
  {
    monasteryId: "pemayangtse",
    title: "The Perfect Sublime Lotus",
    subtitle: "A hilltop monastery, its pure monks, and a paradise carved in wood",
    chapters: [
      {
        id: "pemayangtse-1",
        title: "Tsangkhang",
        text: "It began around 1650 as a small shrine called Tsangkhang, founded by Lhatsun Chenpo — one of the three lamas who consecrated the first Chogyal of Sikkim.",
        focus: { x: 45, y: 50 },
        scale: 1.0,
      },
      {
        id: "pemayangtse-2",
        title: "1705",
        text: "In 1705 the shrine was moved to this hilltop and formally established as a monastery by Chogyal Chakdor Namgyal, together with Lama Khanchen Rolpai Dorje as its first head lama, in honour of Guru Padmasambhava.",
        focus: { x: 55, y: 42 },
        scale: 1.08,
      },
      {
        id: "pemayangtse-3",
        title: "The Pure Monks",
        text: "Pemayangtse follows the Nyingma order, the oldest school of Tibetan Buddhism, and historically held authority over every other Nyingma monastery in Sikkim. Its first residents were the ta-tshang, the 'pure monks', admitted only if they were of unblemished descent and had taken full vows of celibacy.",
        focus: { x: 35, y: 55 },
        scale: 1.12,
      },
      {
        id: "pemayangtse-4",
        title: "Zangdok Palri",
        text: "On the uppermost storey stands the monastery's greatest treasure: the Zangdok Palri, a seven-tiered wooden sculpture of Guru Padmasambhava's celestial palace. It was carved over roughly five years by a single lama, Dungzin Rinpoche.",
        focus: { x: 55, y: 30 },
        scale: 1.18,
      },
      {
        id: "pemayangtse-5",
        title: "Above Rabdentse",
        text: "The monastery stands at about 2,085 metres near Pelling, on a ridge overlooking the ruins of Rabdentse — Sikkim's second capital, which served until 1814 and is now a protected archaeological site.",
        focus: { x: 76, y: 66 },
        scale: 1.1,
      },
      {
        id: "pemayangtse-6",
        title: "Facing the Snows",
        text: "On clear mornings the Kanchenjunga massif fills the northern horizon. The monastery was deliberately sited to face it.",
        focus: { x: 50, y: 25 },
        scale: 1.05,
      },
    ],
  },
  {
    monasteryId: "tashiding",
    title: "The Saviour by Mere Sight",
    subtitle: "A heart-shaped hill, a sacred vase, and a prophecy read once a year",
    chapters: [
      {
        id: "tashiding-1",
        title: "The Arrow",
        text: "Tradition holds that Guru Padmasambhava himself chose this site — shooting an arrow into the air and building where it fell.",
        focus: { x: 50, y: 35 },
        scale: 1.0,
      },
      {
        id: "tashiding-2",
        title: "1641",
        text: "The monastery was founded in 1641 by Ngadak Sempa Chempo Phunshok Rigzing of the Nyingma school. Its name means 'The Devoted Central Glory'.",
        focus: { x: 45, y: 48 },
        scale: 1.08,
      },
      {
        id: "tashiding-3",
        title: "Between Two Rivers",
        text: "It occupies a heart-shaped hill at the confluence of the Rathong and Rangeet rivers — a setting deliberately auspicious in Buddhist geomantic terms, with water on either side and Kanchenjunga to the north.",
        focus: { x: 80, y: 72 },
        scale: 1.14,
      },
      {
        id: "tashiding-4",
        title: "Thongwa Rangdrol",
        text: "Its most venerated object is the Thongwa Rangdrol chorten, whose name means 'the saviour by mere sight'. A single devoted glance is believed to wash away a lifetime of sin.",
        focus: { x: 60, y: 40 },
        scale: 1.16,
      },
      {
        id: "tashiding-5",
        title: "Bumchu",
        text: "On the fourteenth and fifteenth days of the first month of the Tibetan lunar calendar, a sacred vase of holy water is opened. The level inside is read as a prophecy for the year ahead — full foretells prosperity, low foretells hardship.",
        focus: { x: 40, y: 52 },
        scale: 1.1,
      },
      {
        id: "tashiding-6",
        title: "The Mani Path",
        text: "The approach is lined with mani stone slabs, each carved by hand, most bearing the mantra Om Mani Padme Hum. By tradition they are passed on the left.",
        focus: { x: 25, y: 65 },
        scale: 1.12,
      },
    ],
  },
  {
    monasteryId: "enchey",
    title: "The Solitary Temple",
    subtitle: "A hermitage on a pine ridge, and the mountain it calls a guardian",
    chapters: [
      {
        id: "enchey-1",
        title: "The Hermitage",
        text: "The site owes its origin to Lama Druptob Karpo, a tantric master of the Nyingma order renowned in local tradition for the power of flight, who established a hermitage on this ridge.",
        focus: { x: 40, y: 45 },
        scale: 1.0,
      },
      {
        id: "enchey-2",
        title: "1909",
        text: "The present monastery was constructed in 1909, during the rule of Sidkeong Tulku, replacing the earlier hermitage. It was built in a Chinese pagoda style that sets it apart from Sikkim's older monasteries.",
        focus: { x: 48, y: 42 },
        scale: 1.1,
      },
      {
        id: "enchey-3",
        title: "Enchey",
        text: "Its name means 'the solitary temple', reflecting a ridge-top setting three kilometres north-east of Gangtok, at around 1,800 metres and ringed by pine forest. Some ninety monks live here.",
        focus: { x: 22, y: 70 },
        scale: 1.14,
      },
      {
        id: "enchey-4",
        title: "Masks and Movement",
        text: "Enchey is best known for its dances: the masked Cham, performed to dispel obstructive forces, and the Singhe Chaam, the snow lion dance.",
        focus: { x: 70, y: 58 },
        scale: 1.16,
      },
      {
        id: "enchey-5",
        title: "Pang Lhabsol",
        text: "The monastery also observes Pang Lhabsol, a distinctly Sikkimese festival honouring Kanchenjunga as the state's guardian deity — a rare instance of a mountain itself venerated as a protector.",
        focus: { x: 55, y: 25 },
        scale: 1.08,
      },
      {
        id: "enchey-6",
        title: "The Ridge",
        text: "From this elevation the monastery looks out over the capital and, in clear weather, north toward Kanchenjunga. October to December brings the clearest views.",
        focus: { x: 50, y: 35 },
        scale: 1.04,
      },
    ],
  },
]

export const getStory = (monasteryId: string) =>
  stories.find((s) => s.monasteryId === monasteryId)
