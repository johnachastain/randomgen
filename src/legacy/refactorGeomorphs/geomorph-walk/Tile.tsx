import { useState, useEffect } from "react"
import { Edge } from "../geomorph/Geomorph"
import { Cell, Direction } from "./types"
import { pickTileImage } from "./tiles"

const DIRECTIONS: Direction[] = ["top", "right", "bottom", "left"]

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.75)",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  gap: 4,
  padding: 4,
}

type Props = {
  cell: Cell
  isEditing: boolean
  onStartEdit: () => void
  onSave: (updated: Cell) => void
  onClose: () => void
}

const EdgeSelector = (
  { name, value, onChange }: { name: Direction; value: Edge; onChange: (v: Partial<Record<Direction, Edge>>) => void }
) => (
  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
    <select value={value} onChange={e => onChange({ [name]: e.target.value as Edge })}>
      <option value={Edge.Closed}>Closed</option>
      <option value={Edge.Open}>Open</option>
      <option value={Edge.Connect}>Connect</option>
    </select>
    {name}
  </span>
)

export function Tile({ cell, isEditing, onStartEdit, onSave, onClose }: Props) {
  const [edges, setEdges] = useState<Record<Direction, Edge>>(cell.edges)

  useEffect(() => {
    if (!isEditing) setEdges(cell.edges)
  }, [cell.edges, isEditing])

  const onChangeHandler = (update: Partial<Record<Direction, Edge>>) => {
    setEdges(prev => ({ ...prev, ...update }))
  }

  const handleSave = () => {
    onSave({ ...cell, edges, src: pickTileImage(edges) })
  }

  return (
    <div
      style={{ position: "relative", cursor: isEditing ? "default" : "pointer" }}
      onClick={() => !isEditing && onStartEdit()}
    >
      {isEditing && (
        <div style={overlayStyle}>
          {DIRECTIONS.map(dir => (
            <EdgeSelector key={dir} name={dir} value={edges[dir]} onChange={onChangeHandler} />
          ))}
          <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
            <button onClick={onClose}>Close</button>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
      <img src={cell.src} style={{ display: "block", width: "100%" }} />
    </div>
  )
}
