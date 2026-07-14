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
import { pickWeighted, type Table, type Tag, type SelectContext } from "../select"
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

// Descriptors; the watery ones are tagged trait:wet so a watery room soft-boosts toward them. Each is
// also mood-tagged with the dungeon THEME(s) it suits, so an inherited dungeon type soft-boosts a
// child's descriptor toward that mood (crypt → Silent/Grim, mine → Rusted/Cracked, …).
const descriptorTable: Table = [
  ["Sunken",     [TRAIT_WET, theme("cistern")], 1],
  ["Drowned",    [TRAIT_WET, theme("cistern")], 1],
  ["Weeping",    [TRAIT_WET, theme("cistern")], 1],
  ["Mossy",      [TRAIT_WET, theme("cistern")], 1],
  ["Flooded",    [TRAIT_WET, theme("cistern")], 1],
  ["Grim",       [theme("crypt"), theme("prison")], 1],
  ["Rusted",     [theme("mine"), theme("prison")], 1],
  ["Shattered",  [theme("warren"), theme("mine")], 1],
  ["Forgotten",  [theme("crypt"), theme("mine")], 1],
  ["Ashen",      [theme("mine"), theme("vault")], 1],
  ["Gilded",     [theme("vault")], 1],
  ["Crooked",    [theme("warren")], 1],
  ["Silent",     [theme("crypt"), theme("prison")], 1],
  ["Frozen",     [theme("vault")], 1],
  ["Molten",     [theme("mine"), theme("vault")], 1],
  ["Whispering", [theme("warren"), theme("vault")], 1],
  ["Bloodied",   [theme("prison"), theme("crypt")], 1],
  ["Cracked",    [theme("mine"), theme("warren")], 1],
  ["Hollow",     [theme("crypt"), theme("mine")], 1],
  ["Withered",   [theme("crypt")], 1],
  ["Charred",    [theme("mine"), theme("vault")], 1],
]

const ofTable: Table = [
  ["Rust", [], 1], ["Bone", [], 1], ["Ash", [], 1], ["Echoes", [], 1], ["Sorrow", [], 1], ["Chains", [], 1],
  ["Whispers", [], 1], ["Embers", [], 1], ["Thorns", [], 1], ["Dust", [], 1], ["Shadows", [], 1], ["Sighs", [], 1],
  ["Iron", [], 1], ["Salt", [], 1], ["Mourning", [], 1], ["Cinders", [], 1], ["Rot", [], 1], ["Frost", [], 1],
]

// Soft-boost strength for water descriptors (≈ old "60% water-only" bias: 5 water rows × (1+4) vs
// 16 dry rows → ~61% watery). Reused for the dungeon-theme mood boost.
const WATER_BOOST = 4
const THEME_PREFIX = `${NS.theme}:`

// Descriptor selection context: soft-boost toward the water trait and/or any inherited (ancestor) theme
// tags, so a child's descriptor leans to its dungeon's mood. Empty → no boost (plain uniform pick).
const boostCtx = (moodThemes: readonly Tag[], watery: boolean): SelectContext => {
  const tags = [...(watery ? [TRAIT_WET] : []), ...moodThemes]
  return tags.length ? { tags, boost: WATER_BOOST } : {}
}

// Kind noun pools for NON-room map elements (Idea 12). Flat pools (whole-pool pick, no theme filter),
// with the watery hall nouns tagged trait:wet so a flooded hall soft-boosts toward them.
const hallTable: Table = [
  ["Passage", [], 1], ["Corridor", [], 1], ["Gallery", [], 1], ["Tunnel", [], 1],
  ["Causeway", [], 1], ["Arcade", [], 1], ["Gangway", [], 1],
  ["Channel", [TRAIT_WET], 1], ["Culvert", [TRAIT_WET], 1],
]
const stairTable: Table = [
  ["Stair", [], 1], ["Steps", [], 1], ["Flight", [], 1], ["Descent", [], 1], ["Stairway", [], 1], ["Spiral", [], 1],
]
const connectorTable: Table = [
  ["Door", [], 1], ["Gate", [], 1], ["Doorway", [], 1], ["Threshold", [], 1], ["Archway", [], 1], ["Postern", [], 1],
]
const portalTable: Table = [
  ["Gate", [], 1], ["Shaft", [], 1], ["Well", [], 1], ["Stairwell", [], 1], ["Mouth", [], 1], ["Descent", [], 1],
]
const KIND_NOUNS: Record<string, Table> = { hall: hallTable, stair: stairTable, connector: connectorTable, portal: portalTable }

// A simple set of DUNGEON types (themes), drawn for the whole dungeon and inherited down the tree.
const DUNGEON_TYPE_TABLE: Table = [
  ["crypt", [], 1], ["cistern", [], 1], ["warren", [], 1], ["mine", [], 1], ["prison", [], 1], ["vault", [], 1],
]
// Roll a dungeon type. Whole-pool pick; seeded rng → reproducible.
export function dungeonType(rng: Rng = Math.random): string {
  return pickWeighted(DUNGEON_TYPE_TABLE, rng)[0]
}

// Dungeon/complex noun pool for the top-level dungeon name (place-scale nouns), each tagged with the
// dungeon type(s) it suits (+ COMMON for the no-type fallback), so the dungeon name reflects its type.
const dungeonStructureTable: Table = [
  ["Catacombs",  [theme("crypt"), COMMON], 1],
  ["Crypts",     [theme("crypt"), COMMON], 1],
  ["Tombs",      [theme("crypt")], 1],
  ["Barrows",    [theme("crypt")], 1],
  ["Ossuary",    [theme("crypt")], 1],
  ["Cisterns",   [theme("cistern")], 1],
  ["Wells",      [theme("cistern")], 1],
  ["Sump",       [theme("cistern")], 1],
  ["Warren",     [theme("warren"), COMMON], 1],
  ["Maze",       [theme("warren"), COMMON], 1],
  ["Labyrinth",  [theme("warren"), COMMON], 1],
  ["Sprawl",     [theme("warren")], 1],
  ["Delve",      [theme("mine"), COMMON], 1],
  ["Shafts",     [theme("mine")], 1],
  ["Depths",     [theme("mine"), theme("cistern"), COMMON], 1],
  ["Undercity",  [theme("mine"), theme("vault"), COMMON], 1],
  ["Oubliettes", [theme("prison")], 1],
  ["Hold",       [theme("prison"), COMMON], 1],
  ["Gaol",       [theme("prison")], 1],
  ["Cells",      [theme("prison")], 1],
  ["Vaults",     [theme("vault"), COMMON], 1],
  ["Halls",      [theme("vault"), COMMON], 1],
  ["Reliquary",  [theme("vault")], 1],
]

// The three-template assembly shared by room + element naming. Keeps ONE rng draw for the template
// choice, then calls the pickers in a fixed order → naming stays deterministic + reproducible.
function compose(structure: () => string, descriptor: () => string, ofNoun: () => string, rng: Rng): string {
  const r = rng()
  if (r < 0.45) return `The ${descriptor()} ${structure()}`
  if (r < 0.85) return `${structure()} of ${ofNoun()}`
  return `The ${structure()}`
}

// A dungeon room name, e.g. "The Sunken Cistern" / "Rotunda of Echoes" / "The Oubliette".
// `tags` = the room's namespaced signals from its GenContext. Contexts flow parent-first, so the room's
// OWN theme is the LAST theme:* tag (drives the structure noun) and any INHERITED (ancestor / dungeon)
// theme is earlier (soft-boosts the descriptor toward that mood). trait:wet also boosts. A single-theme
// call (no ancestor) behaves exactly as before. Seeded rng → reproducible.
export function roomName(tags: readonly Tag[] = [], rng: Rng = Math.random): string {
  const themes = tags.filter(t => t.startsWith(THEME_PREFIX))
  const structTheme = themes[themes.length - 1] ?? COMMON // own type (added last)
  const moodThemes = themes.slice(0, -1)                  // inherited ancestors (e.g. the dungeon)
  const descCtx = boostCtx(moodThemes, tags.includes(TRAIT_WET))
  return compose(
    () => pickWeighted(structureTable, rng, { include: [structTheme] })[0],
    () => pickWeighted(descriptorTable, rng, descCtx)[0],
    () => pickWeighted(ofTable, rng)[0],
    rng,
  )
}

// A NON-room map-element name (Idea 12), e.g. "The Sunken Passage" / "Flight of Echoes" / "The Iron
// Gate". `kind` selects the noun pool (hall/stair/connector/portal; unknown → the room structure pool);
// the noun is a whole-pool pick (element theme:* tags aren't in these pools, so no include-filter). A
// trait:wet tag soft-boosts the descriptor, just like rooms. Seeded rng → reproducible.
export function elementName(kind: string, tags: readonly Tag[] = [], rng: Rng = Math.random): string {
  const nounTable = KIND_NOUNS[kind] ?? structureTable
  const themes = tags.filter(t => t.startsWith(THEME_PREFIX))
  const moodThemes = themes.slice(0, -1) // inherited ancestors (the element's own kind/type won't match descriptor tags)
  const descCtx = boostCtx(moodThemes, tags.includes(TRAIT_WET))
  return compose(
    () => pickWeighted(nounTable, rng)[0],
    () => pickWeighted(descriptorTable, rng, descCtx)[0],
    () => pickWeighted(ofTable, rng)[0],
    rng,
  )
}

// The top-level DUNGEON name (the whole complex), e.g. "The Silent Catacombs" / "Labyrinth of Rust".
// Its own type is its (only) theme → it drives both the structure noun (include-filter on the dungeon
// pool) and the descriptor mood. Seeded rng → reproducible.
export function dungeonName(tags: readonly Tag[] = [], rng: Rng = Math.random): string {
  const themes = tags.filter(t => t.startsWith(THEME_PREFIX))
  const ownTheme = themes[themes.length - 1] ?? COMMON
  const descCtx = boostCtx([ownTheme], tags.includes(TRAIT_WET))
  return compose(
    () => pickWeighted(dungeonStructureTable, rng, { include: [ownTheme] })[0],
    () => pickWeighted(descriptorTable, rng, descCtx)[0],
    () => pickWeighted(ofTable, rng)[0],
    rng,
  )
}

// A furnishing/prop name, e.g. "Silent Altar" / "Rusted Chest" — a mood descriptor + the type label. All
// of `tags` are inherited context (dungeon ⊕ floor ⊕ room), so the whole place's mood colors the
// descriptor. Seeded rng → reproducible.
export function furnishingName(label: string, tags: readonly Tag[] = [], rng: Rng = Math.random): string {
  const moodThemes = tags.filter(t => t.startsWith(THEME_PREFIX))
  const desc = pickWeighted(descriptorTable, rng, boostCtx(moodThemes, tags.includes(TRAIT_WET)))[0]
  return `${desc} ${label}`
}
