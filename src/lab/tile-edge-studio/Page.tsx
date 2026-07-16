import { useState } from 'react'
import { Link } from 'wouter'
import styles from './Page.module.css'
import { mulberry32, randomSeed } from '../../core/rng'
import { roughen, linePath, smoothPath, point as p } from './roughEdge'
import type { Pt, EdgeMode, RoughEdgeConfig } from './roughEdge'

// --- geometry -------------------------------------------------------------

const STRIP = { W: 300, H: 150, tiles: 6, base: 82 }
const CHAMBER = { W: 300, H: 240, R: 92 }

// A horizontal wall edge spanning several tiles — the seam-continuity demo.
function stripData(cfg: RoughEdgeConfig): { clean: Pt[]; rough: Pt[] } {
  const { W, tiles, base } = STRIP
  const clean: Pt[] = []
  for (let i = 0; i <= tiles; i++) clean.push(p((W / tiles) * i, base, true))
  const rng = mulberry32(cfg.seed ^ 0x9e37)
  const rough = cfg.amp === 0 ? clean.map(pt => ({ ...pt, pin: true })) : roughen(clean, cfg.segs, cfg.amp, rng, false)
  return { clean, rough }
}

// A blobby cave chamber outline. The coarse shape uses its own rng so it stays put while
// amplitude/detail change — you're roughening a fixed chamber, not reshaping it.
function chamberData(cfg: RoughEdgeConfig, verts: number): { clean: Pt[]; rough: Pt[] } {
  const { W, H, R } = CHAMBER
  const cx = W / 2
  const cy = H / 2
  const shapeRng = mulberry32(cfg.seed ^ 0x1234)
  const clean: Pt[] = []
  for (let i = 0; i < verts; i++) {
    const a = (i / verts) * Math.PI * 2
    const rr = R * (0.72 + shapeRng() * 0.42)
    clean.push(p(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.82, true))
  }
  const rng = mulberry32(cfg.seed)
  const rough = cfg.amp === 0 ? clean.map(pt => ({ ...pt, pin: true })) : roughen(clean, cfg.segs, cfg.amp, rng, true)
  return { clean, rough }
}

const pinDots = (pts: Pt[]) =>
  pts.filter(pt => pt.pin).map((pt, i) => <circle key={i} cx={pt.x} cy={pt.y} r={2.6} fill="var(--pin)" />)

// --- svg cards ------------------------------------------------------------

function StripCard({ mode, cfg, pins }: { mode: EdgeMode; cfg: RoughEdgeConfig; pins: boolean }) {
  const { W, H, tiles } = STRIP
  const { clean, rough } = stripData(cfg)
  const pts = mode === 'straight' ? clean : rough
  const boundary = mode === 'eroded' ? smoothPath(pts, false) : linePath(pts, false)
  const wall = `${boundary} L ${W} 0 L 0 0 Z`
  return (
    <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <rect width={W} height={H} fill="var(--floor)" />
      <path d={wall} fill="var(--wall)" />
      <path d={boundary} fill="none" stroke="var(--lip)" strokeWidth={3} strokeLinejoin="round" />
      {pins &&
        Array.from({ length: tiles + 1 }).map((_, i) => (
          <line key={i} x1={(W / tiles) * i} y1={0} x2={(W / tiles) * i} y2={H} stroke="var(--grid)" strokeWidth={1} />
        ))}
      {pins && pinDots(pts)}
    </svg>
  )
}

function ChamberCard({ mode, cfg, verts, pins }: { mode: EdgeMode; cfg: RoughEdgeConfig; verts: number; pins: boolean }) {
  const { W, H } = CHAMBER
  const { clean, rough } = chamberData(cfg, verts)
  const pts = mode === 'straight' ? clean : rough
  const d = mode === 'eroded' ? smoothPath(pts, true) : linePath(pts, true)
  return (
    <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <rect width={W} height={H} fill="var(--wall)" />
      <path d={d} fill="var(--floor)" />
      <path d={d} fill="none" stroke="var(--lip)" strokeWidth={3} strokeLinejoin="round" />
      {pins && pinDots(pts)}
    </svg>
  )
}

// --- controls -------------------------------------------------------------

const MODES: { mode: EdgeMode; title: string; tag: string; note: string }[] = [
  { mode: 'straight', title: 'Straight', tag: 'baseline', note: "Today's perfect edges." },
  { mode: 'jagged', title: 'Jagged', tag: 'rocky', note: 'Displaced polyline — hewn rock.' },
  { mode: 'eroded', title: 'Eroded', tag: 'wavy', note: 'Same jitter, smoothed — water-worn.' },
]

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className={styles.ctl}>
      <label>
        {label} <b>{value}</b>
      </label>
      <input type="range" min={min} max={max} step={1} value={value} onChange={e => onChange(+e.target.value)} />
    </div>
  )
}

// --- page -----------------------------------------------------------------

export default function TileEdgeStudioPage() {
  const [seed, setSeed] = useState(() => randomSeed())
  const [amp, setAmp] = useState(10)
  const [segs, setSegs] = useState(5)
  const [verts, setVerts] = useState(11)
  const [pins, setPins] = useState(false)

  const cfg: RoughEdgeConfig = { seed, amp, segs }

  return (
    <div className={styles.root}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            <Link href="/" className={styles.back}>
              ← randomgen
            </Link>
            {'  ·  Cave tiles · studio'}
          </p>
          <h1 className={styles.title}>Tile Edge Studio</h1>
          <p className={styles.lede}>
            Compare straight, jagged, and eroded cave-wall edges from one seeded displacement, and tune the organic look
            before it lands in the tile generator. Endpoints are pinned at tile boundaries, so rough edges still tile
            seamlessly.
          </p>
        </header>

        <div className={styles.controls}>
          <Slider label="Amplitude" value={amp} min={0} max={26} onChange={setAmp} />
          <Slider label="Roughness detail" value={segs} min={2} max={12} onChange={setSegs} />
          <Slider label="Wall coarseness" value={verts} min={6} max={20} onChange={setVerts} />
          <div className={styles.actions}>
            <label className={styles.toggle}>
              <input type="checkbox" checked={pins} onChange={e => setPins(e.target.checked)} /> Seam pins
            </label>
            <button className={styles.button} onClick={() => setSeed(randomSeed())}>
              ↻ New seed
            </button>
          </div>
        </div>

        <p className={styles.sectionLabel}>A wall edge · seam continuity</p>
        <div className={styles.grid3}>
          {MODES.map(m => (
            <article key={m.mode} className={styles.card}>
              <h3>
                {m.title} <span className={styles.tag}>{m.tag}</span>
              </h3>
              <StripCard mode={m.mode} cfg={cfg} pins={pins} />
              <p>{m.note}</p>
            </article>
          ))}
        </div>

        <p className={styles.sectionLabel}>In context · a cave chamber</p>
        <div className={styles.grid3}>
          {MODES.map(m => (
            <article key={m.mode} className={styles.card}>
              <h3>
                {m.title} <span className={styles.tag}>{m.tag}</span>
              </h3>
              <ChamberCard mode={m.mode} cfg={cfg} verts={verts} pins={pins} />
              <p>{m.note}</p>
            </article>
          ))}
        </div>

        <footer className={styles.footer}>
          <p>
            <b>How to read this.</b> The dots (toggle <b>Seam pins</b>) mark tile boundaries. The rough line always passes
            exactly through them — only the interior is displaced — so adjacent tiles connect with no visible break.{' '}
            <b>Jagged</b> and <b>Eroded</b> use identical jitter data; only the path smoothing differs. One caveat: a
            single rough variant per trim index repeats along long walls — the fix (K variants picked per cell) is roadmap
            R4.
          </p>
        </footer>
      </div>
    </div>
  )
}
