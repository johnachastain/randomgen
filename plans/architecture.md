# Architecture & design notes

Durable design rationale for this repo (a browser-delivered **suite of config-driven generators** — maps, random naming, config-driven objects). The milestone backlog lives in [`dungeon-roadmap.md`](./dungeon-roadmap.md).

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
**Pilot 1 shipped (2026-07-09): `src/core/naming/`** → feeds `RoomInfo.name` in the dungeon (imports `../../core/naming`, proving *feature → core*). Next: seed via T1; enrich from `src/names`; add aliases + boundary lint; promote a 2nd module (likely `core/rng`).

---

## 2. Tech-stack assessment (when to reconsider)

**TS / React / Vite is the right tool — don't rewrite.** The product is an interactive, visual, browser-delivered suite of config-driven generators; compute is light (small grids), and config-driven objects are a TS strength. Broadening from mapping to naming + config-gen only *reinforces* this (even more JSON/data-centric, even less compute-bound).

**The real forks are per-layer, not language:**
- **Rendering at scale → Canvas/WebGL** (still TS). The current DOM tilemap (hundreds–thousands of `<img>`/`<div>` per layer) is the most likely wall on large maps. PixiJS or raw canvas. *(= roadmap P2.)*
- **Heavy generation → Web Workers → Rust/WASM** — only if profiling shows a real bottleneck. The clean generator/renderer split keeps a future *partial* Rust/WASM core cheap.
- **Offline data / ML → Python** — as a build step (Markov-trained naming, an AI tile-reskin), feeding the TS app. Not the app itself.
- **Pivot to an actual game → a game engine** (Godot/Bevy/Unity/Phaser). Not applicable to a *tool*.

**Architectural direction surfaced by the naming + config scope** (becoming a *suite* of config-driven generators → wants a coherent shared core):
- **Data-driven config** — generators read JSON rules, not hardcode them (keeps logic portable + language-agnostic).
- **Schema + validation** — adopt **Zod** (or valibot): one definition → both the TS type and runtime validation. Increasingly important as configs proliferate and get user-edited.
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
