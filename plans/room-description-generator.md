# Room Description Generator — plan

A **mad-libs** text generator: a config-driven **Room** object (properties with random values) → a string-template engine assembles templated sentences into a paragraph or two of descriptive prose. Standalone prototype now; **eventually surfaces on dungeon-map rooms** (each `RoomInfo` gets a description).

Kept separate from the map project ([`dungeon-roadmap.md`](./dungeon-roadmap.md)). Lives in the **experimental `lab/` zone** (two-zone model, [`architecture.md`](./architecture.md)); its `fill()` template engine is a promotion candidate for `core/text` (tracery-lite).

## Where it lives / run
- Pages: `/lab/room-description` (generator) + `/lab/room-description/edit` (template editor). Nav: Home → "Lab". Routes in `src/App.tsx`.
- Code: `src/lab/room-description/` — `roomDescription.ts` (editable `defaultConfig` + engine + `validateConfig`), `Page.tsx` (generator), `EditorPage.tsx` (JSON editor).

## Template editor (Phase 1 shipped — JSON, in-memory)
Templates moved from hardcoded consts into ONE editable `defaultConfig: RoomDescConfig` ({ properties, descriptors, sentences, emptySetDesc }); the engine takes a `config` param (defaulted → existing page untouched). Editor page: a JSON textarea → **Apply** (`JSON.parse` + `validateConfig`: structure + every sentence `{placeholder}` must reference a known property, else error; missing descriptors = warning) → **live preview** (generated sample + Regenerate) → **Export JSON** + Reset. In-memory only (no persistence yet); no new dependency (Zod deferred). This is the room-description analog of roadmap **8a** and the first data-driven-config exercise.
**Editor roadmap:** (a) **structured-forms editor** (per-property lists/buttons instead of raw JSON); (b) **persistence** — baked-in default + localStorage live edits + import/load (currently export-only, decide-later); (c) **Zod schema** for `RoomDescConfig` (replace the hand-rolled `validateConfig`); (d) promote the config + editable-store into **shared-core** (the content registry that 8a/skins/naming will reuse).

## Model — 3 layers (enum → descriptor → sentence)
The Room object holds **short enums / token sets** (the canonical state); prose is a separate two-layer template pass. Clean data/presentation split — these are what a future `RoomInfo` would store.
- **Layer 1 — `PROPERTIES: { key, label, kind: "enum"|"set", values[], min? }[]`** — config-driven schema. **enum** = pick one value; **set** = pick a random subset of tokens (`min` forces ≥N). Current set:
  - enum: `material` (masonry/cave/hewn/brick) · `size` (cramped→cavernous) · `water` (dry→flooded) · `illumination` · `sound` · `smell` · `condition` · `object`.
  - **set** (co-occurring): `shape` (round / rounded-corners / apse / alcoves) · `connectors` (door / corridor / entrance / exit, `min:1`).
- **Map → property mapping (for the eventual dungeon wiring):** `material` ← generation mode (cave vs rooms) · `size` ← room `w×h` bucket · `water` ← the water pass condition · `shape` ← `cornerRadius`/`roundCorners`/`apses[]`/`alcoves[]` · `connectors` ← adjacent doors/halls/`portals[]`.
- **Layer 2 — `DESCRIPTORS: Record<propKey, Record<enumValue, string[]>>`** — 2–3 descriptive fragments per enum (sub-templates → run through `fill`, so a fragment MAY embed `{prop}`; initial content plain). Fallback to the enum string if missing.
- **Layer 3 — `SENTENCES: Record<propKey, string[]>`** — 2–3 sentence templates per property; the `{key}` slot is filled with the chosen **descriptor** (not the enum).
- **Engine:** `generateRoom(rng)` → a `Room` of enums; `fill(tmpl, lookup)` = `{key}` → value; `describeRoom(room, rng)` = per prop resolve enum → descriptor → sentence, capitalize, assemble into **2 paragraphs** (illumination+sound+smell / condition+object). `rng`-injectable → seedable later.
- **Page:** Regenerate button; description as `<p>` paragraphs; properties as a `<ul>` of `label: enum`.

## Status
✅ **Prototype shipped + user-confirmed (2026-07-09, uncommitted)** — "the prototype I was seeking… establishes the basic concept needed for initial use." 3-layer templates; list shows short enums, prose from descriptor+sentence layers; **sentence ORDER shuffled** each generation (Fisher-Yates, rng-injectable) then split 2 paragraphs; no stray placeholders; tsc clean; route 200. Future work is expansion (see Roadmap below).
- Optional tweak if wanted later: keep a scene-setting sentence (illumination) reliably first, shuffle the rest — currently the order is fully random so it can lead with the object/condition sentence.
- **Map-derived props added (2026-07-09, PoC random values):** material, size, water (enum) + shape, connectors (set/co-occurring). Now ~10 props → 3 paragraphs; list shows enums + set tokens.
- **Known PoC artifacts (random selection produces impossible combos real dungeon data wouldn't):** `shape` can pick `round` **and** `rounded-corners` together (mutually exclusive in the real generator — a room is circle OR rounded-rect); the new `water` prop overlaps the old `condition` value `flooded` (can contradict, e.g. Water=dry + Condition=flooded). Both resolve when wired to real `RoomInfo` (constraints baked in) or via the planned property inter-dependency pass; harmless for the PoC.

## Roadmap
- **Content:** more properties (temperature, size/shape, exits, hazards, occupants/tracks, decor), more values + more templates per property.
- **Weighting:** per-value weights (common vs rare) in the config.
- **Cross-property templates / inter-dependencies:** sentences spanning multiple props; conditional logic (e.g. `condition = half-flooded` ⇒ water sounds/smells more likely; `illumination = darkness` ⇒ suppress colour/sight details).
- **Richer engine:** optional `{a|an}` article agreement, list-join ("X, Y and Z"), sentence-order variation, 1–3 paragraph range. → the case for promoting to a real `core/text` grammar (tracery-style).
- **Seeded (T1):** pass a seeded PRNG → reproducible descriptions.
- **Config-driven / schema:** move PROPERTIES + SENTENCES toward Zod-validated JSON config (aligns with the shared config/registry direction) → editable later.
- **Dungeon integration:** generate a description per `RoomInfo` (seeded with the dungeon), surface via the room-number hover popup / a room inspector panel / JSON export.
