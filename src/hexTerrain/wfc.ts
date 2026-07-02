import { TerrainType } from "./types"
import { ALL_TERRAINS, ADJACENCY } from "./terrainConfig"
import { DIRS, getNeighborOffset, inBounds } from "./hexUtils"

function cellKey(col: number, row: number): string {
  return `${col},${row}`
}

function propagate(
  startCol: number,
  startRow: number,
  options: Set<TerrainType>[][],
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

      for (const neighborTerrain of Array.from(neighborOpts)) {
        const compatible = Array.from(cellOpts).some(
          t => ADJACENCY[t].includes(neighborTerrain)
        )
        if (!compatible) neighborOpts.delete(neighborTerrain)
      }

      if (neighborOpts.size === 0) return false
      if (neighborOpts.size < before) queue.push([nc, nr])
    }
  }

  return true
}

function tryWfc(cols: number, rows: number): TerrainType[][] | null {
  const options: Set<TerrainType>[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => new Set<TerrainType>(ALL_TERRAINS))
  )
  const collapsed = new Set<string>()
  const total = cols * rows

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
    const pick = opts[Math.floor(Math.random() * opts.length)]

    options[row][col] = new Set([pick])
    collapsed.add(cellKey(col, row))

    if (!propagate(col, row, options, collapsed, cols, rows)) return null
  }

  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => Array.from(options[r][c])[0])
  )
}

export function wfc(cols: number, rows: number): TerrainType[][] {
  for (let attempt = 0; attempt < 20; attempt++) {
    const result = tryWfc(cols, rows)
    if (result) return result
  }
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => "ocean" as TerrainType)
  )
}

export function buildGrid(terrainMap: TerrainType[][], cols: number, rows: number) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      col: c,
      row: r,
      terrain: terrainMap[r][c],
    }))
  )
}

export function generateGrid(cols: number, rows: number) {
  return buildGrid(wfc(cols, rows), cols, rows)
}
