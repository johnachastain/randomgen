import { GridItem, Edges, Geomorph } from "./Geomorph";
import { geomorphs } from './geomorphConfig'

const getRandom = (n: number): number => Math.floor(Math.random() * n);

export const getRowCol = (
  cols: number, col: number, row: number, idx: number
): number[] => {
  return idx % cols === 1 ? [row++, 1] : [row, col++]
}
export interface Neighbors {
  above?: GridItem,
  prev?: GridItem,
  below?: GridItem,
  next?: GridItem,
}

export type Neighbor = GridItem | undefined

type GetNeighbors = {
  (
    array: GridItem[],
    column: number,
    row: number
  ): Neighbors
}

export const getNeighbors: GetNeighbors = (array, column, row) => {
  const above: Neighbor = array.find(
    (i) => i.row === row - 1 && i.column === column)
  const prev: Neighbor = array.find(
    (i) => i.column === column - 1 && i.row === row)
  const below: Neighbor = array.find(
    (i) => i.row === row + 1 && i.column === column)
  const next: Neighbor = array.find(
    (i) => i.column === column + 1 && i.row === row)
  return { above, prev, below, next }
}

export const getGeomorphsByEdges = (edges: Edges): Geomorph[] => {
  return geomorphs.filter((g: Geomorph) => {
    const t = edges.top ? g.edges.top === edges.top : true
    const r = edges.right ? g.edges.right === edges.right : true
    const b = edges.bottom ? g.edges.bottom === edges.bottom : true
    const l = edges.left ? g.edges.left === edges.left : true
    return t && r && b && l
  })
}
type GetNewEdges = {
  (
    array: GridItem[],
    column: number,
    row: number,
    columns: number,
    rows: number
  ): Edges
}

export const getNewEdges: GetNewEdges = (
  array,
  column,
  row,
  columns,
  rows
) => {
  const { above, prev, below, next } = getNeighbors(array, column, row)

  const top = row === 1 ? "closed" : above?.edges.bottom
  const right = column === columns ? "closed" : next?.edges.left
  const bottom = row === rows ? "closed" : below?.edges.top
  const left = column === 1 ? "closed" : prev?.edges.right

  return { top, right, bottom, left }
}

export const getEdgesForNeighbor = (
  neighbor: GridItem, centerItem: GridItem
): Edges | undefined => {
  const { column, row, edges } = neighbor
  const { column: cCol, row: cRow, edges: cEdges } = centerItem

  const nIsAbove = column === cCol && cRow > row
  const nIsBelow = column === cCol && cRow < row
  const nIsNext = row === cRow && column > cCol
  const nIsPrev = row === cRow && column < cCol

  if (nIsAbove) {
    return { ...edges, bottom: cEdges.top }
  }
  if (nIsBelow) {
    return { ...edges, top: cEdges.bottom }
  }
  if (nIsNext) {
    return { ...edges, left: cEdges.right }
  }
  if (nIsPrev) {
    return { ...edges, right: cEdges.left }
  }
}

type UpdateSelf = {
  (
    grid: GridItem[],
    target: GridItem,
    columns: number,
    rows: number,
    edges: Edges
  ): GridItem[]
}

export const updateSelf: UpdateSelf = (
  grid, target, columns, rows, edges
): GridItem[] => {
  const updateSelf = setGridItem(grid, target.column, target.row, columns, rows, edges)
  let updateGrid = setItemInGrid(grid, updateSelf)
  updateGrid = updateNeighbors(updateGrid, updateSelf, columns, rows)

  return updateGrid
}

type updateNeighbors = {
  (
    grid: GridItem[],
    targetItem: GridItem,
    columns: number,
    rows: number
  ): GridItem[]
}

export const updateNeighbors: updateNeighbors = (
  grid, targetItem, columns, rows
) => {
  const neighbors = getNeighbors(grid, targetItem.column, targetItem.row)
  let updatedGrid = [...grid]
  let key: keyof Neighbors;
  for (key in neighbors) {
    const neighbor = neighbors[key]
    if (neighbor) {
      const newEdges = getEdgesForNeighbor(neighbor, targetItem)
      const updates = setGridItem(grid, neighbor.column, neighbor.row, columns, rows, newEdges)
      updatedGrid = setItemInGrid(updatedGrid, updates)
    }
  }
  return updatedGrid
}

type GetNewGridItem = {
  (
    column: number,
    row: number,
    edges: Edges
  ): GridItem
}

export const getNewGridItem: GetNewGridItem = (column, row, edges) => {
  const available = getGeomorphsByEdges(edges)
  const geomorph = available[getRandom(available.length - 1)]

  return {
    key: `column${column}row${row}`,
    column,
    row,
    edges: geomorph.edges,
    geomorph
  }
}

type SetGridItem = {
  (
    grid: GridItem[],
    column: number,
    row: number,
    columns: number,
    rows: number,
    edges?: Edges
  ): GridItem
}

export const setGridItem: SetGridItem = (
  grid,
  column,
  row,
  columns,
  rows,
  edges
) => {
  const itmEdges = edges ? edges : getNewEdges(grid, column, row, columns, rows)
  return getNewGridItem(column, row, itmEdges)
}

type SetItemInGrid = {
  (
    grid: GridItem[],
    gridItem: GridItem
  ): GridItem[]
}

export const setItemInGrid: SetItemInGrid = (grid, gridItem) => {
  const result = grid.map((g) => {
    if (g.row === gridItem.row && g.column === gridItem.column) {
      return gridItem
    }
    return g
  })
  return result
}

type GetNewGrid = {
  (
    columns: number,
    rows: number
  ): GridItem[]
}

export const getNewGrid: GetNewGrid = (columns, rows) => {
  const maxNum = columns * rows
  let row = 0
  let column = 0
  let grid: GridItem[] = []

  for (let i = 1; i <= maxNum; i++) {
    // const [ r, c ] = getRowCol(columns, column, row, i) // broken
    const modulo = i % columns
    if (modulo === 1) {
      row++
      column = 1
    } else {
      column++
    }

    grid = [...grid, setGridItem(grid, column, row, columns, rows)]
  }
  return grid
}

