import { writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { TRIM_STYLE, STAIR_STYLE, PORTAL_STYLE, MATERIAL_COLOR } from "../src/refactorGeomorphs/geomorph-dungeon/materials.js"
import { Material } from "../src/refactorGeomorphs/geomorph-dungeon/types.js"
import type { Edge, PortalKind, Corner } from "../src/refactorGeomorphs/geomorph-dungeon/types.js"

// Generates PLACEHOLDER wall-detail "trim" tiles (per material) + door tiles for
// the multi-material dungeon geomorph. The detail layer is a fine sub-grid; a
// floor sub-cell touching an edge-material renders a trim lip that bumps into the
// room. Index scheme (see bitmask.ts, must stay in sync):
//   orthogonal sides  N=1 E=2 S=4 W=8  → index 1..15
//   outer corners (diagonal-only)  NE=16 SE=17 SW=18 NW=19
// Straight edges fill the sub-cell (prominent strips); outer corners fill one
// 50×50 quadrant (small nubs). Room-facing sides get a lighter bevel.
//
// Real art later: replace public/dungeonTiles/<name>_trim_<n>.svg / door_*.svg
// (same names, SVG or PNG) or edit the generated manifest — no app-code change.

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const OUT_DIR = join(ROOT, "public/dungeonTiles")
const CONFIG_PATH = join(ROOT, "src/refactorGeomorphs/geomorph-dungeon/tileConfig.ts")

const V = 100 // tile viewBox
const BW = 22 // bevel strip width

const rect = (x: number, y: number, w: number, h: number, fill: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`

function orthoTile(mask: number, body: string, bevel: string): string {
  const parts = [rect(0, 0, V, V, body)]
  if (mask & 1) parts.push(rect(0, V - BW, V, BW, bevel)) // wall N → bevel S
  if (mask & 2) parts.push(rect(0, 0, BW, V, bevel))      // wall E → bevel W
  if (mask & 4) parts.push(rect(0, 0, V, BW, bevel))      // wall S → bevel N
  if (mask & 8) parts.push(rect(V - BW, 0, BW, V, bevel)) // wall W → bevel E
  return parts.join("\n  ")
}

function cornerTile(index: number, body: string, bevel: string): string {
  const H = V / 2
  const map: Record<number, [number, number]> = {
    16: [H, 0], 17: [H, H], 18: [0, H], 19: [0, 0], // NE, SE, SW, NW quadrant origin
  }
  const [qx, qy] = map[index]
  const innerX = qx === 0 ? H - BW : H
  const innerY = qy === 0 ? H - BW : H
  return [
    rect(qx, qy, H, H, body),
    rect(innerX, qy, BW, H, bevel),
    rect(qx, innerY, H, BW, bevel),
  ].join("\n  ")
}

const wrap = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${V} ${V}">\n  ${inner}\n</svg>\n`

// Door: a plain brown line (top-down door leaf), flush to one edge of the cell so
// it aligns with the wall at the room threshold. ~8px thick (wall-detail size).
function doorTile(edge: "n" | "s" | "e" | "w"): string {
  const DOOR = "#8a5a2b", T = 24
  const r = {
    n: rect(0, 0, V, T, DOOR),
    s: rect(0, V - T, V, T, DOOR),
    w: rect(0, 0, T, V, DOOR),
    e: rect(V - T, 0, T, V, DOOR),
  }[edge]
  return wrap(r)
}

// Pillar: a stone dot (rendered at S/2, centered on a base-grid vertex).
function pillarTile(): string {
  return wrap(`<circle cx="${V / 2}" cy="${V / 2}" r="48" fill="#4d525c"/>`)
}

// Stairs: tread lines perpendicular to travel (vertical lines for an E–W stair,
// horizontal for a N–S stair) + a chevron pointing DOWN-slope (toward the lower end,
// i.e. opposite of `up`). One tile per ascent direction.
function stairTile(up: Edge): string {
  const { tread, cue } = STAIR_STYLE
  const horizontalTravel = up === "e" || up === "w"
  const TW = 6 // tread thickness
  const parts: string[] = [] // transparent background — base layer shows through
  for (const p of [8, 24, 40, 56, 72, 88]) {
    parts.push(horizontalTravel ? rect(p, 0, TW, V, tread) : rect(0, p, V, TW, tread))
  }
  // Chevron points DOWN-slope (toward the lower end), i.e. opposite of `up`.
  const tri: Record<Edge, string> = {
    e: "34,50 54,36 54,64", w: "66,50 46,36 46,64",
    n: "50,66 36,46 64,46", s: "50,34 36,54 64,54",
  }
  parts.push(`<polygon points="${tri[up]}" fill="${cue}"/>`)
  return wrap(parts.join("\n  "))
}

// Level-portal marker: a coloured roundel (green entrance / orange exit) + a white arrow
// drawn in a CANONICAL down orientation. Page.tsx rotates the whole marker so the arrow
// points the same way as the stair chevron on the tile beneath it.
function portalTile(kind: PortalKind): string {
  const fill = kind === "entrance" ? PORTAL_STYLE.entrance : PORTAL_STYLE.exit
  const tri = "50,72 34,44 66,44" // canonical: arrow points DOWN
  return wrap(`<circle cx="50" cy="50" r="34" fill="${fill}"/>\n  <polygon points="${tri}" fill="#fff"/>`)
}

// Rounded room-corner tiles (E3c), on a layer ABOVE the base grid, BELOW wall-detail. Two per
// corner orientation (which OUTER corner is rounded off): a CORNER tile = only the wall-colour
// "bite" (the concave region OUTSIDE the floor quarter-disc), transparent inside the arc so the
// base cell (floor OR water) shows through; a TRIM tile = an arc lip hugging the floor side of
// the curve (curved analogue of the straight lip). `bite` = the wall region (square − disc),
// radius V (self-similar → scaled to r·S at render).
const ROUND: Record<Corner, { bite: string }> = {
  nw: { bite: "M 0,0 L 100,0 A 100 100 0 0 0 0,100 Z" },
  ne: { bite: "M 100,0 L 0,0 A 100 100 0 0 1 100,100 Z" },
  se: { bite: "M 100,100 L 100,0 A 100 100 0 0 1 0,100 Z" },
  sw: { bite: "M 0,100 L 0,0 A 100 100 0 0 0 100,100 Z" },
}
function roundCornerTile(orient: Corner): string {
  return wrap(`<path d="${ROUND[orient].bite}" fill="${MATERIAL_COLOR[Material.Wall]}"/>`)
}
// Arc lip. Rendered at r·S, so the stroke width in viewBox units is BW/r (constant on-screen lip).
// A stroke is CENTRED on its path, so the path radius must be Rp = V − (BW/r)/2 for the lip's OUTER
// edge to land on the wall boundary (V) at every r — else the lip sits offset inward by ~½ stroke.
function roundTrimTile(orient: Corner, r: number): string {
  const w = BW / r, inset = w / 2, Rp = V - inset, far = V - inset
  const arc: Record<Corner, string> = {
    nw: `M ${V},${inset} A ${Rp} ${Rp} 0 0 0 ${inset},${V}`,
    ne: `M 0,${inset} A ${Rp} ${Rp} 0 0 1 ${far},${V}`,
    se: `M ${far},0 A ${Rp} ${Rp} 0 0 1 0,${far}`,
    sw: `M ${inset},0 A ${Rp} ${Rp} 0 0 0 ${V},${far}`,
  }
  return wrap(`<path d="${arc[orient]}" fill="none" stroke="${TRIM_STYLE.wall.body}" stroke-width="${w}"/>`)
}

mkdirSync(OUT_DIR, { recursive: true })
for (const f of readdirSync(OUT_DIR)) {
  if (/^(corner_|trim_|wall_trim_|water_trim_|door_|pillar|stairs_|portal_|round_base_|round_corner_|round_trim_)/.test(f)) rmSync(join(OUT_DIR, f))
}

// Per-material trim sets (index 0 unused).
const trimArrays: Record<string, string[]> = {}
for (const name of Object.keys(TRIM_STYLE) as ("wall" | "water")[]) {
  const { body, bevel } = TRIM_STYLE[name]
  const srcs: string[] = new Array(20).fill("")
  for (let i = 1; i <= 19; i++) {
    const inner = i <= 15 ? orthoTile(i, body, bevel) : cornerTile(i, body, bevel)
    const file = `${name}_trim_${i}.svg`
    writeFileSync(join(OUT_DIR, file), wrap(inner), "utf-8")
    srcs[i] = `/dungeonTiles/${file}`
  }
  trimArrays[name] = srcs
}

// Door tiles — one per edge (line flush to that edge).
for (const edge of ["n", "s", "e", "w"] as const) {
  writeFileSync(join(OUT_DIR, `door_${edge}.svg`), doorTile(edge), "utf-8")
}

// Pillar tile.
writeFileSync(join(OUT_DIR, "pillar.svg"), pillarTile(), "utf-8")

// Stair tiles — one per ascent direction.
for (const up of ["n", "s", "e", "w"] as const) {
  writeFileSync(join(OUT_DIR, `stairs_${up}.svg`), stairTile(up), "utf-8")
}

// Portal markers — entrance / exit.
for (const kind of ["entrance", "exit"] as const) {
  writeFileSync(join(OUT_DIR, `portal_${kind}.svg`), portalTile(kind), "utf-8")
}

// Rounded/round-corner tiles — corner-bite overlay (radius-independent) + arc trim per radius 1..4.
for (const orient of ["nw", "ne", "se", "sw"] as const) {
  writeFileSync(join(OUT_DIR, `round_corner_${orient}.svg`), roundCornerTile(orient), "utf-8")
  for (const r of [1, 2, 3, 4]) {
    writeFileSync(join(OUT_DIR, `round_trim_${orient}_r${r}.svg`), roundTrimTile(orient, r), "utf-8")
  }
}

const arrLiteral = (a: string[]) => `[\n${a.map(s => `  "${s}",`).join("\n")}\n]`
const config = `// AUTO-GENERATED by scripts/generateDungeonTiles.ts — do not edit manually.
// Per-material fine-grid trim tiles + door tiles. Trim index scheme (see bitmask.ts):
//   orthogonal sides N=1 E=2 S=4 W=8 → 1..15; outer corners NE=16 SE=17 SW=18 NW=19.
// Index 0 unused. Swap real art by replacing the SVGs (same names) or editing here.

export const TRIM_WALL: string[] = ${arrLiteral(trimArrays.wall)}

export const TRIM_WATER: string[] = ${arrLiteral(trimArrays.water)}

export const DOOR_TILES = { n: "/dungeonTiles/door_n.svg", s: "/dungeonTiles/door_s.svg", e: "/dungeonTiles/door_e.svg", w: "/dungeonTiles/door_w.svg" }

export const PILLAR_TILE = "/dungeonTiles/pillar.svg"

export const STAIR_TILES = { n: "/dungeonTiles/stairs_n.svg", s: "/dungeonTiles/stairs_s.svg", e: "/dungeonTiles/stairs_e.svg", w: "/dungeonTiles/stairs_w.svg" }

export const PORTAL_TILES = { entrance: "/dungeonTiles/portal_entrance.svg", exit: "/dungeonTiles/portal_exit.svg" }

// Rounded room-corner tiles (overlay above base, below wall-detail), keyed by the outer corner
// rounded off (nw/ne/se/sw). ROUND_CORNER = the wall-colour bite (transparent inside the arc).
export const ROUND_CORNER_TILES = { nw: "/dungeonTiles/round_corner_nw.svg", ne: "/dungeonTiles/round_corner_ne.svg", se: "/dungeonTiles/round_corner_se.svg", sw: "/dungeonTiles/round_corner_sw.svg" }

// Arc-lip tiles, nested [orient][radius] (radius 1..4 — stroke width scales so the lip stays ~constant).
export const ROUND_TRIM_TILES = {
${(["nw", "ne", "se", "sw"] as const).map(o => `  ${o}: { ${[1, 2, 3, 4].map(r => `${r}: "/dungeonTiles/round_trim_${o}_r${r}.svg"`).join(", ")} },`).join("\n")}
}
`
mkdirSync(dirname(CONFIG_PATH), { recursive: true })
writeFileSync(CONFIG_PATH, config, "utf-8")

console.log("Done: wall+water trim (19 each) + 4 door tiles + pillar + 4 stair tiles + 2 portal markers + 4 corner-bite + 16 arc-trim (4 orient × 4 radii) tiles → public/dungeonTiles/ + tileConfig.ts")
