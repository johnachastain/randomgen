// Shared core — naming.
// First resident of the `core/` layer (the promotion pilot). This is a deliberately SIMPLE first-pass
// dungeon room-name generator. It takes an optional `rng` so it becomes seed-driven later just by
// passing a seeded PRNG (→ future `core/rng`, the T1 work) — no call-site change beyond the argument.
//
// Promotion TODO (later polish): fold in the richer tagged corpus from `src/names` + a config-driven
// PROFILE system (person / dungeon-room / …) with Zod-validated configs; wire to `core/rng` for seeds.

type Rng = () => number
const pick = <T>(arr: readonly T[], rng: Rng): T => arr[Math.floor(rng() * arr.length)]

const STRUCTURES = [
  "Vault", "Hall", "Crypt", "Chamber", "Hollow", "Gallery", "Sanctum", "Cell", "Den", "Pit",
  "Shrine", "Tomb", "Cistern", "Forge", "Barracks", "Oubliette", "Rotunda", "Antechamber", "Gaol", "Reliquary",
] as const
const DESCRIPTORS = [
  "Sunken", "Grim", "Rusted", "Shattered", "Forgotten", "Weeping", "Ashen", "Gilded", "Crooked", "Silent",
  "Frozen", "Molten", "Whispering", "Bloodied", "Mossy", "Cracked", "Hollow", "Withered", "Drowned", "Charred",
] as const
const OF_NOUNS = [
  "Rust", "Bone", "Ash", "Echoes", "Sorrow", "Chains", "Whispers", "Embers", "Thorns", "Dust",
  "Shadows", "Sighs", "Iron", "Salt", "Mourning", "Cinders", "Rot", "Frost",
] as const

// A dungeon room name, e.g. "The Sunken Vault" / "Chamber of Echoes" / "The Gaol".
// Pass a seeded rng (0..1) to make output reproducible; defaults to Math.random for the prototype.
export function roomName(rng: Rng = Math.random): string {
  const r = rng()
  if (r < 0.45) return `The ${pick(DESCRIPTORS, rng)} ${pick(STRUCTURES, rng)}`
  if (r < 0.85) return `${pick(STRUCTURES, rng)} of ${pick(OF_NOUNS, rng)}`
  return `The ${pick(STRUCTURES, rng)}`
}
