# Dungeon geomorph — roadmap & backlog

Canonical roadmap for the two-layer bitmask dungeon (`src/refactorGeomorphs/geomorph-dungeon/`, route `/refactor/geomorph-dungeon`) and the shared-core work it seeds. Durable design/rationale lives in [`architecture.md`](./architecture.md).

> **Note:** this repo copy is the source of truth. (During Claude Code sessions a working scratchpad also exists under `~/.claude/`, but this file is canonical.)

---

## Shipped (newest first)
- **Room names — shared-core naming pilot** (2026-07-09) — `src/core/naming/` (first `core/` resident): `roomName(rng=Math.random)`, rng-injectable. `RoomInfo.name` set at generation alongside `num`; dungeon imports `../../core/naming` (proves *feature → core* dependency direction). Shown via a hover popup on the room-number pill. Prototype = non-seeded + curated word lists.
- **Room-number indicators** — `RoomInfo.num` (sequential 1..N) + a black-pill/hotdog overlay centred on each room; "Room numbers" toggle.
- **Dungeon v4 frozen baseline** — `geomorph-dungeon-v4` (post-alcoves + tighter rounded corners + door tweaks); tiles shared.
- **Tighter rounded-room corners** — half-cell fillet (straight→arc→straight), scoped to `rounded` rooms via `rrcorner_*`/`rrtrim_*` tiles; circles/apses unchanged.
- **Alcoves (E3d)** — outward half-circle bays (small + large) with dedicated tiles + wall-detail transition fixes.
- **Apses (E3b)** — semicircular bays + tiny bumps (symmetric runs, one-size-per-room, placed after corridors).
- **Round rooms (E3c)** — rounded corners + circular rooms as tile art.
- **Extended room geometry (E3a)** — `rect | rounded | circle` footprints.
- **Edge-features / flush side-rooms (B1)**, **Stairs + elevation** (union-find, geometry-consistent), **Side-rooms (E1)**, **Level portals (E2)**, **MST connector (E5 "evolve current")**, **Pillars**, **Water conditions** (pool / partial / full).
- **Tooling:** Vitest suite (`dungeon.test.ts` property invariants + `bitmask.test.ts` units); tile atlas review template (`scripts/buildDungeonTileAtlas.ts` → `tile-template/`).
- **Frozen baselines** v1–v4 = code snapshots for visual comparison (tiles shared).

## Suggested near-term sequence
Quick wins **E6 (JSON) · Idea 6** and **T1 (seeded RNG)** → then pick from R/U/P as interest dictates. The shared-core reorg proceeds opportunistically (promote modules as they're touched).

---

## Backlog

### Generation features
- **E6 / Idea 6 — Download JSON** — "Download JSON" button; `DungeonResult` is already serialisable. Export `{version, cols, rows, S, SUB, materialLegend, ...dungeon}` via Blob + `<a download>`. Follow-ups: import/load + seeded repro. *Small.*
- **Idea 4 / E4 — Symmetrical zones** — mirror room+corridor *structure* across H/V/both axes with a jitter knob; decoration runs free. MVP whole-map → sub-zones. Optional: mirror elevation. *Medium→large.*
- **Idea 7 — Underground caves** — organic CA / drunkard's-walk carve, meandering tunnels, underground rivers (a meandering `Material.Water` channel); no doors/pillars v1; needs a connectivity flood-fill guarantee. Whole-map mode first. Reuse `geomorph-ca`/`geomorph-walk`. *Medium→large.*
- **Idea 8 — Pre-defined room patterns** — a `RoomPattern` registry (size/shape + feature specs + "magnets" = named anchor points for elements & connectors); apply a pattern to a room instead of the procedural passes. **8a — pattern-editor page:** a standalone route where the user clicks cells → assigns features/magnets → saves records into a *shared pattern collection* other pages read. *Large.*
- **Idea 3c — curve-aware trim polish** / more materials (lava, second wall type) / richer base generation. *Various.*
- **Phase B2 — flush MAIN rooms** — needs a `passable()` connectivity refactor (edge-aware flood over walls/edge-walls). *Medium.*
- **Stairs — literal equal tile counts** (deferred) — elevation is consistent by *net level change* today; making two connections between the same rooms use the same *number* of stair tiles is a distinct, harder constraint.

### Testing & tooling
- **T1 — Seeded / deterministic generation** — thread a seedable PRNG (mulberry32/xorshift, no dep) through `dungeon.ts`, replacing bare `Math.random()`; `generateDungeon(cols, rows, seed?)`, unseeded path unchanged. Enables fixed-seed test corpus, replay-a-failure-by-seed, "share by seed", and reproducible room names / tile variants. **Suite-wide** (maps + names + config-gen). *Small–medium.*
- **T2 — Flush-to-feature invariant test** — assert no non-room open cell is orthogonally flush to any apse/alcove floor cell. Needs the generator to **expose feature footprints** (surface `apseCellList`/`alcoveCellList` on `DungeonResult`). *Small.*

### UI / viewer
- **U1 — Mini-map** — always-visible miniature (one `<canvas>`, a rect per base cell via `MATERIAL_COLOR` — NOT a scaled DOM clone) + a viewport rectangle from the scroll wrapper. Phase 1 view-only, Phase 2 click/drag to pan. `Page.tsx` only. *Phase 1 small.*

### Tile theming pipeline (R) — the ATLAS is the shared contract
See [`architecture.md`](./architecture.md) for the full pipeline. `tile-template/tile-atlas.{png,json}` (atlas-builder, done) is a tileset **interchange format** (93 slot names + geometry + layout). Pipeline: *any tile source → atlas (conforming to JSON) → validate → slice → themed manifest.*
- **R1 — Image-driven reskin** *(producer)* — analyze an example image → retune `generateDungeonTiles.ts` palette/line-style (recommended start), or AI paint into the labeled atlas canvas. *Small→large.*
- **R2 — PNG/Photoshop path** *(producer)* — PNG support near-free (tiles are `<img src>`; manifest → `.png`). Atlas → hand-paint → slice → themed manifest. Needs a **slicer**. Caveat: base floor/wall + doors are `<div>`s (would need converting to `<img>` tiles to texture). *Tooling small–med.*
- **R3 — Runtime skin selector (UI)** *(consumer)* — a "Skin" dropdown swaps the active theme live. `Skin = {id,label,tileBase,tileExt,palette,…}`; derive tile URLs by name from the active skin instead of fixed `tileConfig.ts` constants; base fills/grid from `skin.palette`. Frozen v1–v4 untouched. *Refactor small–med.*
- **R4 — Tile variants (variation families)** — a slot can hold K art options picked per cell (straight wall trims, floor, water). Contract extends to families (`<slot>__<i>` + `variantCount`/`weights`). Deterministic per-cell pick (positional hash → stored index once T1 lands). Floor/water must become tile families first. *Small–med + base-layer-as-tiles.*

### Platform / stack refinements
- **P1 — Suite-wide seeded RNG** (= T1, but shared across maps + names + config-gen).
- **P2 — Canvas/WebGL tilemap render path** — before large maps make the DOM (hundreds–thousands of elements/layer) jank. PixiJS or raw canvas; same TS. Pairs with U1.
- **P3 — Stack tech-debt** — consolidate state (`jotai` + `recoil` both present) + styling (`react-jss` vs inline).

### Shared-core / repo reorg (in progress)
Two-zone model + `core/` layout + promotion discipline — see [`architecture.md`](./architecture.md). Pilot 1 (naming) shipped. Next: seed names via T1; enrich from `src/names`; add `@core/*` aliases + boundary lint; promote a second module opportunistically.
