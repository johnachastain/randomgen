// caves-1 — organic cave generator (the extracted Idea 7 PoC; see plans/cave-prototypes.md).
// Geometry is ORGANIC, not rectangular: cellular-automata chamber blobs (= rooms) joined by
// target-biased drunkard's-walk tunnels (= halls), with a flood-fill connectivity guarantee.
// Caves have NO doors, pillars, room shapes or elevation — only a portal entrance + exit, whose
// stairwells are the sole Material.Stairs cells. Seeded/deterministic via core/rng.
//
// Silhouettes are still grid-blocky (square cells) under the rounded-fillet skin the Page paints
// on top — outline-smoothing is the most promising axis for the NEXT prototype, not a fix here.
//
// Generation is UNCHANGED from the version that lived in lab/geomorph-dungeon (same seed → same
// map). Only the result shape shrank: the `edges`/`pillars` grids this used to build purely to
// satisfy the dungeon's `DungeonResult` are gone, since "no doors, no pillars" is a cave invariant
// the type now states outright rather than a fact you had to assert in a test.

import { Material } from "./types"
import type {
  CaveResult, MaterialGrid, RoomInfo, RoomProfile, Portal, PortalKind, Edge, StairGrid, LevelGrid,
} from "./types"
import { mulberry32, randomSeed } from "../../core/rng"
import { dungeonName, roomName } from "../../core/naming"

type Box = { x: number; y: number; w: number; h: number }

const rectsOverlap = (a: Box, b: Box, m: number) =>
  a.x - m < b.x + b.w && b.x - m < a.x + a.w && a.y - m < b.y + b.h && b.y - m < a.y + a.h

export function generateCave(cols: number, rows: number, seed: number = randomSeed()): CaveResult {
  const rng = mulberry32(seed)
  const randInt = (min: number, max: number) => min + Math.floor(rng() * (max - min + 1))

  const grid: MaterialGrid = Array.from({ length: rows }, () => new Array(cols).fill(Material.Wall))
  const roomAt: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(-1))
  const inb = (c: number, r: number) => c >= 0 && c < cols && r >= 0 && r < rows
  const key = (c: number, r: number) => r * cols + c

  // Carve a WALL cell to hall floor (never demote a chamber cell — keeps its roomAt).
  const carveHall = (c: number, r: number) => {
    if (inb(c, r) && grid[r][c] === Material.Wall) { grid[r][c] = Material.Floor; roomAt[r][c] = -1 }
  }

  // --- 1. Chambers: organic CA blobs, one per nucleus box -------------------------------------
  type Chamber = { cx: number; cy: number; idx: number }
  const chambers: Chamber[] = []
  const boxes: Box[] = []
  const target = Math.max(2, Math.round((cols * rows) / 90))

  const carveBlob = (box: Box, idx: number) => {
    const { x, y, w, h } = box
    // Seed: interior random fill, box border forced wall so the blob stays inside its box.
    let cur: boolean[][] = Array.from({ length: h }, (_, r) =>
      Array.from({ length: w }, (_, c) => (r === 0 || c === 0 || r === h - 1 || c === w - 1 ? false : rng() < 0.55)))
    for (let it = 0; it < 4; it++) {
      const next: boolean[][] = Array.from({ length: h }, () => new Array(w).fill(false))
      for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
        let open = 0
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const rr = r + dr, cc = c + dc
          if (rr >= 0 && rr < h && cc >= 0 && cc < w && cur[rr][cc]) open++
        }
        next[r][c] = open >= 5
      }
      cur = next
    }
    // Force the centre open, then keep only the component connected to it (one clean blob).
    const mc = w >> 1, mr = h >> 1
    cur[mr][mc] = true
    const keep = new Set<number>()
    const stack = [mr * w + mc]
    keep.add(mr * w + mc)
    while (stack.length) {
      const k = stack.pop()!
      const c = k % w, r = (k / w) | 0
      for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        const cc = c + dc, rr = r + dr
        if (cc >= 0 && cc < w && rr >= 0 && rr < h && cur[rr][cc] && !keep.has(rr * w + cc)) {
          keep.add(rr * w + cc); stack.push(rr * w + cc)
        }
      }
    }
    for (const k of keep) {
      const c = x + (k % w), r = y + ((k / w) | 0)
      if (inb(c, r)) { grid[r][c] = Material.Floor; roomAt[r][c] = idx }
    }
  }

  let attempts = 0
  while (chambers.length < target && attempts < target * 25) {
    attempts++
    const w = randInt(4, Math.max(5, Math.floor(cols / 3)))
    const h = randInt(4, Math.max(5, Math.floor(rows / 3)))
    const box: Box = { x: randInt(1, Math.max(1, cols - w - 1)), y: randInt(1, Math.max(1, rows - h - 1)), w, h }
    if (boxes.some(b => rectsOverlap(b, box, 1))) continue
    const idx = chambers.length
    carveBlob(box, idx)
    boxes.push(box)
    chambers.push({ cx: box.x + (w >> 1), cy: box.y + (h >> 1), idx })
  }
  // Fallback: guarantee at least one chamber so downstream code has a room.
  if (chambers.length === 0) {
    const box: Box = { x: (cols >> 1) - 2, y: (rows >> 1) - 2, w: 5, h: 5 }
    carveBlob(box, 0)
    chambers.push({ cx: cols >> 1, cy: rows >> 1, idx: 0 })
  }

  // --- 2. Tunnels: MST (+ a few loops) over chamber centres, biased drunkard's walk ------------
  const tunnel = (a: Chamber, b: Chamber) => {
    let c = a.cx, r = a.cy
    const maxSteps = (cols + rows) * 4
    for (let step = 0; step < maxSteps && (c !== b.cx || r !== b.cy); step++) {
      carveHall(c, r)
      if (rng() < 0.4) carveHall(c + (rng() < 0.5 ? 1 : -1), r) // occasional width-2
      if (rng() < 0.65) {
        const dx = b.cx - c, dy = b.cy - r
        if (Math.abs(dx) > Math.abs(dy)) c += Math.sign(dx)
        else if (dy !== 0) r += Math.sign(dy)
        else c += Math.sign(dx)
      } else {
        const d = randInt(0, 3)
        c += d === 0 ? 1 : d === 1 ? -1 : 0
        r += d === 2 ? 1 : d === 3 ? -1 : 0
      }
      c = Math.max(1, Math.min(cols - 2, c))
      r = Math.max(1, Math.min(rows - 2, r))
    }
    carveHall(b.cx, b.cy)
  }

  if (chambers.length > 1) {
    const all: { a: number; b: number; d: number }[] = []
    for (let i = 0; i < chambers.length; i++) for (let j = i + 1; j < chambers.length; j++) {
      all.push({ a: i, b: j, d: Math.abs(chambers[i].cx - chambers[j].cx) + Math.abs(chambers[i].cy - chambers[j].cy) })
    }
    all.sort((p, q) => p.d - q.d)
    const parent = chambers.map((_, i) => i)
    const find = (x: number): number => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x] } return x }
    const chosen: { a: number; b: number }[] = []
    for (const e of all) { const ra = find(e.a), rb = find(e.b); if (ra !== rb) { parent[ra] = rb; chosen.push(e) } }
    const loops = Math.round(chosen.length * 0.25)
    for (let k = 0; k < loops; k++) chosen.push(all[randInt(0, all.length - 1)])
    for (const e of chosen) tunnel(chambers[e.a], chambers[e.b])
  }

  // --- 2.5 Wall bays: break up long straight wall runs with varied semicircular bays (apse recess in
  // / alcove bulge out) — the organic-wall counterpart to the varied corner tiles. Runs BEFORE the
  // connectivity guarantee, so any bulge that pinches a passage gets re-bridged.
  const isFloorCell = (c: number, r: number) => inb(c, r) && grid[r][c] !== Material.Wall
  const isWallCell = (c: number, r: number) => !inb(c, r) || grid[r][c] === Material.Wall
  const floorDepth = (c: number, r: number, dc: number, dr: number) => { let n = 0, cc = c + dc, rr = r + dr; while (isFloorCell(cc, rr) && n < 7) { n++; cc += dc; rr += dr } return n }
  const FACES: [number, number, number, number][] = [[0, 1, 1, 0], [0, -1, 1, 0], [1, 0, 0, 1], [-1, 0, 0, 1]] // nx,ny,px,py
  for (const [nx, ny, px, py] of FACES) {
    const done = new Set<number>()
    for (let r0 = 0; r0 < rows; r0++) for (let c0 = 0; c0 < cols; c0++) {
      if (done.has(r0 * cols + c0)) continue
      if (!(isWallCell(c0, r0) && isFloorCell(c0 + nx, r0 + ny))) continue
      const run: [number, number][] = []
      let cc = c0, rr = r0
      while (isWallCell(cc, rr) && isFloorCell(cc + nx, rr + ny)) { run.push([cc, rr]); done.add(rr * cols + cc); cc += px; rr += py }
      if (run.length < 5) continue
      let k = 1 + Math.floor(rng() * 2)
      while (k < run.length - 1) {
        const [bc, br] = run[k]
        const R = 1 + Math.floor(rng() * 2) // radius 1..2
        const bulge = rng() < 0.45 && floorDepth(bc, br, nx, ny) >= R + 2 // only bulge where floor is wide enough
        for (let a = -R; a <= R; a++) for (let b = bulge ? 1 : 0; b <= R; b++) {
          if (a * a + b * b > R * R + 1) continue
          const c = bc + px * a + (bulge ? nx : -nx) * b
          const r = br + py * a + (bulge ? ny : -ny) * b
          if (!inb(c, r)) continue
          if (bulge) { grid[r][c] = Material.Wall; roomAt[r][c] = -1 }
          else if (grid[r][c] === Material.Wall) { grid[r][c] = Material.Floor; roomAt[r][c] = -1 }
        }
        k += R + 2 + Math.floor(rng() * 3)
      }
    }
  }

  // --- 3. Connectivity guarantee: bridge any isolated open region to the main component --------
  const openCells = () => { const o: number[] = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (grid[r][c] !== Material.Wall) o.push(key(c, r)); return o }
  const floodOpen = (start: number) => {
    const seen = new Set<number>([start]); const st = [start]
    while (st.length) {
      const k = st.pop()!; const c = k % cols, r = (k / cols) | 0
      for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        const cc = c + dc, rr = r + dr
        if (inb(cc, rr) && grid[rr][cc] !== Material.Wall && !seen.has(key(cc, rr))) { seen.add(key(cc, rr)); st.push(key(cc, rr)) }
      }
    }
    return seen
  }
  // BFS over ALL cells from an isolated cell → nearest cell in `seen`; carve the path as hall.
  const bridge = (iso: number, seen: Set<number>) => {
    const prev = new Map<number, number>([[iso, -1]]); const q = [iso]
    for (let qi = 0; qi < q.length; qi++) {
      const k = q[qi]
      if (seen.has(k)) { // reconstruct + carve
        let cur = k
        while (cur !== -1) { const c = cur % cols, r = (cur / cols) | 0; carveHall(c, r); cur = prev.get(cur)! }
        return
      }
      const c = k % cols, r = (k / cols) | 0
      for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        const cc = c + dc, rr = r + dr
        if (inb(cc, rr) && !prev.has(key(cc, rr))) { prev.set(key(cc, rr), k); q.push(key(cc, rr)) }
      }
    }
  }
  for (let guard = 0; guard < chambers.length + 2; guard++) {
    const open = openCells()
    if (open.length === 0) break
    const seen = floodOpen(open[0])
    if (seen.size === open.length) break
    const iso = open.find(k => !seen.has(k))
    if (iso === undefined) break
    bridge(iso, seen)
  }

  // --- 4. Portals: rectilinear stair portals (reused from the dungeon) — a short straight
  // Material.Stairs channel punched from an interior open cell out to the map edge; the terminal edge
  // cell carries the portal marker. Entrance stairs point up/out, exit stairs point in.
  const stairs: StairGrid = Array.from({ length: rows }, () => new Array(cols).fill(null))
  const portals: Portal[] = []
  const SDIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  const edgeCell = (c: number, r: number) => c === 0 || c === cols - 1 || r === 0 || r === rows - 1
  const upFromDir = (dx: number, dy: number): Edge => (dx > 0 ? "e" : dx < 0 ? "w" : dy > 0 ? "s" : "n")
  const oppEdge = (e: Edge): Edge => (e === "e" ? "w" : e === "w" ? "e" : e === "s" ? "n" : "s")
  const PORTAL_MAX_LEN = 4, PORTAL_EDGE_CHANCE = 0.5
  // Candidate stairwells from an interior open cell: a straight 1-wide WALL channel that reaches the
  // map edge (→ edgeSpots) OR dead-ends in a wall pocket (→ interiorSpots). Mirrors the dungeon.
  type Spot = { flight: [number, number][]; dx: number; dy: number }
  const edgeSpots: Spot[] = [], interiorSpots: Spot[] = []
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (grid[r][c] === Material.Wall || edgeCell(c, r)) continue // anchor = interior open cell
    for (const [dx, dy] of SDIRS) {
      const flight: [number, number][] = []
      let cc = c + dx, rr = r + dy
      while (inb(cc, rr) && flight.length < PORTAL_MAX_LEN) {
        if (grid[rr][cc] !== Material.Wall) break // hit open → channel ends before here
        const perp = dx !== 0 ? (isWallCell(cc, rr - 1) && isWallCell(cc, rr + 1)) : (isWallCell(cc - 1, rr) && isWallCell(cc + 1, rr))
        if (!perp) break // keep it 1-wide
        flight.push([cc, rr])
        if (edgeCell(cc, rr)) break // reached the map edge
        cc += dx; rr += dy
      }
      const last = flight[flight.length - 1]
      if (!last) continue
      if (edgeCell(last[0], last[1])) edgeSpots.push({ flight, dx, dy })
      else if (isWallCell(last[0] + dx, last[1] + dy)) interiorSpots.push({ flight, dx, dy }) // dead-end pocket
    }
  }
  const shuffle = (a: Spot[]) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } }
  shuffle(edgeSpots); shuffle(interiorSpots)
  const nearStair = (c: number, r: number) => {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const nc = c + dc, nr = r + dr; if (inb(nc, nr) && grid[nr][nc] === Material.Stairs) return true }
    return false
  }
  const carveFrom = (list: Spot[], kind: PortalKind): boolean => {
    for (const s of list) {
      if (!s.flight.every(([c, r]) => grid[r][c] === Material.Wall && !nearStair(c, r))) continue
      const up = kind === "entrance" ? upFromDir(s.dx, s.dy) : oppEdge(upFromDir(s.dx, s.dy))
      for (const [c, r] of s.flight) { grid[r][c] = Material.Stairs; stairs[r][c] = up }
      const [tx, ty] = s.flight[s.flight.length - 1]
      portals.push({ c: tx, r: ty, kind })
      return true
    }
    return false
  }
  // Per portal: ~PORTAL_EDGE_CHANCE prefer an edge spot, else interior; fall back to the other.
  const placePortal = (kind: PortalKind): boolean => {
    const [first, second] = rng() < PORTAL_EDGE_CHANCE ? [edgeSpots, interiorSpots] : [interiorSpots, edgeSpots]
    return carveFrom(first, kind) || carveFrom(second, kind)
  }
  const pickCount = () => { const x = rng(); return x < 0.6 ? 1 : x < 0.85 ? 2 : x < 0.96 ? 3 : 4 }
  for (let i = 0, n = pickCount(); i < n; i++) if (!placePortal("entrance")) break
  for (let i = 0, n = pickCount(); i < n; i++) if (!placePortal("exit")) break

  // --- 5. Rooms (chambers) --------------------------------------------------------------------
  const caveProfile = (size: RoomProfile["size"]): RoomProfile =>
    ({ type: "cavern", material: "cave", size, water: "dry", features: [] })
  const rooms: RoomInfo[] = chambers.map(ch => {
    let minC = cols, minR = rows, maxC = 0, maxR = 0, area = 0
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (roomAt[r][c] === ch.idx) {
      area++; if (c < minC) minC = c; if (c > maxC) maxC = c; if (r < minR) minR = r; if (r > maxR) maxR = r
    }
    if (area === 0) { minC = ch.cx; maxC = ch.cx; minR = ch.cy; maxR = ch.cy } // safety
    const size: RoomProfile["size"] = area > 40 ? "large" : area > 16 ? "medium" : "small"
    return {
      x: minC, y: minR, w: maxC - minC + 1, h: maxR - minR + 1,
      num: ch.idx + 1, name: roomName(["cave"], rng), profile: caveProfile(size),
    }
  })

  // --- 6. Assemble the result ------------------------------------------------------------------
  // Elevation is flat: every open cell is level 0, walls are null. (A cave with real elevation is a
  // future prototype axis, not something this one half-supports.)
  const levels: LevelGrid = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => (grid[r][c] === Material.Wall ? null : 0)))

  return {
    grid, rooms, stairs, levels, portals,
    name: dungeonName(["cave"], rng), type: "cavern", seed,
  }
}
