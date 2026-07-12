export type TerrainType = "ocean" | "coast" | "plains" | "forest" | "hills" | "mountains" | "desert" | "swamp"

export type HexDirection = "N" | "NE" | "SE" | "S" | "SW" | "NW"

export type HexCell = {
  col: number
  row: number
  terrain: TerrainType
}

export type HexGrid = HexCell[][]
