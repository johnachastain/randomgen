// caves-1 types — the cave subset of the bitmask dungeon's vocabulary (see plans/cave-prototypes.md).
// Deliberately forked, not shared: prototypes must be free to diverge, and the shape a cave actually
// needs isn't known until the track picks a final candidate. See architecture.md §1.

// Base layer: a grid of materials.
// Values are kept ALIGNED with the dungeon's Material enum (Floor 0 / Wall 1 / Water 2 / Stairs 4 —
// note the gap where Door 3 was) so exported JSON stays comparable across prototypes and against the
// dungeon. Caves generate no doors, so Door has no member here.
// Water has no producer yet either — underground rivers are a planned prototype axis — but it stays
// in the vocabulary because RoomProfile already models water conditions. The legend only lists what
// this prototype actually generates.
export enum Material {
  Floor = 0,
  Wall = 1,
  Water = 2,
  Stairs = 4,
}

export type MaterialGrid = Material[][] // [row][col]

// A cardinal direction — reused for stair ascent and the pocket-dome open side.
export type Edge = "n" | "s" | "e" | "w"

// Room profile: a derived semantic summary of a chamber, the seed for naming + descriptions.
// Trimmed from the dungeon's: no `pillared`/`shape`/`elevation`/`connectors`, all of which were
// constant (false/"rect"/0/0) for every cave room — a field that can only hold one value is noise in
// the UI and a lie in the object model. `material` stays because a prototype could pick "hewn" over
// "cave"; `features` stays because a prototype could tag pockets/bays.
export type WaterCondition = "dry" | "pool" | "partial" | "full"
export type RoomSize = "small" | "medium" | "large"
export type RoomProfile = {
  type: string                 // cavern (feature-derived; richer classification is a prototype axis)
  material: "cave" | "hewn"
  size: RoomSize
  water: WaterCondition
  features: string[]
}

// A chamber: its bounding box + generated identity. Caves have no room SHAPE — a chamber is an
// organic blob, and {x,y,w,h} is only its bbox (used to place the number pill + centre the view),
// NOT its footprint. Footprint membership lives in the grid, which is the whole point of the fork:
// the dungeon's shape/cornerRadius/roundCorners/apses/alcoves have no meaning here.
export type RoomInfo = { x: number; y: number; w: number; h: number; num: number; name: string; profile?: RoomProfile }

// Per-cell stair ascent direction (the "up" side), or null where the cell is not a staircase.
// In a cave the only stair cells are portal stairwells.
export type StairGrid = (Edge | null)[][]

// Per-cell elevation level (null = wall). Flat (all 0) in this prototype.
export type LevelGrid = (number | null)[][]

// Level portals: a stairwell whose far end leaves the cave. `entrance` = stairs up/out; `exit` =
// stairs down/deeper. `(c,r)` = the terminal cell (the flight itself is Material.Stairs cells).
export type PortalKind = "entrance" | "exit"
export type Portal = { c: number; r: number; kind: PortalKind }

// One generated cave map. Note what ISN'T here versus the dungeon's DungeonResult: no `edges`
// (no doors), no `pillars`, no `elements`. The old code built those grids empty just to satisfy the
// dungeon's type; stating the invariant in the type is better than asserting it in a test.
export type CaveResult = {
  grid: MaterialGrid
  rooms: RoomInfo[]
  stairs: StairGrid
  levels: LevelGrid
  portals: Portal[]
  name: string
  type: string
  seed: number
}
