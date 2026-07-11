import { Material, MaterialGrid, EDGE, EdgeGrids } from "./types"

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
  edges?: EdgeGrids,
): number {
  // Trim only hosts on cells matching `host` (per-detail): the wall lip hosts on
  // any non-wall cell (incl. water, so it renders over a wall-adjacent pool); the
  // water shoreline hosts on open land cells.
  const self = fineMaterial(grid, fc, fr, cols, rows)
  if (self === null || !host(self)) return -1

  // Edge kind on the (dc,dr) boundary of base cell (c,r) — for the edge-wall trim below.
  const edgeKind = (c: number, r: number, dc: number, dr: number): number => {
    if (!edges) return EDGE.open
    if (dc === 1) return edges.v[r]?.[c + 1] ?? EDGE.open
    if (dc === -1) return edges.v[r]?.[c] ?? EDGE.open
    if (dr === 1) return edges.h[r + 1]?.[c] ?? EDGE.open
    return edges.h[r]?.[c] ?? EDGE.open
  }
  // Does a fine step of (dc,dr) meet an EDGE.wall (only for the wall detail)? Lets thin
  // edge-walls between flush open cells trim like a Material.Wall cell. ORTHOGONAL steps read
  // the crossed boundary; DIAGONAL steps (at a true corner fine-cell) read the two edges that
  // "wrap" toward the diagonal cell — firing the convex end-cap nub at edge-wall terminations
  // & doorways, consistent with cell-walls.
  const edgeWallAt = (dc: number, dr: number): boolean => {
    if (!edges || target !== Material.Wall) return false
    const bc = Math.floor(fc / SUB), br = Math.floor(fr / SUB)
    const ec = Math.floor((fc + dc) / SUB) - bc, er = Math.floor((fr + dr) / SUB) - br
    if (ec === 0 && er === 0) return false            // stayed in same base cell
    if (dc !== 0 && dr !== 0) {                        // diagonal step
      if (ec === 0 || er === 0) return false           // landed orthogonally → not the corner fine-cell
      return edgeKind(bc + ec, br, 0, er) === EDGE.wall || edgeKind(bc, br + er, ec, 0) === EDGE.wall
    }
    return edgeKind(bc, br, ec, er) === EDGE.wall       // orthogonal step
  }

  const isT = (dc: number, dr: number): boolean => {
    const m = fineMaterial(grid, fc + dc, fr + dr, cols, rows)
    if (m === null) return oobIsTarget
    return m === target || edgeWallAt(dc, dr)
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

// (Doors are now edge features recorded at generation in dungeon.ts — no render-time
// edge heuristic. The old `doorEdge()` open-area guess, which caused the door-side flip,
// has been retired.)
