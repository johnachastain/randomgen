import { useState, useEffect } from "react"
import { HexCell } from "./types"
import { TILES } from "./tileConfig"

export const R = 20
export const HEX_W = R * 2
export const HEX_H = R * Math.sqrt(3)

// Flat-top hex polygon points, viewBox starts at (0,0) — used only as fallback.
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
  validTiles: number[]
  onStartEdit: () => void
  onSave: (updated: HexCell) => void
  onClose: () => void
  style?: React.CSSProperties
}

function TileImage({ index }: { index: number }) {
  const tile = TILES[index]
  if (!tile) {
    return (
      <svg width={HEX_W} height={HEX_H} viewBox={`0 0 ${HEX_W} ${HEX_H}`} style={{ display: "block" }}>
        <polygon points={POINTS} fill="#444" stroke="#00000044" strokeWidth={1} />
      </svg>
    )
  }
  return <img src={tile.src} width={HEX_W} height={HEX_H} style={{ display: "block" }} alt="" />
}

export function HexTile({ cell, isEditing, validTiles, onStartEdit, onSave, onClose, style }: Props) {
  const [tileIndex, setTileIndex] = useState<number>(cell.tileIndex)

  useEffect(() => {
    if (!isEditing) setTileIndex(cell.tileIndex)
  }, [cell.tileIndex, isEditing])

  const handleSave = () => {
    onSave({ ...cell, tileIndex })
  }

  return (
    <div
      style={{ position: "absolute", width: HEX_W, height: HEX_H, cursor: isEditing ? "default" : "pointer", ...style }}
      onClick={() => !isEditing && onStartEdit()}
    >
      {isEditing && (
        <div style={overlayStyle}>
          <div
            style={{
              display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center",
              maxHeight: 60, overflowY: "auto", width: "100%",
            }}
          >
            {validTiles.map(i => (
              <img
                key={i}
                src={TILES[i].src}
                width={20}
                height={17}
                alt=""
                onClick={() => setTileIndex(i)}
                style={{
                  cursor: "pointer",
                  outline: i === tileIndex ? "2px solid #ffcc00" : "1px solid #ffffff55",
                }}
              />
            ))}
            {validTiles.length === 0 && <span style={{ fontSize: 10 }}>no matching tiles</span>}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={onClose} style={{ fontSize: 11 }}>Close</button>
            <button onClick={handleSave} style={{ fontSize: 11 }}>Save</button>
          </div>
        </div>
      )}
      <TileImage index={isEditing ? tileIndex : cell.tileIndex} />
    </div>
  )
}
