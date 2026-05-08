type Rect = { x: number; y: number; w: number; h: number }

interface BSPNode {
  rect: Rect
  left?: BSPNode
  right?: BSPNode
  room?: Rect
}

const MIN_SPLIT = 4
const MIN_ROOM = 2

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function cellKey(col: number, row: number): string {
  return `${col},${row}`
}

function splitNode(node: BSPNode): void {
  const { rect } = node
  const canSplitH = rect.h >= MIN_SPLIT * 2
  const canSplitV = rect.w >= MIN_SPLIT * 2

  if (!canSplitH && !canSplitV) return

  const splitH = canSplitH && canSplitV ? rect.h >= rect.w : canSplitH

  if (splitH) {
    const splitAt = rand(MIN_SPLIT, rect.h - MIN_SPLIT)
    node.left  = { rect: { x: rect.x, y: rect.y,            w: rect.w, h: splitAt } }
    node.right = { rect: { x: rect.x, y: rect.y + splitAt,  w: rect.w, h: rect.h - splitAt } }
  } else {
    const splitAt = rand(MIN_SPLIT, rect.w - MIN_SPLIT)
    node.left  = { rect: { x: rect.x,            y: rect.y, w: splitAt,          h: rect.h } }
    node.right = { rect: { x: rect.x + splitAt,  y: rect.y, w: rect.w - splitAt, h: rect.h } }
  }

  splitNode(node.left)
  splitNode(node.right)
}

function assignRooms(node: BSPNode): void {
  if (node.left && node.right) {
    assignRooms(node.left)
    assignRooms(node.right)
    return
  }

  const { rect } = node
  const innerW = rect.w - 2
  const innerH = rect.h - 2

  if (innerW < MIN_ROOM || innerH < MIN_ROOM) return

  const rw = rand(MIN_ROOM, innerW)
  const rh = rand(MIN_ROOM, innerH)
  const rx = rect.x + 1 + rand(0, innerW - rw)
  const ry = rect.y + 1 + rand(0, innerH - rh)

  node.room = { x: rx, y: ry, w: rw, h: rh }
}

function getRoom(node: BSPNode): Rect | undefined {
  if (node.room) return node.room
  const leftRoom  = node.left  ? getRoom(node.left)  : undefined
  const rightRoom = node.right ? getRoom(node.right) : undefined
  if (!leftRoom) return rightRoom
  if (!rightRoom) return leftRoom
  return Math.random() < 0.5 ? leftRoom : rightRoom
}

function connectChildren(node: BSPNode, visited: Set<string>): void {
  if (!node.left || !node.right) return

  connectChildren(node.left, visited)
  connectChildren(node.right, visited)

  const a = getRoom(node.left)
  const b = getRoom(node.right)
  if (!a || !b) return

  const ax = Math.floor(a.x + a.w / 2)
  const ay = Math.floor(a.y + a.h / 2)
  const bx = Math.floor(b.x + b.w / 2)
  const by = Math.floor(b.y + b.h / 2)

  // L-shaped corridor: horizontal then vertical
  const minX = Math.min(ax, bx)
  const maxX = Math.max(ax, bx)
  for (let x = minX; x <= maxX; x++) visited.add(cellKey(x, ay))

  const minY = Math.min(ay, by)
  const maxY = Math.max(ay, by)
  for (let y = minY; y <= maxY; y++) visited.add(cellKey(bx, y))
}

function fillRoom(room: Rect, visited: Set<string>): void {
  for (let y = room.y; y < room.y + room.h; y++) {
    for (let x = room.x; x < room.x + room.w; x++) {
      visited.add(cellKey(x, y))
    }
  }
}

function fillRooms(node: BSPNode, visited: Set<string>): void {
  if (node.room) {
    fillRoom(node.room, visited)
    return
  }
  if (node.left)  fillRooms(node.left, visited)
  if (node.right) fillRooms(node.right, visited)
}

export function bspRooms(cols: number, rows: number): Set<string> {
  const root: BSPNode = { rect: { x: 0, y: 0, w: cols, h: rows } }
  splitNode(root)
  assignRooms(root)

  const visited = new Set<string>()
  fillRooms(root, visited)
  connectChildren(root, visited)

  return visited
}
