// Build a REVIEW template of every dungeon tile: one labeled contact-sheet PNG + a bounds JSON.
// Purpose: inspect the tile inventory / shapes / sizes / transparency before a raster (Photoshop)
// reskin (roadmap R2). The JSON records each tile's exact pixel rect in the atlas for a future slicer.
//
// Run: npm run build-dungeon-atlas  →  tile-template/tile-atlas.png + tile-template/tile-atlas.json
import { Resvg } from "@resvg/resvg-js"
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const TILE_DIR = join(ROOT, "public/dungeonTiles")
const OUT_DIR = join(ROOT, "tile-template")

// Layout knobs (bump SCALE for a higher-res editing template).
const SCALE = 1.5           // px per SVG unit for the fit box (100 units → 150px)
const ART = Math.round(100 * SCALE) // fit box side
const PAD = Math.round(12 * SCALE)
const LABEL_H = Math.round(16 * SCALE)
const COLS = 8
const CELL_W = ART + 2 * PAD
const CELL_H = ART + 2 * PAD + LABEL_H
const HEADER = Math.round(30 * SCALE)
const FS = Math.round(9 * SCALE) // label font size

type Tile = { name: string; file: string; vw: number; vh: number; inner: string }

const files = readdirSync(TILE_DIR).filter(f => f.endsWith(".svg")).sort()
const tiles: Tile[] = files.map(file => {
  const svg = readFileSync(join(TILE_DIR, file), "utf-8")
  const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
  const inner = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
  if (!vb || !inner) throw new Error(`cannot parse ${file}`)
  return { name: file.replace(/\.svg$/, ""), file, vw: parseFloat(vb[1]), vh: parseFloat(vb[2]), inner: inner[1].trim() }
})

const rows = Math.ceil(tiles.length / COLS)
const atlasW = COLS * CELL_W
const atlasH = HEADER + rows * CELL_H

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const parts: string[] = []
const manifest: { cellPx: [number, number]; cols: number; scale: number; tiles: { name: string; file: string; viewBox: [number, number]; atlas: { x: number; y: number; w: number; h: number } }[] } = {
  cellPx: [CELL_W, CELL_H], cols: COLS, scale: SCALE, tiles: [],
}

// bg + checkerboard pattern (reveals which tiles are transparent overlays)
parts.push(`<rect width="${atlasW}" height="${atlasH}" fill="#3a3a3a"/>`)
const chk = Math.round(8 * SCALE)
parts.push(`<pattern id="chk" width="${chk * 2}" height="${chk * 2}" patternUnits="userSpaceOnUse"><rect width="${chk * 2}" height="${chk * 2}" fill="#ffffff"/><rect width="${chk}" height="${chk}" fill="#cccccc"/><rect x="${chk}" y="${chk}" width="${chk}" height="${chk}" fill="#cccccc"/></pattern>`)
parts.push(`<text x="${PAD}" y="${Math.round(HEADER * 0.7)}" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(14 * SCALE)}" fill="#fff">Dungeon tile atlas — ${tiles.length} tiles (checkerboard = transparent)</text>`)

tiles.forEach((t, i) => {
  const gx = i % COLS, gy = Math.floor(i / COLS)
  const cx = gx * CELL_W, cy = HEADER + gy * CELL_H
  const bx = cx + PAD, by = cy + PAD // art-box origin
  // fit the tile into ART×ART preserving aspect
  const s = ART / Math.max(t.vw, t.vh)
  const dw = t.vw * s, dh = t.vh * s
  const ox = bx + (ART - dw) / 2, oy = by + (ART - dh) / 2
  parts.push(`<rect x="${bx}" y="${by}" width="${ART}" height="${ART}" fill="url(#chk)"/>`)
  parts.push(`<g transform="translate(${ox.toFixed(2)},${oy.toFixed(2)}) scale(${s.toFixed(4)})">${t.inner}</g>`)
  parts.push(`<rect x="${bx}" y="${by}" width="${ART}" height="${ART}" fill="none" stroke="#000" stroke-width="1"/>`)
  parts.push(`<text x="${cx + CELL_W / 2}" y="${by + ART + LABEL_H - Math.round(4 * SCALE)}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${FS}" fill="#eee">${esc(t.name)}</text>`)
  manifest.tiles.push({ name: t.name, file: t.file, viewBox: [t.vw, t.vh], atlas: { x: Math.round(ox), y: Math.round(oy), w: Math.round(dw), h: Math.round(dh) } })
})

const atlasSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${atlasW}" height="${atlasH}" viewBox="0 0 ${atlasW} ${atlasH}">\n${parts.join("\n")}\n</svg>\n`

mkdirSync(OUT_DIR, { recursive: true })
const png = new Resvg(atlasSvg, { fitTo: { mode: "width", value: atlasW } }).render().asPng()
writeFileSync(join(OUT_DIR, "tile-atlas.png"), png)
writeFileSync(join(OUT_DIR, "tile-atlas.svg"), atlasSvg, "utf-8")
writeFileSync(join(OUT_DIR, "tile-atlas.json"), JSON.stringify(manifest, null, 2), "utf-8")
console.log(`Wrote tile-template/tile-atlas.png (${atlasW}×${atlasH}), .svg, and .json — ${tiles.length} tiles, ${COLS}×${rows} grid.`)
