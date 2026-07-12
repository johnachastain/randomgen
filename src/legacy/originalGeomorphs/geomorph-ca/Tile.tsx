import { useState, useEffect } from "react"
import { Cell, Connects, Direction } from "./types"
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

export function Tile({ cell, isEditing, onStartEdit, onSave, onClose }: Props) {
  const [connects, setConnects] = useState<Connects>(cell.connects)

  useEffect(() => {
    if (!isEditing) setConnects(cell.connects)
  }, [cell.connects, isEditing])

  const toggleDirection = (dir: Direction) => {
    setConnects(prev => ({ ...prev, [dir]: !prev[dir] }))
  }

  const handleSave = () => {
    onSave({ ...cell, connects, src: pickTileImage(connects) })
  }

  return (
    <div
      style={{ position: "relative", cursor: isEditing ? "default" : "pointer" }}
      onClick={() => !isEditing && onStartEdit()}
    >
      {isEditing && (
        <div style={overlayStyle}>
          {DIRECTIONS.map(dir => (
            <label key={dir} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                type="checkbox"
                checked={connects[dir]}
                onChange={() => toggleDirection(dir)}
              />
              {dir}
            </label>
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
