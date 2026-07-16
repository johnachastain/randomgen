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

// Room profile (Idea 10): a derived, centralized semantic summary of a room, computed in a
// post-generation pass by scanning the room's footprint over the FINISHED grids. It's the single
// seed for context-aware naming (Step 3) / descriptions / prop placement. `type` is a FEATURE-BASED
// classification of what the map encodes today (geometry/water/pillars/elevation) — cave/temple/crypt
// await content generation (Idea 7), and `material` is masonry until then. Easily retuned.
export type WaterCondition = "dry" | "pool" | "partial" | "full"
export type RoomSize = "small" | "medium" | "large"
export type RoomProfile = {
  type: string             // rotunda | cistern | vault | hall | chamber | cell (feature-derived)
  material: "masonry" | "cave" // "cave" for organic cave rooms (Idea 7); masonry otherwise
  size: RoomSize
  water: WaterCondition
  pillared: boolean
  shape: RoomShape
  elevation: number        // room z (0 = base level)
  connectors: number       // doors + level-portals leading out of the room
  features: string[]       // any of: pillars, apse, alcove, circle, round-corners, stairs
}

// Public room bounding box + vertical level (z) + footprint shape. `cornerRadius` = the rounded/
// round corner size in cells (0 rect, 1 rounded, 2–4 circle: a 2r×2r circle). `roundCorners` =
// which corners are actually rounded (circle = all 4; rounded = the guarded subset). z starts 0.
// `profile` (Idea 10) is filled by a post-generation pass — always present on a generated result.
// A furnishing (Idea 14): a static room-child, placed on a floor cell, generated as a config-object
// (its `name` inherits the dungeon⊕floor⊕room mood). `typeId` → a registered furnishing type.
export type Furnishing = { id: string; typeId: string; name: string; c: number; r: number }

// An occupant (Idea 14): a monster or NPC room-child (movable in the future play layer). Generated as a
// config-object — `name` (mood-inherited) + `count` (group size). `typeId` → a registered occupant type.
export type Occupant = { id: string; typeId: string; category: "monster" | "npc"; name: string; count: number; c: number; r: number }

export type RoomInfo = { x: number; y: number; w: number; h: number; z: number; shape: RoomShape; cornerRadius: number; roundCorners: Corner[]; apses: Apse[]; alcoves: Alcove[]; num: number; name: string; profile?: RoomProfile; furnishings?: Furnishing[]; occupants?: Occupant[] }

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

// Alcove (E3d): an OUTWARD semicircular bay off a rect room's `wall`, drawn with dedicated half-circle
// tiles (not composed from quarter-corner tiles). `center` = the alcove's centre cell column (n/s) or
// row (e/w). Two sizes: "lg" ≈ 3 wide × 1½ deep (radius 1.5, carves a 3×1 floor extension); "sm" ≈
// 1 wide × ½ deep (radius 0.5, sub-cell decorative nub, no cell carved). Positioning mirrors apses
// (lg like the bay, sm like the bump).
export type Alcove = { wall: Edge; center: number; size: "sm" | "lg" }

// Idea 12: non-room map elements get their own derived profiles, mirroring RoomProfile — a semantic
// summary of each hall/connector/stair/portal, derived in the same post-generation pass by reading the
// finished graph the generator would otherwise discard. Additive overlay: the grids/portals[] stay the
// render source; `elements` is the object-model view. Room identity in connects/joins is the public
// room NUMBER (1-based, matching roomObject's `room-${num}`); a non-room endpoint is -1.
export type HallProfile      = { connects: [number, number]; length: number; water: boolean; levelChange: number; type: string } // passage | gallery | flooded-channel
export type StairProfile     = { connects: [number, number]; steps: number; levelDelta: number; direction: Edge; type: string }   // stair | flight
export type ConnectorProfile = { joins: [number, number]; orientation: "v" | "h"; style: string }                                  // style: "door" (portcullis/archway = Idea 9a)
export type PortalProfile    = { portalKind: PortalKind; side: Edge; direction: "up-out" | "down-deeper" }

// `num` = per-kind 1-based index (like RoomInfo.num); `name` = generated via core/naming (elementName).
type ElementBase = { id: string; num: number; name: string }
export type MapElement =
  | (ElementBase & { kind: "hall";      cells: [number, number][]; profile: HallProfile })
  | (ElementBase & { kind: "stair";     cells: [number, number][]; profile: StairProfile })
  | (ElementBase & { kind: "connector"; c: number; r: number;      profile: ConnectorProfile })
  | (ElementBase & { kind: "portal";    c: number; r: number;      profile: PortalProfile })

export type DungeonResult = { grid: MaterialGrid; pillars: PillarGrid; rooms: RoomInfo[]; stairs: StairGrid; levels: LevelGrid; portals: Portal[]; edges: EdgeGrids; elements: MapElement[]; name: string; type: string; seed: number }

// Idea 13 — multi-level dungeon. A Floor is one map (its own name/type/seed) plus its 1-based depth
// number; a DungeonComplex is the root (its own name/type) holding the descending stack of floors.
// (Distinct from `levels` = per-cell elevation/z WITHIN a map.)
export type Floor = DungeonResult & { number: number }
export type DungeonComplex = { seed: number; name: string; type: string; floors: Floor[] }

export type Dims = { cols: number; rows: number }
