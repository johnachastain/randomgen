import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs"
import { join, basename, extname, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { Resvg } from "@resvg/resvg-js"

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
export const ROOT = join(__dirname, "..")

// ── Terrain config (mirrors src/hexTerrain/terrainConfig.ts) ─────────────────

export type TerrainType =
  "ocean" | "coast" | "plains" | "forest" | "hills" | "mountains" | "desert" | "swamp"

export type EdgeMap = Record<string, TerrainType>

export const TERRAIN_COLORS: Record<TerrainType, string> = {
  ocean:     "#2255aa",
  coast:     "#66aadd",
  plains:    "#99cc55",
  forest:    "#336622",
  hills:     "#aa8844",
  mountains: "#999999",
  desert:    "#ddcc77",
  swamp:     "#667744",
}

export const ALL_TERRAINS = Object.keys(TERRAIN_COLORS) as TerrainType[]
export const DIRECTIONS = ["N", "NE", "SE", "S", "SW", "NW"] as const

// Corner names, clockwise from top-right — same order as CORNER_VERTICES below.
export type HexCorner = "TR" | "R" | "BR" | "BL" | "L" | "TL"
export const CORNER_NAMES: HexCorner[] = ["TR", "R", "BR", "BL", "L", "TL"]

// ── Hex geometry ──────────────────────────────────────────────────────────────
// Flat-top hex, circumradius R. W = 2R, H = R*√3.
// Corners clockwise from top-right: 0=top-right, 1=right, 2=bottom-right,
//   3=bottom-left, 4=left, 5=top-left.

const R  = 100
const W  = R * 2                        // 200
const H  = Math.round(R * Math.sqrt(3)) // 173
const CX = R
const CY = H / 2
const INSET = 12 // px toward center from each corner vertex

const CORNER_VERTICES = [
  { name: "top-right",    x: R * 1.5, y: 0   },
  { name: "right",        x: R * 2,   y: CY  },
  { name: "bottom-right", x: R * 1.5, y: H   },
  { name: "bottom-left",  x: R * 0.5, y: H   },
  { name: "left",         x: 0,       y: CY  },
  { name: "top-left",     x: R * 0.5, y: 0   },
] as const

const SAMPLE_POINTS = CORNER_VERTICES.map(v => {
  const dx = CX - v.x
  const dy = CY - v.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  return { name: v.name, x: v.x + (dx / dist) * INSET, y: v.y + (dy / dist) * INSET }
})

const EDGE_CORNERS: Record<typeof DIRECTIONS[number], [number, number]> = {
  N: [5, 0], NE: [0, 1], SE: [1, 2], S: [2, 3], SW: [3, 4], NW: [4, 5],
}

// ── Color utilities ───────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [parseInt(h.slice(0,2), 16), parseInt(h.slice(2,4), 16), parseInt(h.slice(4,6), 16)]
}

const TERRAIN_RGB = Object.fromEntries(
  ALL_TERRAINS.map(t => [t, hexToRgb(TERRAIN_COLORS[t])])
) as Record<TerrainType, [number, number, number]>

function colorDist(a: [number,number,number], b: [number,number,number]): number {
  return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2)
}

function nearestTerrain(rgb: [number,number,number]): TerrainType {
  return ALL_TERRAINS.reduce((best, t) =>
    colorDist(rgb, TERRAIN_RGB[t]) < colorDist(rgb, TERRAIN_RGB[best]) ? t : best
  )
}

function samplePixel(pixels: Uint8ClampedArray, x: number, y: number): [number,number,number] {
  const idx = (Math.round(y) * W + Math.round(x)) * 4
  return [pixels[idx], pixels[idx+1], pixels[idx+2]]
}

// ── Per-file detection (exported for use by other scripts) ────────────────────

export function detectTile(svgPath: string, verbose = false): EdgeMap | null {
  const svgString = readFileSync(svgPath, "utf-8")

  let pixels: Uint8ClampedArray
  try {
    const resvg = new Resvg(svgString, { fitTo: { mode: "width", value: W } })
    pixels = resvg.render().pixels
  } catch (e) {
    console.error(`  ERROR rasterizing: ${e}`)
    return null
  }

  const cornerTerrains = SAMPLE_POINTS.map(pt => {
    const rgb = samplePixel(pixels, pt.x, pt.y)
    const t = nearestTerrain(rgb)
    if (verbose) console.log(`    ${pt.name.padEnd(14)} rgb(${rgb.join(",").padEnd(13)}) → ${t}`)
    return t
  })

  const counts: Partial<Record<TerrainType, number>> = {}
  for (const t of cornerTerrains) counts[t] = (counts[t] ?? 0) + 1

  const edges: EdgeMap = {}
  for (const dir of DIRECTIONS) {
    const [ia, ib] = EDGE_CORNERS[dir]
    const a = cornerTerrains[ia]
    const b = cornerTerrains[ib]
    if (a === b) {
      edges[dir] = a
    } else {
      const majority = (counts[a] ?? 0) >= (counts[b] ?? 0) ? a : b
      console.warn(`  WARN: ${dir} edge has mixed corners (${a} / ${b}) → assigned ${majority}`)
      edges[dir] = majority
    }
  }

  return edges
}

export function edgeKey(edges: EdgeMap): string {
  return DIRECTIONS.map(d => edges[d]).join(",")
}

// Corner-based detection: returns the raw terrain at each of the 6 corners,
// without collapsing corner pairs into per-edge terrains. This preserves the
// transition information that edge detection discards.
export function detectCorners(svgPath: string): Record<HexCorner, TerrainType> | null {
  const svgString = readFileSync(svgPath, "utf-8")

  let pixels: Uint8ClampedArray
  try {
    const resvg = new Resvg(svgString, { fitTo: { mode: "width", value: W } })
    pixels = resvg.render().pixels
  } catch (e) {
    console.error(`  ERROR rasterizing: ${e}`)
    return null
  }

  const corners = {} as Record<HexCorner, TerrainType>
  SAMPLE_POINTS.forEach((pt, i) => {
    corners[CORNER_NAMES[i]] = nearestTerrain(samplePixel(pixels, pt.x, pt.y))
  })
  return corners
}

export function writeTileConfig(
  tiles: Array<{ src: string; edges: EdgeMap }>,
  outPath: string,
  generatedBy: string,
  typesImportPath = "./types",
): void {
  const entries = tiles.map(({ src, edges }) => {
    const edgeLines = DIRECTIONS.map(d => `      ${d}: "${edges[d]}"`).join(",\n")
    return `  {\n    src: "${src}",\n    edges: {\n${edgeLines}\n    }\n  }`
  })

  const output = `\
// AUTO-GENERATED by ${generatedBy} — do not edit manually

import type { TerrainType, HexDirection } from "${typesImportPath}"

export type TileConfig = {
  src: string
  edges: Record<HexDirection, TerrainType>
}

export const TILES: TileConfig[] = [
${entries.join(",\n")}
]
`
  writeFileSync(outPath, output, "utf-8")
}

// ── Main (only runs when this file is the entry point) ───────────────────────

function main() {
  const debug = process.argv.includes("--debug")
  const tilesDir = join(ROOT, "public/hexTiles")
  const outPath  = join(ROOT, "src/hexTerrainShared/tileConfig.ts")

  if (debug) mkdirSync(join(tilesDir, "debug"), { recursive: true })

  const files = readdirSync(tilesDir).filter(f => extname(f) === ".svg")
  if (files.length === 0) {
    console.log("No SVG files found in public/hexTiles/ — add tile artwork and re-run.")
    process.exit(0)
  }

  const tiles: Array<{ src: string; edges: EdgeMap }> = []
  let failed = 0

  for (const file of files) {
    console.log(`\nProcessing: ${file}`)
    const edges = detectTile(join(tilesDir, file), debug)
    if (!edges) { failed++; continue }
    tiles.push({ src: `/hexTiles/${file}`, edges })

    if (debug) {
      const svgString = readFileSync(join(tilesDir, file), "utf-8")
      const resvg = new Resvg(svgString, { fitTo: { mode: "width", value: W } })
      // Re-detect to get corner terrains for debug circles (quick re-render)
      const pixels = resvg.render().pixels
      const cornerTerrains = SAMPLE_POINTS.map(pt => {
        const rgb = samplePixel(pixels, pt.x, pt.y)
        return nearestTerrain(rgb)
      })
      const circles = SAMPLE_POINTS.map((pt, i) =>
        `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="6" ` +
        `fill="${TERRAIN_COLORS[cornerTerrains[i]]}" stroke="white" stroke-width="1.5"/>`
      ).join("\n    ")
      const debugSvg = svgString.replace("</svg>", `  ${circles}\n</svg>`)
      writeFileSync(join(tilesDir, "debug", file), debugSvg)
    }
  }

  writeTileConfig(tiles, outPath, "scripts/detectHexTiles.ts", "../hexTerrain/types")
  console.log(`\nDone: ${tiles.length} tile(s) → src/hexTerrain/tileConfig.ts${failed ? ` (${failed} failed)` : ""}`)
  if (debug) console.log("Debug SVGs → public/hexTiles/debug/")
}

if (process.argv[1] === __filename) main()
