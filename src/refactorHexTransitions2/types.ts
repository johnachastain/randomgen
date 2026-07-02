export type TerrainType = "ocean" | "coast" | "plains" | "forest" | "hills" | "mountains" | "desert" | "swamp"

export type HexDirection = "N" | "NE" | "SE" | "S" | "SW" | "NW"

// Corner names, clockwise from top-right (matches scripts/detectHexTiles.ts).
export type HexCorner = "TR" | "R" | "BR" | "BL" | "L" | "TL"
export const CORNERS: HexCorner[] = ["TR", "R", "BR", "BL", "L", "TL"]

export type HexCell = {
  col: number
  row: number
  tileIndex: number
}

export type HexGrid = HexCell[][]
