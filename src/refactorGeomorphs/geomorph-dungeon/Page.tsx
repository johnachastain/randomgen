import { useState } from "react"
import { GeomorphNav } from "../geomorph-shared/GeomorphNav"
import { generateDungeon } from "./dungeon"
import { SUB, trimIndexFor, doorEdge } from "./bitmask"
import { TRIM_WALL, TRIM_WATER, DOOR_TILES, PILLAR_TILE } from "./tileConfig"
import { MATERIAL_COLOR, MATERIAL_LABEL, DETAIL_MATERIALS } from "./materials"
import { Material } from "./types"

const S = 32 // px per base cell
const s = S / SUB // px per fine (detail) cell

const TRIM_ART: Record<"wall" | "water", string[]> = { wall: TRIM_WALL, water: TRIM_WATER }

export default function GeomorphDungeonPage() {
  const [cols, setCols] = useState(20)
  const [rows, setRows] = useState(14)
  const [dungeon, setDungeon] = useState(() => generateDungeon(20, 14))
  const { grid, pillars } = dungeon
  const [showBase, setShowBase] = useState(true)
  const [showWall, setShowWall] = useState(true)
  const [showWater, setShowWater] = useState(true)
  const [showDoors, setShowDoors] = useState(true)
  const [showPillars, setShowPillars] = useState(true)

  const regenerate = (c = cols, r = rows) => setDungeon(generateDungeon(c, r))
  const handleCols = (n: number) => { setCols(n); regenerate(n, rows) }
  const handleRows = (n: number) => { setRows(n); regenerate(cols, n) }

  // Base layer: material-coloured cells.
  const baseCells = []
  if (showBase) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const m = grid[r][c]
      // Doors are openings — render their base as floor; the door itself is a thin
      // line drawn on the top layer below.
      baseCells.push(
        <div key={`b${c}-${r}`} style={{
          position: "absolute", left: c * S, top: r * S, width: S, height: S,
          background: MATERIAL_COLOR[m === Material.Door ? Material.Floor : m],
        }} />
      )
    }
  }

  // Detail layers: per edge-material fine-grid trim, bumping into adjacent floor.
  const detailTiles = []
  for (const spec of DETAIL_MATERIALS) {
    if (spec.name === "wall" && !showWall) continue
    if (spec.name === "water" && !showWater) continue
    const art = TRIM_ART[spec.name]
    for (let fr = 0; fr < rows * SUB; fr++) for (let fc = 0; fc < cols * SUB; fc++) {
      const idx = trimIndexFor(grid, fc, fr, cols, rows, spec.material, spec.oobIsTarget, spec.host)
      if (idx < 1) continue
      detailTiles.push(
        <img key={`${spec.name}${fc}-${fr}`} src={art[idx]} width={s} height={s} alt=""
          style={{ position: "absolute", left: fc * s, top: fr * s, display: "block" }} />
      )
    }
  }

  // Doors: a thin line flush to the room-threshold edge, on the top layer.
  const doorTiles = []
  if (showDoors) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== Material.Door) continue
      const edge = doorEdge(grid, c, r, cols, rows)
      doorTiles.push(
        <img key={`d${c}-${r}`} src={DOOR_TILES[edge]} width={S} height={S} alt=""
          style={{ position: "absolute", left: c * S, top: r * S, display: "block" }} />
      )
    }
  }

  // Pillars: dots (S/2) centered on base-grid vertices, on the very top layer.
  const pillarTiles = []
  if (showPillars) {
    for (let vj = 0; vj <= rows; vj++) for (let vi = 0; vi <= cols; vi++) {
      if (!pillars[vj]?.[vi]) continue
      pillarTiles.push(
        <img key={`p${vi}-${vj}`} src={PILLAR_TILE} width={S / 2} height={S / 2} alt=""
          style={{ position: "absolute", left: vi * S - S / 4, top: vj * S - S / 4, display: "block" }} />
      )
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <GeomorphNav />
      <h2>Dungeon — multi-material bitmask</h2>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
        <label>Columns: {cols}&nbsp;
          <input type="range" min={4} max={40} value={cols} onChange={e => handleCols(Number(e.target.value))} />
        </label>
        <label>Rows: {rows}&nbsp;
          <input type="range" min={4} max={30} value={rows} onChange={e => handleRows(Number(e.target.value))} />
        </label>
        <label><input type="checkbox" checked={showBase} onChange={e => setShowBase(e.target.checked)} />&nbsp;Base</label>
        <label><input type="checkbox" checked={showWall} onChange={e => setShowWall(e.target.checked)} />&nbsp;Wall detail</label>
        <label><input type="checkbox" checked={showWater} onChange={e => setShowWater(e.target.checked)} />&nbsp;Water detail</label>
        <label><input type="checkbox" checked={showDoors} onChange={e => setShowDoors(e.target.checked)} />&nbsp;Doors</label>
        <label><input type="checkbox" checked={showPillars} onChange={e => setShowPillars(e.target.checked)} />&nbsp;Pillars</label>
        <button onClick={() => regenerate()}>Regenerate</button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap", fontSize: 12 }}>
        {([Material.Floor, Material.Wall, Material.Water, Material.Door] as Material[]).map(m => (
          <span key={m} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 12, height: 12, background: MATERIAL_COLOR[m], display: "inline-block", border: "1px solid #0003" }} />
            {MATERIAL_LABEL[m]}
          </span>
        ))}
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 12, height: 12, background: "#6b7280", borderRadius: "50%", display: "inline-block", border: "1px solid #3a3f4b" }} />
          Pillar
        </span>
      </div>

      <div style={{ overflow: "auto" }}>
        <div style={{ position: "relative", width: cols * S, height: rows * S }}>
          {baseCells}
          {detailTiles}
          {doorTiles}
          {pillarTiles}
        </div>
      </div>
    </div>
  )
}
