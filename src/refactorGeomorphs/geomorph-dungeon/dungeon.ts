import { Material, MaterialGrid, PillarGrid, DungeonResult } from "./types"

// Simple room+corridor dungeon over a Material grid: carve rooms (Floor) joined by
// L-shaped corridors, leave the rest Wall, then add Water pools and Door features.

type Room = { x: number; y: number; w: number; h: number }

const DOOR_CHANCE = 0.35 // fraction of qualifying entrances that actually get a door

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
const PILLAR_ROOM_CHANCE = 0.25 // chance an eligible room is "pillared"

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

  // 1. Rooms.
  const rooms: Room[] = []
  const targetRooms = Math.max(2, Math.round((cols * rows) / 30))
  for (let i = 0; i < targetRooms * 6 && rooms.length < targetRooms; i++) {
    const w = randInt(2, Math.max(2, Math.floor(cols / 3)))
    const h = randInt(2, Math.max(2, Math.floor(rows / 3)))
    const x = randInt(1, Math.max(1, cols - w - 1))
    const y = randInt(1, Math.max(1, rows - h - 1))
    const room: Room = { x, y, w, h }
    if (rooms.some(other => overlaps(room, other))) continue
    rooms.push(room)
    for (let ry = y; ry < y + h; ry++) for (let rx = x; rx < x + w; rx++) carve(rx, ry)
  }
  if (rooms.length === 0) {
    rooms.push({ x: 0, y: 0, w: cols, h: rows })
    for (let ry = 0; ry < rows; ry++) for (let rx = 0; rx < cols; rx++) carve(rx, ry)
  }

  // 2. Corridors between consecutive room centres (L-shaped, 1-wide).
  const centerOf = (r: Room) => ({ cx: r.x + (r.w >> 1), cy: r.y + (r.h >> 1) })
  for (let i = 1; i < rooms.length; i++) {
    const a = centerOf(rooms[i - 1])
    const b = centerOf(rooms[i])
    if (Math.random() < 0.5) {
      for (let c = Math.min(a.cx, b.cx); c <= Math.max(a.cx, b.cx); c++) carve(c, a.cy)
      for (let r = Math.min(a.cy, b.cy); r <= Math.max(a.cy, b.cy); r++) carve(b.cx, r)
    } else {
      for (let r = Math.min(a.cy, b.cy); r <= Math.max(a.cy, b.cy); r++) carve(a.cx, r)
      for (let c = Math.min(a.cx, b.cx); c <= Math.max(a.cx, b.cx); c++) carve(c, b.cy)
    }
  }

  // 3. Doors at 1-wide corridor pinches that open into a room (placed BEFORE water,
  //    on the dry floor plan, so pools can steer clear of them). A door cell has
  //    wall on one axis + floor on the other, and neighbours a room-interior cell
  //    (a Floor cell with >=3 Floor neighbours). Dedup so doors aren't adjacent.
  const floorNeighbors = (c: number, r: number) =>
    (isFloor(c - 1, r) ? 1 : 0) + (isFloor(c + 1, r) ? 1 : 0) + (isFloor(c, r - 1) ? 1 : 0) + (isFloor(c, r + 1) ? 1 : 0)
  const isRoomInterior = (c: number, r: number) => isFloor(c, r) && floorNeighbors(c, r) >= 3
  const doorAdjacent = (c: number, r: number) =>
    (grid[r]?.[c - 1] === Material.Door) || (grid[r]?.[c + 1] === Material.Door) ||
    (grid[r - 1]?.[c] === Material.Door) || (grid[r + 1]?.[c] === Material.Door)

  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (grid[r][c] !== Material.Floor) continue
    const vCorridor = isWall(c, r - 1) && isWall(c, r + 1) && isFloor(c - 1, r) && isFloor(c + 1, r)
    const hCorridor = isWall(c - 1, r) && isWall(c + 1, r) && isFloor(c, r - 1) && isFloor(c, r + 1)
    if (!vCorridor && !hCorridor) continue
    const opensToRoom = isRoomInterior(c - 1, r) || isRoomInterior(c + 1, r) || isRoomInterior(c, r - 1) || isRoomInterior(c, r + 1)
    if (opensToRoom && !doorAdjacent(c, r) && Math.random() < DOOR_CHANCE) grid[r][c] = Material.Door
  }

  // 4. Water conditions per region. Each room and hall rolls one mutually-exclusive
  //    condition: dry / pool (rooms, single cell) / partial (band hugging a side, dry
  //    approach kept at entrances) / full (whole region flooded). Rendering handles
  //    any Water cells; this only decides which Floor cells become Water.
  const DIRS4: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  const key = (c: number, r: number) => r * cols + c
  const openCell = (c: number, r: number) => inb(c, r) && grid[r][c] !== Material.Wall
  const inAnyRoom = (c: number, r: number) =>
    rooms.some(rm => c >= rm.x && c < rm.x + rm.w && r >= rm.y && r < rm.y + rm.h)

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
  const pillarOk = (c: number, r: number) => inb(c, r) && (grid[r][c] === Material.Floor || grid[r][c] === Material.Water)
  for (const room of rooms) {
    if (room.w < MIN_ROOM_DIM || room.h < MIN_ROOM_DIM) continue
    if (Math.random() >= PILLAR_ROOM_CHANCE) continue
    for (let vj = room.y + 1; vj <= room.y + room.h - 1; vj++) for (let vi = room.x + 1; vi <= room.x + room.w - 1; vi++) {
      if (pillarOk(vi - 1, vj - 1) && pillarOk(vi, vj - 1) && pillarOk(vi - 1, vj) && pillarOk(vi, vj)) {
        pillars[vj][vi] = true
      }
    }
  }

  return { grid, pillars }
}
