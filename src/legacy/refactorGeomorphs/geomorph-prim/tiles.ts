import { Edge, Edges } from "../geomorph/Geomorph"
import { getGeomorphsByEdges } from "../geomorph/geomorphs"
import { primsAlgorithm } from "./prim"
import { Cell, Direction, Grid } from "./types"

const SOLID_SRC = "/png/37.png"

type MazeTopology = Record<Direction, boolean>

function allClosed(): Record<Direction, Edge> {
  return { top: Edge.Closed, right: Edge.Closed, bottom: Edge.Closed, left: Edge.Closed }
}

export function pickTileImage(edges: Record<Direction, Edge>): string {
  const matches = getGeomorphsByEdges(edges)
  if (matches.length === 0) return SOLID_SRC
  return matches[Math.floor(Math.random() * matches.length)].src
}

export function buildGrid(mazeMap: Map<string, MazeTopology>, cols: number, rows: number): Grid {
  const placed: (Cell | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null))

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const topology = mazeMap.get(`${col},${row}`) ?? { top: false, right: false, bottom: false, left: false }

      const constraints: Edges = {}
      if (!topology.top)    constraints.top    = Edge.Closed
      if (!topology.right)  constraints.right  = Edge.Closed
      if (!topology.bottom) constraints.bottom = Edge.Closed
      if (!topology.left)   constraints.left   = Edge.Closed

      if (topology.top  && placed[row - 1]?.[col]) constraints.top  = placed[row - 1][col]!.edges.bottom
      if (topology.left && placed[row]?.[col - 1]) constraints.left = placed[row][col - 1]!.edges.right

      const keepOpen = (g: { edges: Edges }) =>
        (!topology.top    || g.edges.top    !== Edge.Closed) &&
        (!topology.right  || g.edges.right  !== Edge.Closed) &&
        (!topology.bottom || g.edges.bottom !== Edge.Closed) &&
        (!topology.left   || g.edges.left   !== Edge.Closed)

      let matches = getGeomorphsByEdges(constraints).filter(keepOpen)

      if (matches.length === 0) {
        const relaxed: Edges = {}
        if (!topology.top)    relaxed.top    = Edge.Closed
        if (!topology.right)  relaxed.right  = Edge.Closed
        if (!topology.bottom) relaxed.bottom = Edge.Closed
        if (!topology.left)   relaxed.left   = Edge.Closed
        matches = getGeomorphsByEdges(relaxed).filter(keepOpen)
      }

      const tile = matches.length > 0
        ? matches[Math.floor(Math.random() * matches.length)]
        : { edges: allClosed(), src: SOLID_SRC }

      placed[row][col] = {
        col, row, isPath: true,
        edges: tile.edges as Record<Direction, Edge>,
        src: tile.src,
      }
    }
  }

  return placed as Grid
}

export function generateGrid(cols: number, rows: number): Grid {
  const mazeMap = primsAlgorithm(cols, rows)
  return buildGrid(mazeMap, cols, rows)
}
