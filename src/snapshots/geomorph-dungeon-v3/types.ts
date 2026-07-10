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

// Room footprint shape (all fit WITHIN the {x,y,w,h} bounding box). `rect` = full box;
// `rounded` = rect with rounded (quarter-circle) corners; `circle` = true inscribed circle
// (box is square). (Half-circle bays = the future "apses" feature, not a base room shape.)
export type RoomShape = "rect" | "rounded" | "circle"

// Public room bounding box + vertical level (z) + footprint shape. `cornerRadius` = the rounded/
// round corner size in cells (0 rect, 1 rounded, 2–4 circle: a 2r×2r circle). `roundCorners` =
// which corners are actually rounded (circle = all 4; rounded = the guarded subset). z starts 0.
export type RoomInfo = { x: number; y: number; w: number; h: number; z: number; shape: RoomShape; cornerRadius: number; roundCorners: Corner[]; apses: Apse[] }

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

// Edge-features layer: what sits on each boundary BETWEEN two base cells (not a whole cell).
// `EDGE.door` = a doorway (a gap/door leaf, passable); `EDGE.wall` = a thin wall (impassable,
// lets rooms sit flush) [Phase B]; `EDGE.open` = nothing. Two grids, each edge stored once:
//   v[r][c] = the VERTICAL edge on the WEST side of cell (c,r), i.e. between (c-1,r) and (c,r);  rows × (cols+1)
//   h[r][c] = the HORIZONTAL edge on the NORTH side of cell (c,r), i.e. between (c,r-1) and (c,r); (rows+1) × cols
export const EDGE = { open: 0, wall: 1, door: 2 } as const
export type EdgeKind = 0 | 1 | 2
export type EdgeGrids = { v: EdgeKind[][]; h: EdgeKind[][] }

// Rounded/round-corner orientation (E3c) — which OUTER corner of the room is rounded off (the
// wall "bite"). Rendered with a quarter-disc bite overlay + arc trim at the room's corner block.
export type Corner = "nw" | "ne" | "sw" | "se"

// Apse (E3b): a semicircular OPEN bay bulging out from a rect room's `wall`, centred at `center`
// (the col for n/s walls, the row for e/w) and `radius` cells deep. Its floor is part of the room
// (carved + stamped roomAt); its two FAR corners render with the round-corner bite+arc tiles.
// `variant`: "bay" = radius-2 (may host a centre connector); "bump" = tiny radius-1 (scalloped).
export type Apse = { wall: Edge; center: number; radius: number; variant: "bay" | "bump" }

export type DungeonResult = { grid: MaterialGrid; pillars: PillarGrid; rooms: RoomInfo[]; stairs: StairGrid; levels: LevelGrid; portals: Portal[]; edges: EdgeGrids }

export type Dims = { cols: number; rows: number }
