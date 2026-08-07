# 360° Skybox Prompts

Prompts for generating the `panoramaImage` skyboxes referenced in
`src/data/monasteries.ts`. Written for [Blockade Labs Skybox
AI](https://skyboxai.blockadelabs.com), which the viewer embeds via iframe.

Every architectural detail below comes from the sourced content in
`monasteries.ts` — the Chinese pagoda roof at Enchey, the seven-tiered
Zangdok Palri at Pemayangtse, the mani slabs at Tashiding. That specificity
is the point: a prompt like "Buddhist monastery interior" produces a
generic East Asian temple that looks nothing like a Sikkimese Nyingma or
Kagyu monastery.

## Before you generate

- Pick a **photorealistic** style preset, not an illustrated or stylised one.
- Keep `no people` in the prompt. Generated figures in a 360° environment
  are static, faces render poorly, and monks rendered inaccurately in a
  religious space is its own problem.
- **Check the result actually looks Himalayan.** During testing, the old
  Jharkhand skybox rendered flawlessly while showing thatched huts and
  tropical forest under the label "Rumtek Monastery". A convincing skybox
  of the wrong kind of place is worse than the honest photography fallback.
- Set `panoramaSource: "artistic-impression"` for anything generated. The
  viewer shows an on-screen badge; that is deliberate.

---

## Rumtek — Karma Kagyu seat, rebuilt 1966

**Interior — main shrine hall**

> Standing in the centre of a large Tibetan Buddhist assembly hall, Karma
> Kagyu monastery interior, tall red and gold lacquered pillars with carved
> capitals, long rows of low maroon monk seating cushions, walls covered
> floor to ceiling with detailed thangka paintings of lineage masters,
> brocade banners hanging from a high coffered ceiling, rows of brass butter
> lamps glowing, soft Himalayan daylight through high windows, faint incense
> haze, photorealistic, no people

**Exterior — Cham dance courtyard**

> Standing in the centre of a wide stone-paved monastery courtyard in the
> eastern Himalaya, a large multi-storey Tibetan monastery with white walls,
> a deep red upper band, golden roof finials and ornately painted window
> frames, colourful prayer flags strung overhead, forested ridges and
> terraced hillsides beyond, distant snow peaks on the horizon, clear
> morning light, photorealistic, no people

## Pemayangtse — Nyingma, 1705, at 2,085 m

**Interior — the Zangdok Palri floor**

> Standing on the top floor of an old three-storey Nyingma monastery in
> Sikkim, dominated by an intricate seven-tiered hand-carved and painted
> wooden sculpture of a celestial palace, dark aged timber floor and roof
> beams, small windows admitting cold mountain light, old thangkas and
> bronze statuary along the walls, butter lamps, photorealistic, no people

**Exterior — the ridge above Rabdentse**

> Standing on a high ridge outside an old Sikkimese Nyingma monastery,
> whitewashed monastery walls with red and gold trim behind, stone
> forecourt, prayer flags, the ruins of an abandoned hilltop palace visible
> in the forested valley below, an immense snow-covered Himalayan massif
> filling the northern horizon on a clear morning, photorealistic, no people

## Tashiding — Nyingma, 1641, holiest in Sikkim

**Exterior — the chorten cluster**

> Standing among a cluster of whitewashed Buddhist chortens on a forested
> hilltop in Sikkim, one large central stupa with a gilded spire,
> weathered stone mani slabs carved with Tibetan mantras stacked along the
> path, prayer flags strung between trees, mist rising from river valleys on
> either side, soft overcast Himalayan light, photorealistic, no people

**Exterior — the mani stone approach**

> Standing on a stone path lined with hand-carved mani stone slabs bearing
> Tibetan mantras, climbing toward a small hilltop Nyingma monastery in
> Sikkim, dense subtropical forest on both sides, prayer flags overhead,
> whitewashed chortens ahead through the trees, early morning mist,
> photorealistic, no people

## Enchey — Nyingma, 1909, Chinese pagoda style

Enchey's pagoda roof is what distinguishes it from every other monastery on
the circuit — keep it in the prompt.

**Exterior — the pagoda forecourt**

> Standing in the forecourt of a small Himalayan Buddhist monastery built in
> Chinese pagoda style, upswept tiered roof with ornate eaves, painted red
> and gold woodwork, whitewashed walls, surrounded by tall dense pine
> forest, prayer flags, a town visible far below through the trees, clear
> cool morning light, photorealistic, no people

**Exterior — the Cham dance ground**

> Standing in the open courtyard of a small pine-shrouded Himalayan
> monastery, a Chinese pagoda-style temple with an upswept tiered roof on
> one side, painted red and gold columns, a tall prayer flag pole at the
> centre, a ring of pine forest all around, snow peaks on the horizon, crisp
> winter light, photorealistic, no people

---

## Wiring one up

```ts
// in src/data/monasteries.ts, on the relevant monastery
panoramaImage: "https://skybox.blockadelabs.com/e/<id>",
panoramaSource: "artistic-impression",
panoramaCredit: "Generated with Blockade Labs Skybox AI.",
```

A real equirectangular photograph instead — your own capture, or an openly
licensed one — goes in the same field and is rendered on a WebGL sphere
rather than iframed:

```ts
panoramaImage: "/vr-assets/rumtek-360.jpg",
panoramaSource: "photograph",
```
