# Architecture & design notes

Durable design rationale for this repo (a browser-delivered **suite of config-driven generators** — maps, random naming, config-driven objects). The milestone backlog lives in [`dungeon-roadmap.md`](./dungeon-roadmap.md); the project's **north star** — a config-driven random-object engine the map renders — is [`vision.md`](./vision.md). The sections below are the *mechanics* that serve that vision.

---

## 1. Shared-core / two-zone model

**Goal:** iterate on features in throwaway, bespoke sandboxes, then *promote* the proven parts into a coherent shared core — a solo-dev-friendly alternative to branch-switching (experiments stay visible and runnable next to stable code; no stash/checkout tax).

### Zones
- **Experimental** (`src/` bespoke dirs, e.g. `refactorGeomorphs/geomorph-*`) — churn freely, delete at will.
- **Finalized core** — `src/core/` (horizontal primitives) + `features/` (vertical generators built on core).
- **Snapshots** (`geomorph-*-v1..v4`) — *intentional* frozen copies for visual comparison. Distinct from promotion; they're allowed to diverge.

### The one hard rule — dependency direction
> **core** imports only **core**. **features** import **core**. **Nothing** imports the experimental zone.

Hold this and you can churn/delete experiments without ever touching core. Enforce mechanically later (ESLint `import/no-restricted-paths` or `eslint-plugin-boundaries`).

### Promotion = extract, don't copy
When something graduates: stabilize its public API (barrel `index.ts`), add tests, strip experiment-only hacks, and **retire the experiment's copy** (it then imports core, or is deleted). Never keep two live forks — that's the divergence the `v1–v4` *snapshots* have on purpose but the working core must not.

### The exception — a prototype fork is not a failed promotion
A **competing-prototype track** is a third legitimate reason to copy, alongside snapshots. When a feature needs to be explored as several divergent implementations before a winner exists (the **cave track**: `src/lab/caves-N/`, [`cave-prototypes.md`](./cave-prototypes.md)), each prototype forks the modules it needs — `caves-1` carries its own trimmed `types`/`materials`/`Page.module.css`/nav rather than importing or promoting the dungeon's.

This is deliberate, not debt. Promotion requires knowing the shared shape, and **you can't know it from one implementation** — extracting now would freeze the current prototype's assumptions into core and make the next prototype fight them. Prototypes are also load-bearingly free to diverge; a shared module is exactly the coupling that prevents that. Note the layout below already anticipates the eventual destination (`core/grid/` — "flood-fill, union-find, bitmask/marching-squares"), and the fork keeps that door open rather than walking through it early.

**So: don't "fix" a prototype fork's duplication.** Promotion happens when the cave track picks its final candidate and the shape it actually needs is known — at which point the losing prototypes are deleted (not left as live forks) and the winner promotes normally, per the checklist below. The forks are still bound by the hard rule: they import **down** into `core/` and never sideways into another lab.

### Proposed layout (let it emerge — don't scaffold empty folders up front)
```
src/
  <experimental dirs>      # sandbox — churn freely
  core/                    # finalized shared primitives (horizontal)
    rng/                   #   seeded PRNG, shuffle, weightedPick, dice   (T1)
    grid/                  #   grid types, neighbors, flood-fill, union-find, bitmask/marching-squares
    config/                #   Zod schemas, content registry, load/validate, persistence
    text/                  #   tracery-style grammar + string helpers (naming primitives)
    render/                #   canvas/SVG draw, palette, viewport
    tiles/                 #   atlas contract, slicer, skin model (theming pipeline)
    serialize/             #   JSON export/import, seed encode
    model/                 #   shared domain types
    ui/                    #   shared React: nav, flyout, sliders, toggles, legend
  features/                # finalized generators (vertical, depend on core)
    dungeon/  hex-terrain/  naming/  character/
  snapshots/               # frozen comparison baselines (v1-v4…) — NOT core
  app/                     # routing, home/index, shell
```
Ergonomics: `@core/*` / `@features/*` path aliases (tsconfig `paths` + Vite `resolve.alias`) + a barrel `index.ts` per core module.

### Promotion checklist (keep it lightweight)
1. API stabilized + barrel export. 2. Has tests. 3. No experiment-only hacks. 4. Experiment copy retired (imports core) or deleted.

### Status
**Pilot 1 shipped (2026-07-09): `src/core/naming/`** → feeds `RoomInfo.name` in the dungeon (imports `../../core/naming`, proving *feature → core*).
**Pilot 2 shipped (2026-07-10): `src/core/rng/`** (T1) → `mulberry32` seeded PRNG + `Rng` type; `generateDungeon(cols, rows, seed?)` is now reproducible (same seed → identical map + room names; determinism test in `dungeon.test.ts`), and `roomName` seeds through it. Seed shown + settable in the dungeon UI. Next: consolidate the duplicate `Rng` type from `lab/room-description` onto `core/rng`; enrich naming from `src/names`; add `@core/*` aliases + boundary lint.

---

## 2. Tech-stack assessment (when to reconsider)

**TS / React / Vite is the right tool — don't rewrite.** The product is an interactive, visual, browser-delivered suite of config-driven generators; compute is light (small grids), and config-driven objects are a TS strength. Broadening from mapping to naming + config-gen only *reinforces* this (even more JSON/data-centric, even less compute-bound).

**The real forks are per-layer, not language:**
- **Rendering at scale → Canvas/WebGL** (still TS). The current DOM tilemap (hundreds–thousands of `<img>`/`<div>` per layer) is the most likely wall on large maps. PixiJS or raw canvas. *(= roadmap P2.)*
- **Heavy generation → Web Workers → Rust/WASM** — only if profiling shows a real bottleneck. The clean generator/renderer split keeps a future *partial* Rust/WASM core cheap.
- **Offline data / ML → Python** — as a build step (Markov-trained naming, an AI tile-reskin), feeding the TS app. Not the app itself.
- **Pivot to an actual game → a game engine** (Godot/Bevy/Unity/Phaser). Not applicable to a *tool*.

**Architectural direction surfaced by the naming + config scope** (becoming a *suite* of config-driven generators → wants a coherent shared core). These bullets are the **building blocks of the one generation engine** described in [`vision.md`](./vision.md); the detailed content + selection design (and a review finding the content model *regressed* over time) is [`generation-engine.md`](./generation-engine.md) *(draft)*:
- **Data-driven config** — generators read JSON rules, not hardcode them (keeps logic portable + language-agnostic).
- **Schema + validation** — adopt **Zod** (**vetted 2026-07-09 against Joi & Yup and chosen deliberately**, not by default): Zod is TS-first, so `z.infer<typeof Schema>` makes the schema the *single source of truth* for the type — eliminating the type↔validator drift that's the main risk for user-edited config content; it's also stricter-by-default on coercion (a data-integrity plus). Joi/Yup validate data fine but keep the TS type and the schema separate (drift-prone) and lean backend/form-oriented. **valibot** is the tree-shakeable alternative if bundle size ever matters. One definition → both the TS type and runtime validation. Increasingly important as configs proliferate and get user-edited.
- **One shared content/registry + persistence** — the pattern-editor "shared collection", name tables, skins, character templates all want the same plumbing (localStorage now → a backend later).
- **Text-gen** — Tracery-style JSON grammars for naming (JS-native, portable).
- **Determinism/seeding** spans all of it (= T1).

---

## 3. Tile theming pipeline — the atlas as shared contract

The renderer draws **~93 named tile slots** (`public/dungeonTiles/`), each with fixed semantics (the 19 marching-squares `wall_trim_*` edge configs, doors, stairs, corner arcs, alcove half-discs…). A reskin is **structure-constrained style transfer onto that fixed atlas**, not free image generation. The renderer already swaps art by filename (`<img src>`; "same name, SVG or PNG, no app change").

**`tile-template/tile-atlas.{png,json}`** (built by `scripts/buildDungeonTileAtlas.ts`) is the **interchange contract**: the JSON enumerates every required slot name + native geometry (viewBox) + layout rect.

**Unified pipeline** — any producer, one back-end:
```
any tile source ──▶ ATLAS (conforming to the JSON contract) ──▶ VALIDATE ──▶ SLICE ──▶ themed manifest
   R1 image-ingest                                              (all 93 slots,   (named PNGs)  (point active
   R2 Photoshop                                                  sizes, alpha,                  tileConfig at a
   procedural retune                                             seams)                         new /dungeonTiles-<theme>/
                                                                                                 folder → swappable skins;
                                                                                                 frozen v1-v4 keep SVG)
```
- **R1 (producer)** — image-driven reskin: retune the SVG generator's palette/line-style from an example image (recommended), or AI-paint each labeled atlas slot (the atlas canvas constrains geometry + cross-tile consistency).
- **R2 (producer)** — manual PNG/Photoshop path.
- **R3 (consumer)** — a runtime "Skin" dropdown; skins share the 93 slot *names*, so tile URLs derive from the active skin (`${tileBase}${name}.${tileExt}`) + a `palette` for the base `<div>` fills.
- **R4 (contract extension)** — variant *families*: a slot can hold K options (`<slot>__<i>` + `variantCount`/`weights`), picked per cell (positional hash → seeded index once T1 lands). Floor & water must first become tile families (they're solid-colour `<div>`s today).

**Shared back-end to build once:** slicer, validator, manifest-swap.

**Caveat:** the base floor/wall fills and the active doors are `<div>`s (colour/strip), not tiles — texturing *those* first requires converting them to `<img>` tiles.

---

## 4. Room profile — semantic properties seed naming / descriptions / props

**Foundational.** Do this before deepening random naming + descriptions, or they stay context-free (a cave room gets a generic hall name). This is also **step 1 of the config-object → map integration** — the first bridge from the bitmask map into the generation engine ([`vision.md`](./vision.md)).

> **Shipped 2026-07-10 (derivation):** `RoomInfo.profile` is now populated by a post-generation pass (`type` feature-derived for now — cave/temple/crypt await Idea 7). The *consumers* (profile-aware naming, real descriptions, prop weighting) are the remaining work.
>
> **Generalizes beyond rooms (Idea 12):** the profile concept extends to *all* map elements — halls, connectors/doors, stairs, portals — each a node with its own per-kind profile. The generator already builds that element graph internally (corridor edges, stair runs, portals) then discards it; exposing it makes the dungeon the concrete instance of the engine's nested element tree (`vision.md`).

**Current state — a hybrid, split geometry vs. content.** `RoomInfo` (the per-room record in `DungeonResult.rooms[]`) centralizes **geometry/identity**: `x,y,w,h, z, shape, cornerRadius, roundCorners, apses[], alcoves[], num, name`. But room **content** facts are **decentralized** across parallel grids, with no back-reference to a room:
- **water** → `Material.Water` cells in `grid` (no per-room flag; the per-region water *condition* rolled during generation is transient — only the cells survive);
- **pillars** → `PillarGrid` (booleans on vertices);
- **doors** → `EdgeGrids` (per edge between cells);
- **elevation** → `stairs` + `levels` grids (per cell; only the net `z` is copied back to the room).

And **`roomAt`** (the cell→room-index map) is **internal to `generateDungeon`, not exported** (`DungeonResult = { grid, pillars, rooms, stairs, levels, portals, edges }`). Net effect: "is this room a flooded cave?" is **not readable** from a room object — it's scattered and must be derived by scanning the grids over the room's footprint.

**Target — a derived, centralized `RoomProfile`.** A **post-generation pass inside `generateDungeon`** (runs *after* the water/pillars/doors/elevation passes, where `roomAt` + all grids are still live) scans each room's footprint and distills its content into one semantic summary attached to `RoomInfo` (e.g. `RoomInfo.profile`). Fields (derived, not raw-restored):
- **`type`** (cave | masonry | temple | crypt | flooded-cistern | …) — the **primary naming seed**, produced by a small classifier over the raw facts;
- plus `material`, `size` (w×h buckets), `water` (dry|pool|partial|full), `pillared`, `shape` (already on `RoomInfo`), `elevation` (z + raised/sunken/has-stairs), `connectors` (door/corridor/portal adjacency), `features` (apses/alcoves/props).

**The profile is the single seed for every downstream generator:**
- **Naming** (`src/core/naming`) — `roomName(profile, rng)`, word lists keyed by `profile.type` → cave→cave words, temple→temple words (upgrades the pilot from context-free → context-aware);
- **Descriptions** (`src/lab/room-description`) — read the **real** profile instead of today's random PoC values (makes the "map-derived properties" integration real);
- **Props** (Idea 9) — weight placement by profile (altars/sarcophagi in temple/crypt rooms, etc.);
- later, the **config Dungeon-CONTENT generator** (monsters/treasure appropriate to room type).

**Boundary (keep the dependency direction).** *Derive* the profile in the dungeon **feature** (where the grids live); keep `core/naming` and the text engine **generic consumers** that take a profile/tags — never dungeon internals. That preserves *features → core*. This work likely also motivates exporting/using `roomAt` for footprint membership, and pairs with **T1** (seeded generation) so profile → name → description is reproducible. Roadmap: **Idea 10** in [`dungeon-roadmap.md`](./dungeon-roadmap.md).
