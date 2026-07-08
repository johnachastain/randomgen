import { Material, MaterialGrid, Edge } from "./types"
import { isOpen } from "./materials"

// Fine-grid wall-detail: a sub-cell grid (SUB per base cell/axis) renders an
// edge-material's floor-facing border as a "trim lip" that bumps BUMP sub-cells
// into open floor. Generalized over materials: each detail material (wall, water,
// …) computes the same index against its own neighbours.

export const SUB = 4  // detail cells per base cell, per axis (16 per base cell)
export const BUMP = 1 // lip depth in sub-cells (implemented via immediate neighbours)

// Orthogonal wall-side bits (must match scripts/generateDungeonTiles.ts):
//   N = 1, E = 2, S = 4, W = 8  → index 1..15
// Outer corners (no orthogonal target, one diagonal target): NE=16 SE=17 SW=18 NW=19.
export const TRIM_COUNT = 20 // indices 0 (unused) .. 19

// Material of the base cell a fine cell belongs to; null = out of bounds.
export function fineMaterial(grid: MaterialGrid, fc: number, fr: number, cols: number, rows: number): Material | null {
  const fcols = cols * SUB
  const frows = rows * SUB
  if (fc < 0 || fc >= fcols || fr < 0 || fr >= frows) return null
  return grid[Math.floor(fr / SUB)][Math.floor(fc / SUB)]
}

// Trim tile index for a fine cell against `target` material, or -1 for "no trim".
// Trim only appears on FLOOR fine-cells adjacent to the target; out-of-bounds
// counts as the target iff `oobIsTarget` (true for walls → enclosed border).
export function trimIndexFor(
  grid: MaterialGrid, fc: number, fr: number, cols: number, rows: number,
  target: Material, oobIsTarget: boolean, host: (m: Material) => boolean,
): number {
  // Trim only hosts on cells matching `host` (per-detail): the wall lip hosts on
  // any non-wall cell (incl. water, so it renders over a wall-adjacent pool); the
  // water shoreline hosts on open land cells.
  const self = fineMaterial(grid, fc, fr, cols, rows)
  if (self === null || !host(self)) return -1

  const isT = (dc: number, dr: number): boolean => {
    const m = fineMaterial(grid, fc + dc, fr + dr, cols, rows)
    return m === null ? oobIsTarget : m === target
  }
  const N = isT(0, -1), E = isT(1, 0), S = isT(0, 1), W = isT(-1, 0)
  const O = (N ? 1 : 0) | (E ? 2 : 0) | (S ? 4 : 0) | (W ? 8 : 0)
  if (O !== 0) return O // straight edge / inner-corner / tunnel lip

  // No orthogonal target — an outer (convex) corner if a diagonal is the target.
  if (isT(1, -1)) return 16  // NE
  if (isT(1, 1)) return 17   // SE
  if (isT(-1, 1)) return 18  // SW
  if (isT(-1, -1)) return 19 // NW
  return -1
}

// Which edge of a door cell faces the room it opens onto — the door line is drawn
// flush to this edge (a threshold aligned to that wall). Returns the neighbour
// direction that is a room interior (a Floor cell with >=3 floor neighbours),
// falling back to the first open neighbour. For a corridor-pinch door this is the
// floor side along the passage, so it also gives the perpendicular orientation.
const EDGES: [Edge, number, number][] = [["w", -1, 0], ["e", 1, 0], ["n", 0, -1], ["s", 0, 1]]

export function doorEdge(grid: MaterialGrid, c: number, r: number, cols: number, rows: number): Edge {
  const inb = (cc: number, rr: number) => cc >= 0 && cc < cols && rr >= 0 && rr < rows
  const openAt = (cc: number, rr: number) => inb(cc, rr) && isOpen(grid[rr][cc])
  // Local open area around a cell — a room (2-D blob) scores high, a corridor
  // (1-D line) low, so we can tell which passage side is the room.
  const openness = (cc: number, rr: number) => {
    let n = 0
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (openAt(cc + dx, rr + dy)) n++
    return n
  }
  // Among the open passage sides, pick the one facing the more-open space (room).
  // First-match order gives a deterministic tie-break; only open sides are
  // candidates, so the line stays on the correct axis.
  let best: Edge = "w", bestScore = -1
  for (const [name, dc, dr] of EDGES) {
    if (!openAt(c + dc, r + dr)) continue
    const score = openness(c + dc, r + dr)
    if (score > bestScore) { bestScore = score; best = name }
  }
  return best
}
