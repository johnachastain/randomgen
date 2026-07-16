import { Material } from "./types"

// Base-layer fill colour per material. (Door & Stairs render their base as Floor;
// their colour here is only for the legend swatch.)
export const MATERIAL_COLOR: Record<Material, string> = {
  [Material.Floor]:  "#dfe3ea",
  [Material.Wall]:   "#2c313b",
  [Material.Water]:  "#5b93cf",
  [Material.Door]:   "#8a5a2b",
  [Material.Stairs]: "#b8b1a0",
}

export const MATERIAL_LABEL: Record<Material, string> = {
  [Material.Floor]:  "Floor",
  [Material.Wall]:   "Wall",
  [Material.Water]:  "Water",
  [Material.Door]:   "Door",
  [Material.Stairs]: "Stairs",
}

// "Open" materials are the background the detail trims render onto (floor-like).
// Stairs are passable, so they count as open (trim runs continuously across them).
export function isOpen(m: Material): boolean {
  return m === Material.Floor || m === Material.Door || m === Material.Stairs
}

// Stair tile palette — consumed by scripts/generateDungeonTiles.ts.
// Background is transparent (base layer shows through); `tread` = the perpendicular
// step lines; `cue` = the directional chevron pointing up-slope.
export const STAIR_STYLE = { tread: "#7c745f", cue: "#4a4534" }

// Level-portal marker colours — entrance (up/out) vs exit (down/out). Consumed by the tile
// generator; also used for the Page legend swatches.
export const PORTAL_STYLE = { entrance: "#2f9e44", exit: "#e8590c" }

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
  water: { body: "#5b93cf", bevel: "#87b7e6" },
}

// --- Cave skin (Idea 7) --------------------------------------------------------------------
// Caves reuse the standard dungeon palette (dark-gray wall, off-white floor) — same values as
// MATERIAL_COLOR above. The base floor/wall `<div>` fills swap to this in cave mode; walls are
// finished with the varied rounded corner tiles + wall bays (no fine-grid fringe). Kept as its own
// map so the cave skin can diverge later if wanted.
export const CAVE_MATERIAL_COLOR: Record<Material, string> = {
  [Material.Floor]:  "#dfe3ea",
  [Material.Wall]:   "#2c313b",
  [Material.Water]:  "#5b93cf",
  [Material.Door]:   "#8a5a2b",
  [Material.Stairs]: "#b8b1a0",
}
