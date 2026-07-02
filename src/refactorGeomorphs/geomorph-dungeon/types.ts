// Two-layer dungeon geomorph.
// Base layer: a grid of materials (was boolean floor/wall).
export enum Material {
  Floor = 0,
  Wall = 1,
  Water = 2,
  Door = 3,
}

export type MaterialGrid = Material[][] // [row][col]

// Pillars sit on base-grid VERTICES (not cells): (rows+1)×(cols+1), indexed [vj][vi].
export type PillarGrid = boolean[][]

export type DungeonResult = { grid: MaterialGrid; pillars: PillarGrid }

export type Dims = { cols: number; rows: number }
