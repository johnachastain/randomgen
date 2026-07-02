import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs"
import { join, basename, extname } from "node:path"
import { detectTile, edgeKey, writeTileConfig, ROOT, DIRECTIONS, EdgeMap } from "./detectHexTiles.js"

// ── Edge rotation ─────────────────────────────────────────────────────────────
// Rotating a tile N steps of 60° clockwise shifts each edge label N positions CW.
// dirs = ["N","NE","SE","S","SW","NW"]; new edge at index i = old edge at (i-steps+6)%6

function rotateEdges(edges: EdgeMap, steps: number): EdgeMap {
  const result: EdgeMap = {}
  for (let i = 0; i < DIRECTIONS.length; i++) {
    result[DIRECTIONS[i]] = edges[DIRECTIONS[((i - steps) % 6 + 6) % 6]]
  }
  return result
}

// ── SVG rotation ──────────────────────────────────────────────────────────────

function parseViewBox(svgString: string): [number, number] {
  const m = svgString.match(/viewBox\s*=\s*["'][\d.\s-]+\s+([\d.]+)\s+([\d.]+)["']/)
  if (!m) throw new Error("Could not parse viewBox")
  return [parseFloat(m[1]), parseFloat(m[2])]
}

function extractSvgParts(svgString: string): { defs: string; body: string } {
  const defsMatch = svgString.match(/<defs>([\s\S]*?)<\/defs>/)
  const defs = defsMatch ? defsMatch[1] : ""

  const body = svgString
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<svg[^>]*>/g, "")
    .replace(/<\/svg>/g, "")
    .replace(/<defs>[\s\S]*?<\/defs>/g, "")
    .trim()

  return { defs, body }
}

function buildRotatedSvg(svgString: string, angleDeg: number): string {
  const [vw, vh] = parseViewBox(svgString)
  const cx = vw / 2
  const cy = vh / 2

  // Flat-top hex clip-path polygon computed from viewBox dimensions
  const hexPoints = [
    `${(vw * 0.75).toFixed(3)},0`,
    `${vw.toFixed(3)},${(vh / 2).toFixed(3)}`,
    `${(vw * 0.75).toFixed(3)},${vh.toFixed(3)}`,
    `${(vw * 0.25).toFixed(3)},${vh.toFixed(3)}`,
    `0,${(vh / 2).toFixed(3)}`,
    `${(vw * 0.25).toFixed(3)},0`,
  ].join(" ")

  const { defs, body } = extractSvgParts(svgString)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}">
  <defs>
    ${defs.trim()}
    <clipPath id="hex-rot-clip">
      <polygon points="${hexPoints}"/>
    </clipPath>
  </defs>
  <g transform="rotate(${angleDeg}, ${cx.toFixed(3)}, ${cy.toFixed(3)})" clip-path="url(#hex-rot-clip)">
    ${body}
  </g>
</svg>`
}

// ── Main ──────────────────────────────────────────────────────────────────────

const tilesDir = join(ROOT, "public/hexTiles")
const outPath  = join(ROOT, "src/hexTerrainShared/tileConfig.ts")

// Only process source tiles (skip already-generated rotations)
const sourceFiles = readdirSync(tilesDir)
  .filter(f => extname(f) === ".svg" && !/_r\d{3}\.svg$/.test(f))

if (sourceFiles.length === 0) {
  console.log("No source SVG tiles found in public/hexTiles/")
  process.exit(0)
}

// Detect edge configs for all source tiles
const tiles: Array<{ src: string; edges: EdgeMap }> = []
const known = new Map<string, string>() // edgeKey → filename

console.log("Detecting source tiles…")
for (const file of sourceFiles) {
  const svgPath = join(tilesDir, file)
  const edges = detectTile(svgPath)
  if (!edges) {
    console.error(`  SKIP: ${file} (detection failed)`)
    continue
  }
  const key = edgeKey(edges)
  known.set(key, file)
  tiles.push({ src: `/hexTiles/${file}`, edges })
  console.log(`  ${file}: [${key}]`)
}

// Generate rotations for each source tile
console.log("\nGenerating rotations…")
let generated = 0, skipped = 0

for (const { src, edges: sourceEdges } of [...tiles]) {
  const file = basename(src)
  const base = basename(file, extname(file))
  const svgString = readFileSync(join(tilesDir, file), "utf-8")

  for (let steps = 1; steps <= 5; steps++) {
    const angle = steps * 60
    const rotatedEdges = rotateEdges(sourceEdges, steps)
    const key = edgeKey(rotatedEdges)

    const outFile = `${base}_r${String(angle).padStart(3, "0")}.svg`
    const outFilePath = join(tilesDir, outFile)

    if (known.has(key)) {
      console.log(`  ${outFile} → duplicate of "${known.get(key)}", skipped`)
      // Still include in tileConfig if the file already exists from a prior run
      if (existsSync(outFilePath)) tiles.push({ src: `/hexTiles/${outFile}`, edges: rotatedEdges })
      skipped++
      continue
    }

    if (existsSync(outFilePath)) {
      console.log(`  ${outFile}: already exists, skipped`)
      known.set(key, outFile)
      tiles.push({ src: `/hexTiles/${outFile}`, edges: rotatedEdges })
      skipped++
      continue
    }

    const outSvg = buildRotatedSvg(svgString, angle)
    writeFileSync(outFilePath, outSvg, "utf-8")

    known.set(key, outFile)
    tiles.push({ src: `/hexTiles/${outFile}`, edges: rotatedEdges })
    console.log(`  ${outFile}: [${key}]`)
    generated++
  }
}

writeTileConfig(tiles, outPath, "scripts/generateHexTileRotations.ts", "../hexTerrain/types")
console.log(`\nDone: ${generated} new tile(s) generated, ${skipped} duplicate(s) skipped`)
console.log(`tileConfig.ts updated with ${tiles.length} total tile(s)`)
