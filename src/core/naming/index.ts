// Shared core — naming.
// First resident of the `core/` layer (the promotion pilot). A SIMPLE, generic dungeon-element
// name generator. It's **profile-aware via plain string tags** (kept generic — no feature/dungeon
// import): a caller passes semantic tags (e.g. a room's `type` + water) and the name is drawn from a
// pool matching them. Takes a seeded rng (→ `core/rng`, T1) so output is reproducible.
//
// Promotion TODO (later polish): fold in the richer tagged corpus from `src/names` + a config-driven
// PROFILE system (person / dungeon-room / …) with Zod-validated configs.

type Rng = () => number
const pick = <T>(arr: readonly T[], rng: Rng): T => arr[Math.floor(rng() * arr.length)]

// Generic fallback structure pool (used when no tag matches a typed pool).
const STRUCTURES = [
  "Vault", "Hall", "Crypt", "Chamber", "Hollow", "Gallery", "Sanctum", "Cell", "Den", "Pit",
  "Shrine", "Tomb", "Cistern", "Forge", "Barracks", "Oubliette", "Rotunda", "Antechamber", "Gaol", "Reliquary",
] as const
// Structure nouns keyed by a room-profile `type` token — the profile-aware vocabulary.
const STRUCTURES_BY_TYPE: Record<string, readonly string[]> = {
  rotunda: ["Rotunda", "Ring", "Round Hall", "Circle"],
  cistern: ["Cistern", "Reservoir", "Sump", "Well", "Drowned Vault"],
  vault:   ["Vault", "Crypt", "Undercroft", "Tomb", "Reliquary"],
  hall:    ["Hall", "Gallery", "Colonnade", "Concourse"],
  chamber: ["Chamber", "Hollow", "Antechamber", "Sanctum"],
  cell:    ["Cell", "Oubliette", "Gaol", "Pit", "Den"],
}
const DESCRIPTORS = [
  "Sunken", "Grim", "Rusted", "Shattered", "Forgotten", "Weeping", "Ashen", "Gilded", "Crooked", "Silent",
  "Frozen", "Molten", "Whispering", "Bloodied", "Mossy", "Cracked", "Hollow", "Withered", "Drowned", "Charred",
] as const
// Descriptors favoured when the element holds water.
const WATER_DESCRIPTORS = ["Sunken", "Drowned", "Weeping", "Mossy", "Flooded"] as const
const OF_NOUNS = [
  "Rust", "Bone", "Ash", "Echoes", "Sorrow", "Chains", "Whispers", "Embers", "Thorns", "Dust",
  "Shadows", "Sighs", "Iron", "Salt", "Mourning", "Cinders", "Rot", "Frost",
] as const

const WATER_TAGS = new Set(["pool", "partial", "full", "water"])

// A dungeon room name, e.g. "The Sunken Cistern" / "Rotunda of Echoes" / "The Oubliette".
// `tags` = the element's semantic signals (a room profile's `type` + water/features). The structure
// noun is drawn from the pool of the first tag that names a type (else the generic pool); a watery
// tag biases the descriptor. Pass a seeded rng to make output reproducible; defaults to Math.random.
export function roomName(tags: readonly string[] = [], rng: Rng = Math.random): string {
  const typeKey = tags.find(t => STRUCTURES_BY_TYPE[t] !== undefined)
  const structures = typeKey ? STRUCTURES_BY_TYPE[typeKey] : STRUCTURES
  const watery = tags.some(t => WATER_TAGS.has(t))
  const descriptors = watery && rng() < 0.6 ? WATER_DESCRIPTORS : DESCRIPTORS
  const r = rng()
  if (r < 0.45) return `The ${pick(descriptors, rng)} ${pick(structures, rng)}`
  if (r < 0.85) return `${pick(structures, rng)} of ${pick(OF_NOUNS, rng)}`
  return `The ${pick(structures, rng)}`
}
