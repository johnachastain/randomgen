import { useState } from "react"
import { GeomorphNav } from "../geomorph-shared/GeomorphNav"
import { generateDungeon } from "./dungeon"
import { SUB, trimIndexFor } from "./bitmask"
import { TRIM_WALL, TRIM_WATER, PILLAR_TILE, STAIR_TILES, PORTAL_TILES } from "./tileConfig"
import { MATERIAL_COLOR, MATERIAL_LABEL, DETAIL_MATERIALS, PORTAL_STYLE } from "./materials"
import { Material, Edge, EDGE } from "./types"

const S = 32 // px per base cell
const s = S / SUB // px per fine (detail) cell

const TRIM_ART: Record<"wall" | "water", string[]> = { wall: TRIM_WALL, water: TRIM_WATER }

export default function GeomorphDungeonPage() {
  const [cols, setCols] = useState(20)
  const [rows, setRows] = useState(14)
  const [dungeon, setDungeon] = useState(() => generateDungeon(20, 14))
  const { grid, pillars, rooms, stairs, levels, portals, edges } = dungeon
  const [showBase, setShowBase] = useState(true)
  const [showWall, setShowWall] = useState(true)
  const [showWater, setShowWater] = useState(true)
  const [showDoors, setShowDoors] = useState(true)
  const [showStairs, setShowStairs] = useState(true)
  const [showPillars, setShowPillars] = useState(true)
  const [showLevels, setShowLevels] = useState(false)
  const [showPortals, setShowPortals] = useState(true)

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
      const displayM = m === Material.Stairs || (m === Material.Water && !showWater) ? Material.Floor : m
      baseCells.push(
        <div key={`b${c}-${r}`} style={{
          position: "absolute", left: c * S, top: r * S, width: S, height: S,
          background: MATERIAL_COLOR[displayM],
        }} />
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

  return (
    <div style={{ padding: 16 }}>
      <GeomorphNav />
      <h2>Dungeon — v2 baseline (code frozen 2026-07-05)</h2>

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
      </div>

      <div style={{ overflow: "auto" }}>
        <div style={{ position: "relative", width: cols * S, height: rows * S }}>
          {baseCells}
          {stairTiles}
          {waterDetailTiles}
          {doorTiles}
          {wallDetailTiles}
          {pillarTiles}
          {levelTiles}
          {portalTiles}
        </div>
      </div>
    </div>
  )
}
