// Rough-edge geometry (Idea 7 — cave tiles). Shared core module consumed by BOTH the Tile Edge
// Studio (`src/lab/tile-edge-studio/`) and the tile generator (`scripts/generateDungeonTiles.ts`).
//
// Turns a clean polyline/polygon into a "rough" one by displacing interior points perpendicular
// to each edge while PINNING the original vertices — so rough tiles still meet seamlessly at their
// shared boundary points. Jagged vs eroded share the same displaced points; only the path
// rendering differs (straight `L` vs Catmull-Rom `C`).

import type { Rng } from '../rng'

export type Pt = { x: number; y: number; pin: boolean }
export type EdgeMode = 'straight' | 'jagged' | 'eroded'

// The tunable look, in one object — the seed of a future exportable preset.
export type RoughEdgeConfig = {
  seed: number
  amp: number // perpendicular displacement, in the caller's units
  segs: number // subdivisions per edge (roughness detail)
}

export const point = (x: number, y: number, pin = false): Pt => ({ x, y, pin })

// Subdivide each edge into `segs` points, displacing the interior perpendicular to the edge.
// The point at each original vertex (s === 0) is left un-displaced (pinned) so neighbouring
// rough edges connect exactly. `closed` wraps the last vertex back to the first.
export function roughen(pts: Pt[], segs: number, amp: number, rng: Rng, closed: boolean): Pt[] {
  const out: Pt[] = []
  const n = pts.length
  const last = closed ? n : n - 1
  for (let i = 0; i < last; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % n]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.hypot(dx, dy) || 1
    const px = -dy / len // perpendicular unit vector
    const py = dx / len
    for (let s = 0; s < segs; s++) {
      const t = s / segs
      const j = s === 0 ? 0 : (rng() * 2 - 1) * amp
      out.push(point(a.x + dx * t + px * j, a.y + dy * t + py * j, s === 0))
    }
  }
  if (!closed) out.push(point(pts[n - 1].x, pts[n - 1].y, true))
  return out
}

const fmt = (v: number) => v.toFixed(1)

// Straight-segment path through the points (faceted / rocky when the points are displaced).
export function linePath(pts: Pt[], closed = false): string {
  const d = 'M ' + pts.map(pt => `${fmt(pt.x)} ${fmt(pt.y)}`).join(' L ')
  return closed ? d + ' Z' : d
}

// Catmull-Rom smoothed path through the same points (eroded / water-worn look).
export function smoothPath(pts: Pt[], closed = false): string {
  const n = pts.length
  if (n < 2) return ''
  let d = `M ${fmt(pts[0].x)} ${fmt(pts[0].y)}`
  const end = closed ? n : n - 1
  for (let i = 0; i < end; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${fmt(c1x)} ${fmt(c1y)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(p2.x)} ${fmt(p2.y)}`
  }
  return closed ? d + ' Z' : d
}

// Render a set of pinned points three ways from ONE displacement pass. If amp is 0 the
// displaced points collapse back to the clean vertices.
export function edgePath(mode: EdgeMode, clean: Pt[], cfg: RoughEdgeConfig, rng: Rng, closed: boolean): string {
  if (mode === 'straight') return linePath(clean, closed)
  const pts = cfg.amp === 0 ? clean.map(pt => ({ ...pt, pin: true })) : roughen(clean, cfg.segs, cfg.amp, rng, closed)
  return mode === 'jagged' ? linePath(pts, closed) : smoothPath(pts, closed)
}
