import { Material, MaterialGrid, PillarGrid, StairGrid, LevelGrid, RoomInfo, RoomShape, Edge, Apse, Alcove, Portal, PortalKind, EDGE, EdgeKind, EdgeGrids, Corner, DungeonResult, WaterCondition, RoomSize, MapElement } from "./types"
import { rootContext, childContext } from "../../core/model" // GenContext flows dungeon → room (Step 4)
import { buildRoomObject } from "./roomObject" // a room as a config object on core/config (Step 8)
import { buildElementObject } from "./elementObject" // a non-room element as a config object (Idea 12)
import { buildDungeonObject, dungeonToTags } from "./dungeonObject" // the dungeon-as-a-whole = the tree ROOT object
import { mulberry32, randomSeed, type Rng } from "../../core/rng" // T1: seeded generation

// Seeded PRNG for this module. Reassigned at the top of generateDungeon (synchronous, single-run
// generation → module-level state is safe). Defaults to Math.random so any use before seeding works.
let rng: Rng = Math.random

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

// Apses (E3b): semicircular OPEN bays bulging from a rect room's wall. Per eligible wall,
// APSE_CHANCE to grow a radius-2 bay; APSE_CENTER_BIAS = chance it's exactly centred on the wall.
const APSE_CHANCE = 0.65
const APSE_CENTER_BIAS = 0.6
const BUMP_FRACTION = 0.5   // of apse walls, share that get a run of tiny r=1 bumps vs one r=2 bay
const BUMP_CENTER_BIAS = 0.9 // chance a LONE bump stays wall-centred (else it may sit off-centre for variety)
const BUMP_RUN_CHANCE = 0.6 // per lattice step, chance to extend the contiguous bump run one more (else stop)

// Alcoves (E3d): outward half-circle bays (sibling to apses), one FAMILY per room. A rect room is an
// alcove-room with ALCOVE_FAMILY_CHANCE (else an apse-room); an alcove-room's wall gets an alcove with
// ALCOVE_CHANCE. Phase 1 = large alcoves only (3×1½); small (1×½) added in Phase 2.
const ALCOVE_FAMILY_CHANCE = 0.4
const ALCOVE_CHANCE = 0.65
const ALCOVE_SMALL_FRACTION = 0.5 // of alcove-rooms, share that use small (1×½) vs large (3×1½) — one size per room

// Extended room geometry (E3a). Footprints are SUBSETS of the {x,y,w,h} bounding box. `rounded`
// needs min-dim ≥4; the circle-based shapes (circle/half/quarter) need ≥5 so they read clearly.

function randInt(min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}

// Pick a footprint shape for a room of the given (rolled) bounding size; small rooms stay rect.
// rounded needs min-dim ≥4; circle needs ≥5 (and a square box) so it reads as round.
function pickShape(w: number, h: number): RoomShape {
  const m = Math.min(w, h)
  if (m < 4) return "rect"
  const roll = rng()
  if (m < 5) return roll < 0.6 ? "rect" : "rounded"          // size 4: only rect / rounded
  return roll < 0.35 ? "rect" : roll < 0.65 ? "rounded" : "circle"
}

// Tight box + corner radius for a shape (rolled max box w0×h0). A circle becomes an ODD (2r+1)²
// square (r∈{1,2,3}, picked RANDOMLY among the values that fit) so its centre is a single CELL
// (rm.x+r) that halls/doors align to → diameter 3/5/7 at comparable frequency. Four radius-r
// corners leave a 1-cell cardinal cross (a rounded square that reads round); r=1 → a small 3×3
// rounded square. rounded → r=1; rect → r=0. rect/rounded carve a FULL rectangle; corners a bite.
function shapeBox(shape: RoomShape, w0: number, h0: number): { w: number; h: number; cornerRadius: number } {
  if (shape === "circle") {
    const rMax = Math.min(3, Math.floor((Math.min(w0, h0) - 1) / 2))
    const r = randInt(1, Math.max(1, rMax)) // uniform among fitting {1,2,3} → D=3/5/7 all appear
    const d = 2 * r + 1
    return { w: d, h: d, cornerRadius: r }
  }
  return { w: w0, h: h0, cornerRadius: shape === "rounded" ? 1 : 0 }
}

// The cells of a room's footprint. rect/rounded carve the FULL rectangle (rounded corners are a
// render-only bite on otherwise-floor corner cells). A CIRCLE carves the DISC (cells within R=D/2
// of the box centre) → genuinely round; on an ODD box the centre is a CELL (rm.x+r), so the disc
// is symmetric and its cardinal edge-contact is centred there (halls align). The box perimeter is
// Wall except the central cells → corridors connect at centre; the corner overlay smooths it.
function shapeCells(x: number, y: number, w: number, h: number, shape: RoomShape): [number, number][] {
  const cells: [number, number][] = []
  if (shape === "circle") {
    const cx = x + w / 2, cy = y + h / 2, R = w / 2
    for (let r = y; r < y + h; r++) for (let c = x; c < x + w; c++) {
      const dx = c + 0.5 - cx, dy = r + 0.5 - cy
      if (dx * dx + dy * dy <= R * R) cells.push([c, r])
    }
    return cells
  }
  for (let r = y; r < y + h; r++) for (let c = x; c < x + w; c++) cells.push([c, r])
  return cells
}

function overlaps(a: Room, b: Room): boolean {
  return (
    a.x - 1 <= b.x + b.w && a.x + a.w + 1 >= b.x &&
    a.y - 1 <= b.y + b.h && a.y + a.h + 1 >= b.y
  )
}

export function generateDungeon(cols: number, rows: number, seed: number = randomSeed()): DungeonResult {
  rng = mulberry32(seed) // T1: seed the module rng first → the whole generation (incl. room names) is reproducible
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

  // 1. Rooms. Each room carves a footprint (`shape`, a subset of its {x,y,w,h} box) and stamps
  //    `roomAt` = its index for footprint-accurate membership (cut corners read as non-room).
  const rooms: Room[] = []
  const roomAt: number[][] = Array.from({ length: rows }, () => Array<number>(cols).fill(-1))
  const carveRoom = (cells: [number, number][], idx: number) => {
    for (const [c, r] of cells) { carve(c, r); if (inb(c, r)) roomAt[r][c] = idx }
  }
  const targetRooms = Math.max(2, Math.round((cols * rows) / 30))
  for (let i = 0; i < targetRooms * 6 && rooms.length < targetRooms; i++) {
    // Moderately larger rooms (higher ceiling than the old /3) so walls are longer for
    // side-rooms, while staying small enough that several rooms still fit the map.
    const w0 = randInt(2, Math.max(4, Math.floor(cols / 2.3)))
    const h0 = randInt(2, Math.max(4, Math.floor(rows / 2.3)))
    const shape = pickShape(w0, h0)
    const { w, h, cornerRadius } = shapeBox(shape, w0, h0) // tight box + corner radius (circle → 2r square)
    const x = randInt(1, Math.max(1, cols - w - 1))
    const y = randInt(1, Math.max(1, rows - h - 1))
    const room: Room = { x, y, w, h, z: 0, shape, cornerRadius, roundCorners: [], apses: [], alcoves: [], num: 0, name: "" }
    if (rooms.some(other => overlaps(room, other))) continue // bounding-box overlap (footprint ⊆ box)
    carveRoom(shapeCells(x, y, w, h, shape), rooms.length)
    rooms.push(room)
  }
  if (rooms.length === 0) {
    carveRoom(shapeCells(0, 0, cols, rows, "rect"), 0)
    rooms.push({ x: 0, y: 0, w: cols, h: rows, z: 0, shape: "rect", cornerRadius: 0, roundCorners: [], apses: [], alcoves: [], num: 0, name: "" })
  }

  // Room membership (also used for water regions below): a cell in any room's carved footprint.
  const inAnyRoom = (c: number, r: number) => inb(c, r) && roomAt[r][c] >= 0

  // 2. Corridors via a spatial connection graph — an MST over room proximity plus a few
  //    intentional loop edges — routed to AVOID cutting through non-endpoint rooms
  //    (corridor↔corridor crossings are fine). Replaces the old placement-order chain;
  //    elevation (Pass B) is then derived from the resulting geometry.
  const stairs: StairGrid = Array.from({ length: rows }, () => Array<Edge | null>(cols).fill(null))
  const centerOf = (r: Room) => ({ cx: r.x + (r.w >> 1), cy: r.y + (r.h >> 1) })
  // Connector MAGNETS: a circle room may be entered ONLY at a cardinal midpoint (where the circle
  // touches its box). `portOf` picks the cardinal port facing the other room + the cell just OUTSIDE
  // it, so the corridor meets the circle perpendicular at the port; routing then runs from `out`.
  const isCircle = (k: number) => rooms[k].cornerRadius >= 2
  const portOf = (k: number, ox: number, oy: number): { port: [number, number]; out: [number, number] } => {
    const rm = rooms[k], cx = rm.x + (rm.w >> 1), cy = rm.y + (rm.h >> 1)
    if (Math.abs(ox - cx) >= Math.abs(oy - cy)) {
      return ox >= cx ? { port: [rm.x + rm.w - 1, cy], out: [rm.x + rm.w, cy] }  // E
                      : { port: [rm.x, cy], out: [rm.x - 1, cy] }                // W
    }
    return oy >= cy ? { port: [cx, rm.y + rm.h - 1], out: [cx, rm.y + rm.h] }    // S
                    : { port: [cx, rm.y], out: [cx, rm.y - 1] }                  // N
  }
  const hCells = (cy: number, cxA: number, cxB: number): [number, number][] => {
    const a: [number, number][] = []; for (let c = Math.min(cxA, cxB); c <= Math.max(cxA, cxB); c++) a.push([c, cy]); return a
  }
  const vCells = (cx: number, cyA: number, cyB: number): [number, number][] => {
    const a: [number, number][] = []; for (let r = Math.min(cyA, cyB); r <= Math.max(cyA, cyB); r++) a.push([cx, r]); return a
  }
  // A corridor may not enter a THIRD room's box; a CIRCLE also gets a 1-cell keep-away margin, else
  // a pass-by corridor runs flush to the box and the disc bulge touches it (dropping the neighbour
  // hall's wall detail + making an off-centre connection).
  const crossesThird = (path: [number, number][], ai: number, bi: number): boolean => {
    for (const [c, r] of path) {
      for (let k = 0; k < rooms.length; k++) {
        if (k === ai || k === bi) continue
        const rm = rooms[k], m = isCircle(k) ? 1 : 0
        if (c >= rm.x - m && c < rm.x + rm.w + m && r >= rm.y - m && r < rm.y + rm.h + m) return true
      }
    }
    return false
  }
  // L-route between rooms ai,bi: prefer an elbow that avoids all third rooms. Circle endpoints are
  // routed to their cardinal port (+ a 1-cell perpendicular stub), so corridors meet them centred.
  const routeEdge = (ai: number, bi: number): { path: [number, number][]; clean: boolean } => {
    const a = centerOf(rooms[ai]), b = centerOf(rooms[bi])
    let ax = a.cx, ay = a.cy, bx = b.cx, by = b.cy
    const pre: [number, number][] = [], post: [number, number][] = []
    let portA: [number, number] | null = null, portB: [number, number] | null = null
    let outA: [number, number] | null = null, outB: [number, number] | null = null
    if (isCircle(ai)) { const { port, out } = portOf(ai, b.cx, b.cy); pre.push(port);[ax, ay] = out; portA = port; outA = out }
    if (isCircle(bi)) { const { port, out } = portOf(bi, a.cx, a.cy); post.push(port);[bx, by] = out; portB = port; outB = out }
    // A route may touch a circle endpoint's box+1-margin ONLY at its port & out cell (else a leg
    // grazes the disc off-centre — crossesThird skips endpoints, so guard it here).
    const clearOf = (full: [number, number][], k: number, port: [number, number] | null, out: [number, number] | null) => {
      if (!port || !out) return true
      const rm = rooms[k]
      return !full.some(([c, r]) =>
        c >= rm.x - 1 && c < rm.x + rm.w + 1 && r >= rm.y - 1 && r < rm.y + rm.h + 1
        && !(c === port[0] && r === port[1]) && !(c === out[0] && r === out[1]))
    }
    const e1 = hCells(ay, ax, bx).concat(vCells(bx, ay, by))
    const e2 = vCells(ax, ay, by).concat(hCells(by, ax, bx))
    const opts = rng() < 0.5 ? [e1, e2] : [e2, e1]
    for (const p of opts) {
      const full = [...pre, ...p, ...post]
      if (!crossesThird(full, ai, bi) && clearOf(full, ai, portA, outA) && clearOf(full, bi, portB, outB)) return { path: full, clean: true }
    }
    return { path: [...pre, ...opts[0], ...post], clean: false } // last resort — kept rare by proximity MST
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

  // A circle (cornerRadius≥2) may be connected ONLY at its 4 cardinal ports (centre of each edge —
  // the same points halls magnet to). Extensions that attach to an open cell of a circle (side-rooms
  // step 2.5, portals step 6) must respect this, else they meet the round wall off-centre. Returns
  // true (unconstrained) for non-circle rooms and D=3/cornerRadius-1 circles (matches the hall magnet).
  const circleCardinalOk = (c: number, r: number, dx: number, dy: number): boolean => {
    const rm = rooms.find(m => m.cornerRadius >= 2 && c >= m.x && c < m.x + m.w && r >= m.y && r < m.y + m.h)
    if (!rm) return true
    const cr = rm.cornerRadius, cx = rm.x + cr, cy = rm.y + cr
    return (c === cx && r === rm.y && dx === 0 && dy === -1)              // N port, outward north
      || (c === cx && r === rm.y + rm.h - 1 && dx === 0 && dy === 1)      // S
      || (c === rm.x && r === cy && dx === -1 && dy === 0)               // W
      || (c === rm.x + rm.w - 1 && r === cy && dx === 1 && dy === 0)     // E
  }

  // 2.5a Apses: semicircular OPEN bays bulging from a rect room's straight wall. Placed AFTER
  //      corridors (like side-rooms) so the free-wall test also rejects any spot touching a corridor
  //      → no corridor (clean OR last-resort) is ever adjacent to an apse. Still before Pass B/water/
  //      pillars, so the bay (roomAt=parent, contiguous) inherits the room's elevation + water. The
  //      bay is DISC-carved (half-disc): its two far corners stay Wall (rendered floor/water-base
  //      under the bite), so anything beside the curve sees Wall. Bay + a 1-cell margin must be free.
  const rectAllWall = (x: number, y: number, w: number, h: number): boolean => {
    if (x < 1 || y < 1 || x + w > cols - 1 || y + h > rows - 1) return false
    for (let r = y; r < y + h; r++) for (let c = x; c < x + w; c++) if (!isWall(c, r)) return false
    return true
  }
  const WALLS: { wall: Edge; horiz: boolean }[] = [
    { wall: "n", horiz: true }, { wall: "s", horiz: true }, { wall: "w", horiz: false }, { wall: "e", horiz: false },
  ]
  const apseCellList: [number, number][] = []
  // Try to carve one apse of radius `r` centred at wall-vertex `center` on `room`'s `wall`. Requires
  // the bay box + a 1-cell margin (3 outward sides; room side stays flush) all Wall — which also
  // rejects any spot touching a corridor. DISC-carves (half-disc) so far corners stay Wall. Returns
  // whether it placed. Shared by bays (r=2) and bumps (r=1).
  // Geometry for an apse of radius r on `wall` centred at vertex `center`: the disc `cells` + the
  // outward margin box (mx,my,mw,mh). Shared by the placer and the bump dry-fit check.
  const apseCells = (room: Room, wall: Edge, center: number, r: number) => {
    let bx: number, by: number, bw: number, bh: number, mx: number, my: number, mw: number, mh: number
    if (wall === "n") { bx = center - r; by = room.y - r; bw = 2 * r; bh = r; mx = bx - 1; my = by - 1; mw = bw + 2; mh = bh + 1 }
    else if (wall === "s") { bx = center - r; by = room.y + room.h; bw = 2 * r; bh = r; mx = bx - 1; my = by; mw = bw + 2; mh = bh + 1 }
    else if (wall === "w") { bx = room.x - r; by = center - r; bw = r; bh = 2 * r; mx = bx - 1; my = by - 1; mw = bw + 1; mh = bh + 2 }
    else { bx = room.x + room.w; by = center - r; bw = r; bh = 2 * r; mx = bx; my = by - 1; mw = bw + 1; mh = bh + 2 }
    const px = wall === "w" ? room.x : wall === "e" ? room.x + room.w : center
    const py = wall === "n" ? room.y : wall === "s" ? room.y + room.h : center
    const cells: [number, number][] = []
    for (let cr = by; cr < by + bh; cr++) for (let cc = bx; cc < bx + bw; cc++) {
      const ddx = cc + 0.5 - px, ddy = cr + 0.5 - py
      if (ddx * ddx + ddy * ddy <= r * r) cells.push([cc, cr])
    }
    return { cells, mx, my, mw, mh }
  }
  // Bump free-test: allow ADJACENCY to the same room (another of its bumps) but never let a bump sit
  // orthogonally flush to a corridor / other room. Each cell must be carvable + inside the 1-cell
  // border; every OPEN orthogonal neighbour must belong to THIS room (parent box or an earlier bump,
  // roomAt===idx). Preserves the "nothing flush to an apse" invariant while permitting scallops.
  const bumpCellsOk = (cells: [number, number][], idx: number): boolean => {
    for (const [cc, cr] of cells) {
      if (cc < 1 || cr < 1 || cc >= cols - 1 || cr >= rows - 1 || !isWall(cc, cr)) return false
      for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nc = cc + dc, nr = cr + dr
        if (!isWall(nc, nr) && !(inb(nc, nr) && roomAt[nr][nc] === idx)) return false
      }
    }
    return true
  }
  // Dry check: would an r=1 bump at `center` place? (no carve) — lets a symmetric run be validated first.
  const bumpFits = (room: Room, idx: number, wall: Edge, center: number): boolean =>
    bumpCellsOk(apseCells(room, wall, center, 1).cells, idx)
  const tryPlaceApse = (room: Room, idx: number, wall: Edge, center: number, r: number, variant: "bay" | "bump"): boolean => {
    const { cells, mx, my, mw, mh } = apseCells(room, wall, center, r)
    if (variant === "bay") {
      if (!rectAllWall(mx, my, mw, mh)) return false // a bay never touches anything
    } else {
      if (!bumpCellsOk(cells, idx)) return false
    }
    carveRoom(cells, idx)
    for (const cell of cells) apseCellList.push(cell)
    room.apses.push({ wall, center, radius: r, variant })
    return true
  }

  // ALCOVES (E3d): outward half-circle bays with dedicated half-circle tiles. lg = 3 wide, carve 1
  // deep (near row → real floor extension), reserve 2 (the outer ½-cell far row is tile-only); sm =
  // 1 wide, carve 0 deep, reserve 1 (a sub-cell nub, cell stays Wall). `alcoveGeom` returns the carve
  // cells (floor), the footprint cells (carve + tile-only, for the flush margin), and the free-wall
  // box (reserve + a 1-cell ring; room side stays flush) — rejecting any spot touching a corridor.
  const alcoveCellList: [number, number][] = []
  const alcoveGeom = (room: Room, wall: Edge, center: number, size: "sm" | "lg") => {
    const wCells = size === "lg" ? 3 : 1, carveDepth = size === "lg" ? 1 : 0, reserveDepth = size === "lg" ? 2 : 1
    const half = (wCells - 1) / 2, a0 = center - half, a1 = center + half
    const cellAt = (along: number, depth: number): [number, number] =>
      wall === "n" ? [along, room.y - depth]
        : wall === "s" ? [along, room.y + room.h - 1 + depth]
          : wall === "w" ? [room.x - depth, along]
            : [room.x + room.w - 1 + depth, along] // e
    const carveCells: [number, number][] = [], footprintCells: [number, number][] = []
    for (let a = a0; a <= a1; a++) for (let d = 1; d <= reserveDepth; d++) {
      const cell = cellAt(a, d); footprintCells.push(cell); if (d <= carveDepth) carveCells.push(cell)
    }
    let mx: number, my: number, mw: number, mh: number
    if (wall === "n") { mx = a0 - 1; my = room.y - reserveDepth - 1; mw = wCells + 2; mh = reserveDepth + 1 }
    else if (wall === "s") { mx = a0 - 1; my = room.y + room.h; mw = wCells + 2; mh = reserveDepth + 1 }
    else if (wall === "w") { mx = room.x - reserveDepth - 1; my = a0 - 1; mw = reserveDepth + 1; mh = wCells + 2 }
    else { mx = room.x + room.w; my = a0 - 1; mw = reserveDepth + 1; mh = wCells + 2 }
    return { carveCells, footprintCells, mx, my, mw, mh }
  }
  const tryPlaceAlcove = (room: Room, idx: number, wall: Edge, center: number, size: "sm" | "lg"): boolean => {
    const { carveCells, footprintCells, mx, my, mw, mh } = alcoveGeom(room, wall, center, size)
    if (!rectAllWall(mx, my, mw, mh)) return false // free wall (also keeps corridors clear)
    if (carveCells.length) carveRoom(carveCells, idx)
    for (const cell of footprintCells) alcoveCellList.push(cell)
    room.alcoves.push({ wall, center, size })
    return true
  }
  // Dry check for a symmetric small-alcove run (sm cells stay Wall → adjacency is fine; the box test
  // still rejects corridors/other rooms).
  const alcoveFits = (room: Room, wall: Edge, center: number, size: "sm" | "lg"): boolean => {
    const { mx, my, mw, mh } = alcoveGeom(room, wall, center, size)
    return rectAllWall(mx, my, mw, mh)
  }

  for (let idx = 0; idx < rooms.length; idx++) {
    const room = rooms[idx]
    if (room.shape !== "rect") continue
    if (rng() < ALCOVE_FAMILY_CHANCE) {
      // ALCOVE-room: one SIZE per room (small OR large, never mixed).
      const roomUsesSmall = rng() < ALCOVE_SMALL_FRACTION
      for (const { wall, horiz } of WALLS) {
        if (rng() >= ALCOVE_CHANCE) continue
        const wallStart = horiz ? room.x : room.y, wallEnd = horiz ? room.x + room.w : room.y + room.h
        if (roomUsesSmall) {
          // SMALL alcoves (1×½ sub-cell nubs) — bump-like symmetric run at ONE consistent pitch
          // (1=adjacent, 2/3=gaps), mirrored-pair growth + outer-pair trim (all must dry-fit), a lone
          // nub usually centred. sm cells stay Wall so adjacency is fine.
          const lo = wallStart, hi = wallEnd - 1
          if (hi < lo) continue
          const P = rng() < 0.55 ? 1 : rng() < 0.6 ? 2 : 3
          const mid = Math.min(Math.max(Math.round((wallStart + wallEnd - 1) / 2), lo), hi)
          const canEven = P % 2 === 0 && mid - P / 2 >= lo && mid + P / 2 <= hi
          let centers: number[] = canEven && rng() < 0.4 ? [mid - P / 2, mid + P / 2] : [mid]
          while (rng() < BUMP_RUN_CHANCE) {
            const L = centers[0] - P, R = centers[centers.length - 1] + P
            if (L < lo || R > hi) break
            centers.unshift(L); centers.push(R)
          }
          while (centers.length > 0 && !centers.every(c => alcoveFits(room, wall, c, "sm"))) {
            if (centers.length >= 2) { centers.shift(); centers.pop() } else centers = []
          }
          if (centers.length === 1 && rng() >= BUMP_CENTER_BIAS) {
            const alt = randInt(lo, hi)
            if (alcoveFits(room, wall, alt, "sm")) centers = [alt]
          }
          for (const c of centers) tryPlaceAlcove(room, idx, wall, c, "sm")
        } else {
          // LARGE alcove (3×1½) — one bay-like, centre-biased, per qualifying wall.
          if (wallEnd - wallStart < 3) continue // lg needs a 3-wide wall
          const lo = wallStart + 1, hi = wallEnd - 2 // center = middle cell; span [center-1,center+1] fits
          const mid = Math.min(Math.max(Math.round((wallStart + wallEnd - 1) / 2), lo), hi)
          const center = rng() < APSE_CENTER_BIAS ? mid : randInt(lo, hi)
          tryPlaceAlcove(room, idx, wall, center, "lg")
        }
      }
      continue
    }
    const roomUsesBumps = rng() < BUMP_FRACTION // one apse SIZE per room — never mix bays + bumps
    for (const { wall, horiz } of WALLS) {
      if (rng() >= APSE_CHANCE) continue
      const wallStart = horiz ? room.x : room.y
      const wallEnd = horiz ? room.x + room.w : room.y + room.h
      const along = wallEnd - wallStart
      if (roomUsesBumps) {
        // Variant B — tiny r=1 bumps (2 wide × 1 deep) at ONE consistent pitch, positioned
        // SYMMETRICALLY about the wall centre. Pick pitch P (2=adjacent, 3=1-gap, 4=2-gap); start from
        // a wall-centred base (odd = one central bump; even = a central pair mid±P/2) and grow by
        // MIRRORED pairs on BUMP_RUN_CHANCE → centres[i]+centres[n-1-i] is constant (symmetric) by
        // construction. Trim the outermost pair until every centre dry-fits (stays symmetric). A lone
        // bump usually stays centred (BUMP_CENTER_BIAS) but may drift off-centre for variety.
        const r = 1
        if (along < 2 * r) continue
        const lo = wallStart + r, hi = wallEnd - r
        const P = rng() < 0.55 ? 2 : rng() < 0.6 ? 3 : 4
        const mid = Math.min(Math.max(Math.round(horiz ? room.x + room.w / 2 : room.y + room.h / 2), lo), hi)
        const canEven = P % 2 === 0 && mid - P / 2 >= lo && mid + P / 2 <= hi
        let centers: number[] = canEven && rng() < 0.4 ? [mid - P / 2, mid + P / 2] : [mid]
        while (rng() < BUMP_RUN_CHANCE) {
          const L = centers[0] - P, R = centers[centers.length - 1] + P
          if (L < lo || R > hi) break
          centers.unshift(L); centers.push(R)
        }
        // keep the largest symmetric subset that all fit (drop the outermost pair if any is blocked)
        while (centers.length > 0 && !centers.every(c => bumpFits(room, idx, wall, c))) {
          if (centers.length >= 2) { centers.shift(); centers.pop() } else centers = []
        }
        // a lone bump may occasionally sit off-centre for variety (a multi-run stays centred/symmetric)
        if (centers.length === 1 && rng() >= BUMP_CENTER_BIAS) {
          const alt = randInt(lo, hi)
          if (bumpFits(room, idx, wall, alt)) centers = [alt]
        }
        for (const c of centers) tryPlaceApse(room, idx, wall, c, r, "bump")
      } else {
        // Variant A — one r=2 half-circle bay, biased toward the wall centre.
        const r = 2
        if (along < 2 * r) continue
        const lo = wallStart + r, hi = wallEnd - r
        const mid = Math.min(Math.max(Math.round(horiz ? room.x + room.w / 2 : room.y + room.h / 2), lo), hi)
        const center = rng() < APSE_CENTER_BIAS ? mid : randInt(lo, hi)
        tryPlaceApse(room, idx, wall, center, r, "bay")
      }
    }
  }
  // Ring = each apse/alcove cell + its outward Wall neighbours → keep side-rooms/portals a wall-cell
  // clear of every apse/alcove too (corridors already avoided them by placement above).
  const apseMargin = new Set<number>()
  for (const [ac, ar] of [...apseCellList, ...alcoveCellList]) {
    apseMargin.add(ar * cols + ac)
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nc = ac + dc, nr = ar + dr
      if (isWall(nc, nr) && inb(nc, nr)) apseMargin.add(nr * cols + nc)
    }
  }

  // A side-room may not attach off an apse/alcove cell, nor onto a room wall that already has one.
  const apseBlocked = (c: number, r: number, dx: number, dy: number): boolean => {
    const k = roomAt[r]?.[c]
    if (k === undefined || k < 0) return false
    const rm = rooms[k]
    if (c < rm.x || c >= rm.x + rm.w || r < rm.y || r >= rm.y + rm.h) return true // anchor is an apse/alcove cell
    const wall: Edge = dx === 1 ? "e" : dx === -1 ? "w" : dy === 1 ? "s" : "n"
    return rm.apses.some(ap => ap.wall === wall) || rm.alcoves.some(al => al.wall === wall)
  }

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
  for (let i = cands.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1));[cands[i], cands[j]] = [cands[j], cands[i]] }
  for (const [ac, ar, dx, dy] of cands) {
    if (rng() >= SIDE_ROOM_CHANCE) continue
    if (isWall(ac, ar)) continue                     // may have been re-carved by an earlier side-room
    if (!circleCardinalOk(ac, ar, dx, dy)) continue  // a circle may host a side-room only at a cardinal
    if (apseBlocked(ac, ar, dx, dy)) continue         // no side-rooms off an apse bay or on an apse wall
    const nearC = ac + dx, nearR = ar + dy           // footprint cell that abuts the anchor
    if (!isWall(nearC, nearR)) continue
    const [sw, sh] = rng() < TINY_FRACTION ? TINY[randInt(0, 2)] : [randInt(2, 3), randInt(2, 3)]
    let x: number, y: number                         // footprint starts flush at the near cell
    if (dx !== 0) { x = dx > 0 ? nearC : nearC - sw + 1; y = nearR - randInt(0, sh - 1) }
    else { y = dy > 0 ? nearR : nearR - sh + 1; x = nearC - randInt(0, sw - 1) }
    if (!footprintFree(x, y, sw, sh)) continue
    let hitsApse = false                              // keep the side-room a wall-cell clear of any apse
    for (let r = y; r < y + sh && !hitsApse; r++) for (let c = x; c < x + sw; c++) if (apseMargin.has(r * cols + c)) { hitsApse = true; break }
    if (hitsApse) continue
    carveRoom(shapeCells(x, y, sw, sh, "rect"), rooms.length) // side-rooms stay rectangular
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
    rooms.push({ x, y, w: sw, h: sh, z: 0, shape: "rect", cornerRadius: 0, roundCorners: [], apses: [], alcoves: [], num: 0, name: "" })
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
  for (let i = runEdges.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1));[runEdges[i], runEdges[j]] = [runEdges[j], runEdges[i]] }
  const runDelta = new Array<number>(runs.length).fill(0) // realized level change on each run
  const wallOff = new Array<boolean>(runs.length).fill(false)
  for (const run of runEdges) {
    const u = unitAt(run.endA), v = unitAt(run.endB)
    const fu = find(u), fv = find(v)
    if (fu.root !== fv.root) {                       // spanning-tree edge: choose a step
      const delta = rng() < STAIR_CHANCE ? (rng() < 0.5 ? 1 : -1) : 0
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

  // (g) room level (for badges/legend) = the level of its interior unit. Sample the CENTRE
  //     cell (always inside these convex footprints; the top-left corner may be cut away).
  for (const room of rooms) {
    const cx = room.x + (room.w >> 1), cy = room.y + (room.h >> 1)
    const u = unit[cy][cx]
    room.z = u !== -1 ? unitLevel[u] : (levels[cy][cx] ?? 0)
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
    if (!roomDir || pinchAdjacent(c, r) || rng() >= DOOR_CHANCE) continue
    setEdge(c, r, roomDir[0], roomDir[1], EDGE.door)
    doorPinch.add(r * cols + c)
  }

  // 3.5 Rounded/round corners (render only): decide which of each room's 4 corners are rounded.
  //     A CIRCLE (cornerRadius≥2) rounds all 4 (connectors magnet to cardinal midpoints, so the
  //     corners are never a connection). A `rounded` room (r=1) rounds only corners whose corner
  //     cell is open with BOTH outer-orthogonal neighbours Wall (⇒ no door/corridor there — a
  //     door needs both sides open), so it isn't rounded across an opening.
  const CORNER_OUT: Record<Corner, [number, number][]> = {
    nw: [[0, -1], [-1, 0]], ne: [[0, -1], [1, 0]], sw: [[0, 1], [-1, 0]], se: [[0, 1], [1, 0]],
  }
  const cornerCell = (room: Room, corner: Corner): [number, number] =>
    [corner === "ne" || corner === "se" ? room.x + room.w - 1 : room.x,
     corner === "sw" || corner === "se" ? room.y + room.h - 1 : room.y]
  const ALL_CORNERS: Corner[] = ["nw", "ne", "sw", "se"]
  const cornerOk = (room: Room, corner: Corner): boolean => {
    const [cc, cr] = cornerCell(room, corner)
    return !isWall(cc, cr) && CORNER_OUT[corner].every(([dc, dr]) => isWall(cc + dc, cr + dr))
  }
  for (const room of rooms) {
    if (room.cornerRadius === 0) continue
    room.roundCorners = room.cornerRadius >= 2 ? [...ALL_CORNERS] : ALL_CORNERS.filter(cn => cornerOk(room, cn))
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
    const depth = Math.max(1, Math.round((PARTIAL_MIN + rng() * (PARTIAL_MAX - PARTIAL_MIN)) * span))
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
    const target = Math.max(1, Math.round((PARTIAL_MIN + rng() * (PARTIAL_MAX - PARTIAL_MIN)) * reg.cells.length))
    const seedK = arr[randInt(0, arr.length - 1)]
    const done = new Set<number>([seedK]); const q: [number, number][] = [[seedK % cols, Math.floor(seedK / cols)]]; let n = 0
    while (q.length && n < target) {
      const [c, r] = q.shift()!
      if (grid[r][c] === Material.Floor) { grid[r][c] = Material.Water; n++ }
      for (const [dc, dr] of DIRS4) { const k = key(c + dc, r + dr); if (fillable.has(k) && !done.has(k)) { done.add(k); q.push([c + dc, r + dr]) } }
    }
  }

  const roomRegion = (i: number): Region => {
    const rm = rooms[i]
    // Expand the box to cover this room's apses (bay cells sit outside the box), then take every
    // roomAt==i Floor cell → the region includes the apse bays (so water floods them with the room).
    let x0 = rm.x, y0 = rm.y, x1 = rm.x + rm.w, y1 = rm.y + rm.h
    for (const ap of rm.apses) {
      if (ap.wall === "n") y0 = Math.min(y0, rm.y - ap.radius)
      else if (ap.wall === "s") y1 = Math.max(y1, rm.y + rm.h + ap.radius)
      else if (ap.wall === "w") x0 = Math.min(x0, rm.x - ap.radius)
      else x1 = Math.max(x1, rm.x + rm.w + ap.radius)
    }
    // Alcoves: lg carves 1 cell of floor outward (sm carves none) — expand by 1 so it floods too.
    for (const al of rm.alcoves) {
      const d = al.size === "lg" ? 1 : 0
      if (al.wall === "n") y0 = Math.min(y0, rm.y - d)
      else if (al.wall === "s") y1 = Math.max(y1, rm.y + rm.h + d)
      else if (al.wall === "w") x0 = Math.min(x0, rm.x - d)
      else x1 = Math.max(x1, rm.x + rm.w + d)
    }
    const cells: [number, number][] = []; const has = new Set<number>()
    for (let r = y0; r < y1; r++) for (let c = x0; c < x1; c++)
      if (roomAt[r]?.[c] === i && isFloor(c, r)) { cells.push([c, r]); has.add(key(c, r)) }
    return { cells, has }
  }

  // Rooms: roll a condition (min-size rooms only get dry/full). The partial-ROOM band's straight
  // edge assumes a rect (non-rect → skip). A CIRCLE only does dry/full — a pool/partial in a
  // hidden corner would be invisible; full floods the square and the corner bites read as a
  // flooded circle.
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i]
    const reg = roomRegion(i)
    const big = room.w >= MIN_ROOM_DIM && room.h >= MIN_ROOM_DIM
    const x = rng()
    if (big) {
      if (x < ROOM_POOL) { if (room.shape !== "circle") fillPool(room) }
      else if (x < ROOM_POOL + ROOM_PARTIAL) { if (room.shape === "rect") fillPartialRoom(room, reg) }
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
    const x = rng()
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
    if (rng() >= PILLAR_ROOM_CHANCE) continue
    // CIRCLE rooms: only the basic `all` layout (perimeter/rows deferred). The rounded-square carve
    // makes corner cells Wall, so `pillarOk` already keeps pillars inside the round footprint.
    const pattern = room.cornerRadius >= 2 ? "all" : PILLAR_PATTERNS[randInt(0, PILLAR_PATTERNS.length - 1)]
    const rowsHoriz = rng() < 0.5 // for `rows`: two horizontal rows vs two vertical columns
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
      if (!circleCardinalOk(c, r, dx, dy)) continue // a circle may host a portal only at a cardinal
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
      if (apseMargin.has(r * cols + c) || flight.some(([fc, fr]) => apseMargin.has(fr * cols + fc))) continue // clear of apses
      const spot: Spot = { flight, anchor: [c, r], dx, dy }
      if (edgeCell(last[0], last[1])) edgeSpots.push(spot)
      else if (isWall(last[0] + dx, last[1] + dy)) interiorSpots.push(spot) // terminal is a dead-end pocket
    }
  }
  const shuffle = (a: Spot[]) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } }
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
    const [first, second] = rng() < PORTAL_EDGE_CHANCE ? [edgeSpots, interiorSpots] : [interiorSpots, edgeSpots]
    return carvePortal(first, kind) || carvePortal(second, kind)
  }
  const pickCount = () => { const x = rng(); return x < 0.6 ? 1 : x < 0.85 ? 2 : x < 0.96 ? 3 : 4 }
  for (let i = 0, n = pickCount(); i < n; i++) if (!placePortal("entrance")) break
  for (let i = 0, n = pickCount(); i < n; i++) if (!placePortal("exit")) break

  // Re-validate ROUNDED (r=1) room corners against the FINAL grid: a later portal stairwell may
  // have carved a wall neighbour. (`cornerOk` already allows the corner cell to be open/Water.)
  // Circle (r≥2) corners are cardinal-isolated by the connector magnets, so they stay valid.
  for (const room of rooms) {
    if (room.cornerRadius === 1) room.roundCorners = room.roundCorners.filter(cn => cornerOk(room, cn))
  }

  // Connectivity guarantee. Pass B walls off redundant/inconsistent corridor runs (grid→Wall), which
  // can rarely sever a region's SOLE bridge to the rest. Run LAST (after every grid/edge pass) so we see
  // the true final connectivity: flood the open cells (EDGE.wall blocks); for any isolated region, reopen
  // ONE bridging edge-wall seam as a DOOR — preferring a seam whose two cells share the SAME level so
  // elevation stays consistent (Pass B already assigned consistent levels before walling the run).
  {
    const openAt = (c: number, r: number) => inb(c, r) && grid[r][c] !== Material.Wall
    const ek = (c: number, r: number, dc: number, dr: number): EdgeKind =>
      dc === 1 ? (edges.v[r]?.[c + 1] ?? EDGE.open) : dc === -1 ? (edges.v[r]?.[c] ?? EDGE.open)
        : dr === 1 ? (edges.h[r + 1]?.[c] ?? EDGE.open) : (edges.h[r]?.[c] ?? EDGE.open)
    const reached: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false))
    const flood = (sc: number, sr: number) => {
      const st: [number, number][] = [[sc, sr]]; reached[sr][sc] = true
      while (st.length) {
        const [c, r] = st.pop()!
        for (const [dc, dr] of SDIRS) {
          const nc = c + dc, nr = r + dr
          if (!openAt(nc, nr) || reached[nr][nc] || ek(c, r, dc, dr) === EDGE.wall) continue
          reached[nr][nc] = true; st.push([nc, nr])
        }
      }
    }
    let sc = -1, sr = -1
    seedScan: for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (openAt(c, r)) { sc = c; sr = r; break seedScan }
    if (sc !== -1) {
      flood(sc, sr)
      for (let guard = 0; guard < rooms.length + 128; guard++) {
        let ic = -1, ir = -1
        isoScan: for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (openAt(c, r) && !reached[r][c]) { ic = c; ir = r; break isoScan }
        if (ic === -1) break // single component — done
        // Gather the isolated region; collect its edge-wall seams onto the reached set.
        const seen: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false))
        const st: [number, number][] = [[ic, ir]]; seen[ir][ic] = true
        const seams: [number, number, number, number][] = []
        while (st.length) {
          const [c, r] = st.pop()!
          for (const [dc, dr] of SDIRS) {
            const nc = c + dc, nr = r + dr
            if (!openAt(nc, nr)) continue
            if (reached[nr][nc]) { if (ek(c, r, dc, dr) === EDGE.wall) seams.push([c, r, dc, dr]); continue }
            if (seen[nr][nc] || ek(c, r, dc, dr) === EDGE.wall) continue
            seen[nr][nc] = true; st.push([nc, nr])
          }
        }
        if (!seams.length) break // fully Wall-enclosed (no edge-wall seam) — not produced by current passes
        // Prefer a same-level seam (elevation-safe); else the first available.
        const [c, r, dc, dr] = seams.find(([c, r, dc, dr]) => levels[r][c] === levels[r + dr]?.[c + dc]) ?? seams[0]
        setEdge(c, r, dc, dr, EDGE.door)
        flood(ic, ir) // absorb the now-connected region
      }
    }
  }

  // Idea 10: derive a semantic RoomProfile per room by scanning its footprint (roomAt === i) over
  // the FINISHED grids (water/pillars/doors/elevation are all placed by now). Feeds context-aware
  // naming (Step 3) / descriptions / prop placement. `type` is feature-derived (see types.ts).
  // Dungeon-level context (Step 4). Level themes flow in via its tags in Step 8; for now the root
  // just carries the seed and each room adds its own profile tags.
  const rootCtx = rootContext(seed)
  // The dungeon-as-a-whole is the ROOT config object: it generates a `type` (theme) and a themed `name`
  // (shown in the page header). The type flows DOWN into every child's context (childRoot) — so rooms and
  // elements inherit the dungeon theme and their names take on its mood (parent → child tag inheritance).
  const dungeonObj = buildDungeonObject(rootCtx, rng)
  const childRoot = childContext(rootCtx, dungeonToTags(dungeonObj))
  rooms.forEach((rm, i) => {
    // Footprint tally over the room's own cells.
    let area = 0, waterCells = 0, hasStairs = false
    for (let r = rm.y; r < rm.y + rm.h; r++) for (let c = rm.x; c < rm.x + rm.w; c++) {
      if (!inb(c, r) || roomAt[r][c] !== i) continue
      const m = grid[r][c]
      if (m === Material.Wall) continue
      area++
      if (m === Material.Water) waterCells++
      else if (m === Material.Stairs) hasStairs = true
    }
    const water: WaterCondition =
      waterCells === 0 ? "dry" : waterCells >= area ? "full" : waterCells === 1 ? "pool" : "partial"
    const size: RoomSize = area <= 6 ? "small" : area <= 16 ? "medium" : "large"

    // Pillars belonging to this room: a pillar vertex whose 4 surrounding cells include a room cell.
    let pillared = false
    for (let vj = 0; vj < pillars.length && !pillared; vj++) for (let vi = 0; vi < pillars[vj].length; vi++) {
      if (!pillars[vj][vi]) continue
      const corners: [number, number][] = [[vi - 1, vj - 1], [vi, vj - 1], [vi - 1, vj], [vi, vj]]
      if (corners.some(([cc, rr]) => inb(cc, rr) && roomAt[rr][cc] === i)) { pillared = true; break }
    }

    // Connectors: distinct boundary openings that lead OUT of the room — a doorway, OR an open edge
    // onto a corridor/other room (not a thin wall, not the map border) — plus adjacent level-portals.
    // An opening across `ek` is traversable if it's a door, or it's open AND the neighbour is passable.
    const opening = (ek: EdgeKind | undefined, nc: number, nr: number) => {
      if (roomAt[nr]?.[nc] === i) return false                          // still inside this room (apse/alcove)
      if (ek === EDGE.door) return true
      return ek !== EDGE.wall && inb(nc, nr) && grid[nr][nc] !== Material.Wall
    }
    let connectors = 0
    for (let r = rm.y; r < rm.y + rm.h; r++) for (let c = rm.x; c < rm.x + rm.w; c++) {
      if (!inb(c, r) || roomAt[r][c] !== i) continue
      if (opening(edges.h[r]?.[c], c, r - 1)) connectors++              // north
      if (opening(edges.h[r + 1]?.[c], c, r + 1)) connectors++          // south
      if (opening(edges.v[r]?.[c], c - 1, r)) connectors++             // west
      if (opening(edges.v[r]?.[c + 1], c + 1, r)) connectors++         // east
    }
    connectors += portals.filter(p =>
      ([[p.c, p.r], [p.c - 1, p.r], [p.c + 1, p.r], [p.c, p.r - 1], [p.c, p.r + 1]] as [number, number][])
        .some(([cc, rr]) => inb(cc, rr) && roomAt[rr][cc] === i)).length

    const features: string[] = []
    if (pillared) features.push("pillars")
    if (rm.apses.length) features.push("apse")
    if (rm.alcoves.length) features.push("alcove")
    if (rm.shape === "circle") features.push("circle")
    else if (rm.roundCorners.length) features.push("round-corners")
    if (hasStairs) features.push("stairs")

    // Feature-based classification (retunable; the naming seed for Step 3).
    const type =
      rm.shape === "circle" ? "rotunda" :
      water === "full" ? "cistern" :
      hasStairs || rm.z !== 0 ? "vault" :
      pillared && size === "large" ? "hall" :
      size === "small" ? "cell" : "chamber"

    rm.profile = { type, material: "masonry", size, water, pillared, shape: rm.shape, elevation: rm.z, connectors, features }

    // Number + name in the same pass: sequential 1-based. The room is built as a config OBJECT on the
    // shared engine — its context = the dungeon root ⊕ the profile's namespaced tags, and the seeded
    // rng makes it reproducible (T1) AND context-aware (a cistern reads watery, a rotunda round). The
    // name is one property today; richer content = more rules reading the same context.
    rm.num = i + 1
    const roomObj = buildRoomObject(rm.profile, childRoot, rng, rm.num)
    rm.name = roomObj.properties.name
  })

  // Idea 12: derive semantic profiles for the NON-room map elements the generator would otherwise
  // discard — halls (the chosen corridor edges), stairs (runs with a level change), connectors (door
  // edges), and level-portals. Additive object-model overlay, mirroring the room pass above; the grids
  // stay the render source. Room identity uses the public 1-based number (or -1 for a non-room end).
  const elements: MapElement[] = []
  const roomNumAt = (c: number, r: number) => (inb(c, r) && roomAt[r][c] >= 0 ? roomAt[r][c] + 1 : -1)

  // Halls: one element per chosen corridor edge (knows its two room endpoints + cell path).
  chosen.forEach((e, k) => {
    const [sc, sr] = e.path[0], [ec, er] = e.path[e.path.length - 1]
    const length = e.path.length
    const water = e.path.some(([c, r]) => grid[r]?.[c] === Material.Water)
    const levelChange = (levels[er]?.[ec] ?? 0) - (levels[sr]?.[sc] ?? 0)
    const type = water ? "flooded-channel" : length >= 8 ? "gallery" : "passage"
    elements.push({ id: `hall-${k}`, num: k + 1, name: "", kind: "hall", cells: e.path, profile: { connects: [e.ai + 1, e.bi + 1], length, water, levelChange, type } })
  })

  // Stairs: one element per corridor run that realized a level change (runDelta ≠ 0).
  let stairCount = 0
  runs.forEach(run => {
    const levelDelta = runDelta[run.id]
    if (levelDelta === 0) return
    let direction: Edge = "n"
    for (const [cc, rr] of run.cells) { const up = stairs[rr]?.[cc]; if (up) { direction = up; break } }
    const steps = run.cells.length
    const idx = stairCount++
    elements.push({ id: `stair-${idx}`, num: idx + 1, name: "", kind: "stair", cells: run.cells, profile: { connects: [roomNumAt(run.endA[0], run.endA[1]), roomNumAt(run.endB[0], run.endB[1])], steps, levelDelta, direction, type: steps >= 4 ? "flight" : "stair" } })
  })

  // Connectors (doors): one element per EDGE.door boundary (each edge is stored once).
  let doorCount = 0
  for (let r = 0; r < rows; r++) for (let c = 0; c <= cols; c++) {
    if (edges.v[r]?.[c] !== EDGE.door) continue
    const idx = doorCount++
    elements.push({ id: `door-${idx}`, num: idx + 1, name: "", kind: "connector", c, r, profile: { joins: [roomNumAt(c - 1, r), roomNumAt(c, r)], orientation: "v", style: "door" } })
  }
  for (let r = 0; r <= rows; r++) for (let c = 0; c < cols; c++) {
    if (edges.h[r]?.[c] !== EDGE.door) continue
    const idx = doorCount++
    elements.push({ id: `door-${idx}`, num: idx + 1, name: "", kind: "connector", c, r, profile: { joins: [roomNumAt(c, r - 1), roomNumAt(c, r)], orientation: "h", style: "door" } })
  }

  // Portals: one element per level-portal (an entrance up/out or exit deeper, at the map edge).
  portals.forEach((p, k) => {
    const side: Edge = p.c === 0 ? "w" : p.c === cols - 1 ? "e" : p.r === 0 ? "n" : "s"
    elements.push({ id: `portal-${k}`, num: k + 1, name: "", kind: "portal", c: p.c, r: p.r, profile: { portalKind: p.kind, side, direction: p.kind === "entrance" ? "up-out" : "down-deeper" } })
  })

  // Name each element as a config object (mirrors the room naming above): its context = the dungeon
  // root ⊕ the element's tags, seeded via the shared rng → reproducible + on-theme. Draws happen at the
  // very end (after room naming), so earlier draws — and all room names — are untouched.
  elements.forEach(el => { el.name = buildElementObject(el, childRoot, rng).properties.name })

  return { grid, pillars, rooms, stairs, levels, portals, edges, elements, name: dungeonObj.properties.name, type: dungeonObj.properties.type, seed }
}
