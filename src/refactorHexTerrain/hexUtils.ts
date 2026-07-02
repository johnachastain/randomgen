import { HexDirection } from "./types"

export const DIRS: HexDirection[] = ["N", "NE", "SE", "S", "SW", "NW"]

export const OPPOSITE: Record<HexDirection, HexDirection> = {
  N: "S", NE: "SW", SE: "NW",
  S: "N", SW: "NE", NW: "SE",
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
