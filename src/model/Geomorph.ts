export enum Edge {
  Closed = "closed",
  Open = "open",
  Connect = "connect"
}

export type Edges = {
  top: Edge,
  right: Edge,
  bottom: Edge,
  left: Edge
}

export type Geomorph = {
  type: string,
  src: string,
  edges: Edges
}

export type GridItem = {
	column: number,
	row: number,
	geomorph?: any,
	type?: string,
  edges: any
}