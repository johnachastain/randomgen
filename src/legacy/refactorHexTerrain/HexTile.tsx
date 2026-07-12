import { useState, useEffect } from "react"
import { HexCell, TerrainType } from "./types"
import { TERRAIN_COLORS, TERRAIN_LABELS } from "./terrainConfig"

export const R = 40
export const HEX_W = R * 2
export const HEX_H = R * Math.sqrt(3)

// Flat-top hex polygon points, viewBox starts at (0,0)
const POINTS = [
  [R * 1.5, 0],
  [R * 2,   HEX_H / 2],
  [R * 1.5, HEX_H],
  [R * 0.5, HEX_H],
  [0,        HEX_H / 2],
  [R * 0.5, 0],
].map(([x, y]) => `${x},${y}`).join(" ")

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.80)",
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
  cell: HexCell
  isEditing: boolean
  validTerrains: TerrainType[]
  onStartEdit: () => void
  onSave: (updated: HexCell) => void
  onClose: () => void
  style?: React.CSSProperties
}

export function HexTile({ cell, isEditing, validTerrains, onStartEdit, onSave, onClose, style }: Props) {
  const [terrain, setTerrain] = useState<TerrainType>(cell.terrain)

  useEffect(() => {
    if (!isEditing) setTerrain(cell.terrain)
  }, [cell.terrain, isEditing])

  const handleSave = () => {
    onSave({ ...cell, terrain })
  }

  return (
    <div
      style={{ position: "absolute", width: HEX_W, height: HEX_H, cursor: isEditing ? "default" : "pointer", ...style }}
      onClick={() => !isEditing && onStartEdit()}
    >
      {isEditing && (
        <div style={overlayStyle}>
          <select
            value={terrain}
            onChange={e => setTerrain(e.target.value as TerrainType)}
            style={{ fontSize: 11, width: "90%" }}
          >
            {validTerrains.map(t => (
              <option key={t} value={t}>{TERRAIN_LABELS[t]}</option>
            ))}
          </select>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={onClose} style={{ fontSize: 11 }}>Close</button>
            <button onClick={handleSave} style={{ fontSize: 11 }}>Save</button>
          </div>
        </div>
      )}
      <svg
        width={HEX_W}
        height={HEX_H}
        viewBox={`0 0 ${HEX_W} ${HEX_H}`}
        style={{ display: "block" }}
      >
        <polygon
          points={POINTS}
          fill={TERRAIN_COLORS[cell.terrain]}
          stroke="#00000044"
          strokeWidth={1}
        />
      </svg>
    </div>
  )
}
