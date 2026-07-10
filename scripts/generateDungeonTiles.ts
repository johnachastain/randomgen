import { writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { TRIM_STYLE, STAIR_STYLE, PORTAL_STYLE, MATERIAL_COLOR } from "../src/lab/geomorph-dungeon/materials.js"
import { Material } from "../src/lab/geomorph-dungeon/types.js"
import type { Edge, PortalKind, Corner } from "../src/lab/geomorph-dungeon/types.js"

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
const CONFIG_PATH = join(ROOT, "src/lab/geomorph-dungeon/tileConfig.ts")

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

// TIGHTER rounded-ROOM corner tiles (2026-07-08): the fillet is only HALF a cell (radius V/2 = 50,
// centred at the cell centre 50,50) — a ½-cell straight wall → quarter-arc → ½-cell straight wall.
// Scoped to the `rounded` room shape ONLY (circles/apses keep the full-cell `roundCornerTile` arc).
// Rounded rooms are always cornerRadius 1, so these are r=1 only (stroke = BW).
const RR_BITE: Record<Corner, string> = {
  nw: "M 0,0 L 50,0 A 50 50 0 0 0 0,50 Z",
  ne: "M 100,0 L 50,0 A 50 50 0 0 1 100,50 Z",
  se: "M 100,100 L 100,50 A 50 50 0 0 1 50,100 Z",
  sw: "M 0,100 L 0,50 A 50 50 0 0 0 50,100 Z",
}
function roundedRoomCornerTile(orient: Corner): string {
  return wrap(`<path d="${RR_BITE[orient]}" fill="${MATERIAL_COLOR[Material.Wall]}"/>`)
}
function roundedRoomTrimTile(orient: Corner): string {
  const i = BW / 2, Rp = 50 - i // stroke centred on the path → outer edge lands on the wall boundary
  const arc: Record<Corner, string> = {
    nw: `M 100,${i} L 50,${i} A ${Rp} ${Rp} 0 0 0 ${i},50 L ${i},100`,
    ne: `M 0,${i} L 50,${i} A ${Rp} ${Rp} 0 0 1 ${100 - i},50 L ${100 - i},100`,
    se: `M ${100 - i},0 L ${100 - i},50 A ${Rp} ${Rp} 0 0 1 50,${100 - i} L 0,${100 - i}`,
    sw: `M ${i},0 L ${i},50 A ${Rp} ${Rp} 0 0 0 50,${100 - i} L 100,${100 - i}`,
  }
  return wrap(`<path d="${arc[orient]}" fill="none" stroke="${TRIM_STYLE.wall.body}" stroke-width="${BW}"/>`)
}

// Alcove half-circle tiles (E3d): an OUTWARD semicircular bay. Unlike apses (two quarter-corner
// tiles) an alcove is ONE half-disc. BITE = the wall-colour region = the 2:1 bounding rect MINUS the
// half-disc (transparent inside → base floor/water shows through); the flat diameter sits on the wall
// line (room side), the bulge points AWAY. TRIM = the arc lip (stroke) hugging the floor side.
// N/S use a 200×100 viewBox (diameter×radius), E/W a 100×200. Rendered scaled to the alcove region.
const svgVB = (w: number, h: number, inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">\n  ${inner}\n</svg>\n`
const WALLC = MATERIAL_COLOR[Material.Wall]
// CELL-ALIGNED per (wall,size): viewBox = wCells×reserveDepth cells (100/cell); the semicircle radius
// = wCells·50 (bulge = 1½ cells lg / ½ sm) sits on the wall line, leaving the outer strip as bite so
// the tile fills WHOLE cells (no floor sliver). Undistorted (aspect matches the region). lg = 3×2
// cells, sm = 1×1. e/w swap the axes. `rad` = the along half-width; `depth` viewBox = reserveDepth·100.
const ALCOVE_DIM: Record<"sm" | "lg", { wCells: number; reserve: number }> = { sm: { wCells: 1, reserve: 1 }, lg: { wCells: 3, reserve: 2 } }
function alcoveBaseTile(wall: Edge, size: "sm" | "lg"): string {
  const { wCells, reserve } = ALCOVE_DIM[size], A = wCells * 100, D = reserve * 100, rad = wCells * 50
  // bite = rect − half-disc; flat diameter on the wall line, bulge outward. Sweeps as derived (P1).
  if (wall === "n") return svgVB(A, D, `<path d="M 0,0 L ${A},0 L ${A},${D} A ${rad} ${rad} 0 0 0 0,${D} Z" fill="${WALLC}"/>`)
  if (wall === "s") return svgVB(A, D, `<path d="M 0,${D} L ${A},${D} L ${A},0 A ${rad} ${rad} 0 0 1 0,0 Z" fill="${WALLC}"/>`)
  if (wall === "e") return svgVB(D, A, `<path d="M ${D},0 L ${D},${A} L 0,${A} A ${rad} ${rad} 0 0 0 0,0 Z" fill="${WALLC}"/>`)
  return svgVB(D, A, `<path d="M 0,0 L 0,${A} L ${D},${A} A ${rad} ${rad} 0 0 1 ${D},0 Z" fill="${WALLC}"/>`) // w
}
function alcoveTrimTile(wall: Edge, size: "sm" | "lg"): string {
  const { wCells, reserve } = ALCOVE_DIM[size], A = wCells * 100, D = reserve * 100, rad = wCells * 50
  const wS = BW, i = wS / 2, R = rad - i // stroke centred → outer edge lands on the arc boundary
  let vb: [number, number], arc: string
  if (wall === "n") { vb = [A, D]; arc = `M ${i},${D} A ${R} ${R} 0 0 1 ${A - i},${D}` }
  else if (wall === "s") { vb = [A, D]; arc = `M ${i},0 A ${R} ${R} 0 0 0 ${A - i},0` }
  else if (wall === "e") { vb = [D, A]; arc = `M 0,${i} A ${R} ${R} 0 0 1 0,${A - i}` }
  else { vb = [D, A]; arc = `M ${D},${i} A ${R} ${R} 0 0 0 ${D},${A - i}` } // w
  return svgVB(vb[0], vb[1], `<path d="${arc}" fill="none" stroke="${TRIM_STYLE.wall.body}" stroke-width="${wS}"/>`)
}

mkdirSync(OUT_DIR, { recursive: true })
for (const f of readdirSync(OUT_DIR)) {
  if (/^(corner_|trim_|wall_trim_|water_trim_|door_|pillar|stairs_|portal_|round_base_|round_corner_|round_trim_|rrcorner_|rrtrim_|alcove_)/.test(f)) rmSync(join(OUT_DIR, f))
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
  // Tighter rounded-ROOM corner (half-cell fillet) — scoped to the `rounded` shape (r=1 only).
  writeFileSync(join(OUT_DIR, `rrcorner_${orient}.svg`), roundedRoomCornerTile(orient), "utf-8")
  writeFileSync(join(OUT_DIR, `rrtrim_${orient}.svg`), roundedRoomTrimTile(orient), "utf-8")
}

// Alcove half-circle tiles — cell-aligned base bite + arc trim per (wall, size).
for (const wall of ["n", "s", "e", "w"] as const) for (const size of ["sm", "lg"] as const) {
  writeFileSync(join(OUT_DIR, `alcove_base_${wall}_${size}.svg`), alcoveBaseTile(wall, size), "utf-8")
  writeFileSync(join(OUT_DIR, `alcove_trim_${wall}_${size}.svg`), alcoveTrimTile(wall, size), "utf-8")
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

// Tighter rounded-ROOM corner tiles (half-cell fillet, r=1) — used ONLY for the rounded room shape;
// circles/apses keep ROUND_CORNER_TILES/ROUND_TRIM_TILES. BITE (mask) + arc TRIM (straight+arc+straight).
export const ROUNDED_CORNER_TILES = { nw: "/dungeonTiles/rrcorner_nw.svg", ne: "/dungeonTiles/rrcorner_ne.svg", se: "/dungeonTiles/rrcorner_se.svg", sw: "/dungeonTiles/rrcorner_sw.svg" }

export const ROUNDED_TRIM_TILES = { nw: "/dungeonTiles/rrtrim_nw.svg", ne: "/dungeonTiles/rrtrim_ne.svg", se: "/dungeonTiles/rrtrim_se.svg", sw: "/dungeonTiles/rrtrim_sw.svg" }

// Alcove half-circle tiles (E3d): outward semicircular bay — cell-aligned BASE bite + arc TRIM, nested [wall][size].
export const ALCOVE_BASE_TILES = {
${(["n", "s", "e", "w"] as const).map(w => `  ${w}: { ${(["sm", "lg"] as const).map(s => `${s}: "/dungeonTiles/alcove_base_${w}_${s}.svg"`).join(", ")} },`).join("\n")}
}

export const ALCOVE_TRIM_TILES = {
${(["n", "s", "e", "w"] as const).map(w => `  ${w}: { ${(["sm", "lg"] as const).map(s => `${s}: "/dungeonTiles/alcove_trim_${w}_${s}.svg"`).join(", ")} },`).join("\n")}
}
`
mkdirSync(dirname(CONFIG_PATH), { recursive: true })
writeFileSync(CONFIG_PATH, config, "utf-8")

console.log("Done: wall+water trim (19 each) + 4 door tiles + pillar + 4 stair tiles + 2 portal markers + 4 corner-bite + 16 arc-trim (4 orient × 4 radii) + 4 rr-corner + 4 rr-trim (tighter rounded-room, half-cell fillet) + 8 alcove-base + 8 alcove-trim (4 wall × 2 size, cell-aligned) tiles → public/dungeonTiles/ + tileConfig.ts")
