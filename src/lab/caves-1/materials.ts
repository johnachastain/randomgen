import { Material } from "./types"

// Cave skin palette. Forked from the dungeon's CAVE_MATERIAL_COLOR, which held the same values as the
// standard dungeon palette (dark-gray wall, off-white floor) purely so the skin COULD diverge later —
// this is that "later": tuning the cave's look now means editing this file and nothing else.
// Walls are finished with the varied rounded corner tiles + wall bays, not a fine-grid fringe trim.
export const MATERIAL_COLOR: Record<Material, string> = {
  [Material.Floor]:  "#dfe3ea",
  [Material.Wall]:   "#2c313b",
  [Material.Water]:  "#5b93cf",
  [Material.Stairs]: "#b8b1a0",
}

export const MATERIAL_LABEL: Record<Material, string> = {
  [Material.Floor]:  "Floor",
  [Material.Wall]:   "Wall",
  [Material.Water]:  "Water",
  [Material.Stairs]: "Stairs",
}

// Materials this prototype actually GENERATES — the legend renders these, so it never advertises a
// swatch you can't find on the map. Water is in the vocabulary (RoomProfile models it) but has no
// producer until the underground-rivers prototype; add it here when it does.
export const LEGEND_MATERIALS: Material[] = [Material.Floor, Material.Wall, Material.Stairs]

// Level-portal marker colours — entrance (up/out) vs exit (down/out). Used for the legend swatches;
// the marker art itself is pre-generated (see caveTileConfig / public/dungeonTiles).
export const PORTAL_STYLE = { entrance: "#2f9e44", exit: "#e8590c" }
