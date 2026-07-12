import { useState } from "react"
import { HexCell, HexGrid } from "./types"
import { TILES } from "./tileConfig"
import { DIRS, OPPOSITE, getNeighborOffset, inBounds, tilesMatch } from "./hexUtils"
import { generateGrid, GenMode } from "./wfc"
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
  const [cols, setCols] = useState(7)
  const [rows, setRows] = useState(5)
  const [mode, setMode] = useState<GenMode>("uniform")
  const [grid, setGrid] = useState<HexGrid>(() => generateGrid(7, 5, "uniform"))
  const [editingCell, setEditingCell] = useState<HexCell | null>(null)
  const [validTiles, setValidTiles] = useState<number[]>(ALL_TILES)

  const regenerate = () => {
    setEditingCell(null)
    setGrid(generateGrid(cols, rows, mode))
  }

  const handleColsChange = (n: number) => {
    setCols(n)
    setEditingCell(null)
    setGrid(generateGrid(n, rows, mode))
  }

  const handleRowsChange = (n: number) => {
    setRows(n)
    setEditingCell(null)
    setGrid(generateGrid(cols, n, mode))
  }

  const handleModeChange = (m: GenMode) => {
    setMode(m)
    setEditingCell(null)
    setGrid(generateGrid(cols, rows, m))
  }

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
      <h2>Hex Transitions WFC</h2>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <label>
          Columns: {cols}&nbsp;
          <input
            type="range" min={2} max={16} value={cols}
            onChange={e => handleColsChange(Number(e.target.value))}
          />
        </label>
        <label>
          Rows: {rows}&nbsp;
          <input
            type="range" min={2} max={12} value={rows}
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
