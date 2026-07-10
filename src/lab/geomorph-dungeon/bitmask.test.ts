import { describe, it, expect } from "vitest"
import { trimIndexFor, fineMaterial, SUB } from "./bitmask"
import { Material } from "./types"
import type { MaterialGrid } from "./types"

// Deterministic unit tests for the fine-grid trim autotile (no RNG). Orthogonal wall sides
// N=1 E=2 S=4 W=8 (summed 1..15); diagonal-only outer corners NE=16 SE=17 SW=18 NW=19.

const W = Material.Wall, F = Material.Floor
const floorHost = (m: Material) => m === F

// Fine coords (fc,fr) for the top-left / a given corner of base cell (c,r) at SUB resolution.
const cell = (c: number, r: number, dxFine = 0, dyFine = 0): [number, number] => [c * SUB + dxFine, r * SUB + dyFine]

describe("trimIndexFor orthogonal edges", () => {
  // 3x3 grid, centre cell (1,1) is Floor. Walls placed around it drive the index.
  const grid = (walls: [number, number][]): MaterialGrid => {
    const g: MaterialGrid = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => F))
    for (const [c, r] of walls) g[r][c] = W
    return g
  }

  it("wall to the north → index 1 on the cell's top edge fine-cell", () => {
    const g = grid([[1, 0]])
    const [fc, fr] = cell(1, 1, 1, 0) // top fine row of centre cell
    expect(trimIndexFor(g, fc, fr, 3, 3, W, true, floorHost)).toBe(1)
  })

  it("walls north + west → inner corner index 9 (1|8)", () => {
    const g = grid([[1, 0], [0, 1]])
    const [fc, fr] = cell(1, 1, 0, 0) // top-left fine-cell of centre
    expect(trimIndexFor(g, fc, fr, 3, 3, W, true, floorHost)).toBe(9)
  })

  it("no wall anywhere → -1 (no trim)", () => {
    const g = grid([])
    const [fc, fr] = cell(1, 1, 1, 1)
    expect(trimIndexFor(g, fc, fr, 3, 3, W, true, floorHost)).toBe(-1)
  })
})

describe("trimIndexFor convex corners (16-19)", () => {
  it("wall only at the NE diagonal → index 16 on the top-right fine-cell", () => {
    const g: MaterialGrid = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => F))
    g[0][2] = W // base cell (2,0) = NE diagonal of centre (1,1)
    const [fc, fr] = cell(1, 1, SUB - 1, 0) // top-right fine-cell of centre
    expect(trimIndexFor(g, fc, fr, 3, 3, W, true, floorHost)).toBe(16)
  })
})

describe("trimIndexFor host + out-of-bounds", () => {
  const allFloor: MaterialGrid = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => F))

  it("returns -1 when the fine cell isn't a host cell", () => {
    const g: MaterialGrid = allFloor.map(row => row.slice())
    g[1][1] = W // centre now a wall → not a floor host
    const [fc, fr] = cell(1, 1, 1, 1)
    expect(trimIndexFor(g, fc, fr, 3, 3, W, true, floorHost)).toBe(-1)
  })

  it("oobIsTarget=true treats the map edge as wall (enclosed) → lip on the border", () => {
    const [fc, fr] = cell(1, 0, 1, 0) // top edge of the whole grid, middle column
    expect(trimIndexFor(allFloor, fc, fr, 3, 3, W, true, floorHost)).toBe(1)
  })

  it("oobIsTarget=false does not trim against the map edge", () => {
    const [fc, fr] = cell(1, 0, 1, 0)
    expect(trimIndexFor(allFloor, fc, fr, 3, 3, W, false, floorHost)).toBe(-1)
  })
})

describe("fineMaterial bounds", () => {
  const g: MaterialGrid = [[F, W], [W, F]]
  it("maps a fine cell to its base cell material", () => {
    expect(fineMaterial(g, 0, 0, 2, 2)).toBe(F)
    expect(fineMaterial(g, SUB, 0, 2, 2)).toBe(W) // base cell (1,0)
  })
  it("returns null out of bounds", () => {
    expect(fineMaterial(g, -1, 0, 2, 2)).toBeNull()
    expect(fineMaterial(g, 2 * SUB, 0, 2, 2)).toBeNull()
  })
})
