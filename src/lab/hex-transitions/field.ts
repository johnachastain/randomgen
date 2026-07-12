import { TerrainType } from "./types"
import { ALL_TERRAINS, ADJACENCY } from "./terrainConfig"

// Coherent per-HEX terrain regions via seeded Voronoi growth: scatter a few
// seeds, give each a terrain (walking the ADJACENCY graph so neighbouring
// regions stay terrain-compatible), then every hex takes its nearest seed's
// terrain — yielding large contiguous blobs. The "field" mode feeds this to the
// (seam-safe) tile-WFC as a per-cell target: solids fill blob interiors,
// transition tiles land on the borders.

const SQRT3 = Math.sqrt(3)

// Flat-top hex center in the same layout the page renders (odd cols shifted down).
function center(col: number, row: number): [number, number] {
  return [col * 1.5, row * SQRT3 + (col % 2 === 1 ? SQRT3 / 2 : 0)]
}

function randInt(n: number): number { return Math.floor(Math.random() * n) }

export function generateTerrainRegions(cols: number, rows: number): TerrainType[][] {
  const seedCount = Math.max(2, Math.round((cols * rows) / 12))

  const seeds: { x: number; y: number; terrain: TerrainType }[] = []
  const used = new Set<string>()
  // First seed random; each subsequent terrain walks ADJACENCY from an existing
  // one, so the map uses a locally-connected slice of the terrain palette.
  const terrains: TerrainType[] = [ALL_TERRAINS[randInt(ALL_TERRAINS.length)]]
  while (seeds.length < seedCount) {
    const c = randInt(cols), r = randInt(rows)
    const key = `${c},${r}`
    if (used.has(key)) continue
    used.add(key)
    if (seeds.length > 0) {
      const from = terrains[randInt(terrains.length)]
      const opts = ADJACENCY[from]
      terrains.push(opts[randInt(opts.length)])
    }
    const [x, y] = center(c, r)
    seeds.push({ x, y, terrain: terrains[seeds.length] })
  }

  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const [x, y] = center(c, r)
      let best = seeds[0], bestD = Infinity
      for (const s of seeds) {
        const d = (s.x - x) ** 2 + (s.y - y) ** 2
        if (d < bestD) { bestD = d; best = s }
      }
      return best.terrain
    }))
}
