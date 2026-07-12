// Shared core — naming.
// First resident of the `core/` layer (the promotion pilot). A SIMPLE, generic dungeon-element
// name generator. It's **profile-aware via plain string tags** (kept generic — no feature/dungeon
// import): a caller passes semantic tags (e.g. a room's `type` + water) and the name is drawn from a
// pool matching them. Takes a seeded rng (→ `core/rng`, T1) so output is reproducible.
//
// Step 3 (generation-engine.md §8): selection runs through `core/select` — word lists are tagged
// `Table`s and `roomName` draws via `pickWeighted`. Structure nouns use a HARD include filter by
// theme (each type's pool preserved exactly; "common" = the generic fallback pool); water descriptors
// use the engine's SOFT-BOOST (replaces the old "60% water-only pool" branch).
// Step 4: the type/water tags are now the namespaced `core/model` taxonomy (theme:*, trait:wet).

import { type Rng } from "../rng"
import { pickWeighted, type Table, type Tag } from "../select"
import { NS, tag, TRAIT_WET } from "../model"

// Convenience for the theme namespace + the internal "common" pool marker (not a semantic tag —
// just a membership flag reproducing the old generic STRUCTURES pool).
const theme = (t: string): Tag => tag(NS.theme, t)
const COMMON = "common"

// Structure nouns, each tagged with the theme(s) it suits + COMMON for the generic fallback pool
// (drawn when the room has no recognized theme). The per-theme include-sets reproduce the old
// STRUCTURES_BY_TYPE pools; the COMMON set reproduces the old generic STRUCTURES pool.
const structureTable: Table = [
  ["Rotunda",       [theme("rotunda"), COMMON], 1],
  ["Ring",          [theme("rotunda")],         1],
  ["Round Hall",    [theme("rotunda")],         1],
  ["Circle",        [theme("rotunda")],         1],
  ["Cistern",       [theme("cistern"), COMMON], 1],
  ["Reservoir",     [theme("cistern")],         1],
  ["Sump",          [theme("cistern")],         1],
  ["Well",          [theme("cistern")],         1],
  ["Drowned Vault", [theme("cistern")],         1],
  ["Vault",         [theme("vault"), COMMON],   1],
  ["Crypt",         [theme("vault"), COMMON],   1],
  ["Undercroft",    [theme("vault")],           1],
  ["Tomb",          [theme("vault"), COMMON],   1],
  ["Reliquary",     [theme("vault"), COMMON],   1],
  ["Hall",          [theme("hall"), COMMON],    1],
  ["Gallery",       [theme("hall"), COMMON],    1],
  ["Colonnade",     [theme("hall")],            1],
  ["Concourse",     [theme("hall")],            1],
  ["Chamber",       [theme("chamber"), COMMON], 1],
  ["Hollow",        [theme("chamber"), COMMON], 1],
  ["Antechamber",   [theme("chamber"), COMMON], 1],
  ["Sanctum",       [theme("chamber"), COMMON], 1],
  ["Cell",          [theme("cell"), COMMON],    1],
  ["Oubliette",     [theme("cell"), COMMON],    1],
  ["Gaol",          [theme("cell"), COMMON],    1],
  ["Pit",           [theme("cell"), COMMON],    1],
  ["Den",           [theme("cell"), COMMON],    1],
  ["Shrine",        [COMMON],                   1],
  ["Forge",         [COMMON],                   1],
  ["Barracks",      [COMMON],                   1],
]

// Descriptors; the watery ones are tagged trait:wet so a watery room soft-boosts toward them.
const descriptorTable: Table = [
  ["Sunken",     [TRAIT_WET], 1],
  ["Drowned",    [TRAIT_WET], 1],
  ["Weeping",    [TRAIT_WET], 1],
  ["Mossy",      [TRAIT_WET], 1],
  ["Flooded",    [TRAIT_WET], 1],
  ["Grim",       [], 1], ["Rusted", [], 1], ["Shattered", [], 1], ["Forgotten", [], 1], ["Ashen", [], 1],
  ["Gilded",     [], 1], ["Crooked", [], 1], ["Silent", [], 1], ["Frozen", [], 1], ["Molten", [], 1],
  ["Whispering", [], 1], ["Bloodied", [], 1], ["Cracked", [], 1], ["Hollow", [], 1], ["Withered", [], 1], ["Charred", [], 1],
]

const ofTable: Table = [
  ["Rust", [], 1], ["Bone", [], 1], ["Ash", [], 1], ["Echoes", [], 1], ["Sorrow", [], 1], ["Chains", [], 1],
  ["Whispers", [], 1], ["Embers", [], 1], ["Thorns", [], 1], ["Dust", [], 1], ["Shadows", [], 1], ["Sighs", [], 1],
  ["Iron", [], 1], ["Salt", [], 1], ["Mourning", [], 1], ["Cinders", [], 1], ["Rot", [], 1], ["Frost", [], 1],
]

// Soft-boost strength for water descriptors (≈ old "60% water-only" bias: 5 water rows × (1+4) vs
// 16 dry rows → ~61% watery).
const WATER_BOOST = 4
const THEME_PREFIX = `${NS.theme}:`

// A dungeon room name, e.g. "The Sunken Cistern" / "Rotunda of Echoes" / "The Oubliette".
// `tags` = the element's namespaced signals (from a GenContext — a room profile's theme:* + water/
// features). The structure noun is drawn from the pool of the first theme:* tag (else the generic
// "common" pool); a trait:wet tag soft-boosts the descriptor. Pass a seeded rng for reproducibility.
export function roomName(tags: readonly Tag[] = [], rng: Rng = Math.random): string {
  const themeTag = tags.find(t => t.startsWith(THEME_PREFIX))
  const structCtx = { include: [themeTag ?? COMMON] }
  const structure = () => pickWeighted(structureTable, rng, structCtx)[0]

  const watery = tags.includes(TRAIT_WET)
  const descCtx = watery ? { tags: [TRAIT_WET], boost: WATER_BOOST } : {}
  const descriptor = () => pickWeighted(descriptorTable, rng, descCtx)[0]

  const ofNoun = () => pickWeighted(ofTable, rng)[0]

  const r = rng()
  if (r < 0.45) return `The ${descriptor()} ${structure()}`
  if (r < 0.85) return `${structure()} of ${ofNoun()}`
  return `The ${structure()}`
}
