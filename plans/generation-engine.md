# Generation engine — content & selection model

> **Status: DRAFT / proposal.** This is the working home for the engine + content-layer design. When it stabilizes, a *condensed* section folds into [`architecture.md`](./architecture.md) and the roadmap's [config-object epic](./dungeon-roadmap.md) is decomposed into sub-tasks. Until then, those two carry only pointers here. Vision context: [`vision.md`](./vision.md).

---

## 1. Why

The north star ([`vision.md`](./vision.md)) is a **config-driven random-object engine** the map renders. That engine has two halves: the **generation logic** (config-driven objects + rules) and the **content layer** (the value pools it draws from). This doc designs both, with the content layer as the sharp end — because a review found the content model has actually **regressed** over the project's life.

---

## 2. How it evolved — one facet per sketch

The engine's history isn't a decline — it's a series of **focus-scoped sketches**. Each prototype foregrounded **one** facet of the engine and deliberately stubbed the rest, so the lists got simpler exactly where lists weren't the point. The job now is to *unify* the facets, not to recover from a fall.

### What each sketch was actually exploring
| Sketch | Facet in focus | So it stubbed… |
|---|---|---|
| `src/functions/tagBasedItemLists.ts` | the **tag → weighted-selection mechanic** (soft-boost, rarity, sub-tables) | everything else |
| `src/names/*` | **rich vocabulary + a shared enum-key tag taxonomy** (`NounGroup`, `NameTags`) + combinatorial name strategies | objects / nesting |
| `src/configCharacterGen/` | the **config-object + ordered per-property rules + cross-property influence** (`socialClass → title`) | the lists (tags mostly `[]`) |
| `src/configDungeonGen/` | **nesting / composition** (`ItemRecord` tree, parent→child, single-prop re-roll) | the data (plain arrays) |

Two threads run through all of them, and they're the real design inputs:
- **Readability was the churn driver.** The author found the word "tuple" confusing and the positional `["Word",[Tag],1]` shape hard to scan (the `[Tag],1` repeats identically on dozens of rows). Much of the reshaping was chasing "understand each item at a glance."
- **Enums-as-shared-keys was the good instinct.** `[Color]`/`[Silly]`/`[Female]` (`names/lists.ts`) are enum tags shared across lists — the seed of the tag taxonomy. Keep this.

### The high-water mark — `src/functions/tagBasedItemLists.ts`
The *oldest* sketch (the selection-mechanic one) is worth calling out because it had capabilities later sketches didn't need and so dropped:
```ts
type ListItem = { name, tags, odds }                 // NAMED record (not a positional tuple)
makeTable:  num = (matches.length + 1) * itm.odds    // SOFT tag-boost — matching a theme makes an
                                                     // item likelier but NEVER excludes non-matches
getItem:    typeof itm === 'object' ? getItem(itm)   // recursive → primitive SUB-TABLES
getRarity(odds): 1→rare 2→uncommon 3→common          // a semantic layer over raw weight
getDeterminer(word): "the / some / a"                // grammar helper for readable phrases
```

### How the shape changed across sketches
- **`src/character/functions.ts`** (naming/character) — moved to the positional shape `TaggedItem = [value, tags[], weight]` (compact, but the "tuple" name + unlabeled columns are the readability friction); selection became **HARD include/exclude** (`containsAll`/`excludesAll` *drop* non-matches — the soft boost was not needed here); weighting became **array duplication** (`makeTaggedList` copies each item `weight` times, rebuilt on every pick).
- **`src/configCharacterGen/character/functions.ts`** — a **forked copy** of that engine (divergent duplicate). Lists use the same shape but tags are mostly empty `[]` (weights only), except `socialClass → title/occupation`.
- **`src/configDungeonGen/`** — since **nesting** was the focus, the data was stubbed to plain string arrays inlined in `functions/generate.ts` (`dungeonAdjectives`, `monsterNames`, …) + uniform `pickRandom`, plus its **own** `functions/random.ts`.

### Richness gradient (4 tiers, 3 data formats)
| Tier | Where | Model |
|---|---|---|
| Richest | `functions/tagBasedItemLists.ts` | named record · **soft** tag-boost · rarity · sub-tables · determiners |
| Rich | `names/lists.ts` (+ enum taxonomy `NounGroup`/`NameTags`/… + `twoTagSets`) | `TaggedItem` tuples · hard filter · int weights · combinatorial strategies |
| Thin | `configCharacterGen/character/lists.ts` | `TaggedItem` tuples · tags mostly `[]` |
| Flat | `configDungeonGen` + `lists/original/*` | **plain string arrays** · uniform pick |

Note the irony of the bottom row: the project's **deepest vocabulary** — `src/lists/original/*` (~4,800 lines of rooms/deities/adjectives) — is **untagged plain arrays**. The richness there is "many words," not "structured, filterable words."

### What no single sketch unified (the gaps to close)
0. **Readability** *(the churn driver)* — lists must be graspable at a glance; the unlabeled positional shape + the confusing "tuple" name obscured the one thing that matters per row (the value). See the readability principle in §3.
1. **Data is code** — pools are hardcoded TS arrays scattered across `generate.ts` / `lists.ts` / `lists/original/`. No single format, no registry, no external data, no schema.
2. **The value shape isn't self-documenting** — a bare `[value, tags, weight]` doesn't name its columns (fixed in §3 by labeled tuple elements + the row/column model, keeping the compact shape).
3. **Weighting = array duplication** — O(Σweights) memory, rebuilt per pick, integer-only.
4. **Tags are flat include/exclude strings** — no namespaces (`theme:cave`, `rarity:rare`), no **soft boost** (present in the oldest sketch, not carried forward), no taxonomy shared across generators.
5. **Parent→child influence is bespoke** — `roomNameUpdater` reaches into the jotai store (`store.get(ItemFamily(room.parentId))`) rather than reading an inherited context.
6. **Duplication + no seeding** — 2 live tag-engine copies + ~5 RNG copies, all `Math.random` (blocks reproducibility / T1).

---

## 3. Target model (A–F)

The theme: **recover and unify capabilities that already existed** (soft-boost, rarity, sub-tables, determiners, enum-key tags) at a higher standard — not invent from scratch.

> **Design principle — readability-first authoring.** The lists of selectable items must be graspable **at a glance**. So: the **positional shape is KEPT** (compact, familiar), but made legible by (a) **labeled tuple elements** so the editor shows the column names, (b) a **table / row / column** vocabulary, (c) **enum keys shared across objects** — the tag taxonomy doubles as the readability aid. The word "tuple" is dropped; `...Tuple` variables become `...Table`.

- **A — Canonical `Row` / `Table` format.** Keep the positional shape, renamed and column-labeled:
  ```ts
  type Row = [value: string, tags: Tag[], weight: number]   // a labeled tuple → hover shows the columns
  type Table = Row[]                                        // a named list of rows
  ```
  Lists become `...Table` (e.g. `titleTable`); the type `TaggedItem` → `Row`. Enum tags stay. An optional `row("Castle", [NOUN, FORTIFICATION], 3)` constructor is available but **not required** — raw `[...]` literals remain the default (minimal churn). Extra columns later (rarity, etc.) go on as **trailing optional elements** `[…, rarity?]`. *(Not "record" — that collides with TS `Record<>` and the existing `ItemRecord` in `configDungeonGen`.)* Tables can still be loaded **by id** for the data-driven / registry direction. *Fixes 0, 1, 2.*
- **B — One seeded selection engine in `core/`.** `pickWeighted(table, ctx, rng)` using cumulative-weight or alias selection (no array duplication), supporting include/exclude **and the recovered soft-boost**. Seeded RNG (`core/rng`) — **this is T1**. Retire the duplicate tag engines + RNGs. *Fixes 3, 6; recovers soft-boost.*
- **C — Namespaced tag taxonomy + `GenContext`.** Promote the enum tag groups into a shared `core/model` taxonomy, namespaced (`theme:cave`, `rarity:rare`). A `GenContext = { tags, seed, … }` flows **parent→child** down the object tree; a child's table query reads `ctx.tags` — the clean version of both cross-property influence and inheritance, replacing store-reaching. *Fixes 4, 5.*
- **D — `core/text` tracery-lite.** A value can be a template that expands by referencing other pools (`"#adjective# #noun#"`) + determiner helpers — so string richness is uniform (names, room names, descriptions) instead of per-generator `${pickRandom(a)} ${pickRandom(b)}`. *Recovers sub-tables + determiners; absorbs the room-description `fill()` engine.*
- **E — `core/config` registry + Zod.** `createItm` / `rerollProperty` (`configDungeonGen/functions/basic.ts`) are already generic — promote them; hold each object type's `Config<T>` in a registry; validate tables + configs with Zod (the single source of truth for type + runtime validation). *Fixes 1.*
- **F — Migrate / tag the deep vocab.** Bring `lists/original/*` under the `Row`/`Table` format (tag by theme/rarity, by hand or a one-off tagging script) so ~4,800 lines become *filterable* content any generator can serve; `configDungeonGen` reads tables by id instead of inlining arrays.

---

## 4. Illustrative shapes *(sketches — not final API)*

```ts
// A — content: a Table is a list of Rows; the columns are value · tags · weight
type Tag   = string   // enum members compile to these (Neutral, Artisan, NOUN, theme:cave…)
type Row   = [value: string, tags: Tag[], weight: number]   // labeled tuple → hover shows columns
type Table = Row[]

export const titleTable: Table = [
  ["Master", [Neutral, Artisan],     1],
  ["Vicar",  [Male, Ecclesiastical], 1],
  ["Castle", [NOUN, FORTIFICATION],  3],
]

// C — the context that flows parent→child down the object tree
type GenContext = { tags: Tag[]; seed: number /* + rng cursor, parent refs… */ }

// B — one seeded, context-aware, soft-boosting pick (no array duplication)
function pickWeighted(table: Table, ctx: GenContext, rng: Rng): Row
// weight_i = base_i * softBoost(matches(row.tags, ctx.tags))   // matches raise, never exclude
//            include/exclude still available as hard filters when wanted

// E — a config property drawing from a table by id, seeded via ctx
const roomNameRule: Rule<Room> = (room, ctx, rng) =>
  expand(table("room-name"), ctx /* inherits theme:cavern from parent Level */, rng)
```
```jsonc
// F — the same table as data, not code (positional rows: [value, tags, weight])
{ "id": "room-name", "rows": [
  ["Ossuary",      ["theme:tomb"],   2],
  ["#adj# Grotto", ["theme:cavern"], 1]
]}
```

---

## 5. Migration / sequencing

Build in `core/` under the two-zone promotion discipline ([`architecture.md` §1](./architecture.md)); retire the divergent engine/RNG copies as each piece lands.

1. **A + B** — `Row`/`Table` format + seeded selection engine (`core/rng`, `core/select`). Foundational; = T1.
2. **C** — tag taxonomy + `GenContext` (`core/model`).
3. **D** — `core/text` tracery-lite (absorb room-description `fill()`).
4. **E** — `core/config` registry + Zod.
5. **F** — migrate the deep vocab; point `configDungeonGen` (and the naming/character gens) at pools by id → deletes the duplicate engines.
6. **Wire the map** — the bitmask dungeon's rooms/levels become config objects; **Idea 10** (room profile → `GenContext` tags) is the first consumer.

---

## 6. Determinism & editing — seed + overrides

The engine must support an **editable** object: it starts fully random from a seed, then the user overrides individual property values (a future UI). Roadmap: **Idea 11** in [`dungeon-roadmap.md`](./dungeon-roadmap.md).

**State model — `(seed, overrides)`.** The canonical, persisted, *shareable* state is just the seed plus a **sparse override map** (`path → value`, only the deviations — not a full object copy). The object is a **pure function** `resolve(seed, overrides) = generate(seed) with each overridden path forced`. Small to store, reproducible, and shareable as a seed + a tiny diff.

**Three states per property:** **rolled** (from seed) · **overridden** (user picked an alternate value) · **locked** (keep the current rolled value even when everything else re-rolls) — the familiar 🔒 next to each field in character creators.

**The critical detail — per-property sub-seeding (avoids "seed drift").** With a single linear stream (what `core/rng` `mulberry32` gives today), editing or re-rolling one property shifts the stream and **scrambles every property after it**. Fix: derive each property's rng from a **hash of `(seed, stable-path)`** rather than a shared cursor:
```ts
// forward-note for core/rng (currently single-stream):
function subRng(seed: number, path: string, nonce = 0): Rng   // = mulberry32(hash(seed, path, nonce))
```
Now each property has an independent sub-stream, so an edit/lock/re-roll of one field **cannot** disturb the others; "re-roll just this field" = bump its `nonce`. This is the same idea as hash-of-coordinate world gen and **splittable / counter-based PRNGs** (SplitMix, Philox).

**Overrides propagate as forced inputs.** Because properties have cross-property influence + parent→child tags (§3-C), an override is fed *into* the generation of dependents (override `level.type = cave` → room-name rule re-runs with `cave`), while sub-seeding keeps unrelated fields exactly where they were. (The simpler "freeze + paint the cell" model doesn't propagate — decide per property; most tools propagate downward.)

**Undo/redo (optional):** a command/event log (`setOverride`/`lock`/`reroll`) layers on top; the canonical persisted state stays the tiny `(seed, overrides)`.

**Where the code stands:** T1 `core/rng` is single-stream (fine for whole-map regen; add `subRng` for per-field editing). `configDungeonGen` already has the single-property hook — `rerollProperty`/`updateProperty` (`functions/basic.ts` + `generate.ts`) — but it mutates a jotai store in place (freeze+patch, not reproducible); seed+overrides is the principled upgrade.

---

## 7. When finalized

Trigger to update the other two docs (kept as pointers until then):
- **`architecture.md`** — add a condensed **"Content & selection engine"** section (the A–F model + the regression finding, minus the sketches).
- **`dungeon-roadmap.md`** — decompose the **Config-object engine → map as its view** epic into concrete A–F sub-tasks (A/B carry the T1 seeded-RNG work; E carries Zod; D carries the `core/text` promotion).
