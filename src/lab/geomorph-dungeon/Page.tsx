import { useState, useMemo, useRef, useEffect, useLayoutEffect, type PointerEvent as ReactPointerEvent } from "react"
import { GeomorphNav } from "../../legacy/refactorGeomorphs/geomorph-shared/GeomorphNav"
import styles from "./Page.module.css"
import { generateDungeon } from "./dungeon"
import { describeDungeonRoom } from "./roomDescribe"
import { describeElement } from "./elementDescribe"
import { SUB, trimIndexFor } from "./bitmask"
import { TRIM_WALL, TRIM_WATER, PILLAR_TILE, STAIR_TILES, PORTAL_TILES, ROUND_CORNER_TILES, ROUND_TRIM_TILES, ROUNDED_CORNER_TILES, ROUNDED_TRIM_TILES, ALCOVE_BASE_TILES, ALCOVE_TRIM_TILES } from "./tileConfig"
import { MATERIAL_COLOR, MATERIAL_LABEL, DETAIL_MATERIALS, PORTAL_STYLE } from "./materials"
import { Material, Edge, EDGE, Corner, type MapElement } from "./types"

const S = 32 // px per base cell
const s = S / SUB // px per fine (detail) cell

const TRIM_ART: Record<"wall" | "water", string[]> = { wall: TRIM_WALL, water: TRIM_WATER }

// Debug "Shapes" overlay: footprint tint colour per room shape.
const SHAPE_COLOR: Record<string, string> = { circle: "#e64980", rounded: "#f08c00" }

const DIRS8: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]

// Unified inspector selection — a room or a non-room element, identified by kind + per-kind number.
type Sel = { kind: "room" | "hall" | "stair" | "connector" | "portal"; num: number } | null
// Element number-pill styling per kind: a letter prefix + a distinct colour so they read apart from
// the black room pills. (Doors get no map pill for now — halls/stairs/portals only.)
const ELEM_PILL: Record<string, { prefix: string; color: string }> = {
  hall: { prefix: "H", color: "#2b8a3e" },
  stair: { prefix: "S", color: "#e8590c" },
  portal: { prefix: "P", color: "#9c36b5" },
}
// Inspector title + one-line profile summary for a selected element (parallels the room profile line).
const elementKindLabel = (el: MapElement) => (el.kind === "connector" ? "Door" : el.kind[0].toUpperCase() + el.kind.slice(1))
function elementSummary(el: MapElement): string {
  switch (el.kind) {
    case "hall": return `${el.profile.type} · length ${el.profile.length}${el.profile.water ? " · watery" : ""}${el.profile.levelChange ? ` · Δ${el.profile.levelChange}` : ""} · rooms ${el.profile.connects.join("–")}`
    case "stair": return `${el.profile.type} · ${el.profile.steps} step${el.profile.steps === 1 ? "" : "s"} · Δ${el.profile.levelDelta} · ${el.profile.direction}`
    case "connector": return `door · ${el.profile.orientation === "v" ? "vertical" : "horizontal"} · joins ${el.profile.joins.join("–")}`
    case "portal": return `${el.profile.portalKind} · ${el.profile.side} edge · ${el.profile.direction}`
  }
}

export default function GeomorphDungeonPage() {
  const [cols, setCols] = useState(20)
  const [rows, setRows] = useState(18)
  const [dungeon, setDungeon] = useState(() => generateDungeon(20, 18))
  const [seedInput, setSeedInput] = useState("") // blank = fresh random seed each Regenerate; a value = reproduce that seed
  // Unified inspector selection: a room OR a non-room element, by (kind, per-kind num). null = nothing selected.
  const [selected, setSelected] = useState<Sel>(null)
  const mapWrapRef = useRef<HTMLDivElement>(null) // the scrollable map viewport (U1 mini-map reads its scroll)
  const miniRef = useRef<HTMLCanvasElement>(null) // mini-map canvas
  const [view, setView] = useState({ sl: 0, st: 0, cw: 0, ch: 0 }) // map wrapper scroll + client size → viewport rect
  // U2: an "outer zone" gutter around the map so any room (edges incl.) can scroll to the viewport centre.
  // Viewport-based (≥ half any visible map dimension) + stable (doesn't shift when the drawer opens).
  const [pad, setPad] = useState(() => ({ x: Math.ceil(window.innerWidth / 2), y: Math.ceil(window.innerHeight / 2) }))
  const [winW, setWinW] = useState(() => window.innerWidth)
  const { grid, pillars, rooms, stairs, levels, portals, edges, elements } = dungeon

  // Curve-art visibility (default on): hide a feature group's corner tiles → its cells revert to raw
  // material + normal trim. Declared here so the block loop below can filter by them.
  const [showRounded, setShowRounded] = useState(true) // rounded-corner rooms
  const [showCircles, setShowCircles] = useState(true) // round (circle) rooms
  const [showApses, setShowApses] = useState(true)     // apses + bumps
  const [showAlcoves, setShowAlcoves] = useState(true) // alcoves (half-circle bays)

  // Rounded/round corner BLOCKS: each active corner of a room (cornerRadius>0) is an r×r block at
  // the room's corner, rendered with the quarter-disc bite + arc lip (a true circle = 4 blocks that
  // meet at the centre). `cornerCellSet` = base cells inside any block (skip straight wall-trim there).
  // `kind` selects the tile art: rounded rooms use the tighter half-cell fillet; circles/apses the full arc.
  // P4: derive the corner/alcove render structures once per (dungeon + curve toggles). Both loops
  // mutate cornerCellSet, so they share one memo. Returned + destructured for the tile builders below.
  const { cornerBlocks, cornerCellSet, alcoveRender, smAlcoveCells } = useMemo(() => {
  type CornerBlock = { orient: Corner; r: number; x: number; y: number; kind: "rounded" | "circle" | "apse" }
  const cornerBlocks: CornerBlock[] = []
  const cornerCellSet = new Set<number>()
  const addBlock = (b: CornerBlock) => {
    cornerBlocks.push(b)
    for (let dy = 0; dy < b.r; dy++) for (let dx = 0; dx < b.r; dx++) cornerCellSet.add((b.y + dy) * cols + (b.x + dx))
  }
  for (const rm of rooms) {
    const r = rm.cornerRadius
    if (r > 0 && (rm.shape === "circle" ? showCircles : showRounded)) for (const orient of rm.roundCorners) {
      const bx = orient === "ne" || orient === "se" ? rm.x + rm.w - r : rm.x
      const by = orient === "sw" || orient === "se" ? rm.y + rm.h - r : rm.y
      addBlock({ orient, r, x: bx, y: by, kind: rm.shape === "circle" ? "circle" : "rounded" })
    }
    // Apse bays: their TWO far corners (away from the room) round with the corner tiles.
    if (showApses) for (const ap of rm.apses) {
      const ar = ap.radius
      const bx = ap.wall === "e" ? rm.x + rm.w : ap.wall === "w" ? rm.x - ar : ap.center - ar
      const by = ap.wall === "s" ? rm.y + rm.h : ap.wall === "n" ? rm.y - ar : ap.center - ar
      const bw = ap.wall === "n" || ap.wall === "s" ? 2 * ar : ar
      const bh = ap.wall === "n" || ap.wall === "s" ? ar : 2 * ar
      const nw: CornerBlock = { orient: "nw", r: ar, x: bx, y: by, kind: "apse" }
      const ne: CornerBlock = { orient: "ne", r: ar, x: bx + bw - ar, y: by, kind: "apse" }
      const sw: CornerBlock = { orient: "sw", r: ar, x: bx, y: by + bh - ar, kind: "apse" }
      const se: CornerBlock = { orient: "se", r: ar, x: bx + bw - ar, y: by + bh - ar, kind: "apse" }
      const far = ap.wall === "n" ? [nw, ne] : ap.wall === "s" ? [sw, se] : ap.wall === "w" ? [nw, sw] : [ne, se]
      for (const b of far) addBlock(b)
    }
  }
  // Alcoves (E3d): outward half-circle bays drawn with ONE half-circle tile (base bite + arc) over a
  // rectangular region (2:1). Their footprint cells join cornerCellSet → floor/water-under-tile (the
  // cutCorner rule) + straight-trim skip; the arc lip handles the whole curved boundary.
  type AlcoveR = { wall: Edge; size: "sm" | "lg"; left: number; top: number; w: number; h: number }
  const alcoveRender: AlcoveR[] = []
  // Small alcoves stay Material.Wall in the grid (no carve), so the marching-squares trim sees a
  // continuous wall and never emits the convex transition nubs a real opening (door/bump) gets. Collect
  // their nub cells → a render-only trimGrid (below) flips them to Floor for the WALL trim only.
  const smAlcoveCells = new Set<number>()
  if (showAlcoves) for (const rm of rooms) for (const al of rm.alcoves) {
    const wCells = al.size === "lg" ? 3 : 1, reserveDepth = al.size === "lg" ? 2 : 1 // CELL-ALIGNED region
    const half = (wCells - 1) / 2
    let left: number, top: number, w: number, h: number
    if (al.wall === "n") { left = (al.center - half) * S; top = (rm.y - reserveDepth) * S; w = wCells * S; h = reserveDepth * S }
    else if (al.wall === "s") { left = (al.center - half) * S; top = (rm.y + rm.h) * S; w = wCells * S; h = reserveDepth * S }
    else if (al.wall === "w") { left = (rm.x - reserveDepth) * S; top = (al.center - half) * S; w = reserveDepth * S; h = wCells * S }
    else { left = (rm.x + rm.w) * S; top = (al.center - half) * S; w = reserveDepth * S; h = wCells * S }
    alcoveRender.push({ wall: al.wall, size: al.size, left, top, w, h })
    for (let a = al.center - half; a <= al.center + half; a++) for (let d = 1; d <= reserveDepth; d++) {
      const c = al.wall === "w" ? rm.x - d : al.wall === "e" ? rm.x + rm.w - 1 + d : a
      const r = al.wall === "n" ? rm.y - d : al.wall === "s" ? rm.y + rm.h - 1 + d : a
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        cornerCellSet.add(r * cols + c)
        if (al.size === "sm") smAlcoveCells.add(r * cols + c) // sm nub cell → opening for wall trim
      }
    }
  }
  return { cornerBlocks, cornerCellSet, alcoveRender, smAlcoveCells }
  }, [dungeon, cols, rows, showCircles, showRounded, showApses, showAlcoves])

  const [showBase, setShowBase] = useState(true)
  const [showWall, setShowWall] = useState(true)
  const [showWater, setShowWater] = useState(true)
  const [showDoors, setShowDoors] = useState(true)
  const [showStairs, setShowStairs] = useState(true)
  const [showPillars, setShowPillars] = useState(true)
  const [showLevels, setShowLevels] = useState(false)
  const [showPortals, setShowPortals] = useState(true)
  const [showShapes, setShowShapes] = useState(false) // debug overlay: mark non-rect room footprints
  const [showGrid, setShowGrid] = useState(false) // graph-paper grid aligned to the base cell grid
  const [showRoomNumbers, setShowRoomNumbers] = useState(true) // black pill w/ the room number at each room centre
  const [showHallLabels, setShowHallLabels] = useState(false)   // element pills — default off to keep the map uncluttered
  const [showStairLabels, setShowStairLabels] = useState(false)
  const [showPortalLabels, setShowPortalLabels] = useState(false)
  const [hoverRoom, setHoverRoom] = useState<number | null>(null) // room number whose name popup is showing
  const [hoverEl, setHoverEl] = useState<string | null>(null)     // element id whose name popup is showing
  const [navOpen, setNavOpen] = useState(false) // hamburger nav flyout
  const [settingsOpen, setSettingsOpen] = useState(false) // settings (layer toggles) flyout
  const [miniOpen, setMiniOpen] = useState(true) // mini-map show/hide
  const [dragging, setDragging] = useState(false) // big-map drag-to-pan (for the grab cursor)

  // Level → colour ramp (cool = lower, warm = higher), scaled to this dungeon's range.
  // Range is taken over every open cell's level (halls included), not just rooms.
  const allLevels: number[] = []
  for (const row of levels) for (const L of row) if (L !== null) allLevels.push(L)
  const zMin = allLevels.length ? Math.min(...allLevels) : 0
  const zMax = allLevels.length ? Math.max(...allLevels) : 0
  const levelColor = (z: number) => {
    const t = zMax > zMin ? (z - zMin) / (zMax - zMin) : 0.5
    return `hsl(${Math.round(210 - t * 190)}, 70%, 50%)`
  }

  // blank seed input → undefined → generateDungeon rolls a fresh random seed; a number → reproduce it.
  const seedArg = () => { const t = seedInput.trim(); return t === "" ? undefined : Number(t) }
  const regenerate = (c = cols, r = rows) => { setDungeon(generateDungeon(c, r, seedArg())); setSelected(null) }

  // Idea 6: export the current dungeon (fully serialisable DungeonResult + repro metadata) as a JSON file.
  const downloadJson = () => {
    const payload = { version: 1, cols, rows, S, SUB, materialLegend: MATERIAL_LABEL, ...dungeon }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `dungeon-${cols}x${rows}-seed${dungeon.seed}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  const handleCols = (n: number) => { setCols(n); regenerate(n, rows) }
  const handleRows = (n: number) => { setRows(n); regenerate(cols, n) }

  // Base layer: material-coloured cells.
  const baseCells = useMemo(() => {
  const baseCells = []
  if (showBase) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const m = grid[r][c]
      // Doors are openings — render their base as floor; the door itself is a thin
      // line drawn on the top layer below. When the Water layer is toggled off,
      // water cells also fall back to floor (water sits on floor), so the single
      // Water toggle hides the base fill together with the shoreline trim.
      // Doors, stairs, and hidden water all fall back to floor for the base fill;
      // their own art (door line / stair treads) draws on the top layer.
      // Every cell draws its full material square here; the corner's wall "bite" is painted by the
      // cornerTiles overlay below, so water shows through the curve. A circle's DISC-cut corner cell
      // is logically Wall — but draw its base to MATCH the room so the smooth bite mask (not a dark
      // stepped square) defines the cut: Floor for a dry room, or Water if the round room is flooded
      // (a neighbouring disc cell is Water). Round rooms are dry/full only, and the circle's corridor
      // margin means the only water neighbour is the room's own disc — so no false positive.
      const cutCorner = m === Material.Wall && cornerCellSet.has(r * cols + c)
      let displayM: Material
      if (cutCorner) {
        displayM = Material.Floor
        if (showWater) for (const [dc, dr] of DIRS8) if (grid[r + dr]?.[c + dc] === Material.Water) { displayM = Material.Water; break }
      } else {
        displayM = m === Material.Stairs || (m === Material.Water && !showWater) ? Material.Floor : m
      }
      baseCells.push(
        <div key={`b${c}-${r}`} style={{
          position: "absolute", left: c * S, top: r * S, width: S, height: S,
          background: MATERIAL_COLOR[displayM],
        }} />
      )
    }
  }
  return baseCells
  }, [dungeon, cols, rows, showBase, showWater, cornerCellSet])

  // Rounded/round-corner overlay: the wall "bite" only (transparent inside the arc), scaled to the
  // r×r block, on a layer above the base squares (so water shows through) and below the arc lip.
  // Part of the base representation → gated with the Base toggle.
  const cornerTiles = useMemo(() => {
  const cornerTiles = []
  if (showBase) {
    for (let i = 0; i < cornerBlocks.length; i++) {
      const b = cornerBlocks[i]
      const biteSrc = b.kind === "rounded" ? ROUNDED_CORNER_TILES[b.orient] : ROUND_CORNER_TILES[b.orient]
      cornerTiles.push(
        <img key={`cn${i}`} src={biteSrc} width={b.r * S} height={b.r * S} alt=""
          style={{ position: "absolute", left: b.x * S, top: b.y * S, display: "block" }} />
      )
    }
    // Alcove BASE bite (half-circle), stretched to fill its 2:1 region (aspect matches the viewBox).
    for (let i = 0; i < alcoveRender.length; i++) {
      const a = alcoveRender[i]
      cornerTiles.push(
        <img key={`alb${i}`} src={ALCOVE_BASE_TILES[a.wall][a.size]} width={a.w} height={a.h} alt=""
          style={{ position: "absolute", left: a.left, top: a.top, display: "block" }} />
      )
    }
  }
  return cornerTiles
  }, [showBase, cornerBlocks, alcoveRender])

  // Detail layers: per edge-material fine-grid trim, bumping into adjacent floor. Split by
  // material so the door layer can sit BETWEEN them — water-detail below doors (else the
  // shoreline clips the door leaf), wall-detail above doors (frames the doorway + end-caps).
  const { wallDetailTiles, waterDetailTiles } = useMemo(() => {
  const wallDetailTiles = []
  const waterDetailTiles = []
  // Render-only grid for the WALL trim: small-alcove nub cells (Material.Wall in the real grid) read as
  // Floor so the trim treats them as a genuine 1-cell opening → the flanking walls terminate and emit the
  // convex transition nubs (indices 16–19), just like a door/bump. Never used for base/water/connectivity.
  const trimGrid = smAlcoveCells.size ? grid.map(row => row.slice()) : grid
  if (smAlcoveCells.size) for (const key of smAlcoveCells) trimGrid[Math.floor(key / cols)][key % cols] = Material.Floor
  for (const spec of DETAIL_MATERIALS) {
    if (spec.name === "wall" && !showWall) continue
    if (spec.name === "water" && !showWater) continue
    const art = TRIM_ART[spec.name]
    for (let fr = 0; fr < rows * SUB; fr++) for (let fc = 0; fc < cols * SUB; fc++) {
      // In a rounded/round corner block, the straight wall lip is replaced by the arc trim below —
      // skip the marching-squares wall trim there so the two don't fight.
      if (spec.name === "wall" && cornerCellSet.has(Math.floor(fr / SUB) * cols + Math.floor(fc / SUB))) continue
      const idx = trimIndexFor(spec.name === "wall" ? trimGrid : grid, fc, fr, cols, rows, spec.material, spec.oobIsTarget, spec.host, edges)
      if (idx < 1) continue
      const tile = (
        <img key={`${spec.name}${fc}-${fr}`} src={art[idx]} width={s} height={s} alt=""
          style={{ position: "absolute", left: fc * s, top: fr * s, display: "block" }} />
      )
      if (spec.name === "water") waterDetailTiles.push(tile)
      else wallDetailTiles.push(tile)
    }
  }
  // Rounded/round-corner arc trim: the curved lip hugging each block's floor/wall boundary, scaled
  // to r×r (wall detail → wallDetailTiles layer, above doors). Gated with the Wall detail toggle.
  if (showWall) {
    for (let i = 0; i < cornerBlocks.length; i++) {
      const b = cornerBlocks[i]
      const trimSrc = b.kind === "rounded" ? ROUNDED_TRIM_TILES[b.orient] : ROUND_TRIM_TILES[b.orient][b.r as 1 | 2 | 3 | 4]
      wallDetailTiles.push(
        <img key={`rt${i}`} src={trimSrc} width={b.r * S} height={b.r * S} alt=""
          style={{ position: "absolute", left: b.x * S, top: b.y * S, display: "block" }} />
      )
    }
    // Alcove ARC lip over its 2:1 region.
    for (let i = 0; i < alcoveRender.length; i++) {
      const a = alcoveRender[i]
      wallDetailTiles.push(
        <img key={`ala${i}`} src={ALCOVE_TRIM_TILES[a.wall][a.size]} width={a.w} height={a.h} alt=""
          style={{ position: "absolute", left: a.left, top: a.top, display: "block" }} />
      )
    }
    // Junction end-caps BETWEEN adjacent same-wall apses/alcoves. The arc tiles are inset by BW/2, so
    // two touching features leave a bare gap at the shared edge; marching-squares can't fill it (base-cell
    // resolution). A lone feature gets convex nubs (16–19) at both ends — restore those two at each
    // adjacent junction so it looks like a lone-feature end. (Reuses TRIM_ART.wall nub tiles.)
    const pushNub = (idx: number, fc: number, fr: number, key: string) =>
      wallDetailTiles.push(
        <img key={key} src={TRIM_ART.wall[idx]} width={s} height={s} alt=""
          style={{ position: "absolute", left: fc * s, top: fr * s, display: "block" }} />
      )
    for (const rm of rooms) {
      const feats: { wall: Edge; lo: number; hi: number }[] = []
      if (showApses) for (const ap of rm.apses) feats.push({ wall: ap.wall, lo: ap.center - ap.radius, hi: ap.center + ap.radius - 1 })
      if (showAlcoves) for (const al of rm.alcoves) { const h = al.size === "lg" ? 1 : 0; feats.push({ wall: al.wall, lo: al.center - h, hi: al.center + h }) }
      for (const wall of ["n", "s", "e", "w"] as Edge[]) {
        const onWall = feats.filter(f => f.wall === wall).sort((p, q) => p.lo - q.lo)
        for (let i = 0; i + 1 < onWall.length; i++) {
          const A = onWall[i], B = onWall[i + 1]
          if (A.hi + 1 !== B.lo) continue // not touching
          const k = `jn${rm.x}-${rm.y}-${wall}-${i}`
          if (wall === "n") { const row = rm.y; pushNub(16, (A.hi + 1) * SUB - 1, row * SUB, `${k}a`); pushNub(19, B.lo * SUB, row * SUB, `${k}b`) }
          else if (wall === "s") { const row = rm.y + rm.h - 1; pushNub(17, (A.hi + 1) * SUB - 1, (row + 1) * SUB - 1, `${k}a`); pushNub(18, B.lo * SUB, (row + 1) * SUB - 1, `${k}b`) }
          else if (wall === "w") { const col = rm.x; pushNub(18, col * SUB, (A.hi + 1) * SUB - 1, `${k}a`); pushNub(19, col * SUB, B.lo * SUB, `${k}b`) }
          else { const col = rm.x + rm.w - 1; pushNub(17, (col + 1) * SUB - 1, (A.hi + 1) * SUB - 1, `${k}a`); pushNub(16, (col + 1) * SUB - 1, B.lo * SUB, `${k}b`) }
        }
      }
    }
  }
  return { wallDetailTiles, waterDetailTiles }
  }, [dungeon, cols, rows, showWall, showWater, showApses, showAlcoves, cornerCellSet, cornerBlocks, alcoveRender, smAlcoveCells])

  // Doors: a leaf strip on the threshold EDGE (recorded at generation → no flip), on its
  // own layer, CENTERED on the boundary grid line (straddles both cells equally). A vertical
  // door-edge `edges.v[r][col]` is the line at x=col·S; a horizontal `edges.h[row][c]` at y=row·S.
  const doorTiles = useMemo(() => {
  const DT = S / 6 // door leaf thickness (tunable)
  const DOOR_GAP = S / 4 // symmetric gap at each end so the leaf doesn't touch the flanking walls (tunable)
  // Openings are always 1 cell wide, so every door leaf is an identical fixed size, centered on the
  // threshold line.
  const doorTiles = []
  if (showDoors) {
    for (let r = 0; r < rows; r++) for (let col = 1; col < cols; col++) {
      if (edges.v[r][col] !== EDGE.door) continue
      doorTiles.push(
        <div key={`dv${col}-${r}`} style={{
          position: "absolute", left: col * S - DT / 2, top: r * S + DOOR_GAP, width: DT, height: S - 2 * DOOR_GAP,
          background: MATERIAL_COLOR[Material.Door],
        }} />
      )
    }
    for (let row = 1; row < rows; row++) for (let c = 0; c < cols; c++) {
      if (edges.h[row][c] !== EDGE.door) continue
      doorTiles.push(
        <div key={`dh${c}-${row}`} style={{
          position: "absolute", left: c * S + DOOR_GAP, top: row * S - DT / 2, width: S - 2 * DOOR_GAP, height: DT,
          background: MATERIAL_COLOR[Material.Door],
        }} />
      )
    }
  }
  return doorTiles
  }, [dungeon, cols, rows, showDoors])

  // Stairs: a full-cell tile (treads perpendicular to travel + up-chevron) per stair
  // cell. Rendered BELOW the wall/water detail layer so the wall lips paint over the
  // stair-tile edges (stairs get walls). `stairs[r][c]` gives the ascent direction.
  const stairTiles = useMemo(() => {
  const stairTiles = []
  if (showStairs) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const up = stairs[r][c]
      if (!up) continue
      stairTiles.push(
        <img key={`s${c}-${r}`} src={STAIR_TILES[up]} width={S} height={S} alt=""
          style={{ position: "absolute", left: c * S, top: r * S, display: "block" }} />
      )
    }
  }
  return stairTiles
  }, [dungeon, cols, rows, showStairs])

  // Level overlay: tint EVERY open cell by its level (halls included, so a corridor
  // shares the tint of the rooms it connects), plus a z badge at each room centre.
  const levelTiles = useMemo(() => {
  const levelTiles = []
  if (showLevels) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const L = levels[r][c]
      if (L === null) continue
      levelTiles.push(
        <div key={`lc${c}-${r}`} style={{
          position: "absolute", left: c * S, top: r * S, width: S, height: S,
          background: levelColor(L), opacity: 0.28, pointerEvents: "none",
        }} />
      )
    }
    for (let i = 0; i < rooms.length; i++) {
      const rm = rooms[i]
      levelTiles.push(
        <div key={`ll${i}`} style={{
          position: "absolute", left: (rm.x + rm.w / 2) * S, top: (rm.y + rm.h / 2) * S,
          transform: "translate(-50%, -50%)", font: "bold 11px sans-serif", color: "#111",
          background: "rgba(255,255,255,0.75)", borderRadius: 4, padding: "0 4px", pointerEvents: "none",
        }}>z{rm.z}</div>
      )
    }
  }
  return levelTiles
  }, [dungeon, cols, rows, showLevels, zMin, zMax])

  // Room-number indicators: a small black pill (circle for 1 digit, auto-widening "hotdog" for more)
  // with the centered white room number, at each room's centre. One per room.
  const roomNumberTiles = []
  if (showRoomNumbers) {
    for (const rm of rooms) {
      const cx = (rm.x + rm.w / 2) * S, cy = (rm.y + rm.h / 2) * S
      roomNumberTiles.push(
        <div key={`rn${rm.num}`} onMouseEnter={() => setHoverRoom(rm.num)} onMouseLeave={() => setHoverRoom(null)}
          onClick={() => setSelected(s => s?.kind === "room" && s.num === rm.num ? null : { kind: "room", num: rm.num })} style={{
          position: "absolute", left: cx, top: cy,
          transform: "translate(-50%, -50%)", display: "inline-flex", alignItems: "center", justifyContent: "center",
          height: 16, minWidth: 16, padding: "0 5px", boxSizing: "border-box", borderRadius: 999,
          background: selected?.kind === "room" && selected.num === rm.num ? "#1e5fbf" : "#000", color: "#fff", font: "600 11px sans-serif", lineHeight: 1,
          pointerEvents: "auto", cursor: "pointer",
        }}>{rm.num}</div>
      )
      // Custom hover popup with the room name (instant + reliable, unlike the native title tooltip).
      if (hoverRoom === rm.num) {
        roomNumberTiles.push(
          <div key={`rnl${rm.num}`} style={{
            position: "absolute", left: cx, top: cy - 13, transform: "translate(-50%, -100%)",
            background: "#000", color: "#fff", padding: "3px 7px", borderRadius: 4,
            font: "600 11px sans-serif", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 20,
            textAlign: "center",
          }}>
            {rm.name}
            {rm.profile && (
              <div style={{ font: "500 10px sans-serif", opacity: 0.7, marginTop: 2 }}>
                {rm.profile.type} · {rm.profile.size} · {rm.profile.water} · {rm.profile.connectors} way{rm.profile.connectors === 1 ? "" : "s"}
                {rm.profile.features.length ? ` · ${rm.profile.features.join(", ")}` : ""}
              </div>
            )}
          </div>
        )
      }
    }
  }

  // Element indicators (Idea 12 UI): numbered pills for halls / stairs / portals (NOT doors), each at
  // the element's representative cell (path/run midpoint; portal cell), gated per-kind (default off).
  // Same pill shape as rooms, coloured + letter-prefixed by kind; name popup on hover; click → inspector.
  const elementNumberTiles = []
  const elemShown: Record<string, boolean> = { hall: showHallLabels, stair: showStairLabels, portal: showPortalLabels }
  for (const el of elements) {
    if (!elemShown[el.kind]) continue
    const pill = ELEM_PILL[el.kind]; if (!pill) continue
    let mc: number, mr: number
    if (el.kind === "hall" || el.kind === "stair") { const mid = el.cells[Math.floor(el.cells.length / 2)]; mc = mid[0]; mr = mid[1] }
    else { mc = el.c; mr = el.r }
    const cx = (mc + 0.5) * S, cy = (mr + 0.5) * S
    const isSel = selected?.kind === el.kind && selected.num === el.num
    elementNumberTiles.push(
      <div key={el.id} onMouseEnter={() => setHoverEl(el.id)} onMouseLeave={() => setHoverEl(null)}
        onClick={() => setSelected(s => s?.kind === el.kind && s.num === el.num ? null : { kind: el.kind, num: el.num })} style={{
        position: "absolute", left: cx, top: cy,
        transform: "translate(-50%, -50%)", display: "inline-flex", alignItems: "center", justifyContent: "center",
        height: 16, minWidth: 16, padding: "0 5px", boxSizing: "border-box", borderRadius: 999,
        background: isSel ? "#1e5fbf" : pill.color, color: "#fff", font: "600 11px sans-serif", lineHeight: 1,
        border: "1px solid rgba(255,255,255,0.5)", pointerEvents: "auto", cursor: "pointer",
      }}>{pill.prefix}{el.num}</div>
    )
    if (hoverEl === el.id) {
      elementNumberTiles.push(
        <div key={`${el.id}-lbl`} style={{
          position: "absolute", left: cx, top: cy - 13, transform: "translate(-50%, -100%)",
          background: "#000", color: "#fff", padding: "3px 7px", borderRadius: 4,
          font: "600 11px sans-serif", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 20, textAlign: "center",
        }}>{el.name}</div>
      )
    }
  }

  // Shapes debug overlay: for each non-rect room, tint its bounding box — footprint cells in
  // the shape colour, CUT-AWAY corner cells (wall inside the box) in red (the proof it isn't a
  // rectangle) — plus a dashed box + a `shape w×h` label. Diagnostic only; no generation effect.
  const shapedRooms = useMemo(() => rooms.filter(rm => rm.shape !== "rect"), [dungeon])
  const shapeTiles = useMemo(() => {
  const shapeTiles = []
  if (showShapes) {
    for (let i = 0; i < shapedRooms.length; i++) {
      const rm = shapedRooms[i]
      const color = SHAPE_COLOR[rm.shape] ?? "#f08c00" // per-shape footprint tint
      for (let r = rm.y; r < rm.y + rm.h; r++) for (let c = rm.x; c < rm.x + rm.w; c++) {
        const cut = grid[r][c] === Material.Wall
        shapeTiles.push(
          <div key={`shp${i}-${c}-${r}`} style={{
            position: "absolute", left: c * S, top: r * S, width: S, height: S,
            background: cut ? "#ff0000" : color, opacity: cut ? 0.55 : 0.3, pointerEvents: "none",
          }} />
        )
      }
      shapeTiles.push(
        <div key={`shpbox${i}`} style={{
          position: "absolute", left: rm.x * S, top: rm.y * S, width: rm.w * S, height: rm.h * S,
          border: "2px dashed #000", boxSizing: "border-box", pointerEvents: "none",
        }} />
      )
      shapeTiles.push(
        <div key={`shplbl${i}`} style={{
          position: "absolute", left: rm.x * S + 2, top: rm.y * S + 2, font: "bold 10px sans-serif",
          background: "rgba(255,255,255,0.85)", padding: "0 3px", pointerEvents: "none", whiteSpace: "nowrap",
        }}>{rm.shape} {rm.w}×{rm.h}</div>
      )
    }
  }
  return shapeTiles
  }, [dungeon, showShapes, shapedRooms])

  // Pillars: dots (S/2) centered on base-grid vertices, on the very top layer.
  const pillarTiles = useMemo(() => {
  const pillarTiles = []
  if (showPillars) {
    for (let vj = 0; vj <= rows; vj++) for (let vi = 0; vi <= cols; vi++) {
      if (!pillars[vj]?.[vi]) continue
      pillarTiles.push(
        <img key={`p${vi}-${vj}`} src={PILLAR_TILE} width={S / 4} height={S / 4} alt=""
          style={{ position: "absolute", left: vi * S - S / 8, top: vj * S - S / 8, display: "block" }} />
      )
    }
  }
  return pillarTiles
  }, [dungeon, cols, rows, showPillars])

  // Portal markers (green entrance / orange exit), on the very top. Smaller than a cell so
  // the layers beneath show, and rotated so the marker arrow points the same way as the
  // stair chevron below it — which points down-slope = opposite of the stair's `up`.
  const portalTiles = useMemo(() => {
  const MK = S - 6 // marker size
  const OPP: Record<Edge, Edge> = { n: "s", s: "n", e: "w", w: "e" }
  const ROT: Record<Edge, number> = { s: 0, w: 90, n: 180, e: 270 } // rotate the canonical down-arrow to point Edge
  const portalTiles = []
  if (showPortals) {
    for (let i = 0; i < portals.length; i++) {
      const p = portals[i]
      const up = stairs[p.r][p.c]
      const chevronDir = up ? OPP[up] : "s"
      portalTiles.push(
        <img key={`pt${i}`} src={PORTAL_TILES[p.kind]} width={MK} height={MK} alt=""
          style={{ position: "absolute", left: p.c * S + (S - MK) / 2, top: p.r * S + (S - MK) / 2, display: "block", transform: `rotate(${ROT[chevronDir]}deg)` }} />
      )
    }
  }
  return portalTiles
  }, [dungeon, showPortals])

  // Graph-paper grid: light-gray thin lines aligned to the base cell grid (0, S, 2S…), drawn with
  // two CSS gradients (no per-cell elements) over the whole board. Toggled by the Grid checkbox.
  const gridLine = "rgba(90,95,105,0.35)"
  const gridOverlay = showGrid ? (
    <div style={{
      position: "absolute", left: 0, top: 0, width: cols * S, height: rows * S, pointerEvents: "none",
      backgroundImage: `linear-gradient(to right, ${gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)`,
      backgroundSize: `${S}px ${S}px`,
    }} />
  ) : null

  // Flyout chrome (hamburger nav + settings). A fixed transparent backdrop closes on click; the
  // panel is a sibling that drops under the top bar. (Styling → Page.module.css: .backdrop / .panel.)
  const settingToggles: [string, boolean, (v: boolean) => void][] = [
    ["Base", showBase, setShowBase], ["Wall detail", showWall, setShowWall], ["Water", showWater, setShowWater],
    ["Doors", showDoors, setShowDoors], ["Stairs", showStairs, setShowStairs], ["Pillars", showPillars, setShowPillars],
    ["Levels", showLevels, setShowLevels], ["Portals", showPortals, setShowPortals], ["Shapes", showShapes, setShowShapes],
    ["Grid", showGrid, setShowGrid], ["Rounded corners", showRounded, setShowRounded],
    ["Round rooms", showCircles, setShowCircles], ["Apses", showApses, setShowApses], ["Alcoves", showAlcoves, setShowAlcoves],
    ["Room numbers", showRoomNumbers, setShowRoomNumbers],
    ["Hall labels", showHallLabels, setShowHallLabels], ["Stair labels", showStairLabels, setShowStairLabels],
    ["Portal labels", showPortalLabels, setShowPortalLabels],
  ]

  const legend = (
    <div className={styles.legend}>
      {([Material.Floor, Material.Wall, Material.Water, Material.Door, Material.Stairs] as Material[]).map(m => (
        <span key={m} className={styles.legendItem}>
          <span className={styles.swatch} style={{ background: MATERIAL_COLOR[m], border: "1px solid #0003" }} />
          {MATERIAL_LABEL[m]}
        </span>
      ))}
      <span className={styles.legendItem}>
        <span className={styles.swatch} style={{ background: "#4d525c", borderRadius: "50%", border: "1px solid #0002" }} />
        Pillar
      </span>
      <span className={styles.legendItem}>
        <span className={styles.swatch} style={{ background: PORTAL_STYLE.entrance, borderRadius: "50%" }} />
        Entrance
        <span className={styles.swatch} style={{ background: PORTAL_STYLE.exit, borderRadius: "50%", marginLeft: 6 }} />
        Exit
      </span>
      {showLevels && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#555" }}>Levels:</span>
          {Array.from({ length: zMax - zMin + 1 }, (_, k) => zMin + k).map(z => (
            <span key={z} style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <span className={styles.swatch} style={{ background: levelColor(z), border: "1px solid #0003" }} />
              z{z}
            </span>
          ))}
        </span>
      )}
      {showShapes && (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#555" }}>
            Shaped rooms: {shapedRooms.length} ({shapedRooms.filter(r => r.shape === "circle").length} circle / {shapedRooms.filter(r => r.shape === "rounded").length} rounded)
          </span>
          <span className={styles.swatch} style={{ background: "#e64980", opacity: 0.6 }} />footprint
          <span className={styles.swatch} style={{ background: "#ff0000", opacity: 0.6 }} />cut corner
        </span>
      )}
    </div>
  )

  // U1 mini-map: px-per-cell for the miniature (longest side ≈ MINI_MAX).
  const MINI_MAX = 200
  const MC = Math.max(2, Math.floor(MINI_MAX / Math.max(cols, rows)))
  // Keep the viewport rectangle synced with the map wrapper's scroll + client size.
  const syncView = () => { const el = mapWrapRef.current; if (el) setView({ sl: el.scrollLeft, st: el.scrollTop, cw: el.clientWidth, ch: el.clientHeight }) }
  // U2 step 2 — drag-to-pan the big map. Threshold (4px) so a click on a room pill still registers as a click.
  const onMapPointerDown = (e: ReactPointerEvent) => {
    const el = mapWrapRef.current; if (!el) return
    const start = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop }
    let moved = false
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x, dy = ev.clientY - start.y
      if (!moved && Math.abs(dx) + Math.abs(dy) < 4) return
      if (!moved) { moved = true; setDragging(true) }
      el.scrollLeft = start.sl - dx; el.scrollTop = start.st - dy
      ev.preventDefault()
    }
    const up = () => {
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up)
      setDragging(false)
    }
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up)
  }
  // U2 step 2 — click/drag on the mini-map to recenter the main view on that point.
  const panFromMini = (clientX: number, clientY: number) => {
    const cv = miniRef.current, el = mapWrapRef.current; if (!cv || !el) return
    const r = cv.getBoundingClientRect()
    const mapPxX = ((clientX - r.left) / MC) * S, mapPxY = ((clientY - r.top) / MC) * S
    el.scrollTo({ left: pad.x + mapPxX - el.clientWidth / 2, top: pad.y + mapPxY - el.clientHeight / 2 })
  }
  const onMiniPointerDown = (e: ReactPointerEvent) => {
    panFromMini(e.clientX, e.clientY)
    const move = (ev: PointerEvent) => panFromMini(ev.clientX, ev.clientY)
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up) }
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up)
  }
  useEffect(() => {
    const onResize = () => { syncView(); setPad({ x: Math.ceil(window.innerWidth / 2), y: Math.ceil(window.innerHeight / 2) }); setWinW(window.innerWidth) }
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dungeon, cols, rows])
  // U2: keep the map at its top-left origin by default (scroll past the top-left gutter). Skipped while
  // something is selected so it doesn't fight click-to-center. Runs before paint → no flash.
  useLayoutEffect(() => {
    if (selected == null) mapWrapRef.current?.scrollTo(pad.x, pad.y)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pad, dungeon, cols, rows])
  // Draw the miniature: one filled rect per base cell, coloured by raw material.
  useEffect(() => {
    const cv = miniRef.current; if (!cv) return
    const ctx = cv.getContext("2d"); if (!ctx) return
    ctx.clearRect(0, 0, cv.width, cv.height)
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      ctx.fillStyle = MATERIAL_COLOR[grid[r][c]]
      ctx.fillRect(c * MC, r * MC, MC, MC)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dungeon, cols, rows, miniOpen])

  // U2: when something is selected, recenter the map on it (runs after the inspector drawer narrows the
  // content column, so clientWidth is the visible map width). Smooth-scroll the map wrapper. Works for a
  // room (bbox centre) or an element (path/run midpoint; portal cell).
  useEffect(() => {
    if (selected == null) return
    let cx = 0, cy = 0
    if (selected.kind === "room") {
      const rm = rooms.find(r => r.num === selected.num); if (!rm) return
      cx = (rm.x + rm.w / 2) * S; cy = (rm.y + rm.h / 2) * S
    } else {
      const el = elements.find(e => e.kind === selected.kind && e.num === selected.num); if (!el) return
      if (el.kind === "hall" || el.kind === "stair") { const m = el.cells[Math.floor(el.cells.length / 2)]; cx = (m[0] + 0.5) * S; cy = (m[1] + 0.5) * S }
      else { cx = (el.c + 0.5) * S; cy = (el.r + 0.5) * S }
    }
    // Wait out the 0.2s drawer-width transition so clientWidth is the narrowed visible width.
    const t = setTimeout(() => {
      const elw = mapWrapRef.current; if (!elw) return
      elw.scrollTo({ left: pad.x + cx - elw.clientWidth / 2, top: pad.y + cy - elw.clientHeight / 2, behavior: "smooth" })
    }, 230)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  // P4: resolve the selection to a room OR an element + its inspector description, memoized so hovering
  // (which re-renders the page) doesn't re-run the description generator on every mouse-move.
  const selRoom = selected?.kind === "room" ? rooms.find(r => r.num === selected.num) ?? null : null
  const selElement = selected && selected.kind !== "room" ? elements.find(e => e.kind === selected.kind && e.num === selected.num) ?? null : null
  const hasSelection = !!(selRoom || selElement)
  const inspectorDesc = useMemo(
    () => selRoom ? describeDungeonRoom(selRoom, dungeon.seed) : selElement ? describeElement(selElement, dungeon.seed) : [],
    [selected, dungeon]) // eslint-disable-line react-hooks/exhaustive-deps

  // Responsive inspector-drawer width: smaller at standard breakpoints; on tiny
  // screens fit within the window (winW - 32) so the panel never overflows.
  const drawerW = winW >= 1024 ? 360 : winW >= 768 ? 320 : winW >= 480 ? 280 : Math.max(200, winW - 32)

  return (
    <div className={styles.page}>
      <div className={styles.content}>
      <div className={styles.topbar}>
        <button aria-label="Navigation" title="Navigation" className={styles.iconBtn}
          onClick={() => { setNavOpen(o => !o); setSettingsOpen(false) }}>☰</button>
        <button aria-label="Settings" title="Layer settings" className={styles.iconBtn}
          onClick={() => { setSettingsOpen(o => !o); setNavOpen(false) }}>⚙</button>
        <button aria-label="Regenerate" title="Regenerate" className={styles.iconBtn}
          onClick={() => regenerate()}>↻</button>
        <button aria-label="Download JSON" title="Export this dungeon as JSON" className={styles.iconBtn}
          onClick={downloadJson}>⤓</button>
        <h2 className={styles.title}>{dungeon.name}</h2>
        <span style={{ color: "#888", fontSize: 12, alignSelf: "center" }}>· {dungeon.type}</span>

        {navOpen && (<>
          <div className={styles.backdrop} onClick={() => setNavOpen(false)} />
          <div className={styles.panel}><GeomorphNav /></div>
        </>)}
        {settingsOpen && (<>
          <div className={styles.backdrop} onClick={() => setSettingsOpen(false)} />
          <div className={styles.panelSettings}>
            {settingToggles.map(([label, on, set]) => (
              <label key={label}><input type="checkbox" checked={on} onChange={e => set(e.target.checked)} />&nbsp;{label}</label>
            ))}
          </div>
        </>)}
      </div>

      <div className={styles.controls}>
        <label>Columns: {cols}&nbsp;
          <input type="range" min={4} max={40} value={cols} onChange={e => handleCols(Number(e.target.value))} />
        </label>
        <label>Rows: {rows}&nbsp;
          <input type="range" min={4} max={30} value={rows} onChange={e => handleRows(Number(e.target.value))} />
        </label>
      </div>

      <div className={styles.mapArea}>
        <div ref={mapWrapRef} onScroll={syncView} onPointerDown={onMapPointerDown} className={styles.mapWrap} style={{ cursor: dragging ? "grabbing" : "grab" }}>
          <div style={{ position: "relative", width: cols * S + 2 * pad.x, height: rows * S + 2 * pad.y }}>
          <div style={{ position: "absolute", left: pad.x, top: pad.y, width: cols * S, height: rows * S }}>
          {baseCells}
          {stairTiles}
          {waterDetailTiles}
          {doorTiles}
          {cornerTiles}
          {wallDetailTiles}
          {pillarTiles}
          {levelTiles}
          {portalTiles}
          {shapeTiles}
          {gridOverlay}
          {roomNumberTiles}
          {elementNumberTiles}
          </div>
          </div>
        </div>
        {miniOpen ? (
        <div className={styles.mini} style={{ width: cols * MC, height: rows * MC }}>
          <canvas ref={miniRef} width={cols * MC} height={rows * MC} onPointerDown={onMiniPointerDown} className={styles.miniCanvas} />
          <div className={styles.miniRect} style={{
            left: ((view.sl - pad.x) / S) * MC, top: ((view.st - pad.y) / S) * MC,
            width: Math.min(cols * MC, (view.cw / S) * MC), height: Math.min(rows * MC, (view.ch / S) * MC),
          }} />
          <button onClick={() => setMiniOpen(false)} title="Hide mini-map" aria-label="Hide mini-map"
            className={styles.miniClose}>×</button>
        </div>
        ) : (
          <button onClick={() => setMiniOpen(true)} title="Show mini-map" aria-label="Show mini-map"
            className={styles.miniOpen}>▦</button>
        )}
      </div>

      {legend}

      <div className={styles.footer}>
        <label>Seed:&nbsp;
          <input type="number" value={seedInput} placeholder="random"
            onChange={e => setSeedInput(e.target.value)} className={styles.seedInput} />
        </label>
        <span className={styles.seedCurrent}>
          current:&nbsp;
          <code className={styles.seedCode} title="Click to reuse this seed"
            onClick={() => setSeedInput(String(dungeon.seed))}>{dungeon.seed}</code>
        </span>
      </div>
      </div>

      {/* U2: slide-out inspector drawer (right). Push layout — narrows the content column above; keeps
          the mini-map visible. Its own scroll so the page never scrolls. */}
      <div className={styles.drawer} style={{ width: hasSelection ? drawerW : 0, height: hasSelection ? "100vh" : 0 }}>
        <div className={styles.drawerInner} style={{ width: drawerW }}>
          <button onClick={() => setSelected(null)} title="Close" aria-label="Close"
            className={styles.drawerClose}>×</button>
          {selRoom && (
            <>
              <div className={styles.roomName}>#{selRoom.num} · {selRoom.name}</div>
              {selRoom.profile && (
                <div className={styles.roomProfile}>
                  {selRoom.profile.type} · {selRoom.profile.size} · {selRoom.profile.water} · {selRoom.profile.connectors} way{selRoom.profile.connectors === 1 ? "" : "s"}
                  {selRoom.profile.features.length ? ` · ${selRoom.profile.features.join(", ")}` : ""}
                </div>
              )}
              {inspectorDesc.map((para, i) => <p key={i} className={styles.roomPara}>{para}</p>)}
            </>
          )}
          {selElement && (
            <>
              <div className={styles.roomName}>{elementKindLabel(selElement)} #{selElement.num} · {selElement.name}</div>
              <div className={styles.roomProfile}>{elementSummary(selElement)}</div>
              {inspectorDesc.map((para, i) => <p key={i} className={styles.roomPara}>{para}</p>)}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
