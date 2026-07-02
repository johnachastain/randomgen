import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { ROOT, TERRAIN_COLORS, ALL_TERRAINS } from "./detectHexTiles.js"

// Normalizes hand-authored source tiles so the whole library is visually
// consistent:
//   1. snap every fill color to the exact terrain palette (fixes mismatched greens)
//   2. tighten the viewBox to the hex outline and shift the art to the origin so
//      every tile fills its cell identically (fixes edge-alignment drift, e.g.
//      five.svg's 0.46px offset)
// Run BEFORE recolor/rotation so all derived tiles inherit the fix.

const dir = join(ROOT, "public/hexTiles")
const SOURCES = ["test_transition", "one", "two", "three", "four", "five", "six"]

function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
function dist(a: [number, number, number], b: [number, number, number]): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
}
function snapColor(hex: string): string {
  const c = rgb(hex)
  let best = TERRAIN_COLORS[ALL_TERRAINS[0]], bd = Infinity
  for (const t of ALL_TERRAINS) {
    const d = dist(rgb(TERRAIN_COLORS[t]), c)
    if (d < bd) { bd = d; best = TERRAIN_COLORS[t] }
  }
  return best
}

function polygonBBoxes(svg: string): { minx: number; miny: number; maxx: number; maxy: number }[] {
  const out: { minx: number; miny: number; maxx: number; maxy: number }[] = []
  for (const m of svg.matchAll(/<polygon[^>]*points="([^"]+)"/g)) {
    const nums = m[1].trim().split(/[\s,]+/).map(Number)
    const xs = nums.filter((_, i) => i % 2 === 0), ys = nums.filter((_, i) => i % 2 === 1)
    out.push({ minx: Math.min(...xs), miny: Math.min(...ys), maxx: Math.max(...xs), maxy: Math.max(...ys) })
  }
  return out
}

function extractParts(svg: string): { defs: string; body: string } {
  const defs = svg.match(/<defs>([\s\S]*?)<\/defs>/)?.[1] ?? ""
  const body = svg
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<svg[^>]*>/g, "")
    .replace(/<\/svg>/g, "")
    .replace(/<defs>[\s\S]*?<\/defs>/g, "")
    .trim()
  return { defs, body }
}

let count = 0
for (const base of SOURCES) {
  const file = join(dir, `${base}.svg`)
  let svg: string
  try { svg = readFileSync(file, "utf-8") } catch { continue }

  // viewBox
  const vb = svg.match(/viewBox="([^"]+)"/)?.[1].split(/\s+/).map(Number) ?? [0, 0, 0, 0]
  const [vx, vy, vw, vh] = vb
  const eps = 1

  // Pick the hex outline: the largest polygon fully inside the current viewBox.
  const hexes = polygonBBoxes(svg)
    .filter(b => b.minx >= vx - eps && b.maxx <= vx + vw + eps && b.miny >= vy - eps && b.maxy <= vy + vh + eps)
    .sort((a, b) => (b.maxx - b.minx) * (b.maxy - b.miny) - (a.maxx - a.minx) * (a.maxy - a.miny))
  const hex = hexes[0]
  if (!hex) { console.warn(`  ${base}: no hex polygon found, skipping`); continue }
  const hw = hex.maxx - hex.minx, hh = hex.maxy - hex.miny

  const { defs, body } = extractParts(svg)
  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${hw.toFixed(2)} ${hh.toFixed(2)}">
  <defs>${defs}</defs>
  <g transform="translate(${(-hex.minx).toFixed(2)}, ${(-hex.miny).toFixed(2)})">
    ${body}
  </g>
</svg>
`
  // snap all colors to palette
  out = out.replace(/#[0-9a-fA-F]{6}/g, m => snapColor(m))

  writeFileSync(file, out, "utf-8")
  console.log(`  ${base}.svg → viewBox 0 0 ${hw.toFixed(2)} ${hh.toFixed(2)}  shift(${(-hex.minx).toFixed(2)},${(-hex.miny).toFixed(2)})`)
  count++
}
console.log(`\nNormalized ${count} source tile(s).`)
