# Cave prototypes — lab track

Canonical roadmap for the **cave-systems track**: a series of isolated lab prototypes (`src/lab/caves-N/`, routes `/lab/caves/N`) explored under different criteria and configurations until a **final candidate** emerges. Durable design/rationale lives in [`architecture.md`](./architecture.md); the bitmask dungeon it separates from is tracked in [`dungeon-roadmap.md`](./dungeon-roadmap.md). Process lessons from the first pass: [`retro-cave-glitches.md`](./retro-cave-glitches.md).

> **Why a track, not a feature.** Caves (Idea 7) shipped as a **toggle inside the bitmask dungeon page** — a `Cave` checkbox swapping the viewed floor for a `generateCave()` result, reusing the dungeon's renderer by returning its `DungeonResult` shape. That was the right way to get a PoC on screen and the wrong place to iterate. One implementation will not be the answer: we expect **several prototypes varying algorithm and configuration**, and the final candidate may look nothing like the current one. Each experiment threaded through a 1090-line `Page.tsx` built for doors/water/apses/alcoves that caves never use would fight both the dungeon and the other prototypes. So: each prototype is a **self-contained lab fork** with its own generator, renderer, and UI.

> **Note:** this repo copy is the source of truth for the cave track.

---

## Conventions
- **One folder per prototype** — `src/lab/caves-N/`, route `/lab/caves/N`, `export default function CavesNPage()` from `Page.tsx`. Mirrors the `hex-transitions` / `hex-transitions-2` full-folder-clone convention.
- **No imports from `geomorph-dungeon` or a sibling `caves-N`.** A prototype imports **down** into `src/core/*` (`rng`, `naming`, `text`). Forking is the point: prototypes must be free to diverge, and the bitmask dungeon must be safe to strip later without a tangle. See the fork-vs-promotion note in [`architecture.md` §1](./architecture.md#1-shared-core--two-zone-model).
  - **One tolerated exception:** the shared **room-description engine** (`lab/room-description/roomDescription.ts`), imported only in `roomDescribe.ts`. It's a pending `core/text` promotion that no cave prototype has reason to diverge from, so copying its 233 lines would duplicate for nothing. Confined to that one file — when the promotion lands, only the import moves. The dungeon lab does the same, for the same reason. Any *new* sideways import needs a better argument than this one.
- **Nav** — each cave prototype's `☰` flyout uses the lab-local `CaveNav`: a link back to **Dungeon (bitmask)** plus one link per cave prototype. The legacy `GeomorphNav` (and its older geomorph/snapshot links) stays out of this track, and the lab→`legacy/` import the dungeon page carries is not copied forward.
- **Generated assets are shared, code is not.** Prototypes may point at the existing `/dungeonTiles/cave_*.svg` assets. Only fork the tile script when a prototype needs a skin of its own.
- **Tests beside the source** — `cave.test.ts` per prototype (vitest, `npm test`). Determinism + connectivity are the invariants worth keeping in every fork.

## Shipped (newest first)
- **caves-1 — extraction of the Idea 7 PoC** (2026-07-16) — the cave generator + its viewer UI lifted out of the bitmask dungeon into `src/lab/caves-1/` (route `/lab/caves/1`), zero imports from `geomorph-dungeon`. Generation is **identical** to the dungeon page's Cave toggle at the same seed — the fork changed no generation logic, **verified** by a temporary parity harness diffing both generators' grid/stairs/levels/portals/rooms/names/profiles across 60 seeds at 24×20 plus 15 seeds at 12×10, 30×24 and 40×30 (all matched; harness then deleted, since keeping it would recreate the very `caves-1 → geomorph-dungeon` import the fork removes). Trimmed to what caves actually use: the marching-squares `DETAIL_MATERIALS` trim loop, `bitmask.ts`, `tileConfig.ts`, doors, water, pillars, elevation, round/rounded/apse/alcove tiles, furnishings, occupants and map elements are all gone — caves produce none of them, and `Page.tsx` skipped the trim loop in cave mode anyway. The multi-floor complex is gone too (each "floor" was just an independent cave); a prototype is now **one map from cols/rows/seed**. Viewer UI kept: icon top bar, flyout nav, drag-to-pan, mini-map, room-only inspector drawer with click-to-center, room pills, seed field, Download JSON, the P4 memo discipline. The bitmask dungeon's Cave toggle is **untouched** — it stays until a final candidate is picked.

## Prototype roster
- **caves-1 — CA blobs + drunkard tunnels** *(the baseline)*. The extracted PoC: cellular-automata chamber blobs (one per nucleus box) → MST + target-biased drunkard's-walk tunnels → wall bays (apse recess / alcove bulge) → flood-fill connectivity guarantee → rectilinear stair portals → chambers-as-rooms. Skin = varied concave corner fillets (4 radii × 4 orientations) + 1-cell pocket domes; silhouette is still grid-blocky under the fillets. **Every later prototype is judged against this.**
- **caves-2+ — open.** Axes worth varying, one prototype per idea rather than one prototype with knobs:
  - **Carve algorithm** — pure CA over the whole map (no nucleus boxes) · Perlin/simplex threshold · agent-based erosion · Voronoi chambers.
  - **Tunnel character** — meandering vs. direct, width variation, dead-ends and side-passages, vertical shafts.
  - **Chamber structure** — do caves even want discrete "rooms"? An unpartitioned cavern network is a real alternative to chambers-as-rooms, and it changes what room profiles/naming can say.
  - **Silhouette** — smoothing the actual polygon (marching squares over a sub-grid, spline outlines) instead of masking a square grid with fillet tiles. The blockiness under the current skin is the most likely reason caves-1 isn't the answer.
  - **Underground rivers** — a meandering `Material.Water` channel following the tunnel network (Idea 7's original ask, never built).
  - **Multi-level** — genuinely connected cave levels (shafts/chimneys), as opposed to the dungeon's stack of independent floors.

## Evaluation criteria
What "better" means when comparing prototypes — worth scoring explicitly rather than eyeballing, since aesthetic churn was the retro's expected-but-costly half:
- **Organic silhouette** — does it read as rock, or as a grid wearing rounded corners?
- **Readable chambers** — can a DM see where the spaces are, and are they distinct enough to name/describe?
- **Tunnel character** — meandering and cave-like vs. corridor-like; do dead-ends and side-passages feel deliberate?
- **Connectivity** — guaranteed reachable, provable by test, not by inspection.
- **Determinism** — same seed → same map, always. Non-negotiable; it's what makes prototypes comparable at all.
- **Perf** — generation time + render cost at large `cols × rows`; the memo discipline holds.
- **Feeds the object tree** — how well the output supports room profiles → naming → descriptions → props. A cavern network with no discrete rooms scores differently here, and that tension is the interesting part.

## Backlog
- **Pick the final candidate** — compare prototypes against the criteria above, in the real app, side by side. Blocked on there being more than one. *Decision, not code.*
- **Remove cave code from the bitmask dungeon** — **gated on the final candidate**; do not start early. Once caves live in their own track for good, strip from `src/lab/geomorph-dungeon/`: `cave.ts`, `cave.test.ts`, `caveTileConfig.ts`; the `caveMode` state + its ~11 branch sites in `Page.tsx` (imports, the `caveFloor` memo + `dungeon` swap, `matColor`, the `caveCorners`/`caveCornerTiles` memos, `caveMode` in four dep arrays, the `if (caveMode) continue` trim skip, the Cave checkbox, the layer-stack slot); `CAVE_MATERIAL_COLOR` in `materials.ts`; the cave half of `scripts/generateDungeonTiles.ts` and its `cave_*` SVG outputs (only once no prototype points at them). **Open question:** `RoomProfile.material: "cave"` in `types.ts` — whether the dungeon's profile vocabulary keeps a cave value at all once caves are elsewhere. The frozen v1–v5 snapshots keep their copies untouched (they're baselines, not live code). *Med; deferred by design.*
- **Prototype #2** — pick an axis from the roster. The **silhouette** axis is the most promising first move, since grid-blockiness is caves-1's known weakness.
- **Per-prototype tile skins** — fork `scripts/generateDungeonTiles.ts`'s cave half into a cave-owned script (→ `public/caveTiles/`) if and when a prototype needs art the shared `cave_*` set can't give it. *Small.*

## Process note — carry the retro forward
[`retro-cave-glitches.md`](./retro-cave-glitches.md) exists because the first cave pass took far too many rounds. Its rules bind this track, and the lab is partly the structural fix for them:
1. **Verify against ground truth, never a proxy.** Roughly half the churn came from declaring "fixed" off an offscreen render that omitted layers the reviewer actually saw. A dedicated, runnable prototype page **is** the real render path — use it.
2. **Reproduce a glitch before fixing it**; if it can't be reproduced, resolve that discrepancy first.
3. **Isolate the mechanism with a minimal controlled test** before implementing.
4. **Pin ambiguous aesthetic intent with 2–3 concrete options** rather than guessing. This track will generate a lot of aesthetic calls — that churn is the reviewer's to spend, and options are how to spend it well.
5. **Fix the layer that owns the problem** — geometry problems don't get texture fixes.
6. **Delete superseded artifacts**, don't just stop referencing them. A dead prototype that loses the comparison should be removed or frozen deliberately, not left to rot in the nav.
