import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs"
import { join, basename, extname } from "node:path"
import { ROOT, TERRAIN_COLORS, ALL_TERRAINS } from "./detectHexTiles.js"
import type { TerrainType } from "./detectHexTiles.js"

// ── Color utilities (duplicated inline to avoid importing Resvg) ───────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function colorDist(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)
}

const TERRAIN_RGB = Object.fromEntries(
  ALL_TERRAINS.map(t => [t, hexToRgb(TERRAIN_COLORS[t])])
) as Record<TerrainType, [number, number, number]>

function nearestTerrain(hex: string): TerrainType {
  const rgb = hexToRgb(hex)
  return ALL_TERRAINS.reduce((best, t) =>
    colorDist(rgb, TERRAIN_RGB[t]) < colorDist(rgb, TERRAIN_RGB[best]) ? t : best
  )
}

function extractColors(svgString: string): string[] {
  return [...new Set((svgString.match(/#[0-9a-fA-F]{6}/gi) ?? []).map(c => c.toLowerCase()))]
}

// ── Adjacent pairs from ADJACENCY ─────────────────────────────────────────────

const ADJACENCY: Record<TerrainType, TerrainType[]> = {
  ocean:     ["ocean", "coast"],
  coast:     ["coast", "ocean", "plains", "swamp"],
  plains:    ["plains", "coast", "forest", "hills", "desert", "swamp"],
  forest:    ["forest", "plains", "hills", "swamp"],
  hills:     ["hills", "plains", "forest", "mountains", "desert"],
  mountains: ["mountains", "hills"],
  desert:    ["desert", "plains", "hills"],
  swamp:     ["swamp", "plains", "forest", "coast"],
}

// Build all unique unordered adjacent cross-terrain pairs (a < b by string sort)
const ADJACENT_PAIRS: [TerrainType, TerrainType][] = []
for (const a of ALL_TERRAINS) {
  for (const b of ADJACENCY[a]) {
    if (a !== b && a < b) ADJACENT_PAIRS.push([a, b])
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

const tilesDir = join(ROOT, "public/hexTiles")

// Matches filenames that end with _{terrain}_{terrain} — these are recolored variants
const RECOLOR_SUFFIX_RE = new RegExp(`_(${ALL_TERRAINS.join("|")})_(${ALL_TERRAINS.join("|")})$`)

// Only process canonical source tiles: no rotation suffix and no recolor suffix
const sourceFiles = readdirSync(tilesDir)
  .filter(f => extname(f) === ".svg"
    && !/_r\d{3}\.svg$/.test(f)
    && !RECOLOR_SUFFIX_RE.test(basename(f, extname(f)))
  )

if (sourceFiles.length === 0) {
  console.log("No source SVG tiles found in public/hexTiles/")
  process.exit(0)
}

let generated = 0
let skipped = 0
let failed = 0

for (const file of sourceFiles) {
  const svgPath = join(tilesDir, file)
  const svgString = readFileSync(svgPath, "utf-8")
  const base = basename(file, extname(file))

  console.log(`\nProcessing: ${file}`)

  const colors = extractColors(svgString)
  const terrainMap = new Map<string, TerrainType>()
  for (const color of colors) {
    terrainMap.set(color, nearestTerrain(color))
  }

  // Group colors by terrain
  const terrainToColors = new Map<TerrainType, string[]>()
  for (const [color, terrain] of terrainMap) {
    const list = terrainToColors.get(terrain) ?? []
    list.push(color)
    terrainToColors.set(terrain, list)
  }

  const distinctTerrains = [...terrainToColors.keys()]
  if (distinctTerrains.length !== 2) {
    console.warn(`  SKIP: expected exactly 2 distinct terrain colors, found ${distinctTerrains.length} (${distinctTerrains.join(", ")})`)
    failed++
    continue
  }

  // srcColorA maps to terrainA; pick by lower ALL_TERRAINS index for consistency
  const [terrainA, terrainB] = distinctTerrains.sort(
    (a, b) => ALL_TERRAINS.indexOf(a) - ALL_TERRAINS.indexOf(b)
  )
  const srcColorA = terrainToColors.get(terrainA)!
  const srcColorB = terrainToColors.get(terrainB)!

  console.log(`  Source: ${terrainA} (${srcColorA.join(", ")}) / ${terrainB} (${srcColorB.join(", ")})`)

  for (const [pairA, pairB] of ADJACENT_PAIRS) {
    // pairA < pairB by string sort; resolve to ALL_TERRAINS index ordering
    const first  = ALL_TERRAINS.indexOf(pairA) <= ALL_TERRAINS.indexOf(pairB) ? pairA : pairB
    const second = first === pairA ? pairB : pairA

    // Skip the source tile's own terrain pair
    if (first === terrainA && second === terrainB) {
      console.log(`  ${first}_${second}: same as source, skipped`)
      skipped++
      continue
    }

    const outFile = `${base}_${first}_${second}.svg`
    const outFilePath = join(tilesDir, outFile)

    if (existsSync(outFilePath)) {
      console.log(`  ${outFile}: already exists, skipped`)
      skipped++
      continue
    }

    const targetColorA = TERRAIN_COLORS[first]
    const targetColorB = TERRAIN_COLORS[second]

    const newSvg = svgString.replace(/#[0-9a-fA-F]{6}/gi, match => {
      const lower = match.toLowerCase()
      if (srcColorA.includes(lower)) return targetColorA
      if (srcColorB.includes(lower)) return targetColorB
      return match
    })

    writeFileSync(outFilePath, newSvg, "utf-8")
    console.log(`  ${outFile}: generated (${first} / ${second})`)
    generated++
  }
}

console.log(`\nDone: ${generated} new tile(s) generated, ${skipped} skipped, ${failed} source(s) failed`)
if (generated > 0) {
  console.log("Run 'npm run generate-tiles' to produce rotations and update tileConfig.ts")
}
