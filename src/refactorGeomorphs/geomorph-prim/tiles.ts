import { Edge, Edges } from "../geomorph/Geomorph"
import { getGeomorphsByEdges } from "../geomorph/geomorphs"
import { primsAlgorithm } from "./prim"
import { Cell, Connects, Grid } from "./types"

const SOLID_SRC = "./png/37.png"

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

export function buildGrid(mazeMap: Map<string, Connects>, cols: number, rows: number): Grid {
  const grid: Grid = []

  for (let row = 0; row < rows; row++) {
    const rowCells: Cell[] = []
    for (let col = 0; col < cols; col++) {
      const connects = mazeMap.get(`${col},${row}`) ?? { top: false, right: false, bottom: false, left: false }
      rowCells.push({ col, row, isPath: true, connects, src: pickTileImage(connects) })
    }
    grid.push(rowCells)
  }

  return grid
}

export function generateGrid(cols: number, rows: number): Grid {
  const mazeMap = primsAlgorithm(cols, rows)
  return buildGrid(mazeMap, cols, rows)
}
