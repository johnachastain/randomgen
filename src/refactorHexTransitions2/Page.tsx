import { useState, useEffect, useRef } from "react"
import { HexCell, HexGrid, TerrainType } from "./types"
import { TILES } from "./tileConfig"
import { DIRS, OPPOSITE, getNeighborOffset, inBounds, tilesMatch } from "./hexUtils"
import { generateGrid, GenMode, GenOptions } from "./wfc"
import { ALL_TERRAINS, TERRAIN_LABELS } from "./terrainConfig"
import { HexTile, R, HEX_W, HEX_H } from "./HexTile"
import { HexTerrainNav } from "./HexTerrainNav"

const ALL_TILES = TILES.map((_, i) => i)

const COL_SPACING = R * 1.5
const ROW_SPACING = HEX_H
const ODD_OFFSET = HEX_H / 2

function hexLeft(col: number): number {
  return col * COL_SPACING
}

function hexTop(col: number, row: number): number {
  return row * ROW_SPACING + (col % 2 === 1 ? ODD_OFFSET : 0)
}

function containerSize(cols: number, rows: number): { width: number; height: number } {
  return {
    width:  (cols - 1) * COL_SPACING + HEX_W,
    height: rows * ROW_SPACING + ODD_OFFSET,
  }
}

// Tiles that fit at (col,row) given the tiles currently in the in-bounds neighbors.
function computeValidTiles(grid: HexGrid, col: number, row: number, cols: number, rows: number): number[] {
  const constraints: { tileIndex: number; dir: typeof DIRS[number] }[] = []
  for (const dir of DIRS) {
    const { dc, dr } = getNeighborOffset(dir, col)
    const nc = col + dc
    const nr = row + dr
    if (inBounds(nc, nr, cols, rows)) {
      constraints.push({ tileIndex: grid[nr][nc].tileIndex, dir })
    }
  }

  if (constraints.length === 0) return ALL_TILES

  return ALL_TILES.filter(i =>
    constraints.every(({ tileIndex, dir }) => tilesMatch(TILES[i], TILES[tileIndex], dir))
  )
}

function cascadeEdit(
  grid: HexGrid,
  editedCol: number,
  editedRow: number,
  newTileIndex: number,
  cols: number,
  rows: number,
): HexGrid {
  const next = grid.map(row => [...row])
  next[editedRow][editedCol] = { ...grid[editedRow][editedCol], tileIndex: newTileIndex }

  const processed = new Set<string>()
  processed.add(`${editedCol},${editedRow}`)
  const queue: [number, number][] = [[editedCol, editedRow]]

  while (queue.length > 0) {
    const [cc, cr] = queue.shift()!
    const currentTile = next[cr][cc].tileIndex

    for (const dir of DIRS) {
      const { dc, dr } = getNeighborOffset(dir, cc)
      const nc = cc + dc
      const nr = cr + dr
      if (!inBounds(nc, nr, cols, rows) || processed.has(`${nc},${nr}`)) continue

      // Already consistent across this edge — leave the neighbor alone.
      if (tilesMatch(TILES[currentTile], TILES[next[nr][nc].tileIndex], dir)) continue

      // Prefer a tile compatible with all of the neighbor's neighbors.
      let valid = computeValidTiles(next, nc, nr, cols, rows)
      // Relax to matching at least the edge we propagated from.
      if (valid.length === 0) {
        valid = ALL_TILES.filter(i => tilesMatch(TILES[i], TILES[currentTile], OPPOSITE[dir]))
      }
      if (valid.length === 0) continue // give up on this neighbor; leave as-is

      const picked = valid[Math.floor(Math.random() * valid.length)]
      next[nr][nc] = { ...next[nr][nc], tileIndex: picked }
      processed.add(`${nc},${nr}`)
      queue.push([nc, nr])
    }
  }

  return next
}

export default function HexTransitionsWfcPage() {
  const INITIAL_COLS = 14
  const INITIAL_ROWS = 10
  const REGEN_DELAY = 200 // ms to wait after the last input before regenerating

  const [cols, setCols] = useState(INITIAL_COLS)
  const [rows, setRows] = useState(INITIAL_ROWS)
  const [mode, setMode] = useState<GenMode>("uniform")
  const [baseTerrain, setBaseTerrain] = useState<TerrainType | "none">("none")
  const [oceanEdge, setOceanEdge] = useState(false)
  const [regenNonce, setRegenNonce] = useState(0)
  const [grid, setGrid] = useState<HexGrid>(() => generateGrid(INITIAL_COLS, INITIAL_ROWS, "uniform"))
  const [loading, setLoading] = useState(false)
  const [editingCell, setEditingCell] = useState<HexCell | null>(null)
  const [validTiles, setValidTiles] = useState<number[]>(ALL_TILES)

  const optsWith = (base: TerrainType | "none", ocean: boolean): GenOptions => ({
    baseTerrain: base === "none" ? null : base,
    oceanEdge: ocean,
  })

  // The latest committed grid (for soft-preserve prevGrid) and the inputs the
  // current grid was generated from, so the debounced effect can tell a size
  // change (→ soft-preserve) from a mode/base/ocean/Regenerate change (→ fresh).
  const latestGrid = useRef(grid)
  const lastGen = useRef({ cols: INITIAL_COLS, rows: INITIAL_ROWS, mode, baseTerrain, oceanEdge, nonce: 0 })
  const didMount = useRef(false)

  // Handlers only touch cheap state — generation is debounced below so dragging a
  // slider never blocks on a 768-cell WFC + re-render.
  const handleColsChange = (n: number) => setCols(n)
  const handleRowsChange = (n: number) => setRows(n)
  const handleModeChange = (m: GenMode) => setMode(m)
  const handleBaseChange = (b: TerrainType | "none") => setBaseTerrain(b)
  const handleOceanEdgeChange = (on: boolean) => setOceanEdge(on)
  const regenerate = () => setRegenNonce(n => n + 1)

  // Debounced regeneration. The cleanup clears the pending timer, so rapid slider
  // ticks coalesce into a single run REGEN_DELAY ms after the last change. Setting
  // loading first lets the "loading…" text paint before the blocking generate.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      lastGen.current = { cols, rows, mode, baseTerrain, oceanEdge, nonce: regenNonce }
      latestGrid.current = grid
      return
    }
    setLoading(true)
    const id = setTimeout(() => {
      const prev = lastGen.current
      const sizeChanged = cols !== prev.cols || rows !== prev.rows
      const optsChanged = mode !== prev.mode || baseTerrain !== prev.baseTerrain || oceanEdge !== prev.oceanEdge
      const nonceChanged = regenNonce !== prev.nonce
      // Size-only change grows the existing map; anything else is a fresh roll.
      const preserve = sizeChanged && !optsChanged && !nonceChanged
      const g = generateGrid(cols, rows, mode, optsWith(baseTerrain, oceanEdge), preserve ? latestGrid.current : undefined)
      latestGrid.current = g
      lastGen.current = { cols, rows, mode, baseTerrain, oceanEdge, nonce: regenNonce }
      setGrid(g)
      setEditingCell(null)
      setLoading(false)
    }, REGEN_DELAY)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cols, rows, mode, baseTerrain, oceanEdge, regenNonce])

  // Keep the soft-preserve source mirrored to the committed grid, so edits (and
  // any other setGrid) are carried into the next size change.
  useEffect(() => { latestGrid.current = grid }, [grid])

  const handleStartEdit = (cell: HexCell) => {
    setEditingCell(cell)
    setValidTiles(computeValidTiles(grid, cell.col, cell.row, cols, rows))
  }

  const handleSave = (updated: HexCell) => {
    setGrid(prev => cascadeEdit(prev, updated.col, updated.row, updated.tileIndex, cols, rows))
    setEditingCell(null)
  }

  const { width, height } = containerSize(cols, rows)

  return (
    <div style={{ padding: 16 }}>
      <HexTerrainNav />
      <h2>
        Hex Transitions WFC (v2)
        {loading && <span style={{ marginLeft: 10, fontSize: 14, fontWeight: "normal", color: "#888" }}>loading…</span>}
      </h2>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <label>
          Columns: {cols}&nbsp;
          <input
            type="range" min={2} max={32} value={cols}
            onChange={e => handleColsChange(Number(e.target.value))}
          />
        </label>
        <label>
          Rows: {rows}&nbsp;
          <input
            type="range" min={2} max={24} value={rows}
            onChange={e => handleRowsChange(Number(e.target.value))}
          />
        </label>
        <label>
          Mode:&nbsp;
          <select value={mode} onChange={e => handleModeChange(e.target.value as GenMode)}>
            <option value="uniform">Uniform (current)</option>
            <option value="weighted">Weighted (clustered)</option>
            <option value="field">Field-driven (regions)</option>
          </select>
        </label>
        <label title="Dominant terrain (applies in Field mode) — keeps the biome consistent across redraws">
          Base terrain:&nbsp;
          <select value={baseTerrain} onChange={e => handleBaseChange(e.target.value as TerrainType | "none")}>
            <option value="none">None</option>
            {ALL_TERRAINS.map(t => (
              <option key={t} value={t}>{TERRAIN_LABELS[t]}</option>
            ))}
          </select>
        </label>
        <label title="Force a ring of ocean around all outer edges (continents in the middle)">
          <input
            type="checkbox" checked={oceanEdge}
            onChange={e => handleOceanEdgeChange(e.target.checked)}
          />
          &nbsp;Ocean edge
        </label>
        <button onClick={regenerate}>Regenerate</button>
      </div>

      <div style={{ position: "relative", width, height }}>
        {grid.flat().map(cell => {
          const editing = editingCell?.col === cell.col && editingCell?.row === cell.row
          return (
            <HexTile
              key={`${cell.col}-${cell.row}`}
              cell={cell}
              isEditing={editing}
              validTiles={editing ? validTiles : ALL_TILES}
              onStartEdit={() => handleStartEdit(cell)}
              onSave={handleSave}
              onClose={() => setEditingCell(null)}
              style={{ left: hexLeft(cell.col), top: hexTop(cell.col, cell.row) }}
            />
          )
        })}
      </div>
    </div>
  )
}
