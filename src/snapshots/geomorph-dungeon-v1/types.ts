// Two-layer dungeon geomorph.
// Base layer: a grid of materials (was boolean floor/wall).
export enum Material {
  Floor = 0,
  Wall = 1,
  Water = 2,
  Door = 3,
  Stairs = 4,
}

export type MaterialGrid = Material[][] // [row][col]

// A cardinal direction — reused for door threshold sides and stair ascent.
export type Edge = "n" | "s" | "e" | "w"

// Pillars sit on base-grid VERTICES (not cells): (rows+1)×(cols+1), indexed [vj][vi].
export type PillarGrid = boolean[][]

// Public room rect + its vertical level (z). All rooms are z=0 until stairs raise/lower them.
export type RoomInfo = { x: number; y: number; w: number; h: number; z: number }

// Per-cell stair ascent direction (the "up" side, toward the higher room), or null
// where the cell is not a staircase. Parallel [row][col] grid, like PillarGrid.
export type StairGrid = (Edge | null)[][]

// Per-cell elevation level (null = wall). Consistent over the real geometry: every
// path between two points changes level by the same net amount (see dungeon.ts Pass B).
export type LevelGrid = (number | null)[][]

// Level portals: a perimeter stairwell whose far end leaves the level. `entrance` = stairs
// up/out (from the level above); `exit` = stairs down/out (deeper). `(c,r)` = the terminal
// cell at the map edge (the flight itself is Material.Stairs cells).
export type PortalKind = "entrance" | "exit"
export type Portal = { c: number; r: number; kind: PortalKind }

export type DungeonResult = { grid: MaterialGrid; pillars: PillarGrid; rooms: RoomInfo[]; stairs: StairGrid; levels: LevelGrid; portals: Portal[] }

export type Dims = { cols: number; rows: number }
