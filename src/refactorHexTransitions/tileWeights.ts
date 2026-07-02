import { TILES } from "./tileConfig"

// Per-family spawn weights. Every tile belongs to a "family" = its source shape
// (the filename with the terrain-pair and rotation suffixes stripped). Lower
// weight = rarer. Default is 1. This is the knob for "some variants rarer than
// others" — e.g. the "two" island family is made rare so region interiors mostly
// use the clean solid tiles.
export const FAMILY_WEIGHTS: Record<string, number> = {
  solid: 2,     // prefer clean flat solids for region interiors
  two: 0.12,    // island family (blob-in-interior) — rare
}

const TERRAIN = "ocean|coast|plains|forest|hills|mountains|desert|swamp"
const PAIR_RE = new RegExp(`_(${TERRAIN})_(${TERRAIN})`)

export function familyOf(src: string): string {
  const name = src.replace(/^.*\//, "").replace(/\.svg$/, "")
  if (name.startsWith("solid_")) return "solid"
  return name.replace(PAIR_RE, "").replace(/_r\d{3}$/, "")
}

// Precomputed weight per tile index, aligned with TILES.
export const TILE_WEIGHT = TILES.map(t => FAMILY_WEIGHTS[familyOf(t.src)] ?? 1)
