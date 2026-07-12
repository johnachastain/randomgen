import { Edge } from "../geomorph/Geomorph"

export type Direction = "top" | "right" | "bottom" | "left"

export type Cell = {
  col: number
  row: number
  isPath: boolean
  edges: Record<Direction, Edge>
  src: string
}

export type Grid = Cell[][]
