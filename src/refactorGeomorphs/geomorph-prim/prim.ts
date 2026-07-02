import { Direction } from "./types"

type Connects = Record<Direction, boolean>

type Offset = { dir: Direction; dc: number; dr: number }

const OFFSETS: Offset[] = [
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

function emptyConnects(): Connects {
  return { top: false, right: false, bottom: false, left: false }
}

function inBounds(col: number, row: number, cols: number, rows: number): boolean {
  return col >= 0 && col < cols && row >= 0 && row < rows
}

export function primsAlgorithm(cols: number, rows: number): Map<string, Connects> {
  const maze = new Map<string, Connects>()
  const frontier = new Set<string>()

  // seed every cell with empty connects
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      maze.set(cellKey(c, r), emptyConnects())
    }
  }

  const inMaze = new Set<string>()

  const addToFrontier = (col: number, row: number) => {
    const key = cellKey(col, row)
    if (!inMaze.has(key)) frontier.add(key)
  }

  // random start cell
  const startCol = Math.floor(Math.random() * cols)
  const startRow = Math.floor(Math.random() * rows)
  inMaze.add(cellKey(startCol, startRow))
  for (const { dc, dr } of OFFSETS) {
    const nc = startCol + dc
    const nr = startRow + dr
    if (inBounds(nc, nr, cols, rows)) addToFrontier(nc, nr)
  }

  while (frontier.size > 0) {
    // pick random frontier cell
    const keys = Array.from(frontier)
    const key = keys[Math.floor(Math.random() * keys.length)]
    frontier.delete(key)

    const [col, row] = key.split(",").map(Number)

    // find maze neighbors, pick one at random to carve through
    const mazeNeighbors: Offset[] = []
    for (const offset of OFFSETS) {
      const nc = col + offset.dc
      const nr = row + offset.dr
      if (inBounds(nc, nr, cols, rows) && inMaze.has(cellKey(nc, nr))) {
        mazeNeighbors.push(offset)
      }
    }

    if (mazeNeighbors.length > 0) {
      const { dir, dc, dr } = mazeNeighbors[Math.floor(Math.random() * mazeNeighbors.length)]
      const nc = col + dc
      const nr = row + dr

      // carve passage bidirectionally
      const cellConnects = maze.get(key)!
      cellConnects[dir] = true

      const neighborConnects = maze.get(cellKey(nc, nr))!
      neighborConnects[OPPOSITE[dir]] = true
    }

    inMaze.add(key)

    // add unvisited neighbors to frontier
    for (const { dc, dr } of OFFSETS) {
      const nc = col + dc
      const nr = row + dr
      if (inBounds(nc, nr, cols, rows)) addToFrontier(nc, nr)
    }
  }

  return maze
}
