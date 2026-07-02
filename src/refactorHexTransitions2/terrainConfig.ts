import { TerrainType } from "./types"

export const ALL_TERRAINS: TerrainType[] = [
  "ocean", "coast", "plains", "forest", "hills", "mountains", "desert", "swamp",
]

export const TERRAIN_COLORS: Record<TerrainType, string> = {
  ocean:     "#2255aa",
  coast:     "#66aadd",
  plains:    "#99cc55",
  forest:    "#336622",
  hills:     "#aa8844",
  mountains: "#999999",
  desert:    "#ddcc77",
  swamp:     "#667744",
}

export const TERRAIN_LABELS: Record<TerrainType, string> = {
  ocean:     "Ocean",
  coast:     "Coast",
  plains:    "Plains",
  forest:    "Forest",
  hills:     "Hills",
  mountains: "Mountains",
  desert:    "Desert",
  swamp:     "Swamp",
}

// Symmetric adjacency — terrain types that may share a border
export const ADJACENCY: Record<TerrainType, TerrainType[]> = {
  ocean:     ["ocean", "coast"],
  coast:     ["coast", "ocean", "plains", "swamp"],
  plains:    ["plains", "coast", "forest", "hills", "desert", "swamp"],
  forest:    ["forest", "plains", "hills", "swamp"],
  hills:     ["hills", "plains", "forest", "mountains", "desert"],
  mountains: ["mountains", "hills"],
  desert:    ["desert", "plains", "hills"],
  swamp:     ["swamp", "plains", "forest", "coast"],
}
