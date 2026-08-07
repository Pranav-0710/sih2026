# Image & Video Credits

Monastery photography and video used in Monastery360 is sourced from Wikimedia
Commons under Creative Commons licences. Attribution is required by these
licences and is reproduced here in full.

| Media | Monastery | Author | Licence | Source |
|---|---|---|---|---|
| `public/vr-assets/enchey-prayer-flags.webm` | Enchey Monastery (prayer flags) | Rajani Gairshail | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Prayer_flags_at_Enchey_Monastery,_Gangtok.webm) |
| `public/vr-assets/enchey-prayer-wheels.webm` | Enchey Monastery (prayer wheels) | Rajani Gairshail | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Prayer_wheels_at_Enchey_Monastery,_Gangtok.webm) |
| `public/vr-assets/rumtek-monastery.jpg` | Rumtek Monastery (Dharma Chakra Centre) | Anjan Kumar Kundu | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Rumtek_Monastery_alias_Dharma_Chakra_Centre_near_Gangtok,_East_Sikkim_09.jpg) |
| `src/assets/hero-sikkim.png` | Rumtek Monastery (site-wide hero image, higher-resolution crop of the same source) | Anjan Kumar Kundu | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Rumtek_Monastery_alias_Dharma_Chakra_Centre_near_Gangtok,_East_Sikkim_09.jpg) |
| `public/vr-assets/pemayangtse-monastery.jpg` | Pemayangtse Monastery | Kothanda Srinivasan | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Main_Shrine_of_Pemangytse_Gompa_with_prayer_flags.jpg) |
| `public/vr-assets/tashiding-monastery.jpg` | Tashiding Monastery (mani stone slabs) | walter callens | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Mani_stone_slabs_outside_Tashiding_Monastery.jpg) |
| `public/vr-assets/enchey-monastery.jpg` | Enchey Monastery | Amitabha Gupta | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Enchey_Monastery_in_Gangtok_district,_East_Sikkim.jpg) |
| `public/images/sikkim-map.svg` | Sikkim location map | Own work based on User:Philg88 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Sikkim_location_map.svg) |

## Map marker positioning

Monastery markers on the Heritage map are positioned from real coordinates
(sourced from Wikipedia) against the documented bounds of the Sikkim location
map — `top 28.14, bottom 27.03, left 87.95, right 88.93` — using:

```
left% = (lon − 87.95) / (88.93 − 87.95) × 100
top%  = (28.14 − lat) / (28.14 − 27.03) × 100
```

| Monastery | Latitude | Longitude | top | left |
|---|---|---|---|---|
| Rumtek | 27.28861 | 88.56139 | 76.70% | 62.39% |
| Pemayangtse | 27.30444 | 88.25278 | 75.28% | 30.90% |
| Tashiding | 27.30833 | 88.29806 | 74.92% | 35.52% |
| Enchey | 27.33583 | 88.61917 | 72.45% | 68.28% |

## Historical & cultural sources

Monastery histories, founding dates, lineages and festival details are drawn from
Wikipedia and Sikkim tourism references, including:

- [Rumtek Monastery](https://en.wikipedia.org/wiki/Rumtek_Monastery) — founding, Karma Kagyu lineage, 16th Karmapa
- [Pemayangtse Monastery](https://www.incredibleindia.gov.in/en/sikkim/pelling/pemayangtse-monastery) — 1705 founding, Nyingma order, Zangdok Palri
- [Tashiding Monastery](https://en.wikipedia.org/wiki/Tashiding_Monastery) — 1641 founding, Thongwa Rangdrol chorten, Bumchu festival
- [Enchey Monastery](https://en.wikipedia.org/wiki/Enchey_Monastery) — 1909 construction, Lama Druptob Karpo, Cham dances

Visitor hours displayed in the homepage monastery cards were checked against
[Incredible India](https://www.incredibleindia.gov.in/en/sikkim/pelling/pemayangtse-monastery)
(Pemayangtse), the Government of India's
[Swadesh Darshan 2.0 Sikkim plan](https://sd2.tourism.gov.in/DocumentRepoFiles/MasterPlan/MPa73cf981-1e7e-4fea-af16-dbce64b2862b.pdf)
(Tashiding), [Taj Hotels' Gangtok visitor guide](https://www.tajhotels.com/en-in/hotels/taj-guras-kutir-gangtok/places-to-visit)
(Rumtek), and a current [Gangtok visitor guide](https://india-guide.in/destinations/gangtok/timings/)
(Enchey). Hours can change for religious observances and should be confirmed locally before travel.

> Note: panoramic (360°) imagery of these specific monasteries is not freely
> available under an open licence. The current build uses the static photography
> credited above; true panoramic capture is documented as future scope rather
> than simulated.

## Homepage hero media carousel

The homepage hero cycles through all four monasteries. Only Enchey has openly-licensed
video footage available (the two clips above, both vertical/portrait source).
Rumtek, Pemayangtse, and Tashiding use the static photography above with a
"Ken Burns" pan/zoom effect rather than real video — this is disclosed here
rather than presented as if all four had actual motion footage.


## Digital archive (/archive)

The archive presents **87** images pulled from Wikimedia Commons via its
public API, together with the author and licence metadata recorded for each file.
Images are loaded from Commons' own thumbnail service and every card links back to
its source page, where the full licence terms and author credit live. Attribution
(author + licence) is also shown on the card itself, as CC BY and CC BY-SA require.

Licences represented:

- CC BY 4.0 — 72 file(s)
- CC BY 2.0 — 5 file(s)
- CC BY-SA 3.0 — 4 file(s)
- CC BY-SA 4.0 — 3 file(s)
- CC BY 3.0 — 1 file(s)
- CC0 — 1 file(s)
- CC BY-SA 2.0 — 1 file(s)

By monastery:

- Enchey Monastery — 38 item(s)
- Tashiding Monastery — 28 item(s)
- Pemayangtse Monastery — 16 item(s)
- Rumtek Monastery — 5 item(s)

> Nothing in the archive is generated or reconstructed. The dataset is produced by
> `gen-archive.mjs` from live Commons metadata so it can be regenerated as more
> material is released under a free licence. No manuscript scans are included:
> none are openly licensed for these four monasteries at the time of writing.
