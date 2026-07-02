import { HexGrid, TerrainType, CORNERS } from "./types"
import { TILES } from "./tileConfig"
import { DIRS, getNeighborOffset, inBounds, tilesMatch, sharedCornerPairs } from "./hexUtils"
import { generateTerrainRegions } from "./field"
import { TILE_WEIGHT } from "./tileWeights"

// Tile-domain WFC: each cell's domain is a set of indices into TILES.
// Neighbors are compatible when the current tile and neighbor tile agree on the
// terrain at their two shared corners (see hexUtils.tilesMatch).

const ALL_TILES = TILES.map((_, i) => i)

// The clean all-ocean solid, used to force a water border in "ocean edge" mode.
const SOLID_OCEAN = TILES.findIndex(t => t.src.endsWith("/solid_ocean.svg"))

// Generation strategy — selectable from the page so versions can be compared.
export type GenMode = "uniform" | "weighted" | "field"

// Per-generation options, bundled so call sites (and future knobs) stay tidy.
export type GenOptions = {
  baseTerrain: TerrainType | null // dominant terrain; stabilizes biome across redraws
  oceanEdge: boolean              // force a 1-ring ocean border (continents look)
}

export const DEFAULT_OPTIONS: GenOptions = { baseTerrain: null, oceanEdge: false }

const CORNER_TERRAINS = TILES.map(t => CORNERS.map(c => t.corners[c]))

// Minority-corner count per tile: 0 = solid, 1 = 1/5, 2 = 2/4, 3 = 3/3 split.
const MINORITY = TILES.map((_, i) => {
  const counts: Record<string, number> = {}
  for (const t of CORNER_TERRAINS[i]) counts[t] = (counts[t] ?? 0) + 1
  const vals = Object.values(counts).sort((a, b) => a - b)
  return vals.length === 1 ? 0 : vals[0]
})

// "weighted" mode: favor solids (bigger regions) AND, crucially, tiles that
// continue the terrain already placed in collapsed neighbors — so same-terrain
// hexes grow into blobs instead of scattering. Tunable.
const WEIGHT_BY_MINORITY = [3, 2, 1, 1] // index = MINORITY (0..3): solid pref
const CONTINUATION_K = 3                 // pull toward the dominant neighbor terrain
const RESIZE_K = 40                      // resize: pull hard toward the echoed old layout

function cellKey(col: number, row: number): string {
  return `${col},${row}`
}

// Most common terrain that collapsed neighbors present onto this cell's corners.
function dominantContext(
  options: Set<number>[][], collapsed: Set<string>, col: number, row: number, cols: number, rows: number,
): TerrainType | null {
  const votes: Record<string, number> = {}
  for (const dir of DIRS) {
    const { dc, dr } = getNeighborOffset(dir, col)
    const nc = col + dc, nr = row + dr
    if (!inBounds(nc, nr, cols, rows) || !collapsed.has(cellKey(nc, nr))) continue
    const nTile = options[nr][nc].values().next().value as number
    for (const [, theirCorner] of sharedCornerPairs(dir)) {
      const t = TILES[nTile].corners[theirCorner]
      votes[t] = (votes[t] ?? 0) + 1
    }
  }
  let best: string | null = null, bestN = 0
  for (const [t, n] of Object.entries(votes)) if (n > bestN) { bestN = n; best = t }
  return best as TerrainType | null
}

function pickTile(indices: number[], mode: GenMode, dominant: TerrainType | null, kOverride?: number): number {
  // Per-tile spawn weight (island rarity, solid preference) applies in every
  // mode; clustering weight only in weighted/field.
  const clustering = mode !== "uniform"
  // field's target is an authoritative region map, so pull toward it harder than
  // weighted's locally-inferred neighbor terrain. Resize overrides this even
  // higher so the map holds its old layout.
  const k = kOverride ?? (mode === "field" ? 10 : CONTINUATION_K)
  const weights = indices.map(i => {
    let w = TILE_WEIGHT[i]
    if (clustering) {
      w *= WEIGHT_BY_MINORITY[MINORITY[i]]
      if (dominant) {
        let match = 0
        for (const t of CORNER_TERRAINS[i]) if (t === dominant) match++
        w *= 1 + k * match
      }
    }
    return w
  })
  const sum = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * sum
  for (let k = 0; k < indices.length; k++) {
    r -= weights[k]
    if (r < 0) return indices[k]
  }
  return indices[indices.length - 1]
}

function propagate(
  startCol: number,
  startRow: number,
  options: Set<number>[][],
  collapsed: Set<string>,
  cols: number,
  rows: number,
): boolean {
  const queue: [number, number][] = [[startCol, startRow]]

  while (queue.length > 0) {
    const [cc, cr] = queue.shift()!
    const cellOpts = options[cr][cc]

    for (const dir of DIRS) {
      const { dc, dr } = getNeighborOffset(dir, cc)
      const nc = cc + dc
      const nr = cr + dr
      if (!inBounds(nc, nr, cols, rows) || collapsed.has(cellKey(nc, nr))) continue

      const neighborOpts = options[nr][nc]
      const before = neighborOpts.size

      for (const nt of Array.from(neighborOpts)) {
        const compatible = Array.from(cellOpts).some(
          ct => tilesMatch(TILES[ct], TILES[nt], dir)
        )
        if (!compatible) neighborOpts.delete(nt)
      }

      if (neighborOpts.size === 0) return false
      if (neighborOpts.size < before) queue.push([nc, nr])
    }
  }

  return true
}

function tryWfc(
  cols: number,
  rows: number,
  mode: GenMode,
  target: TerrainType[][] | null,
  preset: (number | null)[][] | null,
  kOverride?: number,
): number[][] | null {
  const options: Set<number>[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => new Set<number>(ALL_TILES))
  )
  const collapsed = new Set<string>()
  const total = cols * rows

  // Seed pre-assigned cells (ocean border, preserved-on-resize hexes): collapse
  // them to a single tile, then propagate their constraints outward. A preset
  // that can't coexist returns null → wfc()'s retry/fallback handles it.
  if (preset) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const t = preset[r][c]
        if (t == null) continue
        options[r][c] = new Set([t])
        collapsed.add(cellKey(c, r))
      }
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!collapsed.has(cellKey(c, r))) continue
        if (!propagate(c, r, options, collapsed, cols, rows)) return null
      }
    }
  }

  for (let step = 0; step < total; step++) {
    let minOpts = Infinity
    let chosen: [number, number] | null = null

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (collapsed.has(cellKey(c, r))) continue
        const n = options[r][c].size
        if (n === 0) return null
        if (n < minOpts || (n === minOpts && Math.random() < 0.5)) {
          minOpts = n
          chosen = [c, r]
        }
      }
    }

    if (!chosen) break
    if (minOpts === 0) return null

    const [col, row] = chosen
    const opts = Array.from(options[row][col])
    // Bias terrain: an explicit region target (field mode) wins; otherwise the
    // terrain that collapsed neighbors present (weighted mode); none for uniform.
    let dominant: TerrainType | null = null
    if (mode !== "uniform") {
      dominant = target ? target[row][col] : dominantContext(options, collapsed, col, row, cols, rows)
    }
    const pick = pickTile(opts, mode, dominant, kOverride)

    options[row][col] = new Set([pick])
    collapsed.add(cellKey(col, row))

    if (!propagate(col, row, options, collapsed, cols, rows)) return null
  }

  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => Array.from(options[r][c])[0])
  )
}

export function wfc(
  cols: number,
  rows: number,
  mode: GenMode,
  target: TerrainType[][] | null = null,
  preset: (number | null)[][] | null = null,
  kOverride?: number,
): number[][] {
  // A preset (ocean border) fixes a boundary the greedy collapse must work
  // around, which dead-ends more often — so give the random restarts a larger
  // budget before falling back.
  const attempts = preset ? 60 : 20
  for (let attempt = 0; attempt < attempts; attempt++) {
    const result = tryWfc(cols, rows, mode, target, preset, kOverride)
    if (result) return result
  }
  // Last-resort fallback: fill with tile 0 (seams may not match, but always
  // renders). Honour any preset so a failed ocean border still shows water.
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => preset?.[r]?.[c] ?? 0)
  )
}

export function buildGrid(tileMap: number[][], cols: number, rows: number): HexGrid {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      col: c,
      row: r,
      tileIndex: tileMap[r][c],
    }))
  )
}

// Dominant (majority) corner terrain of each tile — its "what terrain is this".
const TILE_TERRAIN: TerrainType[] = CORNER_TERRAINS.map(corners => {
  const counts: Record<string, number> = {}
  for (const t of corners) counts[t] = (counts[t] ?? 0) + 1
  let best = corners[0], bestN = 0
  for (const [t, n] of Object.entries(counts)) if (n > bestN) { bestN = n; best = t as TerrainType }
  return best
})

// Soft per-cell terrain bias for a from-scratch generation. Only "field" uses an
// explicit region map; a base terrain flows through it (base-weighted regions)
// so redraws keep the biome.
function buildTarget(cols: number, rows: number, mode: GenMode, opts: GenOptions): TerrainType[][] | null {
  if (mode !== "field") return null
  return generateTerrainRegions(cols, rows, opts.baseTerrain)
}

// Resize target: echo the previous map's terrain layout into the new size. New
// cells clamp to the nearest old edge cell, so regions extend outward rather than
// re-rolling. Feeding this as a soft target to a fresh (fully seam-consistent)
// WFC keeps the map's character stable across size changes without seam glitches.
function buildResizeTarget(prevGrid: HexGrid, cols: number, rows: number): TerrainType[][] {
  const pr = prevGrid.length
  const pc = prevGrid[0]?.length ?? 0
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const sr = Math.min(r, pr - 1)
      const sc = Math.min(c, pc - 1)
      return TILE_TERRAIN[prevGrid[sr][sc].tileIndex]
    })
  )
}

// Hard pre-assignment: force the outer ring to ocean for the "continents" look.
function buildPreset(cols: number, rows: number, opts: GenOptions): (number | null)[][] | null {
  if (!opts.oceanEdge || SOLID_OCEAN < 0) return null
  const preset: (number | null)[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null as number | null)
  )
  for (let c = 0; c < cols; c++) { preset[0][c] = SOLID_OCEAN; preset[rows - 1][c] = SOLID_OCEAN }
  for (let r = 0; r < rows; r++) { preset[r][0] = SOLID_OCEAN; preset[r][cols - 1] = SOLID_OCEAN }
  return preset
}

export function generateGrid(
  cols: number,
  rows: number,
  mode: GenMode = "uniform",
  opts: GenOptions = DEFAULT_OPTIONS,
  prevGrid?: HexGrid,
): HexGrid {
  // Resize = SOFT-preserve: re-roll a fully seam-consistent map biased to the old
  // layout (via a resize target realized at field strength), so regions stay put
  // and grow into new space with no seam glitches. A from-scratch generation uses
  // the chosen mode's target. Ocean edge applies to both via the preset.
  const target = prevGrid
    ? buildResizeTarget(prevGrid, cols, rows)
    : buildTarget(cols, rows, mode, opts)
  const preset = buildPreset(cols, rows, opts)
  const effectiveMode: GenMode = prevGrid ? "field" : mode
  // Resize pulls hard toward the echoed old layout so regions hold their place.
  const kOverride = prevGrid ? RESIZE_K : undefined
  return buildGrid(wfc(cols, rows, effectiveMode, target, preset, kOverride), cols, rows)
}
