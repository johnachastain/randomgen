import { useState, useMemo, useRef, useEffect, useLayoutEffect, type PointerEvent as ReactPointerEvent } from "react"
import { CaveNav } from "./CaveNav"
import styles from "./Page.module.css"
import { generateCave } from "./cave"
import { describeCaveRoom } from "./roomDescribe"
import { STAIR_TILES, PORTAL_TILES } from "./tileConfig"
import { CAVE_CORNER_VARIANTS, CAVE_POCKET } from "./caveTileConfig"
import { MATERIAL_COLOR, MATERIAL_LABEL, LEGEND_MATERIALS, PORTAL_STYLE } from "./materials"
import { Material, type Edge } from "./types"

// caves-1 — the extracted Idea 7 PoC, first of the cave prototypes (plans/cave-prototypes.md).
//
// This page renders ONE cave from cols/rows/seed. It is a trimmed fork of the bitmask dungeon's
// Page.tsx: gone are the multi-floor complex, the marching-squares detail trim (the dungeon skipped
// it in cave mode anyway), doors, water, pillars, elevation, room shapes/apses/alcoves, furnishings,
// occupants and map elements — caves generate none of them. What's kept is the viewer: icon top bar,
// flyout nav, drag-to-pan, mini-map, and a room inspector with click-to-center.
//
// P4 memo discipline carried over: the heavy tile arrays are useMemo'd so hover/select/drag/scroll
// never rebuild them.

const S = 32 // px per base cell

// Rounded-corner orientation — which corner of a cell the concave fillet bites.
type Corner = "nw" | "ne" | "se" | "sw"

export default function Caves1Page() {
  const [cols, setCols] = useState(20)
  const [rows, setRows] = useState(18)
  const [cave, setCave] = useState(() => generateCave(20, 18))
  const [seedInput, setSeedInput] = useState("") // blank = fresh random seed each Regenerate; a value = reproduce that seed
  // Inspector: a cave has only chambers to inspect, so this is a plain selected-room number. (The
  // dungeon needs a ref history stack because its furnishings/occupants/elements cross-link into each
  // other; with one inspectable kind there's nothing to navigate between.)
  const [selNum, setSelNum] = useState<number | null>(null)
  const selectRoom = (num: number) => setSelNum(n => (n === num ? null : num)) // re-click closes
  const closeInspector = () => setSelNum(null)

  const mapWrapRef = useRef<HTMLDivElement>(null) // the scrollable map viewport (the mini-map reads its scroll)
  const miniRef = useRef<HTMLCanvasElement>(null) // mini-map canvas
  const [view, setView] = useState({ sl: 0, st: 0, cw: 0, ch: 0 }) // map wrapper scroll + client size → viewport rect
  // An "outer zone" gutter around the map so any chamber (edges incl.) can scroll to the viewport centre.
  // Viewport-based (≥ half any visible map dimension) + stable (doesn't shift when the drawer opens).
  const [pad, setPad] = useState(() => ({ x: Math.ceil(window.innerWidth / 2), y: Math.ceil(window.innerHeight / 2) }))
  const [winW, setWinW] = useState(() => window.innerWidth)
  const { grid, rooms, stairs, portals } = cave

  const [showBase, setShowBase] = useState(true)
  const [showSkin, setShowSkin] = useState(true)   // the cave skin: pocket domes + corner fillets
  const [showStairs, setShowStairs] = useState(true)
  const [showPortals, setShowPortals] = useState(true)
  const [showGrid, setShowGrid] = useState(false)  // graph-paper grid aligned to the base cell grid
  const [showRoomNumbers, setShowRoomNumbers] = useState(true)
  const [hoverRoom, setHoverRoom] = useState<number | null>(null) // room number whose name popup is showing
  const [navOpen, setNavOpen] = useState(false)      // hamburger nav flyout
  const [settingsOpen, setSettingsOpen] = useState(false) // settings (layer toggles) flyout
  const [miniOpen, setMiniOpen] = useState(true)     // mini-map show/hide
  const [dragging, setDragging] = useState(false)    // big-map drag-to-pan (for the grab cursor)

  // blank seed input → undefined → generateCave rolls a fresh random seed; a number → reproduce it.
  const seedArg = () => { const t = seedInput.trim(); return t === "" ? undefined : Number(t) }
  // `seed` is an explicit override for callers that set seedInput in the same handler — setSeedInput
  // hasn't committed yet at that point, so seedArg() would read the PREVIOUS value.
  const regenerate = (c = cols, r = rows, seed = seedArg()) => { setCave(generateCave(c, r, seed)); closeInspector() }
  const handleCols = (n: number) => { setCols(n); regenerate(n, rows) }
  const handleRows = (n: number) => { setRows(n); regenerate(cols, n) }
  // The field holds a seed that isn't the one on screen → it hasn't been applied yet. Drives the
  // pending cue, which is the only feedback available when applying a seed leaves the map identical.
  const seedPending = seedInput.trim() !== "" && Number(seedInput) !== cave.seed

  // Export the cave as JSON (fully serialisable + repro metadata).
  const downloadJson = () => {
    const payload = { version: 1, prototype: "caves-1", cols, rows, S, materialLegend: MATERIAL_LABEL, ...cave }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cave-${cols}x${rows}-seed${cave.seed}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // The cave skin — de-squares the silhouette. TWO passes:
  //  (a) 1-cell POCKETS — a floor cell walled on exactly 3 sides → one smooth half-circle "dome" tile,
  //      instead of two corner tiles meeting in an asymmetrical point.
  //  (b) CONCAVE CORNERS — a vertex marching-squares scan; a lone floor cell (3 walls) gets a rounded
  //      fillet variant, picked by hashing the cell position so it's stable across re-renders.
  //      Corners on a pocket cell, or any vertex touching a stairwell, are skipped so pockets stay
  //      smooth and stairwells stay rectilinear.
  const caveCorners = useMemo(() => {
  type CC = { x: number; y: number; orient: Corner; variant: number }
  const corners: CC[] = []
  const pockets: { x: number; y: number; open: Edge }[] = []
  const isWall = (c: number, r: number) => c < 0 || c >= cols || r < 0 || r >= rows || grid[r][c] === Material.Wall
  const isStair = (c: number, r: number) => c >= 0 && c < cols && r >= 0 && r < rows && grid[r][c] === Material.Stairs
  // (a) 1-cell pockets
  const pocketCells = new Set<number>()
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (grid[r][c] !== Material.Floor) continue
    const n = isWall(c, r - 1), s = isWall(c, r + 1), e = isWall(c + 1, r), w = isWall(c - 1, r)
    if ((+n + +s + +e + +w) !== 3) continue
    const open: Edge = !n ? "n" : !s ? "s" : !e ? "e" : "w"
    const oc = open === "e" ? c + 1 : open === "w" ? c - 1 : c
    const or = open === "s" ? r + 1 : open === "n" ? r - 1 : r
    if (isStair(oc, or)) continue // the open side is a stairwell mouth → leave it rectilinear
    pocketCells.add(r * cols + c)
    pockets.push({ x: c, y: r, open })
  }
  // (b) concave corners
  const nVar = CAVE_CORNER_VARIANTS.nw.length
  for (let j = 1; j < rows; j++) for (let i = 1; i < cols; i++) {
    if (isStair(i - 1, j - 1) || isStair(i, j - 1) || isStair(i - 1, j) || isStair(i, j)) continue // no rounding around stairwells
    const nw = isWall(i - 1, j - 1), ne = isWall(i, j - 1), sw = isWall(i - 1, j), se = isWall(i, j)
    if (((nw ? 1 : 0) + (ne ? 1 : 0) + (sw ? 1 : 0) + (se ? 1 : 0)) !== 3) continue // concave pocket = lone floor cell
    const b = !se ? { x: i, y: j, orient: "nw" as Corner } : !sw ? { x: i - 1, y: j, orient: "ne" as Corner }
      : !ne ? { x: i, y: j - 1, orient: "sw" as Corner } : { x: i - 1, y: j - 1, orient: "se" as Corner }
    if (pocketCells.has(b.y * cols + b.x)) continue // this cell is a dome, not corner-rounded
    let h = ((b.x * 73856093) ^ (b.y * 19349663) ^ (b.orient.charCodeAt(0) * 2654435761)) >>> 0
    h ^= h >>> 13; h = (Math.imul(h, 0x5bd1e995)) >>> 0
    corners.push({ ...b, variant: h % nVar })
  }
  return { corners, pockets }
  }, [cave, cols, rows]) // eslint-disable-line react-hooks/exhaustive-deps

  // Base layer: material-coloured cells. Stairs draw their base as Floor (the stair tile art paints
  // on top). Wall "bites" come from the skin overlay below, so the base grid stays untouched.
  const baseCells = useMemo(() => {
  const baseCells = []
  if (showBase) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const m = grid[r][c]
      const displayM = m === Material.Stairs ? Material.Floor : m
      baseCells.push(
        <div key={`b${c}-${r}`} style={{
          position: "absolute", left: c * S, top: r * S, width: S, height: S,
          background: MATERIAL_COLOR[displayM],
        }} />
      )
    }
  }
  return baseCells
  }, [cave, cols, rows, showBase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cave skin tiles: pocket domes + varied corner fillets, painting cave wall over the floor base.
  const caveSkinTiles = useMemo(() => {
  const out = []
  if (showSkin && showBase) {
    for (let k = 0; k < caveCorners.pockets.length; k++) {
      const p = caveCorners.pockets[k]
      out.push(<img key={`cp${k}`} src={CAVE_POCKET[p.open]} width={S} height={S} alt=""
        style={{ position: "absolute", left: p.x * S, top: p.y * S, display: "block" }} />)
    }
    for (let k = 0; k < caveCorners.corners.length; k++) {
      const b = caveCorners.corners[k]
      out.push(<img key={`cc${k}`} src={CAVE_CORNER_VARIANTS[b.orient][b.variant]} width={S} height={S} alt=""
        style={{ position: "absolute", left: b.x * S, top: b.y * S, display: "block" }} />)
    }
  }
  return out
  }, [showSkin, showBase, caveCorners])

  // Stairs: a full-cell tile (treads + up-chevron) per stair cell. `stairs[r][c]` = ascent direction.
  const stairTiles = useMemo(() => {
  const stairTiles = []
  if (showStairs) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const up = stairs[r][c]
      if (!up) continue
      stairTiles.push(
        <img key={`s${c}-${r}`} src={STAIR_TILES[up]} width={S} height={S} alt=""
          style={{ position: "absolute", left: c * S, top: r * S, display: "block" }} />
      )
    }
  }
  return stairTiles
  }, [cave, cols, rows, showStairs]) // eslint-disable-line react-hooks/exhaustive-deps

  // Portal markers (green entrance / orange exit), on the very top. Smaller than a cell so the layers
  // beneath show, and rotated so the marker arrow points the same way as the stair chevron below it —
  // which points down-slope = opposite of the stair's `up`.
  const portalTiles = useMemo(() => {
  const MK = S - 6 // marker size
  const OPP: Record<Edge, Edge> = { n: "s", s: "n", e: "w", w: "e" }
  const ROT: Record<Edge, number> = { s: 0, w: 90, n: 180, e: 270 } // rotate the canonical down-arrow to point Edge
  const portalTiles = []
  if (showPortals) {
    for (let i = 0; i < portals.length; i++) {
      const p = portals[i]
      const up = stairs[p.r][p.c]
      const chevronDir = up ? OPP[up] : "s"
      portalTiles.push(
        <img key={`pt${i}`} src={PORTAL_TILES[p.kind]} width={MK} height={MK} alt=""
          style={{ position: "absolute", left: p.c * S + (S - MK) / 2, top: p.r * S + (S - MK) / 2, display: "block", transform: `rotate(${ROT[chevronDir]}deg)` }} />
      )
    }
  }
  return portalTiles
  }, [cave, showPortals]) // eslint-disable-line react-hooks/exhaustive-deps

  // Graph-paper grid: light-gray thin lines aligned to the base cell grid, drawn with two CSS
  // gradients (no per-cell elements) over the whole board.
  const gridLine = "rgba(90,95,105,0.35)"
  const gridOverlay = showGrid ? (
    <div style={{
      position: "absolute", left: 0, top: 0, width: cols * S, height: rows * S, pointerEvents: "none",
      backgroundImage: `linear-gradient(to right, ${gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)`,
      backgroundSize: `${S}px ${S}px`,
    }} />
  ) : null

  // Room-number indicators: a small black pill with the centered white number, at each chamber's bbox
  // centre. (A blob's bbox centre can land on wall — acceptable for a marker; a centroid-on-floor
  // placement is a candidate polish if it reads badly.)
  const roomNumberTiles = []
  if (showRoomNumbers) {
    for (const rm of rooms) {
      const cx = (rm.x + rm.w / 2) * S, cy = (rm.y + rm.h / 2) * S
      roomNumberTiles.push(
        <div key={`rn${rm.num}`} onMouseEnter={() => setHoverRoom(rm.num)} onMouseLeave={() => setHoverRoom(null)}
          onClick={() => selectRoom(rm.num)} style={{
          position: "absolute", left: cx, top: cy,
          transform: "translate(-50%, -50%)", display: "inline-flex", alignItems: "center", justifyContent: "center",
          height: 16, minWidth: 16, padding: "0 5px", boxSizing: "border-box", borderRadius: 999,
          background: selNum === rm.num ? "#1e5fbf" : "#000", color: "#fff", font: "600 11px sans-serif", lineHeight: 1,
          pointerEvents: "auto", cursor: "pointer",
        }}>{rm.num}</div>
      )
      // Custom hover popup with the chamber name (instant + reliable, unlike the native title tooltip).
      if (hoverRoom === rm.num) {
        roomNumberTiles.push(
          <div key={`rnl${rm.num}`} style={{
            position: "absolute", left: cx, top: cy - 13, transform: "translate(-50%, -100%)",
            background: "#000", color: "#fff", padding: "3px 7px", borderRadius: 4,
            font: "600 11px sans-serif", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 20,
            textAlign: "center",
          }}>
            {rm.name}
            {rm.profile && (
              <div style={{ font: "500 10px sans-serif", opacity: 0.7, marginTop: 2 }}>
                {rm.profile.type} · {rm.profile.size} · {rm.profile.water}
                {rm.profile.features.length ? ` · ${rm.profile.features.join(", ")}` : ""}
              </div>
            )}
          </div>
        )
      }
    }
  }

  // Flyout chrome (hamburger nav + settings). A fixed transparent backdrop closes on click; the
  // panel is a sibling that drops under the top bar. (Styling → Page.module.css: .backdrop / .panel.)
  const settingToggles: [string, boolean, (v: boolean) => void][] = [
    ["Base", showBase, setShowBase], ["Cave skin", showSkin, setShowSkin],
    ["Stairs", showStairs, setShowStairs], ["Portals", showPortals, setShowPortals],
    ["Grid", showGrid, setShowGrid], ["Chamber numbers", showRoomNumbers, setShowRoomNumbers],
  ]

  const legend = (
    <div className={styles.legend}>
      {LEGEND_MATERIALS.map(m => (
        <span key={m} className={styles.legendItem}>
          <span className={styles.swatch} style={{ background: MATERIAL_COLOR[m], border: "1px solid #0003" }} />
          {MATERIAL_LABEL[m]}
        </span>
      ))}
      <span className={styles.legendItem}>
        <span className={styles.swatch} style={{ background: PORTAL_STYLE.entrance, borderRadius: "50%" }} />
        Entrance
        <span className={styles.swatch} style={{ background: PORTAL_STYLE.exit, borderRadius: "50%", marginLeft: 6 }} />
        Exit
      </span>
      <span className={styles.legendItem} style={{ color: "#555" }}>
        Chambers: {rooms.length}
      </span>
    </div>
  )

  // Mini-map: px-per-cell for the miniature (longest side ≈ MINI_MAX).
  const MINI_MAX = 200
  const MC = Math.max(2, Math.floor(MINI_MAX / Math.max(cols, rows)))
  // Keep the viewport rectangle synced with the map wrapper's scroll + client size.
  const syncView = () => { const el = mapWrapRef.current; if (el) setView({ sl: el.scrollLeft, st: el.scrollTop, cw: el.clientWidth, ch: el.clientHeight }) }
  // Drag-to-pan the big map. Threshold (4px) so a click on a chamber pill still registers as a click.
  const onMapPointerDown = (e: ReactPointerEvent) => {
    const el = mapWrapRef.current; if (!el) return
    const start = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop }
    let moved = false
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x, dy = ev.clientY - start.y
      if (!moved && Math.abs(dx) + Math.abs(dy) < 4) return
      if (!moved) { moved = true; setDragging(true) }
      el.scrollLeft = start.sl - dx; el.scrollTop = start.st - dy
      ev.preventDefault()
    }
    const up = () => {
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up)
      setDragging(false)
    }
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up)
  }
  // Click/drag on the mini-map to recenter the main view on that point.
  const panFromMini = (clientX: number, clientY: number) => {
    const cv = miniRef.current, el = mapWrapRef.current; if (!cv || !el) return
    const r = cv.getBoundingClientRect()
    const mapPxX = ((clientX - r.left) / MC) * S, mapPxY = ((clientY - r.top) / MC) * S
    el.scrollTo({ left: pad.x + mapPxX - el.clientWidth / 2, top: pad.y + mapPxY - el.clientHeight / 2 })
  }
  const onMiniPointerDown = (e: ReactPointerEvent) => {
    panFromMini(e.clientX, e.clientY)
    const move = (ev: PointerEvent) => panFromMini(ev.clientX, ev.clientY)
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up) }
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up)
  }

  useEffect(() => {
    const onResize = () => { syncView(); setPad({ x: Math.ceil(window.innerWidth / 2), y: Math.ceil(window.innerHeight / 2) }); setWinW(window.innerWidth) }
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cave, cols, rows])
  // Keep the map at its top-left origin by default (scroll past the top-left gutter). Skipped while
  // something is selected so it doesn't fight click-to-center. Runs before paint → no flash.
  useLayoutEffect(() => {
    if (selNum == null) mapWrapRef.current?.scrollTo(pad.x, pad.y)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pad, cave, cols, rows])
  // Draw the miniature: one filled rect per base cell, coloured by raw material.
  useEffect(() => {
    const cv = miniRef.current; if (!cv) return
    const ctx = cv.getContext("2d"); if (!ctx) return
    ctx.clearRect(0, 0, cv.width, cv.height)
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      ctx.fillStyle = MATERIAL_COLOR[grid[r][c]]
      ctx.fillRect(c * MC, r * MC, MC, MC)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cave, cols, rows, miniOpen])

  const selRoom = selNum != null ? rooms.find(r => r.num === selNum) ?? null : null

  // Recenter the map on the selected chamber (runs after the drawer narrows the content column).
  useEffect(() => {
    if (!selRoom) return
    const cx = (selRoom.x + selRoom.w / 2) * S, cy = (selRoom.y + selRoom.h / 2) * S
    // Wait out the 0.2s drawer-width transition so clientWidth is the narrowed visible width.
    const t = setTimeout(() => {
      const elw = mapWrapRef.current; if (!elw) return
      elw.scrollTo({ left: pad.x + cx - elw.clientWidth / 2, top: pad.y + cy - elw.clientHeight / 2, behavior: "smooth" })
    }, 230)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selNum])

  // The selected chamber's description, memoized so hovering doesn't re-run the generator.
  const inspectorDesc = useMemo(
    () => (selRoom ? describeCaveRoom(selRoom, cave.seed) : []),
    [selNum, cave]) // eslint-disable-line react-hooks/exhaustive-deps

  // Responsive inspector-drawer width: smaller at standard breakpoints; on tiny screens fit within
  // the window (winW - 32) so the panel never overflows.
  const drawerW = winW >= 1024 ? 360 : winW >= 768 ? 320 : winW >= 480 ? 280 : Math.max(200, winW - 32)

  return (
    <div className={styles.page}>
      <div className={styles.content}>
      <div className={styles.topbar}>
        <button aria-label="Navigation" title="Navigation" className={styles.iconBtn}
          onClick={() => { setNavOpen(o => !o); setSettingsOpen(false) }}>☰</button>
        <button aria-label="Settings" title="Layer settings" className={styles.iconBtn}
          onClick={() => { setSettingsOpen(o => !o); setNavOpen(false) }}>⚙</button>
        <button aria-label="Regenerate" title="Regenerate" className={styles.iconBtn}
          onClick={() => regenerate()}>↻</button>
        <button aria-label="Download JSON" title="Export this cave as JSON" className={styles.iconBtn}
          onClick={downloadJson}>⤓</button>
        <h2 className={styles.title}>{cave.name}</h2>
        <span style={{ color: "#888", fontSize: 12, alignSelf: "center" }}>· {cave.type}</span>

        {navOpen && (<>
          <div className={styles.backdrop} onClick={() => setNavOpen(false)} />
          <div className={styles.panel}><CaveNav /></div>
        </>)}
        {settingsOpen && (<>
          <div className={styles.backdrop} onClick={() => setSettingsOpen(false)} />
          <div className={styles.panelSettings}>
            {settingToggles.map(([label, on, set]) => (
              <label key={label}><input type="checkbox" checked={on} onChange={e => set(e.target.checked)} />&nbsp;{label}</label>
            ))}
          </div>
        </>)}
      </div>

      <div className={styles.controls}>
        <label>Columns: {cols}&nbsp;
          <input type="range" min={4} max={40} value={cols} onChange={e => handleCols(Number(e.target.value))} />
        </label>
        <label>Rows: {rows}&nbsp;
          <input type="range" min={4} max={30} value={rows} onChange={e => handleRows(Number(e.target.value))} />
        </label>
      </div>

      <div className={styles.mapArea}>
        <div ref={mapWrapRef} onScroll={syncView} onPointerDown={onMapPointerDown} className={styles.mapWrap} style={{ cursor: dragging ? "grabbing" : "grab" }}>
          <div style={{ position: "relative", width: cols * S + 2 * pad.x, height: rows * S + 2 * pad.y }}>
          <div style={{ position: "absolute", left: pad.x, top: pad.y, width: cols * S, height: rows * S }}>
          {baseCells}
          {stairTiles}
          {caveSkinTiles}
          {portalTiles}
          {gridOverlay}
          {roomNumberTiles}
          </div>
          </div>
        </div>
        {miniOpen ? (
        <div className={styles.mini} style={{ width: cols * MC, height: rows * MC }}>
          <canvas ref={miniRef} width={cols * MC} height={rows * MC} onPointerDown={onMiniPointerDown} className={styles.miniCanvas} />
          <div className={styles.miniRect} style={{
            left: ((view.sl - pad.x) / S) * MC, top: ((view.st - pad.y) / S) * MC,
            width: Math.min(cols * MC, (view.cw / S) * MC), height: Math.min(rows * MC, (view.ch / S) * MC),
          }} />
          <button onClick={() => setMiniOpen(false)} title="Hide mini-map" aria-label="Hide mini-map"
            className={styles.miniClose}>×</button>
        </div>
        ) : (
          <button onClick={() => setMiniOpen(true)} title="Show mini-map" aria-label="Show mini-map"
            className={styles.miniOpen}>▦</button>
        )}
      </div>

      {legend}

      <div className={styles.footer}>
        <label>Seed:&nbsp;
          <input type="number" value={seedInput} placeholder="random"
            onChange={e => setSeedInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") regenerate() }}
            onBlur={() => { if (seedPending) regenerate() }}
            data-pending={seedPending ? "" : undefined}
            title="Type a seed and press Enter to reproduce that cave; clear it for a random one"
            className={styles.seedInput} />
        </label>
        {seedPending && <span className={styles.seedHint}>press Enter to apply</span>}
        <span className={styles.seedCurrent}>
          current:&nbsp;
          <code className={styles.seedCode} title="Click to reuse this seed"
            onClick={() => { setSeedInput(String(cave.seed)); regenerate(cols, rows, cave.seed) }}>{cave.seed}</code>
        </span>
      </div>
      </div>

      {/* Slide-out inspector drawer (right). Push layout — narrows the content column above; keeps
          the mini-map visible. Its own scroll so the page never scrolls. */}
      <div className={styles.drawer} style={{ width: selRoom ? drawerW : 0, height: selRoom ? "100vh" : 0 }}>
        <div className={styles.drawerInner} style={{ width: drawerW }}>
          <button onClick={closeInspector} title="Close" aria-label="Close"
            className={styles.drawerClose}>×</button>
          {selRoom && (
            <>
              <div className={styles.roomName}>#{selRoom.num} · {selRoom.name}</div>
              {selRoom.profile && (
                <div className={styles.roomProfile}>
                  {selRoom.profile.type} · {selRoom.profile.size} · {selRoom.profile.water}
                  {selRoom.profile.features.length ? ` · ${selRoom.profile.features.join(", ")}` : ""}
                </div>
              )}
              {inspectorDesc.map((para, i) => <p key={i} className={styles.roomPara}>{para}</p>)}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
