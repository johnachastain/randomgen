import { HexDirection, HexCorner } from "./types"
import { TileConfig } from "./tileConfig"

export const DIRS: HexDirection[] = ["N", "NE", "SE", "S", "SW", "NW"]

export const OPPOSITE: Record<HexDirection, HexDirection> = {
  N: "S", NE: "SW", SE: "NW",
  S: "N", SW: "NE", NW: "SE",
}

// The two corners bounding each edge, clockwise (matches scripts/detectHexTiles.ts EDGE_CORNERS).
export const EDGE_CORNERS: Record<HexDirection, [HexCorner, HexCorner]> = {
  N:  ["TL", "TR"],
  NE: ["TR", "R"],
  SE: ["R",  "BR"],
  S:  ["BR", "BL"],
  SW: ["BL", "L"],
  NW: ["L",  "TL"],
}

// Even-q offset coordinates for flat-top hexes.
// Odd columns are shifted down by half a hex height.
export function getNeighborOffset(dir: HexDirection, col: number): { dc: number; dr: number } {
  const odd = col % 2 === 1
  switch (dir) {
    case "N":  return { dc:  0, dr: -1 }
    case "S":  return { dc:  0, dr:  1 }
    case "NE": return odd ? { dc:  1, dr:  0 } : { dc:  1, dr: -1 }
    case "SE": return odd ? { dc:  1, dr:  1 } : { dc:  1, dr:  0 }
    case "SW": return odd ? { dc: -1, dr:  1 } : { dc: -1, dr:  0 }
    case "NW": return odd ? { dc: -1, dr:  0 } : { dc: -1, dr: -1 }
  }
}

export function inBounds(col: number, row: number, cols: number, rows: number): boolean {
  return col >= 0 && col < cols && row >= 0 && row < rows
}

// Corners shared with the neighbor in `dir`, as [ourCorner, theirCorner] pairs.
// The two hexes view the same edge from opposite sides, so the pairing is reversed:
// our [p, q] line up with their opposite edge's [s, r].
export function sharedCornerPairs(dir: HexDirection): [HexCorner, HexCorner][] {
  const [p, q] = EDGE_CORNERS[dir]
  const [r, s] = EDGE_CORNERS[OPPOSITE[dir]]
  return [[p, s], [q, r]]
}

// Two tiles fit across the edge in `dir` (from A's perspective) iff they agree
// on the terrain at both shared corners.
export function tilesMatch(a: TileConfig, b: TileConfig, dir: HexDirection): boolean {
  return sharedCornerPairs(dir).every(([ac, bc]) => a.corners[ac] === b.corners[bc])
}
