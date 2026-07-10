import { describe, it, expect } from "vitest"
import { generateDungeon } from "./dungeon"
import { Material, EDGE } from "./types"
import type { DungeonResult, EdgeGrids, MaterialGrid } from "./types"

// Property-based suite: these mirror the headless invariant checks used throughout the
// dungeon's development (connectivity, elevation consistency, feature placement rules).
// generateDungeon defaults to a fresh random seed (T1), so we assert each invariant over a
// CORPUS of many runs at a few sizes rather than a single fixed seed. A failure prints the
// offending dungeon index + cell so it's reproducible-by-inspection.

const SIZES: [number, number][] = [[20, 18], [16, 14], [24, 20]]
const PER_SIZE = 60

const CORPUS: DungeonResult[] = []
for (const [cols, rows] of SIZES) for (let i = 0; i < PER_SIZE; i++) CORPUS.push(generateDungeon(cols, rows))

// A cell is passable unless it's a Wall (Floor/Water/Door/Stairs are all traversable).
const passable = (m: Material) => m !== Material.Wall

// EdgeKind on the boundary crossed when stepping (dc,dr) out of cell (c,r) — mirrors
// bitmask.ts edgeKind. Only orthogonal steps are used here.
function edgeBetween(edges: EdgeGrids, c: number, r: number, dc: number, dr: number): number {
  if (dc === 1) return edges.v[r]?.[c + 1] ?? EDGE.open
  if (dc === -1) return edges.v[r]?.[c] ?? EDGE.open
  if (dr === 1) return edges.h[r + 1]?.[c] ?? EDGE.open
  return edges.h[r]?.[c] ?? EDGE.open
}

const dims = (grid: MaterialGrid) => ({ rows: grid.length, cols: grid[0].length })
const inb = (grid: MaterialGrid, c: number, r: number) => r >= 0 && r < grid.length && c >= 0 && c < grid[0].length

const ORTHO: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]]

// Flood from (c0,r0) over passable cells; `blockStairs` also refuses to enter/leave a
// Stairs cell (used to isolate flat elevation units). Respects EDGE.wall boundaries.
function flood(d: DungeonResult, c0: number, r0: number, seen: boolean[][], blockStairs: boolean): [number, number][] {
  const { grid, edges } = d
  const comp: [number, number][] = []
  const stack: [number, number][] = [[c0, r0]]
  seen[r0][c0] = true
  while (stack.length) {
    const [c, r] = stack.pop()!
    comp.push([c, r])
    for (const [dc, dr] of ORTHO) {
      const nc = c + dc, nr = r + dr
      if (!inb(grid, nc, nr) || seen[nr][nc]) continue
      if (!passable(grid[nr][nc])) continue
      if (edgeBetween(edges, c, r, dc, dr) === EDGE.wall) continue
      if (blockStairs && (grid[r][c] === Material.Stairs || grid[nr][nc] === Material.Stairs)) continue
      seen[nr][nc] = true
      stack.push([nc, nr])
    }
  }
  return comp
}

describe("dungeon connectivity", () => {
  it("every open cell is reachable (single connected component)", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      const { grid } = d
      const { rows, cols } = dims(grid)
      const seen = grid.map(row => row.map(() => false))
      const open: [number, number][] = []
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (passable(grid[r][c])) open.push([c, r])
      if (!open.length) return
      const [c0, r0] = open[0]
      const reached = flood(d, c0, r0, seen, false).length
      if (reached !== open.length) bad.push(`dungeon ${di}: ${open.length - reached}/${open.length} open cells unreachable`)
    })
    expect(bad.slice(0, 5)).toEqual([])
  })
})

describe("dungeon elevation", () => {
  it("levels is null exactly on Wall cells", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      const { grid, levels } = d
      const { rows, cols } = dims(grid)
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const isWall = grid[r][c] === Material.Wall
        if (isWall !== (levels[r][c] === null)) bad.push(`dungeon ${di} (${c},${r}): wall=${isWall} level=${levels[r][c]}`)
      }
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("each flat (stair-free) region sits at a single consistent level", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      const { grid, levels } = d
      const { rows, cols } = dims(grid)
      const seen = grid.map(row => row.map(() => false))
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        if (seen[r][c] || !passable(grid[r][c]) || grid[r][c] === Material.Stairs) continue
        const comp = flood(d, c, r, seen, true)
        const lvls = new Set(comp.map(([cc, rr]) => levels[rr][cc]))
        if (lvls.size > 1) bad.push(`dungeon ${di}: flat region at (${c},${r}) spans levels ${[...lvls].join("/")}`)
      }
    })
    expect(bad.slice(0, 5)).toEqual([])
  })
})

describe("dungeon stairs", () => {
  it("every Stairs cell is a straight run (perpendicular sides are Wall) with a direction", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      const { grid, stairs } = d
      const { rows, cols } = dims(grid)
      const wallOrOob = (c: number, r: number) => !inb(grid, c, r) || grid[r][c] === Material.Wall
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== Material.Stairs) continue
        const up = stairs[r][c]
        if (up === null) { bad.push(`dungeon ${di} (${c},${r}): stair cell with no direction`); continue }
        const horizontal = up === "e" || up === "w"
        const perpWalls = horizontal ? wallOrOob(c, r - 1) && wallOrOob(c, r + 1) : wallOrOob(c - 1, r) && wallOrOob(c + 1, r)
        if (!perpWalls) bad.push(`dungeon ${di} (${c},${r}): stair not flanked by perpendicular walls`)
      }
    })
    expect(bad.slice(0, 5)).toEqual([])
  })
})

describe("dungeon pillars", () => {
  it("every pillar vertex is surrounded by four Floor/Water cells", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      const { grid, pillars } = d
      const { rows, cols } = dims(grid)
      const ok = (c: number, r: number) => inb(grid, c, r) && (grid[r][c] === Material.Floor || grid[r][c] === Material.Water)
      for (let vj = 0; vj <= rows; vj++) for (let vi = 0; vi <= cols; vi++) {
        if (!pillars[vj]?.[vi]) continue
        if (!(ok(vi - 1, vj - 1) && ok(vi, vj - 1) && ok(vi - 1, vj) && ok(vi, vj)))
          bad.push(`dungeon ${di}: pillar at vertex (${vi},${vj}) not fully surrounded by floor/water`)
      }
    })
    expect(bad.slice(0, 5)).toEqual([])
  })
})

describe("dungeon portals", () => {
  it("has at least one entrance and one exit, each on a Stairs cell", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      const { grid, portals } = d
      if (!portals.some(p => p.kind === "entrance")) bad.push(`dungeon ${di}: no entrance`)
      if (!portals.some(p => p.kind === "exit")) bad.push(`dungeon ${di}: no exit`)
      for (const p of portals) if (grid[p.r]?.[p.c] !== Material.Stairs) bad.push(`dungeon ${di}: portal (${p.c},${p.r}) is not a Stairs cell`)
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("no two portal terminals are adjacent (>=1 tile apart)", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      const { portals } = d
      for (let i = 0; i < portals.length; i++) for (let j = i + 1; j < portals.length; j++) {
        const cheb = Math.max(Math.abs(portals[i].c - portals[j].c), Math.abs(portals[i].r - portals[j].r))
        if (cheb < 2) bad.push(`dungeon ${di}: portals ${i}&${j} only ${cheb} apart`)
      }
    })
    expect(bad.slice(0, 5)).toEqual([])
  })
})

describe("dungeon room features (apses & alcoves)", () => {
  it("apses and alcoves only attach to rectangular rooms", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      d.rooms.forEach((rm, ri) => {
        if ((rm.apses.length || rm.alcoves.length) && rm.shape !== "rect")
          bad.push(`dungeon ${di} room ${ri}: shape=${rm.shape} carries features`)
      })
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("a room never mixes apses with alcoves (one family per room)", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      d.rooms.forEach((rm, ri) => {
        if (rm.apses.length && rm.alcoves.length) bad.push(`dungeon ${di} room ${ri}: has both apses and alcoves`)
      })
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("all alcoves in a room share one size, and all apses one variant", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      d.rooms.forEach((rm, ri) => {
        if (new Set(rm.alcoves.map(a => a.size)).size > 1) bad.push(`dungeon ${di} room ${ri}: mixed alcove sizes`)
        if (new Set(rm.apses.map(a => a.variant)).size > 1) bad.push(`dungeon ${di} room ${ri}: mixed apse variants`)
      })
    })
    expect(bad.slice(0, 5)).toEqual([])
  })
})

// T1: seeded generation is deterministic — same seed → identical dungeon (incl. room names).
describe("seeded generation (T1)", () => {
  it("same seed reproduces the same dungeon", () => {
    const a = generateDungeon(20, 18, 12345)
    const b = generateDungeon(20, 18, 12345)
    expect(a.seed).toBe(12345)
    expect(JSON.stringify(b)).toBe(JSON.stringify(a))
    expect(b.rooms.map(r => r.name)).toEqual(a.rooms.map(r => r.name))
  })

  it("different seeds diverge", () => {
    const a = generateDungeon(20, 18, 1)
    const b = generateDungeon(20, 18, 2)
    expect(JSON.stringify(b)).not.toBe(JSON.stringify(a))
  })
})

// Idea 10: every room gets a derived profile, and the derived facts match the map.
describe("room profiles (Idea 10)", () => {
  it("every room has a well-formed profile; water/shape match the map", () => {
    const bad: string[] = []
    for (let di = 0; di < CORPUS.length; di++) {
      const d = CORPUS[di]
      d.rooms.forEach((rm, ri) => {
        const p = rm.profile
        if (!p) { bad.push(`dungeon ${di} room ${ri}: missing profile`); return }
        if (p.shape !== rm.shape) bad.push(`dungeon ${di} room ${ri}: profile.shape ≠ room.shape`)
        if (p.elevation !== rm.z) bad.push(`dungeon ${di} room ${ri}: profile.elevation ≠ room.z`)
        if (!["dry", "pool", "partial", "full"].includes(p.water)) bad.push(`dungeon ${di} room ${ri}: bad water ${p.water}`)
        if (!["small", "medium", "large"].includes(p.size)) bad.push(`dungeon ${di} room ${ri}: bad size ${p.size}`)
        // Water cross-check: only for RECT rooms, whose bounding box equals their footprint exactly
        // (rounded/circle bboxes include non-room corner cells; roomAt isn't exported to verify those).
        if (rm.shape === "rect") {
          let water = 0
          for (let r = rm.y; r < rm.y + rm.h; r++) for (let c = rm.x; c < rm.x + rm.w; c++)
            if (d.grid[r]?.[c] === Material.Water) water++
          if (p.water === "dry" && water > 0) bad.push(`dungeon ${di} room ${ri}: dry profile but ${water} water cells`)
          if (p.water !== "dry" && water === 0) bad.push(`dungeon ${di} room ${ri}: ${p.water} profile but no water cells`)
        }
      })
    }
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("profile-aware names are well-formed (non-empty, no unresolved templates)", () => {
    const bad: string[] = []
    for (let di = 0; di < CORPUS.length; di++) CORPUS[di].rooms.forEach((rm, ri) => {
      if (!rm.name || !rm.name.trim()) bad.push(`dungeon ${di} room ${ri}: empty name`)
      if (/[{}]|undefined/.test(rm.name)) bad.push(`dungeon ${di} room ${ri}: bad name "${rm.name}"`)
    })
    expect(bad.slice(0, 5)).toEqual([])
  })
})
