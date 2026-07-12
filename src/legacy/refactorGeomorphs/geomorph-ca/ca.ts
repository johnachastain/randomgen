function cellKey(col: number, row: number): string {
  return `${col},${row}`
}

function countOpenNeighbors(grid: boolean[][], col: number, row: number, cols: number, rows: number): number {
  let count = 0
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = row + dr
      const nc = col + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
        // out-of-bounds counts as wall (closed)
        continue
      }
      if (grid[nr][nc]) count++
    }
  }
  return count
}

export function cellularAutomata(
  cols: number,
  rows: number,
  fillRatio = 0.45,
  iterations = 4,
  threshold = 5,
): Set<string> {
  // seed
  let current: boolean[][] = []
  for (let row = 0; row < rows; row++) {
    current.push([])
    for (let col = 0; col < cols; col++) {
      current[row].push(Math.random() < fillRatio)
    }
  }

  // smooth
  for (let i = 0; i < iterations; i++) {
    const next: boolean[][] = []
    for (let row = 0; row < rows; row++) {
      next.push([])
      for (let col = 0; col < cols; col++) {
        const open = countOpenNeighbors(current, col, row, cols, rows)
        next[row].push(open >= threshold)
      }
    }
    current = next
  }

  const visited = new Set<string>()
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (current[row][col]) visited.add(cellKey(col, row))
    }
  }
  return visited
}
