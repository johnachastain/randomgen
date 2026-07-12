import { Material, MaterialGrid, PillarGrid, StairGrid, LevelGrid, RoomInfo, Edge, Portal, PortalKind, EDGE, EdgeKind, EdgeGrids, DungeonResult } from "./types"

// Simple room+corridor dungeon over a Material grid: carve rooms (Floor) joined by
// L-shaped corridors, leave the rest Wall, then add stairs (elevation), Water pools
// and Door features.

type Room = RoomInfo // { x, y, w, h, z }

const DOOR_CHANCE = 0.35 // fraction of qualifying entrances that actually get a door

// Stairs / elevation. Levels are assigned consistently over the REAL geometry (a
// weighted union-find, Pass B): every path between two points changes level by the
// same net amount, so loops get matching stairs on both connections. STAIR_CHANCE is
// the per spanning-tree-edge chance of a ±1 step (else flat).
const STAIR_CHANCE = 0.25

// Corridor connection graph: rooms are joined by an MST over spatial proximity plus a
// few extra "loop" edges (count ≈ room count × LOOP_FRACTION). Corridors are routed to
// avoid cutting through non-endpoint rooms; corridor↔corridor crossings are allowed.
const LOOP_FRACTION = 0.25

// Side-rooms: small spur rooms branching off a main room or a hall via a single 1-wide
// opening. Every boundary spot has SIDE_ROOM_CHANCE to spawn one (so several can radiate
// around one room); TINY_FRACTION of them occupy just 1–2 cells (rest are small 2–3 rooms).
const SIDE_ROOM_CHANCE = 0.12
const TINY_FRACTION = 0.6

// Level portals (entrances up/out + exits down/out): short stairwells punched through wall,
// terminating either at the map edge (~PORTAL_EDGE_CHANCE) or an interior dead-end pocket.
// Usually one of each, up to 4; flight ≤ PORTAL_MAX_LEN cells.
const PORTAL_MAX_LEN = 4
const PORTAL_EDGE_CHANCE = 0.5

// Water condition rules. Each region (room / hall) rolls one mutually-exclusive
// condition; the remaining probability is "dry".
const MIN_ROOM_DIM = 4      // rooms smaller than this only get dry or full (no pool/partial)
const ENTRANCE_CLEAR = 1    // water must be this far from a region mouth (entrance/door)
const POOL_TRIES = 6        // attempts to find a valid cell for a pool
const ROOM_POOL = 0.2       // room: single-cell pool
const ROOM_PARTIAL = 0.15   // room: water band hugging one side
const ROOM_FULL = 0.1       // room: fully flooded
const HALL_PARTIAL = 0.18   // hall: water fills a mid-segment run
const HALL_FULL = 0.12      // hall: fully flooded
const PARTIAL_MIN = 0.4     // partial fill covers this..PARTIAL_MAX of the region
const PARTIAL_MAX = 0.6
const PILLAR_ROOM_CHANCE = 0.4 // chance an eligible room is "pillared"

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function overlaps(a: Room, b: Room): boolean {
  return (
    a.x - 1 <= b.x + b.w && a.x + a.w + 1 >= b.x &&
    a.y - 1 <= b.y + b.h && a.y + a.h + 1 >= b.y
  )
}

export function generateDungeon(cols: number, rows: number): DungeonResult {
  const grid: MaterialGrid = Array.from({ length: rows }, () => Array(cols).fill(Material.Wall))
  const inb = (c: number, r: number) => c >= 0 && c < cols && r >= 0 && r < rows
  const carve = (c: number, r: number) => { if (inb(c, r)) grid[r][c] = Material.Floor }
  const isFloor = (c: number, r: number) => inb(c, r) && grid[r][c] === Material.Floor
  const isWall = (c: number, r: number) => !inb(c, r) || grid[r][c] === Material.Wall

  // Edge-features layer: walls & doors on cell BOUNDARIES (not whole cells). v[r][c] = the
  // west edge of (c,r) [between (c-1,r) & (c,r)]; h[r][c] = the north edge of (c,r).
  const edges: EdgeGrids = {
    v: Array.from({ length: rows }, () => Array<EdgeKind>(cols + 1).fill(EDGE.open)),
    h: Array.from({ length: rows + 1 }, () => Array<EdgeKind>(cols).fill(EDGE.open)),
  }
  // Set the boundary between (c,r) and its orthogonal neighbour (c+dc,r+dr) to `kind`.
  const setEdge = (c: number, r: number, dc: number, dr: number, kind: EdgeKind) => {
    if (dc === 1) edges.v[r][c + 1] = kind
    else if (dc === -1) edges.v[r][c] = kind
    else if (dr === 1) edges.h[r + 1][c] = kind
    else edges.h[r][c] = kind
  }

  // 1. Rooms.
  const rooms: Room[] = []
  const targetRooms = Math.max(2, Math.round((cols * rows) / 30))
  for (let i = 0; i < targetRooms * 6 && rooms.length < targetRooms; i++) {
    // Moderately larger rooms (higher ceiling than the old /3) so walls are longer for
    // side-rooms, while staying small enough that several rooms still fit the map.
    const w = randInt(2, Math.max(4, Math.floor(cols / 2.6)))
    const h = randInt(2, Math.max(4, Math.floor(rows / 2.6)))
    const x = randInt(1, Math.max(1, cols - w - 1))
    const y = randInt(1, Math.max(1, rows - h - 1))
    const room: Room = { x, y, w, h, z: 0 }
    if (rooms.some(other => overlaps(room, other))) continue
    rooms.push(room)
    for (let ry = y; ry < y + h; ry++) for (let rx = x; rx < x + w; rx++) carve(rx, ry)
  }
  if (rooms.length === 0) {
    rooms.push({ x: 0, y: 0, w: cols, h: rows, z: 0 })
    for (let ry = 0; ry < rows; ry++) for (let rx = 0; rx < cols; rx++) carve(rx, ry)
  }

  // Room membership (also used for water regions below). A cell inside any room rect.
  const inAnyRoom = (c: number, r: number) =>
    rooms.some(rm => c >= rm.x && c < rm.x + rm.w && r >= rm.y && r < rm.y + rm.h)

  // 2. Corridors via a spatial connection graph — an MST over room proximity plus a few
  //    intentional loop edges — routed to AVOID cutting through non-endpoint rooms
  //    (corridor↔corridor crossings are fine). Replaces the old placement-order chain;
  //    elevation (Pass B) is then derived from the resulting geometry.
  const stairs: StairGrid = Array.from({ length: rows }, () => Array<Edge | null>(cols).fill(null))
  const centerOf = (r: Room) => ({ cx: r.x + (r.w >> 1), cy: r.y + (r.h >> 1) })
  const hCells = (cy: number, cxA: number, cxB: number): [number, number][] => {
    const a: [number, number][] = []; for (let c = Math.min(cxA, cxB); c <= Math.max(cxA, cxB); c++) a.push([c, cy]); return a
  }
  const vCells = (cx: number, cyA: number, cyB: number): [number, number][] => {
    const a: [number, number][] = []; for (let r = Math.min(cyA, cyB); r <= Math.max(cyA, cyB); r++) a.push([cx, r]); return a
  }
  const inRoomK = (c: number, r: number, k: number) => {
    const rm = rooms[k]; return c >= rm.x && c < rm.x + rm.w && r >= rm.y && r < rm.y + rm.h
  }
  const crossesThird = (path: [number, number][], ai: number, bi: number): boolean => {
    for (const [c, r] of path) for (let k = 0; k < rooms.length; k++) {
      if (k !== ai && k !== bi && inRoomK(c, r, k)) return true
    }
    return false
  }
  // L-route between rooms ai,bi: prefer an elbow that avoids all third rooms.
  const routeEdge = (ai: number, bi: number): { path: [number, number][]; clean: boolean } => {
    const a = centerOf(rooms[ai]), b = centerOf(rooms[bi])
    const e1 = hCells(a.cy, a.cx, b.cx).concat(vCells(b.cx, a.cy, b.cy))
    const e2 = vCells(a.cx, a.cy, b.cy).concat(hCells(b.cy, a.cx, b.cx))
    const opts = Math.random() < 0.5 ? [e1, e2] : [e2, e1]
    for (const p of opts) if (!crossesThird(p, ai, bi)) return { path: p, clean: true }
    return { path: opts[0], clean: false } // last resort (crosses a room) — kept rare by proximity MST
  }

  const n = rooms.length
  type CEdge = { ai: number; bi: number; d: number; path: [number, number][]; clean: boolean; used: boolean }
  const allEdges: CEdge[] = []
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const a = centerOf(rooms[i]), b = centerOf(rooms[j])
    const { path, clean } = routeEdge(i, j)
    allEdges.push({ ai: i, bi: j, d: Math.abs(a.cx - b.cx) + Math.abs(a.cy - b.cy), path, clean, used: false })
  }
  allEdges.sort((x, y) => x.d - y.d)

  // MST (Kruskal) — clean edges first for connectivity, then any edge to close gaps.
  const cparent = Array.from({ length: n }, (_, i) => i)
  const cfind = (x: number): number => cparent[x] === x ? x : (cparent[x] = cfind(cparent[x]))
  const cunite = (x: number, y: number) => { cparent[cfind(x)] = cfind(y) }
  const chosen: CEdge[] = []
  for (const e of allEdges) if (e.clean && cfind(e.ai) !== cfind(e.bi)) { cunite(e.ai, e.bi); e.used = true; chosen.push(e) }
  for (const e of allEdges) if (cfind(e.ai) !== cfind(e.bi)) { cunite(e.ai, e.bi); e.used = true; chosen.push(e) }
  // Loop edges: a few shortest clean edges beyond the tree.
  let loopsLeft = Math.round(n * LOOP_FRACTION)
  for (const e of allEdges) { if (loopsLeft <= 0) break; if (e.clean && !e.used) { e.used = true; chosen.push(e); loopsLeft-- } }

  for (const e of chosen) for (const [c, r] of e.path) carve(c, r)

  // 2.5 Side-rooms: small rooms placed FLUSH against a main room or hall — the footprint's
  //     base cells sit directly adjacent to the parent's (no wall-cell gap). The shared seam
  //     is separated by EDGE-walls (thin walls the trim renders), pierced by a single DOOR
  //     edge = the opening. Placed BEFORE elevation/doors/water/pillars so they inherit all.
  //     Reached only through the door ⇒ still a spur off the parent's flat unit.
  const SDIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  // The footprint itself must be all Wall (carvable) and inside the 1-cell outer border.
  const footprintFree = (x: number, y: number, w: number, h: number): boolean => {
    if (x < 1 || y < 1 || x + w > cols - 1 || y + h > rows - 1) return false
    for (let r = y; r < y + h; r++) for (let c = x; c < x + w; c++) if (!isWall(c, r)) return false
    return true
  }
  // Boundary candidates: an open cell (room edge or hall) with a Wall neighbour the footprint
  // can sit flush against. Shuffled; each is an independent SIDE_ROOM_CHANCE to spawn a spur.
  const TINY: [number, number][] = [[1, 1], [1, 2], [2, 1]]
  const cands: [number, number, number, number][] = [] // ac, ar, dx, dy
  for (let r = 1; r < rows - 1; r++) for (let c = 1; c < cols - 1; c++) {
    if (isWall(c, r)) continue
    for (const [dx, dy] of SDIRS) if (isWall(c + dx, r + dy)) cands.push([c, r, dx, dy])
  }
  for (let i = cands.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[cands[i], cands[j]] = [cands[j], cands[i]] }
  for (const [ac, ar, dx, dy] of cands) {
    if (Math.random() >= SIDE_ROOM_CHANCE) continue
    if (isWall(ac, ar)) continue                     // may have been re-carved by an earlier side-room
    const nearC = ac + dx, nearR = ar + dy           // footprint cell that abuts the anchor
    if (!isWall(nearC, nearR)) continue
    const [sw, sh] = Math.random() < TINY_FRACTION ? TINY[randInt(0, 2)] : [randInt(2, 3), randInt(2, 3)]
    let x: number, y: number                         // footprint starts flush at the near cell
    if (dx !== 0) { x = dx > 0 ? nearC : nearC - sw + 1; y = nearR - randInt(0, sh - 1) }
    else { y = dy > 0 ? nearR : nearR - sh + 1; x = nearC - randInt(0, sw - 1) }
    if (!footprintFree(x, y, sw, sh)) continue
    for (let r = y; r < y + sh; r++) for (let c = x; c < x + sw; c++) carve(c, r)
    // Edge-wall every footprint boundary that now faces an OPEN cell (the flush seam) …
    const inFoot = (c: number, r: number) => c >= x && c < x + sw && r >= y && r < y + sh
    for (let r = y; r < y + sh; r++) for (let c = x; c < x + sw; c++) {
      for (const [ec, er] of SDIRS) {
        if (inFoot(c + ec, r + er) || isWall(c + ec, r + er)) continue
        setEdge(c, r, ec, er, EDGE.wall)
      }
    }
    // … then open a single DOOR edge at the anchor (overrides the wall on that boundary).
    setEdge(ac, ar, dx, dy, EDGE.door)
    rooms.push({ x, y, w: sw, h: sh, z: 0 })
  }

  // Pass B: assign a CONSISTENT elevation over the real geometry. Level changes only
  // happen on straight 1-wide corridor "runs" (stairs). A weighted union-find over
  // "flat units" (rooms + corners + junctions) makes every path between two points
  // change level by the same net amount — so loops get matching stairs on both sides.
  const NDIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  const isOpen = (c: number, r: number) => inb(c, r) && grid[r][c] !== Material.Wall

  // (a) straight corridor cell → its travel axis, else null (open, not in a room, both
  //     perpendicular neighbours Wall: excludes rooms/corners/junctions).
  const straightAxis = (c: number, r: number): "h" | "v" | null => {
    if (!isOpen(c, r) || inAnyRoom(c, r)) return null
    if (isWall(c, r - 1) && isWall(c, r + 1)) return "h" // travels E–W
    if (isWall(c - 1, r) && isWall(c + 1, r)) return "v" // travels N–S
    return null
  }

  // (b) group straight cells into maximal runs; each run's two along-axis end-neighbours
  //     are the flat cells it connects.
  type Run = { id: number; cells: [number, number][]; axis: "h" | "v"; endA: [number, number]; endB: [number, number] }
  const runOf: (number | null)[][] = Array.from({ length: rows }, () => Array<number | null>(cols).fill(null))
  const runs: Run[] = []
  for (let r0 = 0; r0 < rows; r0++) for (let c0 = 0; c0 < cols; c0++) {
    const ax = straightAxis(c0, r0)
    if (ax === null || runOf[r0][c0] !== null) continue
    const [dc, dr] = ax === "h" ? [1, 0] : [0, 1]
    let sc = c0, sr = r0
    while (straightAxis(sc - dc, sr - dr) === ax) { sc -= dc; sr -= dr }
    const id = runs.length
    const cells: [number, number][] = []
    for (let cc = sc, cr = sr; straightAxis(cc, cr) === ax; cc += dc, cr += dr) { runOf[cr][cc] = id; cells.push([cc, cr]) }
    const [fc, fr] = cells[0], [lc, lr] = cells[cells.length - 1]
    runs.push({ id, cells, axis: ax, endA: [fc - dc, fr - dr], endB: [lc + dc, lr + dr] })
  }

  // (c) flat units = components of open cells with all run cells removed.
  const unit: number[][] = Array.from({ length: rows }, () => Array<number>(cols).fill(-1))
  let unitCount = 0
  for (let r0 = 0; r0 < rows; r0++) for (let c0 = 0; c0 < cols; c0++) {
    if (!isOpen(c0, r0) || runOf[r0][c0] !== null || unit[r0][c0] !== -1) continue
    const id = unitCount++
    const q: [number, number][] = [[c0, r0]]; unit[r0][c0] = id
    while (q.length) {
      const [cc, cr] = q.shift()!
      for (const [dc, dr] of NDIRS) {
        const nc = cc + dc, nr = cr + dr
        if (isOpen(nc, nr) && runOf[nr][nc] === null && unit[nr][nc] === -1) { unit[nr][nc] = id; q.push([nc, nr]) }
      }
    }
  }

  // (d) weighted union-find over units: offset[x] = level(x) − level(parent[x]).
  const parent = Array.from({ length: unitCount }, (_, i) => i)
  const offset = new Array<number>(unitCount).fill(0)
  const find = (x: number): { root: number; off: number } => {
    if (parent[x] === x) return { root: x, off: 0 }
    const up = find(parent[x]); offset[x] += up.off; parent[x] = up.root
    return { root: up.root, off: offset[x] }
  }
  const union = (u: number, v: number, delta: number) => { // set level(v) − level(u) = delta
    const fu = find(u), fv = find(v)
    parent[fv.root] = fu.root
    offset[fv.root] = delta + fu.off - fv.off
  }

  // (e) run edges (both ends open) in random order; tree edges pick a step, loop edges
  //     are forced to the difference the other path already set.
  const unitAt = (cell: [number, number]) => isOpen(cell[0], cell[1]) ? unit[cell[1]][cell[0]] : -1
  const runEdges = runs.filter(run => unitAt(run.endA) !== -1 && unitAt(run.endB) !== -1)
  for (let i = runEdges.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[runEdges[i], runEdges[j]] = [runEdges[j], runEdges[i]] }
  const runDelta = new Array<number>(runs.length).fill(0) // realized level change on each run
  const wallOff = new Array<boolean>(runs.length).fill(false)
  for (const run of runEdges) {
    const u = unitAt(run.endA), v = unitAt(run.endB)
    const fu = find(u), fv = find(v)
    if (fu.root !== fv.root) {                       // spanning-tree edge: choose a step
      const delta = Math.random() < STAIR_CHANCE ? (Math.random() < 0.5 ? 1 : -1) : 0
      union(u, v, delta); runDelta[run.id] = delta
    } else {                                         // loop edge: difference is forced
      const forced = fv.off - fu.off
      if (Math.abs(forced) <= 1) runDelta[run.id] = forced
      else wallOff[run.id] = true                    // unrealisable → drop this redundant run
    }
  }

  // (f) absolute unit levels (root = 0 per component), a per-cell level grid, and stairs.
  const unitLevel = Array.from({ length: unitCount }, (_, u) => find(u).off)
  const levels: LevelGrid = Array.from({ length: rows }, () => Array<number | null>(cols).fill(null))
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (unit[r][c] !== -1) levels[r][c] = unitLevel[unit[r][c]]
  for (const run of runs) {
    if (wallOff[run.id]) { for (const [c, r] of run.cells) grid[r][c] = Material.Wall; continue }
    const ua = unitAt(run.endA), ub = unitAt(run.endB)
    const la = ua !== -1 ? unitLevel[ua] : null, lb = ub !== -1 ? unitLevel[ub] : null
    const lvl = la !== null && lb !== null ? Math.min(la, lb) : (la ?? lb ?? 0)
    const delta = runDelta[run.id]
    if (delta !== 0) {
      // delta = level(endB) − level(endA); "up" points toward the higher end.
      const up: Edge = run.axis === "h" ? (delta > 0 ? "e" : "w") : (delta > 0 ? "s" : "n")
      for (const [c, r] of run.cells) { grid[r][c] = Material.Stairs; stairs[r][c] = up; levels[r][c] = lvl }
    } else {
      for (const [c, r] of run.cells) levels[r][c] = lvl
    }
  }

  // (g) room level (for badges/legend) = the level of its interior unit.
  for (const room of rooms) {
    const u = unit[room.y][room.x]
    room.z = u !== -1 ? unitLevel[u] : (levels[room.y][room.x] ?? 0)
  }

  // 3. Doors at 1-wide corridor pinches that open into a room. Recorded on the THRESHOLD
  //    EDGE between the pinch and the room-interior neighbour (direction known here → no
  //    render-time guess → no flip); the pinch stays Floor. Dedup adjacent pinches.
  //    (`edges`/`setEdge` are declared at the top of generateDungeon.)
  const floorNeighbors = (c: number, r: number) =>
    (isFloor(c - 1, r) ? 1 : 0) + (isFloor(c + 1, r) ? 1 : 0) + (isFloor(c, r - 1) ? 1 : 0) + (isFloor(c, r + 1) ? 1 : 0)
  const isRoomInterior = (c: number, r: number) => isFloor(c, r) && floorNeighbors(c, r) >= 3
  const DOOR_DIRS: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  const doorPinch = new Set<number>()
  const pinchAdjacent = (c: number, r: number) => DOOR_DIRS.some(([dc, dr]) => {
    const nc = c + dc, nr = r + dr
    return nc >= 0 && nc < cols && nr >= 0 && nr < rows && doorPinch.has(nr * cols + nc)
  })

  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (grid[r][c] !== Material.Floor) continue
    const vCorridor = isWall(c, r - 1) && isWall(c, r + 1) && isFloor(c - 1, r) && isFloor(c + 1, r)
    const hCorridor = isWall(c - 1, r) && isWall(c + 1, r) && isFloor(c, r - 1) && isFloor(c, r + 1)
    if (!vCorridor && !hCorridor) continue
    const roomDir = DOOR_DIRS.find(([dc, dr]) => isRoomInterior(c + dc, r + dr))
    if (!roomDir || pinchAdjacent(c, r) || Math.random() >= DOOR_CHANCE) continue
    setEdge(c, r, roomDir[0], roomDir[1], EDGE.door)
    doorPinch.add(r * cols + c)
  }

  // 4. Water conditions per region. Each room and hall rolls one mutually-exclusive
  //    condition: dry / pool (rooms, single cell) / partial (band hugging a side, dry
  //    approach kept at entrances) / full (whole region flooded). Rendering handles
  //    any Water cells; this only decides which Floor cells become Water.
  const DIRS4: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  const key = (c: number, r: number) => r * cols + c
  const openCell = (c: number, r: number) => inb(c, r) && grid[r][c] !== Material.Wall

  type Region = { cells: [number, number][]; has: Set<number> }

  // Region Floor cells clear of a "mouth" (a region cell adjacent to an open cell
  // OUTSIDE the region — an entrance/door junction), so partial fills stay dry there.
  const fillableOf = (reg: Region): Set<number> => {
    const mouth = new Set<number>()
    for (const [c, r] of reg.cells) {
      for (const [dc, dr] of DIRS4) if (openCell(c + dc, r + dr) && !reg.has.has(key(c + dc, r + dr))) { mouth.add(key(c, r)); break }
    }
    const nearMouth = (c: number, r: number) => {
      for (let dr = -ENTRANCE_CLEAR; dr <= ENTRANCE_CLEAR; dr++) for (let dc = -ENTRANCE_CLEAR; dc <= ENTRANCE_CLEAR; dc++)
        if (mouth.has(key(c + dc, r + dr))) return true
      return false
    }
    const out = new Set<number>()
    for (const [c, r] of reg.cells) if (grid[r][c] === Material.Floor && !nearMouth(c, r)) out.add(key(c, r))
    return out
  }

  const fillFull = (reg: Region) => {
    for (const [c, r] of reg.cells) if (grid[r][c] === Material.Floor) grid[r][c] = Material.Water
  }

  // Single-cell pool (rooms): may touch walls, clear of any entrance/door opening.
  const isOpening = (c: number, r: number) =>
    !isWall(c, r) && ((isWall(c, r - 1) && isWall(c, r + 1)) || (isWall(c - 1, r) && isWall(c + 1, r)))
  const nearOpening = (c: number, r: number) => {
    for (let dr = -ENTRANCE_CLEAR; dr <= ENTRANCE_CLEAR; dr++) for (let dc = -ENTRANCE_CLEAR; dc <= ENTRANCE_CLEAR; dc++)
      if (isOpening(c + dc, r + dr)) return true
    return false
  }
  const fillPool = (room: Room) => {
    for (let attempt = 0; attempt < POOL_TRIES; attempt++) {
      const sx = randInt(room.x, room.x + room.w - 1)
      const sy = randInt(room.y, room.y + room.h - 1)
      if (grid[sy][sx] === Material.Floor && !nearOpening(sx, sy)) { grid[sy][sx] = Material.Water; break }
    }
  }

  // Partial ROOM: a contiguous water band hugging a random side, edge jittered ±1.
  const fillPartialRoom = (room: Room, reg: Region) => {
    const fillable = fillableOf(reg)
    const side = randInt(0, 3) // 0=N 1=S 2=E 3=W
    const horizontal = side >= 2
    const span = horizontal ? room.w : room.h
    const depth = Math.max(1, Math.round((PARTIAL_MIN + Math.random() * (PARTIAL_MAX - PARTIAL_MIN)) * span))
    const jit = new Map<number, number>()
    const jitter = (line: number) => { if (!jit.has(line)) jit.set(line, randInt(-1, 1)); return jit.get(line)! }
    for (const [c, r] of reg.cells) {
      if (!fillable.has(key(c, r))) continue
      const dist = side === 0 ? r - room.y : side === 1 ? room.y + room.h - 1 - r
                 : side === 2 ? room.x + room.w - 1 - c : c - room.x
      if (dist < depth + jitter(horizontal ? r : c)) grid[r][c] = Material.Water
    }
  }

  // Partial HALL: a contiguous mid-segment run (ends stay dry), grown from a seed.
  const fillPartialHall = (reg: Region) => {
    const fillable = fillableOf(reg)
    if (fillable.size === 0) return
    const arr = [...fillable]
    const target = Math.max(1, Math.round((PARTIAL_MIN + Math.random() * (PARTIAL_MAX - PARTIAL_MIN)) * reg.cells.length))
    const seedK = arr[randInt(0, arr.length - 1)]
    const done = new Set<number>([seedK]); const q: [number, number][] = [[seedK % cols, Math.floor(seedK / cols)]]; let n = 0
    while (q.length && n < target) {
      const [c, r] = q.shift()!
      if (grid[r][c] === Material.Floor) { grid[r][c] = Material.Water; n++ }
      for (const [dc, dr] of DIRS4) { const k = key(c + dc, r + dr); if (fillable.has(k) && !done.has(k)) { done.add(k); q.push([c + dc, r + dr]) } }
    }
  }

  const roomRegion = (rm: Room): Region => {
    const cells: [number, number][] = []; const has = new Set<number>()
    for (let r = rm.y; r < rm.y + rm.h; r++) for (let c = rm.x; c < rm.x + rm.w; c++)
      if (isFloor(c, r)) { cells.push([c, r]); has.add(key(c, r)) }
    return { cells, has }
  }

  // Rooms: roll a condition (min-size rooms only get dry/full).
  for (const room of rooms) {
    const reg = roomRegion(room)
    const big = room.w >= MIN_ROOM_DIM && room.h >= MIN_ROOM_DIM
    const x = Math.random()
    if (big) {
      if (x < ROOM_POOL) fillPool(room)
      else if (x < ROOM_POOL + ROOM_PARTIAL) fillPartialRoom(room, reg)
      else if (x < ROOM_POOL + ROOM_PARTIAL + ROOM_FULL) fillFull(reg)
    } else if (x < ROOM_FULL) {
      fillFull(reg)
    }
  }

  // Halls: connected components of Floor cells outside every room → dry/partial/full.
  const hallSeen = new Set<number>()
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (grid[r][c] !== Material.Floor || inAnyRoom(c, r) || hallSeen.has(key(c, r))) continue
    const cells: [number, number][] = []; const has = new Set<number>(); const q: [number, number][] = [[c, r]]
    hallSeen.add(key(c, r))
    while (q.length) {
      const [cc, rr] = q.shift()!; cells.push([cc, rr]); has.add(key(cc, rr))
      for (const [dc, dr] of DIRS4) {
        const nc = cc + dc, nr = rr + dr, k = key(nc, nr)
        if (inb(nc, nr) && grid[nr][nc] === Material.Floor && !inAnyRoom(nc, nr) && !hallSeen.has(k)) { hallSeen.add(k); q.push([nc, nr]) }
      }
    }
    const reg: Region = { cells, has }
    const x = Math.random()
    if (x < HALL_PARTIAL) fillPartialHall(reg)
    else if (x < HALL_PARTIAL + HALL_FULL) fillFull(reg)
  }

  // 5. Pillars — a random subset of rooms are "pillared". A pillar sits on every
  //    interior vertex whose 4 surrounding cells are Floor or Water (never Wall/Door),
  //    so pillars stay in room interiors and may sit over water. Vertex grid is
  //    (rows+1)×(cols+1), indexed [vj][vi].
  const pillars: PillarGrid = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(false))
  //    Each pillared room rolls one of three layouts: `all` interior vertices,
  //    `perimeter` (outer ring on all four walls), or `rows` (only two parallel outer lines —
  //    top+bottom OR left+right, chosen per room).
  const pillarOk = (c: number, r: number) => inb(c, r) && (grid[r][c] === Material.Floor || grid[r][c] === Material.Water)
  const PILLAR_PATTERNS = ["all", "perimeter", "rows"] as const
  for (const room of rooms) {
    if (room.w < MIN_ROOM_DIM || room.h < MIN_ROOM_DIM) continue
    if (Math.random() >= PILLAR_ROOM_CHANCE) continue
    const pattern = PILLAR_PATTERNS[randInt(0, PILLAR_PATTERNS.length - 1)]
    const rowsHoriz = Math.random() < 0.5 // for `rows`: two horizontal rows vs two vertical columns
    const vi0 = room.x + 1, vi1 = room.x + room.w - 1
    const vj0 = room.y + 1, vj1 = room.y + room.h - 1
    for (let vj = vj0; vj <= vj1; vj++) for (let vi = vi0; vi <= vi1; vi++) {
      const onPerimeter = vi === vi0 || vi === vi1 || vj === vj0 || vj === vj1
      const inPattern = pattern === "all" ? true
        : pattern === "perimeter" ? onPerimeter
        : rowsHoriz ? (vj === vj0 || vj === vj1)   // "rows" (horizontal): top + bottom rows
          : (vi === vi0 || vi === vi1)             // "rows" (vertical): left + right columns
      if (!inPattern) continue
      if (pillarOk(vi - 1, vj - 1) && pillarOk(vi, vj - 1) && pillarOk(vi - 1, vj) && pillarOk(vi, vj)) {
        pillars[vj][vi] = true
      }
    }
  }

  // 6. Level portals: entrances (stairs up/out) + exits (stairs down/out). A short stairwell
  //    punched through wall to either the MAP EDGE or an INTERIOR dead-end pocket. Placed AFTER
  //    elevation as a spur (single connection), so they can't affect interior levels; the flight
  //    reuses Material.Stairs, the terminal is recorded for its marker.
  const portals: Portal[] = []
  const edgeCell = (c: number, r: number) => c === 0 || c === cols - 1 || r === 0 || r === rows - 1
  const upFromDir = (dx: number, dy: number): Edge => dx > 0 ? "e" : dx < 0 ? "w" : dy > 0 ? "s" : "n"
  const oppEdge = (e: Edge): Edge => e === "e" ? "w" : e === "w" ? "e" : e === "s" ? "n" : "s"
  // Candidate stairwells from an interior open cell: a straight 1-wide WALL channel that either
  // reaches the map edge (→ edgeSpots) or dead-ends in a wall pocket (→ interiorSpots).
  type Spot = { flight: [number, number][]; anchor: [number, number]; dx: number; dy: number }
  const edgeSpots: Spot[] = [], interiorSpots: Spot[] = []
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (isWall(c, r) || edgeCell(c, r)) continue // anchor must be an interior open cell
    for (const [dx, dy] of SDIRS) {
      const flight: [number, number][] = []
      let cc = c + dx, rr = r + dy
      while (inb(cc, rr) && flight.length < PORTAL_MAX_LEN) {
        if (!isWall(cc, rr)) break                   // hit open → channel ends before here
        const perp = dx !== 0 ? (isWall(cc, rr - 1) && isWall(cc, rr + 1)) : (isWall(cc - 1, rr) && isWall(cc + 1, rr))
        if (!perp) break                             // keep the stairwell 1-wide
        flight.push([cc, rr])
        if (edgeCell(cc, rr)) break                  // reached the map edge
        cc += dx; rr += dy
      }
      const last = flight[flight.length - 1]
      if (!last) continue
      const spot: Spot = { flight, anchor: [c, r], dx, dy }
      if (edgeCell(last[0], last[1])) edgeSpots.push(spot)
      else if (isWall(last[0] + dx, last[1] + dy)) interiorSpots.push(spot) // terminal is a dead-end pocket
    }
  }
  const shuffle = (a: Spot[]) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } }
  shuffle(edgeSpots); shuffle(interiorSpots)

  // A flight cell too close to ANY existing stair — interior stairs (elevation) OR already-placed
  // portals (which are also Material.Stairs). Requires a wall tile between a portal and any stair,
  // and (since the anchor is a neighbour of flight[0]) rejects an anchor that is itself a stair.
  const nearStair = (c: number, r: number): boolean => {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nc = c + dc, nr = r + dr
      if (nc >= 0 && nc < cols && nr >= 0 && nr < rows && grid[nr][nc] === Material.Stairs) return true
    }
    return false
  }
  const carvePortal = (spots: Spot[], kind: PortalKind): boolean => {
    for (const spot of spots) {
      if (spot.flight.some(([c, r]) => !isWall(c, r) || nearStair(c, r))) continue // free + ≥1 tile from any stair
      const [ax, ay] = spot.anchor
      const anchorLevel = levels[ay][ax] ?? 0
      const outward = upFromDir(spot.dx, spot.dy)
      const up = kind === "entrance" ? outward : oppEdge(outward) // entrance points out (up=off-map), exit points in
      for (const [c, r] of spot.flight) {
        grid[r][c] = Material.Stairs; stairs[r][c] = up; levels[r][c] = anchorLevel
      }
      const [tx, ty] = spot.flight[spot.flight.length - 1]
      portals.push({ c: tx, r: ty, kind })
      return true
    }
    return false
  }
  // Per portal: ~PORTAL_EDGE_CHANCE prefer an edge spot, else interior; fall back to the other.
  const placePortal = (kind: PortalKind): boolean => {
    const [first, second] = Math.random() < PORTAL_EDGE_CHANCE ? [edgeSpots, interiorSpots] : [interiorSpots, edgeSpots]
    return carvePortal(first, kind) || carvePortal(second, kind)
  }
  const pickCount = () => { const x = Math.random(); return x < 0.6 ? 1 : x < 0.85 ? 2 : x < 0.96 ? 3 : 4 }
  for (let i = 0, n = pickCount(); i < n; i++) if (!placePortal("entrance")) break
  for (let i = 0, n = pickCount(); i < n; i++) if (!placePortal("exit")) break

  return { grid, pillars, rooms, stairs, levels, portals, edges }
}
