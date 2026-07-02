import { Material } from "./types"

// Base-layer fill colour per material.
export const MATERIAL_COLOR: Record<Material, string> = {
  [Material.Floor]: "#dfe3ea",
  [Material.Wall]:  "#2c313b",
  [Material.Water]: "#3a6ea5",
  [Material.Door]:  "#8a5a2b",
}

export const MATERIAL_LABEL: Record<Material, string> = {
  [Material.Floor]: "Floor",
  [Material.Wall]:  "Wall",
  [Material.Water]: "Water",
  [Material.Door]:  "Door",
}

// "Open" materials are the background the detail trims render onto (floor-like).
export function isOpen(m: Material): boolean {
  return m === Material.Floor || m === Material.Door
}

// Materials that get their own bitmask detail (bump/trim) layer, in render order.
// `oobIsTarget`: whether out-of-bounds counts as this material — true for Wall so
// the dungeon reads as enclosed; false for Water (no water at the border).
// `name`: key into the generated tile manifest (TRIM_<NAME>).
// `host`: which cells a detail's trim renders on. `render order` = array order,
// later paints on top — so wall is LAST (its lip sits above water base + shoreline).
export type DetailSpec = { material: Material; name: "wall" | "water"; oobIsTarget: boolean; host: (m: Material) => boolean }
export const DETAIL_MATERIALS: DetailSpec[] = [
  // Water shoreline first (below), on open land cells.
  { material: Material.Water, name: "water", oobIsTarget: false, host: isOpen },
  // Wall lip last (on top), on any non-wall cell — so it bumps over a wall-adjacent pool.
  { material: Material.Wall,  name: "wall",  oobIsTarget: true,  host: (m) => m !== Material.Wall },
]

// Trim palette per detail material — consumed by scripts/generateDungeonTiles.ts.
export const TRIM_STYLE: Record<"wall" | "water", { body: string; bevel: string }> = {
  wall:  { body: "#4a5160", bevel: "#6f7686" },
  water: { body: "#3a6ea5", bevel: "#6ea3d6" },
}
