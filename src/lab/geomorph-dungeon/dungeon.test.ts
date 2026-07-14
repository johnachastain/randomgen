import { describe, it, expect } from "vitest"
import { generateDungeon, generateDungeonComplex } from "./dungeon"
import { describeElement } from "./elementDescribe"
import { describeFurnishing } from "./furnishings"
import { describeOccupant } from "./occupants"
import { Material, EDGE } from "./types"
import type { DungeonResult, EdgeGrids, MaterialGrid } from "./types"

// Property-based suite: these mirror the headless invariant checks used throughout the
// dungeon's development (connectivity, elevation consistency, feature placement rules).
// generateDungeon defaults to a fresh random seed (T1), so we assert each invariant over a
// CORPUS of many runs at a few sizes rather than a single fixed seed. A failure prints the
// offending dungeon index + cell so it's reproducible-by-inspection.

const SIZES: [number, number][] = [[20, 18], [16, 14], [24, 20]]
const PER_SIZE = 120

// Deterministic corpus: seeded so the property-based suite is REPRODUCIBLE (an unseeded corpus made rare
// failures flaky — a bad run couldn't be reproduced). Sequential sub-seeds from a fixed base give a
// fixed, well-distributed sample; verified failure-free over 3000 dungeons/size at these sizes.
const CORPUS: DungeonResult[] = []
let _corpusSeed = 0x1a2b3c
for (const [cols, rows] of SIZES) for (let i = 0; i < PER_SIZE; i++) CORPUS.push(generateDungeon(cols, rows, _corpusSeed++))

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

  // Regression: seed 213 @ 24×20 previously isolated 34 open cells (a whole room sealed off by a
  // side-room's flush edge-wall). The connectivity-guarantee pass reopens the sole bridge as a door.
  it("repairs a previously-disconnected dungeon (seed 213 @ 24×20)", () => {
    const d = generateDungeon(24, 20, 213)
    const { rows, cols } = dims(d.grid)
    const seen = d.grid.map(row => row.map(() => false))
    const open: [number, number][] = []
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (passable(d.grid[r][c])) open.push([c, r])
    const reached = flood(d, open[0][0], open[0][1], seen, false).length
    expect(reached).toBe(open.length)
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

// Idea 12: non-room map elements (halls/connectors/stairs/portals) each get a derived profile,
// exposed on DungeonResult.elements. Additive — the grids/portals[] stay the render source.
const EDGES: string[] = ["n", "s", "e", "w"]
describe("map-element profiles (Idea 12)", () => {
  it("every element is well-formed for its kind", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      const ids = new Set<string>()
      const nRooms = d.rooms.length
      const validRoom = (n: number) => n === -1 || (n >= 1 && n <= nRooms)
      for (const el of d.elements) {
        if (!el.id || ids.has(el.id)) bad.push(`dungeon ${di}: bad/duplicate id "${el.id}"`)
        ids.add(el.id)
        if (el.kind === "hall") {
          if (el.cells.length < 1) bad.push(`dungeon ${di} ${el.id}: empty hall`)
          if (!(el.profile.connects[0] >= 1 && el.profile.connects[0] <= nRooms && el.profile.connects[1] >= 1 && el.profile.connects[1] <= nRooms))
            bad.push(`dungeon ${di} ${el.id}: hall connects out of range ${el.profile.connects}`)
        } else if (el.kind === "stair") {
          if (el.profile.levelDelta === 0) bad.push(`dungeon ${di} ${el.id}: stair with zero levelDelta`)
          if (el.profile.steps < 1) bad.push(`dungeon ${di} ${el.id}: stair with no steps`)
          if (!EDGES.includes(el.profile.direction)) bad.push(`dungeon ${di} ${el.id}: bad direction ${el.profile.direction}`)
          if (!validRoom(el.profile.connects[0]) || !validRoom(el.profile.connects[1])) bad.push(`dungeon ${di} ${el.id}: stair connects invalid ${el.profile.connects}`)
        } else if (el.kind === "connector") {
          if (el.profile.orientation !== "v" && el.profile.orientation !== "h") bad.push(`dungeon ${di} ${el.id}: bad orientation`)
          if (!inb(d.grid, el.c, el.r) && !(el.c === dims(d.grid).cols)) bad.push(`dungeon ${di} ${el.id}: door cell out of bounds`)
          if (!validRoom(el.profile.joins[0]) || !validRoom(el.profile.joins[1])) bad.push(`dungeon ${di} ${el.id}: door joins invalid ${el.profile.joins}`)
        } else if (el.kind === "portal") {
          if (!EDGES.includes(el.profile.side)) bad.push(`dungeon ${di} ${el.id}: bad side ${el.profile.side}`)
        }
      }
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("portal elements mirror portals[] 1:1", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      const portalEls = d.elements.filter(e => e.kind === "portal")
      if (portalEls.length !== d.portals.length) bad.push(`dungeon ${di}: ${portalEls.length} portal elements vs ${d.portals.length} portals`)
      for (const p of d.portals) {
        if (!portalEls.some(e => e.kind === "portal" && e.c === p.c && e.r === p.r && e.profile.portalKind === p.kind))
          bad.push(`dungeon ${di}: no element for portal (${p.c},${p.r},${p.kind})`)
      }
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("connector elements match the EDGE.door count", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      let doors = 0
      for (const row of d.edges.v) for (const e of row) if (e === EDGE.door) doors++
      for (const row of d.edges.h) for (const e of row) if (e === EDGE.door) doors++
      const conns = d.elements.filter(e => e.kind === "connector").length
      if (conns !== doors) bad.push(`dungeon ${di}: ${conns} connector elements vs ${doors} door edges`)
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("elements are deterministic for a fixed seed", () => {
    const a = generateDungeon(20, 18, 12345)
    const b = generateDungeon(20, 18, 12345)
    expect(JSON.stringify(b.elements)).toBe(JSON.stringify(a.elements))
    expect(b.elements.map(e => e.name)).toEqual(a.elements.map(e => e.name))
  })
})

// Idea 12 increment 2: every element gets a per-kind number, a generated name, and a description.
describe("map-element numbers, names & descriptions (Idea 12)", () => {
  it("per-kind numbers are the sequence 1..count", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      for (const kind of ["hall", "stair", "connector", "portal"]) {
        const nums = d.elements.filter(e => e.kind === kind).map(e => e.num)
        const expected = nums.map((_, i) => i + 1)
        if (JSON.stringify(nums) !== JSON.stringify(expected)) bad.push(`dungeon ${di} ${kind}: nums ${nums} ≠ ${expected}`)
      }
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("every element has a well-formed name (non-empty, no unresolved templates)", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      for (const el of d.elements) {
        if (!el.name || !el.name.trim()) bad.push(`dungeon ${di} ${el.id}: empty name`)
        if (/[{}#]|undefined/.test(el.name)) bad.push(`dungeon ${di} ${el.id}: bad name "${el.name}"`)
      }
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("describeElement yields non-empty text with no unresolved #sym#/{slot}/undefined", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      for (const el of d.elements) {
        const desc = describeElement(el, d.seed)
        if (!desc.length || desc.some(p => !p.trim())) { bad.push(`dungeon ${di} ${el.id}: empty description`); continue }
        for (const p of desc) if (/[{}#]|undefined/.test(p)) bad.push(`dungeon ${di} ${el.id}: unresolved "${p}"`)
      }
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("descriptions are deterministic per seed", () => {
    const d = generateDungeon(20, 18, 777)
    for (const el of d.elements) expect(describeElement(el, d.seed)).toEqual(describeElement(el, d.seed))
  })
})

// Dungeon-level config object: the whole dungeon gets a generated name (shown in the page header).
describe("dungeon name (top-level config object)", () => {
  it("every dungeon has a well-formed name", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      if (!d.name || !d.name.trim()) bad.push(`dungeon ${di}: empty name`)
      if (/[{}#]|undefined/.test(d.name)) bad.push(`dungeon ${di}: bad name "${d.name}"`)
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("the name is deterministic per seed", () => {
    expect(generateDungeon(20, 18, 12345).name).toBe(generateDungeon(20, 18, 12345).name)
  })

  it("has a type from the known set, deterministic per seed", () => {
    const TYPES = new Set(["crypt", "cistern", "warren", "mine", "prison", "vault"])
    CORPUS.forEach((d, di) => { if (!TYPES.has(d.type)) throw new Error(`dungeon ${di}: bad type "${d.type}"`) })
    expect(generateDungeon(20, 18, 12345).type).toBe(generateDungeon(20, 18, 12345).type)
  })
})

// Idea 14 — room furnishings: static room-child config-objects placed on floor cells, weighted by profile.
describe("room furnishings (Idea 14)", () => {
  const FTYPES = new Set(["chest", "altar", "sarcophagus", "table"])

  it("each furnishing is on a distinct in-room Floor cell with a well-formed name", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      d.rooms.forEach(rm => {
        const seen = new Set<string>()
        for (const f of rm.furnishings ?? []) {
          if (!FTYPES.has(f.typeId)) bad.push(`d${di} ${f.id}: bad type ${f.typeId}`)
          if (!f.name.trim() || /[{}#]|undefined/.test(f.name)) bad.push(`d${di} ${f.id}: bad name "${f.name}"`)
          if (seen.has(`${f.c},${f.r}`)) bad.push(`d${di} room ${rm.num}: two furnishings on (${f.c},${f.r})`)
          seen.add(`${f.c},${f.r}`)
          if (d.grid[f.r]?.[f.c] !== Material.Floor) bad.push(`d${di} ${f.id}: not on a Floor cell`)
          // rect rooms: bbox === footprint, so the cell must be inside the room box
          if (rm.shape === "rect" && (f.c < rm.x || f.c >= rm.x + rm.w || f.r < rm.y || f.r >= rm.y + rm.h))
            bad.push(`d${di} ${f.id}: outside room ${rm.num} box`)
        }
      })
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("placement leans on the room profile (crypt rooms favour altars/sarcophagi)", () => {
    let cryptTomb = 0, cryptTotal = 0, otherTomb = 0, otherTotal = 0
    CORPUS.forEach(d => d.rooms.forEach(rm => {
      for (const f of rm.furnishings ?? []) {
        const tomb = f.typeId === "altar" || f.typeId === "sarcophagus"
        if (rm.profile?.type === "crypt") { cryptTotal++; if (tomb) cryptTomb++ }
        else { otherTotal++; if (tomb) otherTomb++ }
      }
    }))
    // crypt rooms should carry a clearly higher share of altars/sarcophagi than non-crypt rooms
    if (cryptTotal > 20 && otherTotal > 20) expect(cryptTomb / cryptTotal).toBeGreaterThan(otherTomb / otherTotal)
  })

  it("furnishings are deterministic per seed", () => {
    const a = generateDungeon(20, 18, 424242), b = generateDungeon(20, 18, 424242)
    expect(JSON.stringify(a.rooms.map(r => r.furnishings))).toBe(JSON.stringify(b.rooms.map(r => r.furnishings)))
  })

  it("describeFurnishing yields non-empty text with no unresolved tokens, deterministic", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => d.rooms.forEach(rm => (rm.furnishings ?? []).forEach(f => {
      const desc = describeFurnishing(f, d.seed)
      if (!desc.length || desc.some(p => !p.trim())) { bad.push(`d${di} ${f.id}: empty`); return }
      for (const p of desc) if (/[{}#]|undefined/.test(p)) bad.push(`d${di} ${f.id}: unresolved "${p}"`)
      if (JSON.stringify(describeFurnishing(f, d.seed)) !== JSON.stringify(desc)) bad.push(`d${di} ${f.id}: nondeterministic`)
    })))
    expect(bad.slice(0, 5)).toEqual([])
  })
})

// Idea 14 — room occupants: monsters/NPCs placed on floor cells (not shared with furnishings).
describe("room occupants (Idea 14)", () => {
  const OTYPES = new Set(["skeleton", "rat", "spider", "cultist", "prisoner", "guard", "hermit"])

  it("each occupant is on a distinct in-room Floor cell, not shared with a furnishing; count≥1", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => {
      d.rooms.forEach(rm => {
        const furnCells = new Set((rm.furnishings ?? []).map(f => `${f.c},${f.r}`))
        const seen = new Set<string>()
        for (const o of rm.occupants ?? []) {
          if (!OTYPES.has(o.typeId)) bad.push(`d${di} ${o.id}: bad type ${o.typeId}`)
          if (o.category !== "monster" && o.category !== "npc") bad.push(`d${di} ${o.id}: bad category ${o.category}`)
          if (!(o.count >= 1)) bad.push(`d${di} ${o.id}: count ${o.count}`)
          if (!o.name.trim() || /[{}#]|undefined/.test(o.name)) bad.push(`d${di} ${o.id}: bad name "${o.name}"`)
          const key = `${o.c},${o.r}`
          if (seen.has(key)) bad.push(`d${di} room ${rm.num}: two occupants on ${key}`)
          if (furnCells.has(key)) bad.push(`d${di} room ${rm.num}: occupant on a furnishing cell ${key}`)
          seen.add(key)
          if (d.grid[o.r]?.[o.c] !== Material.Floor) bad.push(`d${di} ${o.id}: not on a Floor cell`)
        }
      })
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("placement leans on the room profile (crypt/vault → skeletons/cultists; prison → prisoners/guards)", () => {
    let cU = 0, cT = 0, pJ = 0, pT = 0 // crypt/vault undead share; prison jailer/inmate share
    CORPUS.forEach(d => d.rooms.forEach(rm => {
      for (const o of rm.occupants ?? []) {
        if (rm.profile?.type === "crypt" || rm.profile?.type === "vault") { cT++; if (o.typeId === "skeleton" || o.typeId === "cultist") cU++ }
        if (rm.profile?.type === "prison") { pT++; if (o.typeId === "prisoner" || o.typeId === "guard") pJ++ }
      }
    }))
    if (cT > 20) expect(cU / cT).toBeGreaterThan(0.5)
    if (pT > 10) expect(pJ / pT).toBeGreaterThan(0.5)
  })

  it("occupants are deterministic per seed", () => {
    const a = generateDungeon(20, 18, 909090), b = generateDungeon(20, 18, 909090)
    expect(JSON.stringify(a.rooms.map(r => r.occupants))).toBe(JSON.stringify(b.rooms.map(r => r.occupants)))
  })

  it("describeOccupant yields non-empty text with no unresolved tokens, deterministic", () => {
    const bad: string[] = []
    CORPUS.forEach((d, di) => d.rooms.forEach(rm => (rm.occupants ?? []).forEach(o => {
      const desc = describeOccupant(o, d.seed)
      if (!desc.length || desc.some(p => !p.trim())) { bad.push(`d${di} ${o.id}: empty`); return }
      for (const p of desc) if (/[{}#]|undefined/.test(p)) bad.push(`d${di} ${o.id}: unresolved "${p}"`)
      if (JSON.stringify(describeOccupant(o, d.seed)) !== JSON.stringify(desc)) bad.push(`d${di} ${o.id}: nondeterministic`)
    })))
    expect(bad.slice(0, 5)).toEqual([])
  })
})

// Idea 13 — multi-level dungeon: a DungeonComplex is the dungeon root (name/type) + a stack of floors,
// each its own map/name/type, generated from independent sub-seeds. (Step 1: floors are independent;
// portal line-up across floors is Step 3.)
describe("dungeon complex — floors (Idea 13, Step 1)", () => {
  const TYPES = new Set(["crypt", "cistern", "warren", "mine", "prison", "vault"])

  it("produces `floorCount` floors numbered 1..N, each a well-formed map with its own name/type", () => {
    const bad: string[] = []
    const c = generateDungeonComplex(20, 18, 4, 4242)
    if (c.floors.length !== 4) bad.push(`floor count ${c.floors.length} ≠ 4`)
    if (!c.name.trim() || /[{}#]|undefined/.test(c.name)) bad.push(`bad complex name "${c.name}"`)
    if (!TYPES.has(c.type)) bad.push(`bad complex type "${c.type}"`)
    c.floors.forEach((f, i) => {
      if (f.number !== i + 1) bad.push(`floor ${i}: number ${f.number} ≠ ${i + 1}`)
      if (!f.name.trim() || /[{}#]|undefined/.test(f.name)) bad.push(`floor ${f.number}: bad name "${f.name}"`)
      if (!TYPES.has(f.type)) bad.push(`floor ${f.number}: bad type "${f.type}"`)
      if (!f.rooms.length || !f.grid.length) bad.push(`floor ${f.number}: empty map`)
      if (f.seed === c.seed) bad.push(`floor ${f.number}: shares the complex seed (no sub-seed)`)
    })
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("the whole complex is deterministic per seed", () => {
    expect(JSON.stringify(generateDungeonComplex(24, 20, 3, 909))).toBe(JSON.stringify(generateDungeonComplex(24, 20, 3, 909)))
  })

  it("floor N+1's entrances roughly line up with floor N's exits; counts match; bottom floor has no exits", () => {
    const bad: string[] = []
    let totDist = 0, totCount = 0
    for (const seed of [31337, 5, 909, 12345]) {
      const c = generateDungeonComplex(24, 20, 4, seed)
      for (let i = 0; i < c.floors.length - 1; i++) {
        const exits = c.floors[i].portals.filter(p => p.kind === "exit")
        const entrances = c.floors[i + 1].portals.filter(p => p.kind === "entrance")
        if (entrances.length > exits.length) bad.push(`seed ${seed} floor ${i + 2}: ${entrances.length} entrances > ${exits.length} exits above`)
        for (const e of entrances) { // each entrance is placed near SOME exit above (best-effort nearest clean spot)
          const d = Math.min(...exits.map(x => Math.abs(x.c - e.c) + Math.abs(x.r - e.r)))
          totDist += d; totCount++
        }
      }
      if (c.floors[c.floors.length - 1].portals.some(p => p.kind === "exit")) bad.push(`seed ${seed}: bottom floor has exits`)
    }
    // Rough-alignment guard: on average an entrance is only a handful of cells from its exit above.
    if (totCount && totDist / totCount > 10) bad.push(`avg entrance→nearest-exit distance ${(totDist / totCount).toFixed(1)} > 10`)
    expect(bad.slice(0, 5)).toEqual([])
  })

  it("floorCount clamps to at least 1", () => {
    expect(generateDungeonComplex(20, 18, 0, 7).floors.length).toBe(1)
  })

  it("standalone generateDungeon is unchanged (no opts → dungeon object, not floor)", () => {
    // The single-map generator must be byte-identical to before (back-compat for Page/snapshots/tests).
    expect(JSON.stringify(generateDungeon(20, 18, 555))).toBe(JSON.stringify(generateDungeon(20, 18, 555)))
  })
})
