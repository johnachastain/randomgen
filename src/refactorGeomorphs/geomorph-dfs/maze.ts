import { Connects, Direction } from "./types"

const DIRECTIONS: { dir: Direction; dc: number; dr: number }[] = [
  { dir: "top",    dc:  0, dr: -1 },
  { dir: "right",  dc:  1, dr:  0 },
  { dir: "bottom", dc:  0, dr:  1 },
  { dir: "left",   dc: -1, dr:  0 },
]

const OPPOSITE: Record<Direction, Direction> = {
  top: "bottom", right: "left", bottom: "top", left: "right",
}

function cellKey(col: number, row: number): string {
  return `${col},${row}`
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Recursive backtracker (iterative DFS with explicit stack).
// Returns a map of every cell's carved connections — every cell is reachable
// and the connections form a spanning tree (perfect maze: no loops, no isolated cells).
export function recursiveBacktracker(cols: number, rows: number): Map<string, Connects> {
  const mazeMap = new Map<string, Connects>()
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      mazeMap.set(cellKey(c, r), { top: false, right: false, bottom: false, left: false })
    }
  }

  const visited = new Set<string>()
  const stack: { col: number; row: number }[] = []

  const startCol = Math.floor(Math.random() * cols)
  const startRow = Math.floor(Math.random() * rows)
  visited.add(cellKey(startCol, startRow))
  stack.push({ col: startCol, row: startRow })

  while (stack.length > 0) {
    const { col, row } = stack[stack.length - 1]

    const unvisitedNeighbors = shuffle(DIRECTIONS)
      .map(({ dir, dc, dr }) => ({ dir, col: col + dc, row: row + dr }))
      .filter(({ col: nc, row: nr }) =>
        nc >= 0 && nc < cols && nr >= 0 && nr < rows &&
        !visited.has(cellKey(nc, nr))
      )

    if (unvisitedNeighbors.length > 0) {
      const { dir, col: nc, row: nr } = unvisitedNeighbors[0]

      // Carve passage in both directions
      mazeMap.get(cellKey(col, row))![dir] = true
      mazeMap.get(cellKey(nc, nr))![OPPOSITE[dir]] = true

      visited.add(cellKey(nc, nr))
      stack.push({ col: nc, row: nr })
    } else {
      stack.pop()
    }
  }

  return mazeMap
}
