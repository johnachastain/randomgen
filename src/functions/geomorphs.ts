import { GridItem, Edge, Edges, Geomorph } from "../model/Geomorph";
import { geomorphs } from '../lists/geomorphConfig'

const  getRandom = (n: number):number =>  Math.floor(Math.random()*n);

export const getRowCol = (
  cols: number, col: number, row: number, idx: number
):number[] => {
  return idx % cols === 1 ? [row++, 1] : [row, col++]
}

export interface Neighbors {
  above?: GridItem,
  prev?: GridItem,
  below?: GridItem,
  next?: GridItem,
}

export const getNeighbors = (
  array: GridItem[], column: number, row: number
): Neighbors => {
  const above: GridItem | undefined = array.find(
    (i: any) =>  i.row === row - 1 && i.column === column) 
  const prev: GridItem | undefined = array.find(
    (i: any) =>  i.column === column - 1 && i.row === row)
  const below: GridItem | undefined = array.find(
    (i: any) =>  i.row === row + 1 && i.column === column)
  const next: GridItem | undefined = array.find(
    (i: any) =>  i.column === column + 1 && i.row === row)
  return { above, prev, below, next }
}

// export const getEdges = (
//   array: GridItem[], column: number, row: number, columns: number, rows: number
// ) => { 
//   const { above, prev } =  getNeighbors(array, column, row)

//   const top = row === 1 ? "closed" : above?.geomorph.edges?.bottom
//   const right = column === columns ? "closed" : undefined
//   const bottom = row === rows ? "closed" : undefined
//   const left = column === 1 ? "closed" : prev?.geomorph.edges?.right

//   return { top, right, bottom, left }
// }

export const getGeomorphsByEdges = (edges:any) => {
   return geomorphs.filter((g: any) => {
    const t = edges.top ? g.edges.top === edges.top : true
    const r = edges.right ? g.edges.right === edges.right : true
    const b = edges.bottom ? g.edges.bottom === edges.bottom : true
    const l = edges.left ? g.edges.left === edges.left : true
    return t && r && b && l
  })
}

// export const getGridItem = (column: number, row: number, edges: any): GridItem => {
//   const available = getGeomorphsByEdges(edges)
//   const geomorph = available[ getRandom(available.length -1) ]

//   console.log('available.length', available.length)
//   console.log('geomorph', geomorph)

//   return { 
//     key: `column${column}row${row}`,
//     column, 
// 		row,  
//     edges: geomorph.edges,
//     geomorph
//   }
  
// }

// export const getGrid = (columns: number, rows: number): GridItem[] => {
// 	const maxNum = columns * rows
// 	let row = 0
// 	let column = 0
// 	let grid: GridItem[] = []
// 	for (let i=1; i<= maxNum; i++) {
// 		const modulo = i % columns
// 		if (modulo === 1) {
// 			row++
// 			column = 1
// 		} else {
// 			column++
// 		}
// 		const edges = getEdges(grid, column, row, columns, rows )
// 		let item: GridItem = getGridItem(column, row, edges)

// 		grid = [ ...grid, item]
// 	}
// 	return grid
// }

export const getNewEdges = (
  array: GridItem[], column: number, row: number, columns: number, rows: number
) => { 
  const { above, prev, below, next } =  getNeighbors(array, column, row)

  const top = row === 1 ? "closed" : above?.edges.bottom
  const right = column === columns ? "closed" : next?.edges.left
  const bottom = row === rows ? "closed" : below?.edges.top
  const left = column === 1 ? "closed" : prev?.edges.right

  return { top, right, bottom, left }
}

export const getEdgesByNeighbor = (
  targetItem: GridItem, neighbor: GridItem
) => { 
  const { column, row, edges } = targetItem
  const { column: nCol, row: nRow, edges: nEdges } = neighbor

  const isAbove = column === nCol && nRow < row
  const isBelow = column === nCol && nRow > row
  const isNext = row === nRow && column < nCol
  const isPrev = row === nRow && column > nCol

  if (isAbove) {
    return { ...edges, top: nEdges.bottom }
  }
  if (isBelow) {
    return { ...edges, bottom: nEdges.top }
  }
  if (isNext) {
    return { ...edges, right: nEdges.left }
  }
  if (isPrev) {
    return { ...edges, left: nEdges.right }
  }
}
export const updateSelf = (
  grid: GridItem[], target: GridItem, columns: number, rows: number, edges: Edges
) => {
  const updates = setGridItem(grid, target.column, target.row, columns, rows, edges)
  return setItemInGrid(grid, updates)
}

export const updateNeighbors = (
  grid: GridItem[], targetItem: GridItem, columns: number, rows: number
) => {
  const neighbors = getNeighbors(grid, targetItem.column, targetItem.row)
  let updatedGrid = { ...grid }
  let key: keyof Neighbors;
  for (key in neighbors) {
    const neighbor = neighbors[key]
    if (neighbor){
      const newEdges = getEdgesByNeighbor(neighbor, targetItem)
      const updates = setGridItem(grid, neighbor.column, neighbor.row, columns, rows, newEdges)
      updatedGrid = setItemInGrid(grid, updates)
      
    }
  }
  return updatedGrid
}




export const getNewGridItem = (column: number, row: number, edges: any): GridItem => {
  const available = getGeomorphsByEdges(edges)
  const geomorph = available[ getRandom(available.length -1) ]

  // console.log('available.length', available.length)
  // console.log('geomorph', geomorph)

  return { 
    key: `column${column}row${row}`,
    column, 
		row,  
    edges: geomorph.edges,
    geomorph
  } 
}

export const setGridItem = (
  grid: GridItem[], column: number, row: number, columns: number, rows: number, edges?: any
): GridItem => {
  const itmEdges = edges? edges : getNewEdges(grid, column, row, columns, rows )
	return getNewGridItem(column, row, itmEdges)
}

export const setItemInGrid =(grid: GridItem[], gridItem: GridItem) => {
  const result = grid.map((g) => {
    if (g.row === gridItem.row && g.column === gridItem.column) {
      return gridItem
    }
    return g
  })
  return result
}

export const getNewGrid = (columns: number, rows: number): GridItem[] => {
	const maxNum = columns * rows
	let row = 0
	let column = 0
	let grid: GridItem[] = []

	for (let i=1; i<= maxNum; i++) {
    // const [ r, c ] = getRowCol(columns, column, row, i) // broken
    const modulo = i % columns
		if (modulo === 1) {
			row++
			column = 1
		} else {
			column++
		}

		grid = [ ...grid, setGridItem(grid, column, row, columns, rows)]
	}
	return grid
}

