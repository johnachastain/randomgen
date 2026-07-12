import { Connects, Direction } from "./types"

const DIRS: Direction[] = ["top", "right", "bottom", "left"]

const OPPOSITE: Record<Direction, Direction> = {
  top: "bottom", right: "left", bottom: "top", left: "right",
}

const OFFSET: Record<Direction, { dc: number; dr: number }> = {
  top:    { dc:  0, dr: -1 },
  right:  { dc:  1, dr:  0 },
  bottom: { dc:  0, dr:  1 },
  left:   { dc: -1, dr:  0 },
}

// All 16 possible Connects patterns encoded as indices 0–15
// bit 0 = top, bit 1 = right, bit 2 = bottom, bit 3 = left
const ALL_PATTERNS: Connects[] = Array.from({ length: 16 }, (_, i) => ({
  top:    (i & 1) !== 0,
  right:  (i & 2) !== 0,
  bottom: (i & 4) !== 0,
  left:   (i & 8) !== 0,
}))

function cellKey(col: number, row: number): string {
  return `${col},${row}`
}

function inBounds(col: number, row: number, cols: number, rows: number): boolean {
  return col >= 0 && col < cols && row >= 0 && row < rows
}

function propagate(
  startCol: number,
  startRow: number,
  options: Set<number>[][],
  collapsed: Map<string, Connects>,
  cols: number,
  rows: number,
): boolean {
  const queue: [number, number][] = [[startCol, startRow]]
  while (queue.length > 0) {
    const [cc, cr] = queue.shift()!
    const cellOpts = options[cr][cc]

    for (const dir of DIRS) {
      const { dc, dr } = OFFSET[dir]
      const nc = cc + dc
      const nr = cr + dr
      if (!inBounds(nc, nr, cols, rows) || collapsed.has(cellKey(nc, nr))) continue

      const neighborOpts = options[nr][nc]
      const before = neighborOpts.size

      for (const nIdx of Array.from(neighborOpts)) {
        const neighborPattern = ALL_PATTERNS[nIdx]
        const compatible = Array.from(cellOpts).some(
          cIdx => ALL_PATTERNS[cIdx][dir] === neighborPattern[OPPOSITE[dir]]
        )
        if (!compatible) neighborOpts.delete(nIdx)
      }

      if (neighborOpts.size === 0) return false
      if (neighborOpts.size < before) queue.push([nc, nr])
    }
  }
  return true
}

function tryWfc(cols: number, rows: number): Map<string, Connects> | null {
  const options: Set<number>[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => new Set(ALL_PATTERNS.map((_, i) => i)))
  )

  const collapsed = new Map<string, Connects>()

  // Close off all outer edges before collapsing begins
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = options[r][c]
      if (r === 0)        for (const idx of Array.from(cell)) { if (ALL_PATTERNS[idx].top)    cell.delete(idx) }
      if (r === rows - 1) for (const idx of Array.from(cell)) { if (ALL_PATTERNS[idx].bottom) cell.delete(idx) }
      if (c === 0)        for (const idx of Array.from(cell)) { if (ALL_PATTERNS[idx].left)   cell.delete(idx) }
      if (c === cols - 1) for (const idx of Array.from(cell)) { if (ALL_PATTERNS[idx].right)  cell.delete(idx) }
      if (cell.size === 0) return null
    }
  }

  // Propagate border constraints inward
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isBorder = r === 0 || r === rows - 1 || c === 0 || c === cols - 1
      if (isBorder && !propagate(c, r, options, collapsed, cols, rows)) return null
    }
  }

  // Main WFC collapse loop
  const total = cols * rows
  for (let step = 0; step < total; step++) {
    let minOpts = Infinity
    let chosen: [number, number] | null = null

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (collapsed.has(cellKey(c, r))) continue
        const n = options[r][c].size
        if (n < minOpts || (n === minOpts && Math.random() < 0.5)) {
          minOpts = n
          chosen = [c, r]
        }
      }
    }

    if (!chosen || minOpts === 0) return null

    const [col, row] = chosen
    const opts = Array.from(options[row][col])
    const pick = opts[Math.floor(Math.random() * opts.length)]

    collapsed.set(cellKey(col, row), ALL_PATTERNS[pick])
    options[row][col] = new Set([pick])

    if (!propagate(col, row, options, collapsed, cols, rows)) return null
  }

  return collapsed
}

export function wfc(cols: number, rows: number): Map<string, Connects> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const result = tryWfc(cols, rows)
    if (result) return result
  }
  // Fallback: all-closed grid
  const fallback = new Map<string, Connects>()
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      fallback.set(cellKey(c, r), { top: false, right: false, bottom: false, left: false })
  return fallback
}
