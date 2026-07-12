export type Direction = "top" | "right" | "bottom" | "left"

export type Connects = Record<Direction, boolean>

export type Cell = {
  col: number
  row: number
  isPath: boolean
  connects: Connects
  src: string
}

export type Grid = Cell[][]
