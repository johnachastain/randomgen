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

  next[updated.row][updated.col] = updated

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

const DEFAULT_COLS = 10
const DEFAULT_ROWS = 10
const DEFAULT_FILL = 0.45
const DEFAULT_ITERATIONS = 4

export default function GeomorphCaPage() {
  const [cols, setCols] = useState(DEFAULT_COLS)
  const [rows, setRows] = useState(DEFAULT_ROWS)
  const [fill, setFill] = useState(DEFAULT_FILL)
  const [iterations, setIterations] = useState(DEFAULT_ITERATIONS)
  const [grid, setGrid] = useState<Grid>(() => generateGrid(DEFAULT_COLS, DEFAULT_ROWS, DEFAULT_FILL, DEFAULT_ITERATIONS))
  const [editingCell, setEditingCell] = useState<Cell | null>(null)

  const regenerate = (c = cols, r = rows, f = fill, it = iterations) => {
    setEditingCell(null)
    setGrid(generateGrid(c, r, f, it))
  }

  return (
    <div style={{ padding: 16 }}>
      <GeomorphNav />
      <h2>Cellular Automata Cave</h2>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <label>
          Columns: {cols}&nbsp;
          <input
            type="range" min={4} max={16} value={cols}
            onChange={e => { const n = Number(e.target.value); setCols(n); regenerate(n, rows, fill, iterations) }}
          />
        </label>
        <label>
          Rows: {rows}&nbsp;
          <input
            type="range" min={4} max={16} value={rows}
            onChange={e => { const n = Number(e.target.value); setRows(n); regenerate(cols, n, fill, iterations) }}
          />
        </label>
        <label>
          Fill: {Math.round(fill * 100)}%&nbsp;
          <input
            type="range" min={30} max={65} value={Math.round(fill * 100)}
            onChange={e => { const f = Number(e.target.value) / 100; setFill(f); regenerate(cols, rows, f, iterations) }}
          />
        </label>
        <label>
          Smooth: {iterations}&nbsp;
          <input
            type="range" min={1} max={8} value={iterations}
            onChange={e => { const it = Number(e.target.value); setIterations(it); regenerate(cols, rows, fill, it) }}
          />
        </label>
        <button onClick={() => regenerate()}>Regenerate</button>
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
            onSave={updated => { setGrid(prev => applyEditAndCascade(prev, updated, cols, rows)); setEditingCell(null) }}
            onClose={() => setEditingCell(null)}
          />
        ))}
      </div>
    </div>
  )
}
