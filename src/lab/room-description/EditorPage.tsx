import { useState } from "react"
import { Link } from "wouter"
import { defaultConfig, validateConfig, generateRoom, describeRoom, type RoomDescConfig, type Room } from "./roomDescription"

// LAB — template editor (Phase 1: raw JSON). Edit the config → Apply (parse + validate) → live preview
// a generated sample → Export. In-memory only (no persistence yet). Broken placeholders are flagged.
export default function RoomDescriptionEditorPage() {
  const [text, setText] = useState(() => JSON.stringify(defaultConfig, null, 2))
  const [config, setConfig] = useState<RoomDescConfig>(defaultConfig)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [rp, setRp] = useState<{ room: Room; preview: string[] }>(() => {
    const r = generateRoom(defaultConfig)
    return { room: r, preview: describeRoom(r, defaultConfig) }
  })

  const roll = (cfg: RoomDescConfig) => { const r = generateRoom(cfg); setRp({ room: r, preview: describeRoom(r, cfg) }) }

  const apply = () => {
    let parsed: unknown
    try { parsed = JSON.parse(text) } catch (e) { setErrors(["JSON parse error: " + (e as Error).message]); setWarnings([]); return }
    const res = validateConfig(parsed)
    setErrors(res.errors); setWarnings(res.warnings)
    if (res.errors.length) return
    const cfg = parsed as RoomDescConfig
    setConfig(cfg); roll(cfg)
  }

  const exportJson = () => {
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }))
    a.download = "room-desc-config.json"; a.click(); URL.revokeObjectURL(a.href)
  }

  const box: React.CSSProperties = { padding: 12, border: "1px solid #555", borderRadius: 6, background: "rgba(255,255,255,0.03)" }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24, lineHeight: 1.5 }}>
      <p style={{ marginBottom: 12 }}><Link href="/">← home</Link> · <Link href="/lab/room-description">← generator</Link></p>
      <h2 style={{ marginTop: 0 }}>Room Description — template editor <span style={{ opacity: 0.5, fontSize: 14 }}>(lab · JSON · in-memory)</span></h2>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 460px", minWidth: 320 }}>
          <textarea value={text} onChange={e => setText(e.target.value)} spellCheck={false}
            style={{ width: "100%", height: 460, fontFamily: "monospace", fontSize: 12, boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={apply} style={{ padding: "6px 14px" }}>Apply</button>
            <button onClick={exportJson} style={{ padding: "6px 14px" }}>Export JSON</button>
            <button onClick={() => { setText(JSON.stringify(defaultConfig, null, 2)); setErrors([]); setWarnings([]); setConfig(defaultConfig); roll(defaultConfig) }} style={{ padding: "6px 14px" }}>Reset to default</button>
          </div>
          {errors.length > 0 && (
            <div style={{ ...box, marginTop: 10, borderColor: "#c0392b" }}>
              <strong style={{ color: "#e74c3c" }}>Errors (not applied):</strong>
              <ul style={{ margin: "6px 0 0" }}>{errors.map((e, i) => <li key={i} style={{ color: "#e74c3c" }}>{e}</li>)}</ul>
            </div>
          )}
          {warnings.length > 0 && (
            <div style={{ ...box, marginTop: 10, borderColor: "#b7950b" }}>
              <strong style={{ color: "#f1c40f" }}>Warnings:</strong>
              <ul style={{ margin: "6px 0 0" }}>{warnings.map((w, i) => <li key={i} style={{ color: "#f1c40f" }}>{w}</li>)}</ul>
            </div>
          )}
        </div>

        <div style={{ flex: "1 1 380px", minWidth: 300 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>Preview</h3>
            <button onClick={() => roll(config)} style={{ padding: "4px 10px" }}>Regenerate sample</button>
          </div>
          <div style={box}>
            {rp.preview.map((p, i) => <p key={i} style={{ margin: i === 0 ? "0 0 10px" : "0 0 10px" }}>{p}</p>)}
          </div>
          <h4 style={{ marginBottom: 4 }}>Properties</h4>
          <ul style={{ marginTop: 0 }}>
            {config.properties.map(p => {
              const v = rp.room[p.key]
              const shown = Array.isArray(v) ? (v.length ? v.join(", ") : "(none)") : v
              return <li key={p.key}><strong>{p.label}:</strong> {shown}</li>
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
