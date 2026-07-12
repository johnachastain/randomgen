import { useState } from "react"
import { HexCell, HexGrid, TerrainType } from "./types"
import { ALL_TERRAINS, ADJACENCY } from "./terrainConfig"
import { DIRS, getNeighborOffset, inBounds } from "./hexUtils"
import { generateGrid } from "./wfc"
import { HexTile, R, HEX_W, HEX_H } from "./HexTile"
import { HexTerrainNav } from "./HexTerrainNav"

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

function computeValidTerrains(grid: HexGrid, col: number, row: number, cols: number, rows: number): TerrainType[] {
  const neighborTerrains: TerrainType[] = []
  for (const dir of DIRS) {
    const { dc, dr } = getNeighborOffset(dir, col)
    const nc = col + dc
    const nr = row + dr
    if (inBounds(nc, nr, cols, rows)) {
      neighborTerrains.push(grid[nr][nc].terrain)
    }
  }

  if (neighborTerrains.length === 0) return ALL_TERRAINS

  const valid = ALL_TERRAINS.filter(t =>
    neighborTerrains.every(nt => ADJACENCY[t].includes(nt))
  )
  return valid.length > 0 ? valid : ALL_TERRAINS
}

function cascadeEdit(
  grid: HexGrid,
  editedCol: number,
  editedRow: number,
  newTerrain: TerrainType,
  cols: number,
  rows: number,
): HexGrid {
  const next = grid.map(row => [...row])
  next[editedRow][editedCol] = { ...grid[editedRow][editedCol], terrain: newTerrain }

  const processed = new Set<string>()
  processed.add(`${editedCol},${editedRow}`)
  const queue: [number, number][] = [[editedCol, editedRow]]

  while (queue.length > 0) {
    const [cc, cr] = queue.shift()!
    const currentTerrain = next[cr][cc].terrain

    for (const dir of DIRS) {
      const { dc, dr } = getNeighborOffset(dir, cc)
      const nc = cc + dc
      const nr = cr + dr
      if (!inBounds(nc, nr, cols, rows) || processed.has(`${nc},${nr}`)) continue

      const neighborTerrain = next[nr][nc].terrain
      if (ADJACENCY[currentTerrain].includes(neighborTerrain)) continue

      const neighborNeighborTerrains: TerrainType[] = []
      for (const d2 of DIRS) {
        const { dc: dc2, dr: dr2 } = getNeighborOffset(d2, nc)
        const nnc = nc + dc2
        const nnr = nr + dr2
        if (inBounds(nnc, nnr, cols, rows)) {
          neighborNeighborTerrains.push(next[nnr][nnc].terrain)
        }
      }

      let valid = ALL_TERRAINS.filter(t =>
        neighborNeighborTerrains.every(nt => ADJACENCY[t].includes(nt))
      )
      if (valid.length === 0) valid = ADJACENCY[currentTerrain]
      if (valid.length === 0) valid = ALL_TERRAINS

      const picked = valid[Math.floor(Math.random() * valid.length)]
      next[nr][nc] = { ...next[nr][nc], terrain: picked }
      processed.add(`${nc},${nr}`)
      queue.push([nc, nr])
    }
  }

  return next
}

export default function RefactorHexTerrainWfcPage() {
  const [cols, setCols] = useState(7)
  const [rows, setRows] = useState(5)
  const [grid, setGrid] = useState<HexGrid>(() => generateGrid(7, 5))
  const [editingCell, setEditingCell] = useState<HexCell | null>(null)
  const [validTerrains, setValidTerrains] = useState<TerrainType[]>(ALL_TERRAINS)

  const regenerate = () => {
    setEditingCell(null)
    setGrid(generateGrid(cols, rows))
  }

  const handleColsChange = (n: number) => {
    setCols(n)
    setEditingCell(null)
    setGrid(generateGrid(n, rows))
  }

  const handleRowsChange = (n: number) => {
    setRows(n)
    setEditingCell(null)
    setGrid(generateGrid(cols, n))
  }

  const handleStartEdit = (cell: HexCell) => {
    setEditingCell(cell)
    setValidTerrains(computeValidTerrains(grid, cell.col, cell.row, cols, rows))
  }

  const handleSave = (updated: HexCell) => {
    setGrid(prev => cascadeEdit(prev, updated.col, updated.row, updated.terrain, cols, rows))
    setEditingCell(null)
  }

  const { width, height } = containerSize(cols, rows)

  return (
    <div style={{ padding: 16 }}>
      <HexTerrainNav />
      <h2>Hex Terrain WFC</h2>

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
        <button onClick={regenerate}>Regenerate</button>
      </div>

      <div style={{ position: "relative", width, height }}>
        {grid.flat().map(cell => (
          <HexTile
            key={`${cell.col}-${cell.row}`}
            cell={cell}
            isEditing={editingCell?.col === cell.col && editingCell?.row === cell.row}
            validTerrains={editingCell?.col === cell.col && editingCell?.row === cell.row ? validTerrains : ALL_TERRAINS}
            onStartEdit={() => handleStartEdit(cell)}
            onSave={handleSave}
            onClose={() => setEditingCell(null)}
            style={{ left: hexLeft(cell.col), top: hexTop(cell.col, cell.row) }}
          />
        ))}
      </div>
    </div>
  )
}
