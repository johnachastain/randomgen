import { useState } from "react"
import { Link } from "wouter"
import { PROPERTIES, generateRoom, describeRoom, type Room } from "./roomDescription"

// LAB prototype page: mad-libs room description generator. Regenerate → a fresh Room object
// (config-driven properties) rendered as a description paragraph + the raw properties list.
export default function RoomDescriptionPage() {
  const [room, setRoom] = useState<Room>(() => generateRoom())
  const paragraphs = describeRoom(room)

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 24, lineHeight: 1.6 }}>
      <p style={{ marginBottom: 12 }}><Link href="/">← home</Link> · <Link href="/lab/room-description/edit">edit templates →</Link></p>
      <h2 style={{ marginTop: 0 }}>Room Description Generator <span style={{ opacity: 0.5, fontSize: 14 }}>(lab)</span></h2>

      <button onClick={() => setRoom(generateRoom())} style={{ padding: "6px 14px", marginBottom: 16 }}>
        Regenerate
      </button>

      <div style={{ padding: 16, border: "1px solid #555", borderRadius: 6, background: "rgba(255,255,255,0.03)" }}>
        {paragraphs.map((p, i) => <p key={i} style={{ margin: i === 0 ? "0 0 12px" : 0 }}>{p}</p>)}
      </div>

      <h3 style={{ marginBottom: 4 }}>Properties</h3>
      <ul style={{ marginTop: 0 }}>
        {PROPERTIES.map(p => {
          const v = room[p.key]
          const shown = Array.isArray(v) ? (v.length ? v.join(", ") : "(none)") : v
          return <li key={p.key}><strong>{p.label}:</strong> {shown}</li>
        })}
      </ul>
    </div>
  )
}
