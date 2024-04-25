export enum Edge {
  Closed = "closed",
  Open = "open",
  Connect = "connect"
}

export enum GeomorphTag {
  Entrance = "entrance",
  Exit = "exit",
  Cave = "cave",
  Dungeon = "dungeon",
  Crypt = "crypt",
  Mine = "mine",
  Temple = "temple",
  Solid = "solid",
  Room = "room",
  Corridor = "corridor"
}

export type Edges = {
  top?: Edge,
  right?: Edge,
  bottom?: Edge,
  left?: Edge
}

export type Geomorph = {
  key: string,
  type?: GeomorphTag[],
  src: string,
  edges: Edges
}

export type GridItem = {
  key: string,
	column: number,
	row: number,
	geomorph?: any,
	type?: string,
  edges: any
}