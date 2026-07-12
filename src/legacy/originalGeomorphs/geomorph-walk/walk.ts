const DIRECTIONS = [
  { dc: 0, dr: -1 },  // up
  { dc: 1, dr: 0 },   // right
  { dc: 0, dr: 1 },   // down
  { dc: -1, dr: 0 },  // left
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomOuterCell(cols: number, rows: number): { col: number; row: number } {
  const edge = Math.floor(Math.random() * 4)
  switch (edge) {
    case 0: return { col: Math.floor(Math.random() * cols), row: 0 }           // top edge
    case 1: return { col: cols - 1, row: Math.floor(Math.random() * rows) }    // right edge
    case 2: return { col: Math.floor(Math.random() * cols), row: rows - 1 }    // bottom edge
    default: return { col: 0, row: Math.floor(Math.random() * rows) }          // left edge
  }
}

export function drunkenWalk(cols: number, rows: number, steps?: number): Set<string> {
  const totalSteps = steps ?? cols * rows * 3
  let { col, row } = randomOuterCell(cols, rows)
  const visited = new Set<string>([`${col},${row}`])

  for (let i = 0; i < totalSteps; i++) {
    const { dc, dr } = pickRandom(DIRECTIONS)
    const nextCol = col + dc
    const nextRow = row + dr
    if (nextCol >= 0 && nextCol < cols && nextRow >= 0 && nextRow < rows) {
      col = nextCol
      row = nextRow
      visited.add(`${col},${row}`)
    }
  }

  return visited
}
