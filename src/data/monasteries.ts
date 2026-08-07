/**
 * Sikkim monastery content for the Monastery360 virtual tour.
 *
 * Historical details are sourced from Wikipedia and Sikkim tourism references —
 * see CREDITS.md at the repo root for image attribution and source links.
 *
 * 360° PANORAMAS
 * --------------
 * All four monasteries carry a generated Blockade Labs skybox, labelled in
 * the viewer as an artistic impression. No openly-licensed photographic
 * 360° capture of these specific sites exists (Wikimedia Commons has no
 * equirectangular panoramas of them), so these evoke each site rather than
 * document it — swap any of them for `panoramaSource: "photograph"` the
 * moment a real capture is available.
 *
 * Note the URLs use the `/e/` embed form. The plain share URL
 * (skybox.blockadelabs.com/<id>, no `/e/`) returns HTTP 500 and will not
 * load — verified against all four.
 *
 * TO CHANGE OR ADD A PANORAMA
 * ---------------------------
 * Set `panoramaImage` on a monastery below. The viewer detects the form
 * automatically:
 *
 *   panoramaImage: "https://skybox.blockadelabs.com/e/<id>",
 *   panoramaSource: "artistic-impression",
 *   panoramaCredit: "Generated with Blockade Labs Skybox AI.",
 *
 * ...embeds that service's own 360 viewer in an iframe (verified working),
 * while a direct equirectangular image URL or local file:
 *
 *   panoramaImage: "/vr-assets/rumtek-360.jpg",
 *   panoramaSource: "photograph",
 *
 * ...is rendered onto a sphere in WebGL with drag-to-look.
 *
 * Set `panoramaSource` honestly. A generated skybox is an artistic
 * impression of the site, and the viewer labels it as such on screen — on
 * a heritage-preservation project, presenting generated imagery as a
 * record of a real building is the one thing not worth doing for a nicer
 * demo. Make sure any generated environment actually depicts a Himalayan
 * Buddhist monastery, too: a plausible-looking skybox of the wrong kind of
 * place is worse than the honest photography fallback.
 */

export interface MonasteryHotspot {
  id: string
  title: string
  description: string
  type: "landmark" | "wildlife" | "culture" | "nature"
  facts?: string[]
  historicalInfo?: string
  bestTime?: string
  position: { x: number; y: number }
}

export interface MonasteryLocation {
  id: string
  name: string
  type: string
  foundingYear: string
  sect: string
  description: string
  /** Published visitor hours; religious services may affect access. */
  openingHours: string
  image: string
  /**
   * A 360° panorama for this monastery. Two forms are supported and are
   * detected automatically by the viewer:
   *
   *  - A direct equirectangular image (`.jpg`/`.png`/`.webp`, local or
   *    remote) — rendered onto a sphere in WebGL, with drag-to-look.
   *  - Any other http(s) URL — treated as a third-party 360 viewer page
   *    (e.g. a Blockade Labs skybox share link) and embedded in an iframe,
   *    letting that service do its own sphere rendering.
   */
  panoramaImage?: string
  /**
   * Where the panorama came from. This is not cosmetic: an AI-generated
   * skybox is an artistic impression, not a record of the building, and on
   * a heritage-preservation project it has to be labelled as such rather
   * than presented as documentation of the real interior. The viewer shows
   * a badge whenever this is "artistic-impression".
   */
  panoramaSource?: "photograph" | "artistic-impression"
  /** Attribution line shown alongside the panorama, if any. */
  panoramaCredit?: string
  audioTracks?: Array<{
    id: string
    title: string
    description: string
    duration: string
    type: string
  }>
  educationalContent?: {
    history: string
    culture: string
    geography: string
    quiz: Array<{
      id: string
      question: string
      options: string[]
      correctAnswer: number
      explanation: string
    }>
  }
  hotspots?: MonasteryHotspot[]
}

export const locations: MonasteryLocation[] = [
  {
    id: "rumtek",
    name: "Rumtek Monastery",
    type: "Karma Kagyu Seat",
    foundingYear: "1734",
    sect: "Karma Kagyu",
    description:
      "Step inside the Dharma Chakra Centre, the largest monastery in Sikkim and the principal seat of the Karma Kagyu lineage outside Tibet.",
    openingHours: "6:00 AM – 6:00 PM",
    image: "/vr-assets/rumtek-monastery.jpg",
    panoramaImage: "https://skybox.blockadelabs.com/e/6b765851fda20aae3e2a0cea82220e14",
    panoramaSource: "artistic-impression",
    panoramaCredit: "Generated with Blockade Labs Skybox AI.",
    audioTracks: [
      {
        id: "rumtek-intro",
        title: "Welcome to Rumtek",
        description: "Introduction to the Dharma Chakra Centre",
        duration: "1:40",
        type: "introduction",
      },
      {
        id: "rumtek-history",
        title: "A Lineage in Exile",
        description: "How the 16th Karmapa rebuilt Rumtek after 1959",
        duration: "2:20",
        type: "location",
      },
      {
        id: "rumtek-culture",
        title: "The Golden Stupa",
        description: "Sacred relics and ritual life at Rumtek",
        duration: "1:55",
        type: "cultural",
      },
    ],
    educationalContent: {
      history:
        "The original monastery at Rumtek was built in 1734 by Wangchuk Dorje, the 9th Karmapa, under the patronage of the fourth Chogyal, Gyurmed Namgyal. By the 1950s it had fallen almost entirely into ruin. When the 16th Karmapa fled Tibet in 1959 following the Chinese occupation, he chose Rumtek as his seat in exile and rebuilt it from the ground up. Construction was completed in 1966, and the sacred relics and ritual objects carried out of Tibet were installed in the new shrine that same year.",
      culture:
        "Rumtek is the principal seat of the Karma Kagyu order, one of the four major schools of Tibetan Buddhism. Behind the main shrine stands the Golden Stupa, which holds the relics of the 16th Karmapa. The monastery houses a monastic college and a retreat centre, and its courtyard hosts masked Cham dances during the Tibetan new year, when monks in elaborate costume enact the subjugation of obstructive forces.",
      geography:
        "Rumtek sits at roughly 1,550 metres above sea level in East Sikkim, about 24 kilometres from Gangtok. It faces the capital across a deep river valley, and the approach winds up through terraced hillsides and stands of prayer flags. The site was chosen in part for its auspicious geography — flowing streams below, mountains behind, and a clear view of the snows.",
      quiz: [
        {
          id: "q1",
          question: "Which lineage of Tibetan Buddhism has its principal seat at Rumtek?",
          options: ["Gelug", "Karma Kagyu", "Sakya", "Nyingma"],
          correctAnswer: 1,
          explanation:
            "Rumtek is the main seat of the Karma Kagyu order outside Tibet, established there by the 16th Karmapa.",
        },
        {
          id: "q2",
          question: "By what other name is Rumtek Monastery known?",
          options: ["Dharma Chakra Centre", "Zangdok Palri", "Thongwa Rangdrol", "Tsuklakhang"],
          correctAnswer: 0,
          explanation:
            "Rumtek is formally known as the Dharma Chakra Centre, meaning the centre of the wheel of dharma.",
        },
      ],
    },
    hotspots: [
      {
        id: "rumtek-main-shrine",
        title: "Main Shrine Hall",
        description:
          "The principal assembly hall, its walls lined with murals and thangkas depicting the Kagyu lineage masters.",
        type: "landmark" as const,
        historicalInfo:
          "Completed in 1966 as part of the 16th Karmapa's reconstruction of the monastery.",
        facts: [
          "Houses relics carried out of Tibet in 1959",
          "Walls painted with the Kagyu lineage tree",
          "Seats several hundred monks during assembly",
        ],
        position: { x: 50, y: 45 },
      },
      {
        id: "rumtek-golden-stupa",
        title: "The Golden Stupa",
        description:
          "A gilded reliquary stupa containing the remains of the 16th Karmapa, kept in a chamber behind the main shrine.",
        type: "culture" as const,
        facts: [
          "Holds the relics of the 16th Karmapa",
          "Gilded and set with semi-precious stones",
          "A focus of pilgrimage for Kagyu practitioners",
        ],
        position: { x: 72, y: 38 },
      },
      {
        id: "rumtek-courtyard",
        title: "Cham Dance Courtyard",
        description:
          "The open forecourt where masked Cham dances are performed during Losar, the Tibetan new year.",
        type: "culture" as const,
        facts: [
          "Masked dances performed annually",
          "Costumes represent protective deities",
          "Open to visitors during festival days",
        ],
        bestTime: "February to March, during Losar",
        position: { x: 28, y: 62 },
      },
    ],
  },
  {
    id: "pemayangtse",
    name: "Pemayangtse Monastery",
    type: "Nyingma Monastery",
    foundingYear: "1705",
    sect: "Nyingma",
    description:
      "Explore the 'Perfect Sublime Lotus' — one of Sikkim's oldest and most revered monasteries, crowned by a seven-tiered wooden vision of paradise.",
    openingHours: "8:00 AM – 4:00 PM",
    image: "/vr-assets/pemayangtse-monastery.jpg",
    panoramaImage: "https://skybox.blockadelabs.com/e/5568ac69449b7c77f8c81662000bfd54",
    panoramaSource: "artistic-impression",
    panoramaCredit: "Generated with Blockade Labs Skybox AI.",
    audioTracks: [
      {
        id: "pemayangtse-intro",
        title: "The Perfect Sublime Lotus",
        description: "Introduction to Pemayangtse Monastery",
        duration: "1:35",
        type: "introduction",
      },
      {
        id: "pemayangtse-zangdok",
        title: "Zangdok Palri",
        description: "The seven-tiered celestial abode carved in wood",
        duration: "2:10",
        type: "cultural",
      },
    ],
    educationalContent: {
      history:
        "Pemayangtse began around 1650 as a small shrine called Tsangkhang, founded by Lhatsun Chenpo, one of the three lamas who consecrated the first Chogyal of Sikkim. In 1705 it was moved to its present hilltop site and formally established as a monastery by Chogyal Chakdor Namgyal together with Lama Khanchen Rolpai Dorje, its first head lama, in honour of Guru Padmasambhava. Its name means 'Perfect Sublime Lotus'.",
      culture:
        "Pemayangtse follows the Nyingma order, the oldest school of Tibetan Buddhism, and historically held authority over all other Nyingma monasteries in Sikkim. Its first residents were the ta-tshang, or 'pure monks', admitted only if they were of unblemished descent and had taken full vows of celibacy. Its most extraordinary treasure is the Zangdok Palri: a seven-tiered wooden sculpture of Guru Padmasambhava's celestial palace, carved over five years by a single lama.",
      geography:
        "The monastery stands at about 2,085 metres near Pelling in West Sikkim, on a ridge that looks down over the ruins of Rabdentse, Sikkim's second capital. On clear mornings the Kanchenjunga massif fills the northern horizon, and the monastery was deliberately sited to face it.",
      quiz: [
        {
          id: "q1",
          question: "What does the name 'Pemayangtse' mean?",
          options: ["Sacred Mountain", "Perfect Sublime Lotus", "Solitary Temple", "Devoted Central Glory"],
          correctAnswer: 1,
          explanation:
            "Pemayangtse translates as 'Perfect Sublime Lotus', a reference to Guru Padmasambhava.",
        },
        {
          id: "q2",
          question: "What is the Zangdok Palri housed at Pemayangtse?",
          options: [
            "A sacred water vessel",
            "A seven-tiered wooden sculpture of Padmasambhava's celestial abode",
            "A gilded reliquary stupa",
            "An illuminated manuscript library",
          ],
          correctAnswer: 1,
          explanation:
            "The Zangdok Palri is a seven-tiered wooden model of Guru Padmasambhava's heavenly palace, carved by a single lama over several years.",
        },
      ],
    },
    hotspots: [
      {
        id: "pemayangtse-zangdok-palri",
        title: "Zangdok Palri",
        description:
          "A seven-tiered wooden sculpture depicting Guru Padmasambhava's celestial palace, occupying the monastery's top floor.",
        type: "culture" as const,
        historicalInfo:
          "Carved over roughly five years by Dungzin Rinpoche, and considered the monastery's greatest treasure.",
        facts: [
          "Seven tiers, entirely hand-carved in wood",
          "Depicts Padmasambhava's paradise, Zangdok Palri",
          "Occupies the uppermost storey of the monastery",
        ],
        position: { x: 55, y: 30 },
      },
      {
        id: "pemayangtse-main-hall",
        title: "Main Prayer Hall",
        description:
          "The ground-floor assembly hall, lined with murals, statuary and centuries-old thangka paintings.",
        type: "landmark" as const,
        facts: [
          "Three-storeyed Tibetan architectural plan",
          "Murals depict Nyingma lineage masters",
          "Still in daily ritual use",
        ],
        position: { x: 35, y: 55 },
      },
      {
        id: "pemayangtse-rabdentse-view",
        title: "Rabdentse Ruins Viewpoint",
        description:
          "A viewpoint over the ruins of Rabdentse, the second capital of the Kingdom of Sikkim, in the valley below.",
        type: "landmark" as const,
        facts: [
          "Rabdentse served as capital until 1814",
          "Now a protected archaeological site",
          "Kanchenjunga visible on clear mornings",
        ],
        bestTime: "Early morning for clear mountain views",
        position: { x: 76, y: 66 },
      },
    ],
  },
  {
    id: "tashiding",
    name: "Tashiding Monastery",
    type: "Sacred Monastery",
    foundingYear: "1641",
    sect: "Nyingma",
    description:
      "Visit the monastery widely held to be the holiest in Sikkim, where a single glance at the Thongwa Rangdrol chorten is said to cleanse a lifetime of sin.",
    openingHours: "10:00 AM – 4:00 PM",
    image: "/vr-assets/tashiding-monastery.jpg",
    panoramaImage: "https://skybox.blockadelabs.com/e/1f012dec7c86c0a4193436f020cd092b",
    panoramaSource: "artistic-impression",
    panoramaCredit: "Generated with Blockade Labs Skybox AI.",
    audioTracks: [
      {
        id: "tashiding-intro",
        title: "The Devoted Central Glory",
        description: "Introduction to Tashiding Monastery",
        duration: "1:30",
        type: "introduction",
      },
      {
        id: "tashiding-bumchu",
        title: "The Bumchu Prophecy",
        description: "The sacred vase that forecasts Sikkim's year",
        duration: "2:05",
        type: "cultural",
      },
    ],
    educationalContent: {
      history:
        "Tashiding was founded in 1641 by Ngadak Sempa Chempo Phunshok Rigzing of the Nyingma school. Its name means 'The Devoted Central Glory'. The monastery occupies a heart-shaped hill between the Rathong and Rangeet rivers — a site said to have been identified by Guru Padmasambhava himself, who is believed to have shot an arrow into the air and built where it landed.",
      culture:
        "Tashiding is regarded by many Sikkimese Buddhists as the holiest monastery in the state. Its most venerated object is the Thongwa Rangdrol chorten, whose name means 'the saviour by mere sight' — a single devoted glance is believed to wash away sin. Each year the Bumchu festival, held on the fourteenth and fifteenth days of the first month of the Tibetan lunar calendar, opens a sacred vase of holy water. The level of water inside is read as a prophecy for the coming year: full foretells prosperity, low foretells hardship. The approach to the monastery is lined with mani stone slabs, each hand-carved with mantras.",
      geography:
        "The monastery stands on a hilltop in West Sikkim, at the confluence of the Rathong and Rangeet rivers. The setting is deliberately auspicious in Buddhist geomantic terms, with water on either side and the peaks of Kanchenjunga to the north.",
      quiz: [
        {
          id: "q1",
          question: "What is believed to happen when a devotee glances at the Thongwa Rangdrol chorten?",
          options: [
            "They receive a vision of the future",
            "Their sins are cleansed",
            "They are granted long life",
            "They are protected on the journey home",
          ],
          correctAnswer: 1,
          explanation:
            "Thongwa Rangdrol means 'the saviour by mere sight' — a single devoted glance is believed to cleanse sin.",
        },
        {
          id: "q2",
          question: "What does the Bumchu festival use to predict Sikkim's fortunes for the coming year?",
          options: [
            "The flight of birds over the monastery",
            "The water level in a sacred vase",
            "The pattern of butter lamp flames",
            "The first snowfall on Kanchenjunga",
          ],
          correctAnswer: 1,
          explanation:
            "During Bumchu, a sacred vase of holy water is opened and its level read as a forecast for the year ahead.",
        },
      ],
    },
    hotspots: [
      {
        id: "tashiding-thongwa-rangdrol",
        title: "Thongwa Rangdrol Chorten",
        description:
          "The most sacred chorten in Sikkim, believed to cleanse the sins of anyone who looks upon it with devotion.",
        type: "culture" as const,
        historicalInfo:
          "Its name translates as 'the saviour by mere sight', and it draws pilgrims from across the Himalaya.",
        facts: [
          "Considered the holiest chorten in Sikkim",
          "Surrounded by a cluster of smaller chortens",
          "A focal point of the Bumchu festival",
        ],
        position: { x: 60, y: 40 },
      },
      {
        id: "tashiding-mani-stones",
        title: "Mani Stone Slabs",
        description:
          "Rows of stone slabs carved by hand with Buddhist mantras, lining the path up to the monastery.",
        type: "culture" as const,
        facts: [
          "Each slab is carved by hand",
          "Most bear the mantra Om Mani Padme Hum",
          "Traditionally passed on the left when walking",
        ],
        position: { x: 25, y: 65 },
      },
      {
        id: "tashiding-river-confluence",
        title: "Rathong–Rangeet Confluence",
        description:
          "The meeting of two rivers below the monastery hill, part of what makes the site geomantically auspicious.",
        type: "nature" as const,
        facts: [
          "Monastery sits on a heart-shaped hill between the rivers",
          "Site said to be chosen by Guru Padmasambhava",
          "Sacred water for Bumchu is drawn nearby",
        ],
        bestTime: "Post-monsoon, when the rivers run clear",
        position: { x: 80, y: 72 },
      },
    ],
  },
  {
    id: "enchey",
    name: "Enchey Monastery",
    type: "Nyingma Monastery",
    foundingYear: "1909",
    sect: "Nyingma",
    description:
      "Walk through 'The Solitary Temple' above Gangtok, a pine-shrouded Nyingma monastery famed for its masked Cham dances.",
    openingHours: "9:00 AM – 5:00 PM",
    image: "/vr-assets/enchey-monastery.jpg",
    panoramaImage: "https://skybox.blockadelabs.com/e/3969db90361f9f10e02ee432bb90328b",
    panoramaSource: "artistic-impression",
    panoramaCredit: "Generated with Blockade Labs Skybox AI.",
    audioTracks: [
      {
        id: "enchey-intro",
        title: "The Solitary Temple",
        description: "Introduction to Enchey Monastery",
        duration: "1:25",
        type: "introduction",
      },
      {
        id: "enchey-cham",
        title: "Masks and Movement",
        description: "The Cham and Singhe Chaam dances of Enchey",
        duration: "1:50",
        type: "cultural",
      },
    ],
    educationalContent: {
      history:
        "The site owes its origin to Lama Druptob Karpo, a tantric master of the Nyingma order renowned in local tradition for the power of flight, who established a hermitage on this ridge. The present monastery was constructed in 1909 during the rule of Sidkeong Tulku, and was built in a Chinese pagoda style that sets it apart from Sikkim's older monasteries. Its name, Enchey, means 'the solitary temple'.",
      culture:
        "Enchey belongs to the Nyingma order of Vajrayana Buddhism. It is best known for its festival dances: the masked Cham, performed to dispel obstructive forces, and the Singhe Chaam or snow lion dance. The monastery also observes Pang Lhabsol, the distinctly Sikkimese festival honouring Kanchenjunga as the state's guardian deity — a rare instance of a mountain itself being venerated as a protector.",
      geography:
        "Enchey stands roughly three kilometres north-east of Gangtok at around 1,800 metres, on a ridge surrounded by pine forest. Its elevation gives it a wide outlook over the capital and, in clear weather, toward Kanchenjunga.",
      quiz: [
        {
          id: "q1",
          question: "What does the name 'Enchey' mean?",
          options: ["The Golden Roof", "The Solitary Temple", "The Lotus Throne", "The Cloud Gate"],
          correctAnswer: 1,
          explanation: "Enchey means 'the solitary temple', reflecting its isolated ridge-top setting above Gangtok.",
        },
        {
          id: "q2",
          question: "Which festival celebrated at Enchey honours Kanchenjunga as Sikkim's guardian deity?",
          options: ["Losar", "Bumchu", "Pang Lhabsol", "Saga Dawa"],
          correctAnswer: 2,
          explanation:
            "Pang Lhabsol is a distinctly Sikkimese festival that venerates Mount Kanchenjunga as the state's protective deity.",
        },
      ],
    },
    hotspots: [
      {
        id: "enchey-main-temple",
        title: "Main Temple",
        description:
          "The principal shrine, built in 1909 in a Chinese pagoda style unusual among Sikkim's monasteries.",
        type: "landmark" as const,
        historicalInfo: "Constructed under the rule of Sidkeong Tulku, replacing Lama Druptob Karpo's hermitage.",
        facts: [
          "Built in 1909 in Chinese pagoda style",
          "Stands on the site of an earlier hermitage",
          "Home to around ninety monks",
        ],
        position: { x: 48, y: 42 },
      },
      {
        id: "enchey-cham-ground",
        title: "Cham Dance Ground",
        description:
          "The courtyard where monks perform the masked Cham and the Singhe Chaam snow lion dance each year.",
        type: "culture" as const,
        facts: [
          "Masked Cham performed annually",
          "Singhe Chaam represents the snow lion",
          "Dances are believed to dispel obstructive forces",
        ],
        bestTime: "December to January, during the Cham festival",
        position: { x: 70, y: 58 },
      },
      {
        id: "enchey-pine-ridge",
        title: "Pine Forest Ridge",
        description:
          "The forested ridge surrounding the monastery, offering views over Gangtok and toward Kanchenjunga.",
        type: "nature" as const,
        facts: [
          "Roughly 1,800 metres above sea level",
          "Surrounded by dense pine forest",
          "Kanchenjunga visible in clear weather",
        ],
        bestTime: "October to December for clearest views",
        position: { x: 22, y: 70 },
      },
    ],
  },
]
