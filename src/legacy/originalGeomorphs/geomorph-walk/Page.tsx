import { useState } from "react"
import { Cell, Direction, Grid } from "./types"
import { generateGrid, pickTileImage } from "./tiles"
import { Tile } from "./Tile"
import { GeomorphNav } from "../geomorph-shared/GeomorphNav"

const OPPOSITE: Record<Direction, Direction> = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right",
}

const NEIGHBOR_OFFSET: Record<Direction, { dc: number; dr: number }> = {
  top:    { dc: 0, dr: -1 },
  right:  { dc: 1, dr: 0 },
  bottom: { dc: 0, dr: 1 },
  left:   { dc: -1, dr: 0 },
}

function applyEditAndCascade(grid: Grid, updated: Cell, cols: number, rows: number): Grid {
  const next = grid.map(row => [...row])

  // Place updated cell
  next[updated.row][updated.col] = updated

  // Update each of the 4 neighbors to reflect the new connections
  const directions: Direction[] = ["top", "right", "bottom", "left"]
  for (const dir of directions) {
    const { dc, dr } = NEIGHBOR_OFFSET[dir]
    const nc = updated.col + dc
    const nr = updated.row + dr
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      const neighbor = next[nr][nc]
      const theirSide = OPPOSITE[dir]
      const newConnects = { ...neighbor.connects, [theirSide]: updated.connects[dir] }
      next[nr][nc] = { ...neighbor, connects: newConnects, src: pickTileImage(newConnects) }
    }
  }

  return next
}

export default function GeomorphWalkPage() {
  const [cols, setCols] = useState(5)
  const [rows, setRows] = useState(5)
  const [grid, setGrid] = useState<Grid>(() => generateGrid(5, 5))
  const [editingCell, setEditingCell] = useState<Cell | null>(null)

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

  const handleSave = (updated: Cell) => {
    setGrid(prev => applyEditAndCascade(prev, updated, cols, rows))
    setEditingCell(null)
  }

  return (
    <div style={{ padding: 16 }}>
      <GeomorphNav />
      <h2>Drunken Walk Map</h2>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <label>
          Columns: {cols}&nbsp;
          <input
            type="range" min={2} max={12} value={cols}
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

      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 80px)`,
        gridTemplateRows: `repeat(${rows}, 80px)`,
      }}>
        {grid.flat().map(cell => (
          <Tile
            key={`${cell.col}-${cell.row}`}
            cell={cell}
            isEditing={editingCell?.col === cell.col && editingCell?.row === cell.row}
            onStartEdit={() => setEditingCell(cell)}
            onSave={handleSave}
            onClose={() => setEditingCell(null)}
          />
        ))}
      </div>
    </div>
  )
}
