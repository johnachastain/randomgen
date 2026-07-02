import { Edge, Edges } from "../geomorph/Geomorph"
import { getGeomorphsByEdges } from "../geomorph/geomorphs"
import { bspRooms } from "./bsp"
import { Cell, Connects, Grid } from "./types"

const SOLID_SRC = "/png/37.png"

function cellKey(col: number, row: number): string {
  return `${col},${row}`
}

function connectsToEdges(connects: Connects): Edges {
  return {
    top:    connects.top    ? Edge.Connect : Edge.Closed,
    right:  connects.right  ? Edge.Connect : Edge.Closed,
    bottom: connects.bottom ? Edge.Connect : Edge.Closed,
    left:   connects.left   ? Edge.Connect : Edge.Closed,
  }
}

export function pickTileImage(connects: Connects): string {
  const edges = connectsToEdges(connects)
  const matches = getGeomorphsByEdges(edges)
  if (matches.length === 0) return SOLID_SRC
  return matches[Math.floor(Math.random() * matches.length)].src
}

export function buildGrid(visited: Set<string>, cols: number, rows: number): Grid {
  const grid: Grid = []

  for (let row = 0; row < rows; row++) {
    const rowCells: Cell[] = []

    for (let col = 0; col < cols; col++) {
      const isPath = visited.has(cellKey(col, row))

      if (isPath) {
        const connects: Connects = {
          top:    visited.has(cellKey(col, row - 1)),
          right:  visited.has(cellKey(col + 1, row)),
          bottom: visited.has(cellKey(col, row + 1)),
          left:   visited.has(cellKey(col - 1, row)),
        }
        rowCells.push({ col, row, isPath: true, connects, src: pickTileImage(connects) })
      } else {
        const connects: Connects = { top: false, right: false, bottom: false, left: false }
        rowCells.push({ col, row, isPath: false, connects, src: SOLID_SRC })
      }
    }

    grid.push(rowCells)
  }

  return grid
}

export function generateGrid(cols: number, rows: number): Grid {
  const visited = bspRooms(cols, rows)
  return buildGrid(visited, cols, rows)
}
