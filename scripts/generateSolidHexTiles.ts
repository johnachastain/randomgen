import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { ALL_TERRAINS, TERRAIN_COLORS, ROOT } from "./detectHexTiles.js"

// Generates solid single-terrain hex tiles — one flat-color hexagon per terrain.
// Without these the tile library is all 2-terrain transitions, so no region can
// ever be uniform and the map degrades into stripes. Geometry matches the
// flat-top hex the detector samples (W=200, H=173).

const tilesDir = join(ROOT, "public/hexTiles")

// Flat-top hex, W=200, H=200*(√3/2)=173.205 — exact √3 aspect so solids line up
// with the transition tiles. Corners clockwise from top-right.
const H = 200 * Math.sqrt(3) / 2 // 173.205
const HEX_POINTS = `150,0 200,${(H / 2).toFixed(3)} 150,${H.toFixed(3)} 50,${H.toFixed(3)} 0,${(H / 2).toFixed(3)} 50,0`

let written = 0
for (const terrain of ALL_TERRAINS) {
  const color = TERRAIN_COLORS[terrain]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 ${H.toFixed(3)}">
  <polygon points="${HEX_POINTS}" fill="${color}"/>
</svg>
`
  const outPath = join(tilesDir, `solid_${terrain}.svg`)
  writeFileSync(outPath, svg, "utf-8")
  console.log(`  solid_${terrain}.svg (${color})`)
  written++
}

console.log(`\nDone: ${written} solid tile(s) → public/hexTiles/`)
