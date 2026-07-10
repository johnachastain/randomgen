# Hex tile generation scripts

Scripts that turn hand-authored hex SVG artwork into the tile library the
Hex Transitions page (`/refactor/hex-transitions/wfc`) renders. All output SVGs
live in `public/hexTiles/`; the runtime tile config is generated into
`src/refactorHexTransitions/tileConfig.ts`.

## Authoring a new tile (source SVG requirements)

Drop hand-drawn source SVGs into `public/hexTiles/` (the generators scan that
folder's top level only — not subfolders like `new/`).

**Naming** — the base name must NOT contain the generators' reserved suffixes:
- no rotation suffix `_r###` (e.g. `_r060` … `_r300`) — added by `generate-tiles`.
- no terrain-pair suffix `_<terrain>_<terrain>` (e.g. `_coast_plains`) — added by `recolor-tiles`.

Good source names: `curve.svg`, `corner.svg`, `peninsula.svg`.

**Geometry** — flat-top hex filling the viewBox, proportioned **width : height = 2 : √3**
(e.g. `viewBox="0 0 200 173.2"`, or Illustrator's `121.88 × 105.56`). Corners sit
at the box extremes. Each corner is color-sampled **12px inset** toward center at a
200px-wide render, so keep every corner region a clean single color — don't route
the dividing line straight through a corner.

**Color** — use **exactly two fill colors and nothing else**: no strokes/outlines,
no gradients, no extra artboard colors. `recolorHexTiles.ts` reads every `#rrggbb`
in the file text (including the `<style>` block) and **skips any tile whose colors
map to more than two terrains**. A stray `stroke:#…` counts. Author in two of the
palette hexes below so they map cleanly:

| terrain | hex | terrain | hex |
|---|---|---|---|
| ocean | `#2255aa` | hills | `#aa8844` |
| coast | `#66aadd` | mountains | `#999999` |
| plains | `#99cc55` | desert | `#ddcc77` |
| forest | `#336622` | swamp | `#667744` |

Colors are matched to the nearest palette entry, so near-palette shades are fine
(the stock art uses `#a7d16c`→plains, `#006838`→forest). The **shape** — which
corners are color A vs B — is what defines the tile's corner pattern. To contribute
a real transition (not a "solid"), the minority terrain must reach at least one corner.

## Processing sequence

Once source SVGs are in `public/hexTiles/`:

```
npm run recolor-tiles              # fan each source out to every adjacent terrain pair
npm run generate-tiles             # write 60°..300° rotation files (_r###)
npm run generate-transitions-config  # rebuild src/refactorHexTransitions/tileConfig.ts
```

`generate-solid-tiles` only needs to be run once (or when the palette changes) to
create the solid single-terrain tiles.

## Script index

| npm script | file | what it does |
|---|---|---|
| `detect-tiles` | `detectHexTiles.ts` | Corner sampler + shared helpers (`detectTile`, `detectCorners`, `edgeKey`, `writeTileConfig`, palette). Also writes the legacy edge-based config for the older hex-terrain pages. |
| `recolor-tiles` | `recolorHexTiles.ts` | For each 2-terrain source, emits `<base>_<a>_<b>.svg` for every adjacent terrain pair in the `ADJACENCY` matrix. Skips non-2-terrain files. |
| `generate-tiles` | `generateHexTileRotations.ts` | Writes 60° rotation SVGs (`_r###`) for every source/variant, dedup'd by edge key. Also refreshes the legacy edge-based `src/hexTerrainShared/tileConfig.ts`. |
| `generate-solid-tiles` | `generateSolidHexTiles.ts` | Writes `solid_<terrain>.svg` — one flat-color hex per terrain, so map regions can be uniform. |
| `generate-transitions-config` | `generateHexTransitionsConfig.ts` | Rasterizes every `public/hexTiles/*.svg`, samples its 6 corners (no pair-collapsing), and writes the **corner-based** `src/refactorHexTransitions/tileConfig.ts` the Hex Transitions page consumes. |
| `generate-dungeon-tiles` | `generateDungeonTiles.ts` | Emits **placeholder** per-material wall-detail "trim" SVGs (`public/dungeonTiles/wall_trim_<1..19>.svg`, `water_trim_<1..19>.svg`; orthogonal edges 1–15, outer-corner nubs 16–19) plus `door_{n,s,e,w}.svg` and `pillar.svg`, and the `src/lab/geomorph-dungeon/tileConfig.ts` manifest (`TRIM_WALL`, `TRIM_WATER`, `DOOR_TILES`, `PILLAR_TILE`). Colours come from `materials.ts` `TRIM_STYLE`; index scheme lives in `bitmask.ts`. Swap real art by replacing the SVGs (same names) or editing the manifest. |

## How the runtime uses it

`src/refactorHexTransitions/` runs a tile-domain WFC: each cell picks a tile, and
two neighbors fit when they agree on the terrain at their two shared **corners**
(`hexUtils.tilesMatch`). `HexTile.tsx` renders the chosen tile's SVG. So the visual
richness of the map is driven almost entirely by the variety of corner patterns in
the source artwork.
