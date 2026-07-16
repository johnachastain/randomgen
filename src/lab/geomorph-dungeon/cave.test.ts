import { describe, it, expect } from "vitest"
import { generateCave } from "./cave"
import { Material, EDGE } from "./types"

// Flood the open cells (orthogonal) from one start → the reachable set.
function flood(grid: Material[][], sc: number, sr: number): Set<number> {
  const rows = grid.length, cols = grid[0].length
  const key = (c: number, r: number) => r * cols + c
  const seen = new Set<number>([key(sc, sr)]), st = [key(sc, sr)]
  while (st.length) {
    const k = st.pop()!, c = k % cols, r = (k / cols) | 0
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const cc = c + dc, rr = r + dr
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols && grid[rr][cc] !== Material.Wall && !seen.has(key(cc, rr))) {
        seen.add(key(cc, rr)); st.push(key(cc, rr))
      }
    }
  }
  return seen
}

const openCount = (grid: Material[][]) => grid.flat().filter(m => m !== Material.Wall).length

describe("generateCave", () => {
  it("is deterministic for a given seed", () => {
    const a = generateCave(24, 20, 12345)
    const b = generateCave(24, 20, 12345)
    expect(a.grid).toEqual(b.grid)
    expect(a.rooms.map(r => r.num)).toEqual(b.rooms.map(r => r.num))
  })

  it("produces chambers + variable-count entrance/exit portals (edge or interior)", () => {
    const d = generateCave(24, 20, 7)
    expect(d.rooms.length).toBeGreaterThanOrEqual(1)
    expect(d.portals.every(p => p.kind === "entrance" || p.kind === "exit")).toBe(true)
    // across seeds: both kinds appear, counts vary (not always exactly one), and some portals sit at
    // INTERIOR dead-end pockets rather than all on the map edge — matching the dungeon's placement.
    let ent = 0, ext = 0, interior = 0, multi = 0
    for (let s = 0; s < 40; s++) {
      const dd = generateCave(30, 24, s)
      const e = dd.portals.filter(p => p.kind === "entrance").length
      ent += e; if (e > 1) multi++
      ext += dd.portals.filter(p => p.kind === "exit").length
      interior += dd.portals.filter(p => p.c > 0 && p.c < 29 && p.r > 0 && p.r < 23).length
    }
    expect(ent).toBeGreaterThan(0)
    expect(ext).toBeGreaterThan(0)
    expect(multi).toBeGreaterThan(0)    // some floors have >1 entrance
    expect(interior).toBeGreaterThan(0) // some portals are interior, not all on the edge
  })

  it("every open cell is reachable (single connected component)", () => {
    for (let seed = 0; seed < 200; seed++) {
      const d = generateCave(24, 20, seed)
      const open = openCount(d.grid)
      // find any open cell to seed the flood
      let sc = -1, sr = -1
      outer: for (let r = 0; r < 20; r++) for (let c = 0; c < 24; c++) if (d.grid[r][c] !== Material.Wall) { sc = c; sr = r; break outer }
      expect(sc).toBeGreaterThanOrEqual(0)
      expect(flood(d.grid, sc, sr).size).toBe(open)
    }
  })

  it("has no doors and flat elevation; stairs only as portal stairwells (cave invariants)", () => {
    const d = generateCave(30, 24, 99)
    expect(d.edges.v.flat().every(e => e === EDGE.open)).toBe(true)
    expect(d.edges.h.flat().every(e => e === EDGE.open)).toBe(true)
    for (let r = 0; r < 24; r++) for (let c = 0; c < 30; c++) {
      // every Stairs cell is a portal stairwell with a direction; elevation stays flat (level 0)
      if (d.grid[r][c] === Material.Stairs) expect(d.stairs[r][c]).not.toBeNull()
      expect(d.levels[r][c]).toBe(d.grid[r][c] === Material.Wall ? null : 0)
    }
  })

  it("rooms are plain rect footprints (no cave shapes/corners)", () => {
    const d = generateCave(24, 20, 3)
    for (const rm of d.rooms) {
      expect(rm.shape).toBe("rect")
      expect(rm.cornerRadius).toBe(0)
      expect(rm.roundCorners).toEqual([])
      expect(rm.apses).toEqual([])
      expect(rm.alcoves).toEqual([])
    }
  })
})
