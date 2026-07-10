import { useState } from "react"
import { GeomorphNav } from "../../refactorGeomorphs/geomorph-shared/GeomorphNav"
import { generateDungeon } from "./dungeon"
import { SUB, trimIndexFor } from "./bitmask"
import { TRIM_WALL, TRIM_WATER, PILLAR_TILE, STAIR_TILES, PORTAL_TILES, ROUND_CORNER_TILES, ROUND_TRIM_TILES } from "./tileConfig"
import { MATERIAL_COLOR, MATERIAL_LABEL, DETAIL_MATERIALS, PORTAL_STYLE } from "./materials"
import { Material, Edge, EDGE, Corner } from "./types"

const S = 32 // px per base cell
const s = S / SUB // px per fine (detail) cell

const TRIM_ART: Record<"wall" | "water", string[]> = { wall: TRIM_WALL, water: TRIM_WATER }

// Debug "Shapes" overlay: footprint tint colour per room shape.
const SHAPE_COLOR: Record<string, string> = { circle: "#e64980", rounded: "#f08c00" }

const DIRS8: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]

export default function GeomorphDungeonPage() {
  const [cols, setCols] = useState(20)
  const [rows, setRows] = useState(18)
  const [dungeon, setDungeon] = useState(() => generateDungeon(20, 18))
  const { grid, pillars, rooms, stairs, levels, portals, edges } = dungeon

  // Curve-art visibility (default on): hide a feature group's corner tiles → its cells revert to raw
  // material + normal trim. Declared here so the block loop below can filter by them.
  const [showRounded, setShowRounded] = useState(true) // rounded-corner rooms
  const [showCircles, setShowCircles] = useState(true) // round (circle) rooms
  const [showApses, setShowApses] = useState(true)     // apses + bumps

  // Rounded/round corner BLOCKS: each active corner of a room (cornerRadius>0) is an r×r block at
  // the room's corner, rendered with the quarter-disc bite + arc lip (a true circle = 4 blocks that
  // meet at the centre). `cornerCellSet` = base cells inside any block (skip straight wall-trim there).
  type CornerBlock = { orient: Corner; r: number; x: number; y: number }
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
      addBlock({ orient, r, x: bx, y: by })
    }
    // Apse bays: their TWO far corners (away from the room) round with the corner tiles.
    if (showApses) for (const ap of rm.apses) {
      const ar = ap.radius
      const bx = ap.wall === "e" ? rm.x + rm.w : ap.wall === "w" ? rm.x - ar : ap.center - ar
      const by = ap.wall === "s" ? rm.y + rm.h : ap.wall === "n" ? rm.y - ar : ap.center - ar
      const bw = ap.wall === "n" || ap.wall === "s" ? 2 * ar : ar
      const bh = ap.wall === "n" || ap.wall === "s" ? ar : 2 * ar
      const nw: CornerBlock = { orient: "nw", r: ar, x: bx, y: by }
      const ne: CornerBlock = { orient: "ne", r: ar, x: bx + bw - ar, y: by }
      const sw: CornerBlock = { orient: "sw", r: ar, x: bx, y: by + bh - ar }
      const se: CornerBlock = { orient: "se", r: ar, x: bx + bw - ar, y: by + bh - ar }
      const far = ap.wall === "n" ? [nw, ne] : ap.wall === "s" ? [sw, se] : ap.wall === "w" ? [nw, sw] : [ne, se]
      for (const b of far) addBlock(b)
    }
  }
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

  const regenerate = (c = cols, r = rows) => setDungeon(generateDungeon(c, r))
  const handleCols = (n: number) => { setCols(n); regenerate(n, rows) }
  const handleRows = (n: number) => { setRows(n); regenerate(cols, n) }

  // Base layer: material-coloured cells.
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

  // Rounded/round-corner overlay: the wall "bite" only (transparent inside the arc), scaled to the
  // r×r block, on a layer above the base squares (so water shows through) and below the arc lip.
  // Part of the base representation → gated with the Base toggle.
  const cornerTiles = []
  if (showBase) {
    for (let i = 0; i < cornerBlocks.length; i++) {
      const b = cornerBlocks[i]
      cornerTiles.push(
        <img key={`cn${i}`} src={ROUND_CORNER_TILES[b.orient]} width={b.r * S} height={b.r * S} alt=""
          style={{ position: "absolute", left: b.x * S, top: b.y * S, display: "block" }} />
      )
    }
  }

  // Detail layers: per edge-material fine-grid trim, bumping into adjacent floor. Split by
  // material so the door layer can sit BETWEEN them — water-detail below doors (else the
  // shoreline clips the door leaf), wall-detail above doors (frames the doorway + end-caps).
  const wallDetailTiles = []
  const waterDetailTiles = []
  for (const spec of DETAIL_MATERIALS) {
    if (spec.name === "wall" && !showWall) continue
    if (spec.name === "water" && !showWater) continue
    const art = TRIM_ART[spec.name]
    for (let fr = 0; fr < rows * SUB; fr++) for (let fc = 0; fc < cols * SUB; fc++) {
      // In a rounded/round corner block, the straight wall lip is replaced by the arc trim below —
      // skip the marching-squares wall trim there so the two don't fight.
      if (spec.name === "wall" && cornerCellSet.has(Math.floor(fr / SUB) * cols + Math.floor(fc / SUB))) continue
      const idx = trimIndexFor(grid, fc, fr, cols, rows, spec.material, spec.oobIsTarget, spec.host, edges)
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
      wallDetailTiles.push(
        <img key={`rt${i}`} src={ROUND_TRIM_TILES[b.orient][b.r as 1 | 2 | 3 | 4]} width={b.r * S} height={b.r * S} alt=""
          style={{ position: "absolute", left: b.x * S, top: b.y * S, display: "block" }} />
      )
    }
  }

  // Doors: a leaf strip on the threshold EDGE (recorded at generation → no flip), on its
  // own layer, CENTERED on the boundary grid line (straddles both cells equally). A vertical
  // door-edge `edges.v[r][col]` is the line at x=col·S; a horizontal `edges.h[row][c]` at y=row·S.
  const DT = S / 4 // door leaf thickness
  const doorTiles = []
  if (showDoors) {
    for (let r = 0; r < rows; r++) for (let col = 1; col < cols; col++) {
      if (edges.v[r][col] !== EDGE.door) continue
      doorTiles.push(
        <div key={`dv${col}-${r}`} style={{
          position: "absolute", left: col * S - DT / 2, top: r * S, width: DT, height: S,
          background: MATERIAL_COLOR[Material.Door],
        }} />
      )
    }
    for (let row = 1; row < rows; row++) for (let c = 0; c < cols; c++) {
      if (edges.h[row][c] !== EDGE.door) continue
      doorTiles.push(
        <div key={`dh${c}-${row}`} style={{
          position: "absolute", left: c * S, top: row * S - DT / 2, width: S, height: DT,
          background: MATERIAL_COLOR[Material.Door],
        }} />
      )
    }
  }

  // Stairs: a full-cell tile (treads perpendicular to travel + up-chevron) per stair
  // cell. Rendered BELOW the wall/water detail layer so the wall lips paint over the
  // stair-tile edges (stairs get walls). `stairs[r][c]` gives the ascent direction.
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

  // Level overlay: tint EVERY open cell by its level (halls included, so a corridor
  // shares the tint of the rooms it connects), plus a z badge at each room centre.
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

  // Shapes debug overlay: for each non-rect room, tint its bounding box — footprint cells in
  // the shape colour, CUT-AWAY corner cells (wall inside the box) in red (the proof it isn't a
  // rectangle) — plus a dashed box + a `shape w×h` label. Diagnostic only; no generation effect.
  const shapedRooms = rooms.filter(rm => rm.shape !== "rect")
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

  // Pillars: dots (S/2) centered on base-grid vertices, on the very top layer.
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

  // Portal markers (green entrance / orange exit), on the very top. Smaller than a cell so
  // the layers beneath show, and rotated so the marker arrow points the same way as the
  // stair chevron below it — which points down-slope = opposite of the stair's `up`.
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

  return (
    <div style={{ padding: 16 }}>
      <GeomorphNav />
      <h2>Dungeon — v3 baseline (code frozen 2026-07-08)</h2>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
        <label>Columns: {cols}&nbsp;
          <input type="range" min={4} max={40} value={cols} onChange={e => handleCols(Number(e.target.value))} />
        </label>
        <label>Rows: {rows}&nbsp;
          <input type="range" min={4} max={30} value={rows} onChange={e => handleRows(Number(e.target.value))} />
        </label>
        <label><input type="checkbox" checked={showBase} onChange={e => setShowBase(e.target.checked)} />&nbsp;Base</label>
        <label><input type="checkbox" checked={showWall} onChange={e => setShowWall(e.target.checked)} />&nbsp;Wall detail</label>
        <label><input type="checkbox" checked={showWater} onChange={e => setShowWater(e.target.checked)} />&nbsp;Water</label>
        <label><input type="checkbox" checked={showDoors} onChange={e => setShowDoors(e.target.checked)} />&nbsp;Doors</label>
        <label><input type="checkbox" checked={showStairs} onChange={e => setShowStairs(e.target.checked)} />&nbsp;Stairs</label>
        <label><input type="checkbox" checked={showPillars} onChange={e => setShowPillars(e.target.checked)} />&nbsp;Pillars</label>
        <label><input type="checkbox" checked={showLevels} onChange={e => setShowLevels(e.target.checked)} />&nbsp;Levels</label>
        <label><input type="checkbox" checked={showPortals} onChange={e => setShowPortals(e.target.checked)} />&nbsp;Portals</label>
        <label><input type="checkbox" checked={showShapes} onChange={e => setShowShapes(e.target.checked)} />&nbsp;Shapes</label>
        <label><input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} />&nbsp;Grid</label>
        <label><input type="checkbox" checked={showRounded} onChange={e => setShowRounded(e.target.checked)} />&nbsp;Rounded corners</label>
        <label><input type="checkbox" checked={showCircles} onChange={e => setShowCircles(e.target.checked)} />&nbsp;Round rooms</label>
        <label><input type="checkbox" checked={showApses} onChange={e => setShowApses(e.target.checked)} />&nbsp;Apses</label>
        <button onClick={() => regenerate()}>Regenerate</button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap", fontSize: 12 }}>
        {([Material.Floor, Material.Wall, Material.Water, Material.Door, Material.Stairs] as Material[]).map(m => (
          <span key={m} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 12, height: 12, background: MATERIAL_COLOR[m], display: "inline-block", border: "1px solid #0003" }} />
            {MATERIAL_LABEL[m]}
          </span>
        ))}
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 12, height: 12, background: "#4d525c", borderRadius: "50%", display: "inline-block", border: "1px solid #0002" }} />
          Pillar
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 12, height: 12, background: PORTAL_STYLE.entrance, borderRadius: "50%", display: "inline-block" }} />
          Entrance
          <span style={{ width: 12, height: 12, background: PORTAL_STYLE.exit, borderRadius: "50%", display: "inline-block", marginLeft: 6 }} />
          Exit
        </span>
        {showLevels && (
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#555" }}>Levels:</span>
            {Array.from({ length: zMax - zMin + 1 }, (_, k) => zMin + k).map(z => (
              <span key={z} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ width: 12, height: 12, background: levelColor(z), display: "inline-block", border: "1px solid #0003" }} />
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
            <span style={{ width: 12, height: 12, background: "#e64980", opacity: 0.6, display: "inline-block" }} />footprint
            <span style={{ width: 12, height: 12, background: "#ff0000", opacity: 0.6, display: "inline-block" }} />cut corner
          </span>
        )}
      </div>

      <div style={{ overflow: "auto" }}>
        <div style={{ position: "relative", width: cols * S, height: rows * S }}>
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
        </div>
      </div>
    </div>
  )
}
