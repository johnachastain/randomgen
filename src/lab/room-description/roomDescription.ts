// LAB prototype — Room Description Generator (mad-libs), 3-layer templates.
//
//   Layer 1  properties  — each property is an ENUM (pick one) or a SET (pick a subset of tokens).
//   Layer 2  descriptors — enum: per value; set: per TOKEN → 2–3 descriptive fragments each.
//   Layer 3  sentences   — per property; the {key} slot is filled with the chosen descriptor(s)
//                          (set props list-join their tokens' descriptors).
//
// The template DATA now lives in a single editable `defaultConfig` object (was hardcoded consts) so a
// template editor can swap it at runtime. The engine takes a `config` (defaults to `defaultConfig`, so
// existing callers are unaffected). PROTOTYPE: random values; rng-injectable → seedable later.
// Future real wiring maps the map-derived props: material ← gen mode · size ← room w×h · water ← water
// pass · shape ← cornerRadius/roundCorners/apses[]/alcoves[] · connectors ← adjacent doors/halls/portals[].

type Rng = () => number
const pick = <T>(arr: readonly T[], rng: Rng): T => arr[Math.floor(rng() * arr.length)]
const shuffle = <T>(arr: readonly T[], rng: Rng): T[] => {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}
// "a", "a and b", "a, b, and c"
const listJoin = (xs: string[]): string =>
  xs.length <= 1 ? (xs[0] ?? "") : xs.length === 2 ? `${xs[0]} and ${xs[1]}` : `${xs.slice(0, -1).join(", ")}, and ${xs[xs.length - 1]}`

export type PropKind = "enum" | "set"
export type PropertyDef = { key: string; label: string; kind: PropKind; values: string[]; min?: number }

// The full editable template document.
export type RoomDescConfig = {
  properties: PropertyDef[]
  descriptors: Record<string, Record<string, string[]>> // enum: per value; set: per token
  sentences: Record<string, string[]>                    // {key} slot → chosen descriptor(s)
  emptySetDesc: Record<string, string>                   // fallback fragment when a set selects nothing
}

const properties: PropertyDef[] = [
  { key: "material", label: "Material", kind: "enum", values: ["masonry", "cave", "hewn", "brick"] },
  { key: "size", label: "Size", kind: "enum", values: ["cramped", "small", "modest", "large", "cavernous"] },
  { key: "shape", label: "Shape", kind: "set", values: ["round", "rounded-corners", "apse", "alcoves"] },
  { key: "water", label: "Water", kind: "enum", values: ["dry", "damp", "puddled", "pooled", "flooded"] },
  { key: "illumination", label: "Illumination", kind: "enum", values: ["dark", "torchlit", "glowing", "daylit", "witchlit", "embers"] },
  { key: "sound", label: "Sound", kind: "enum", values: ["dripping", "echoing", "silent", "skittering", "draft", "creaking"] },
  { key: "smell", label: "Smell", kind: "enum", values: ["mildew", "decay", "mineral", "dust", "blood", "smoke"] },
  { key: "condition", label: "Condition", kind: "enum", values: ["crumbling", "flooded", "cobwebbed", "scorched", "intact", "rubble"] },
  { key: "object", label: "Object found", kind: "enum", values: ["chain", "chair", "bones", "crate", "altar", "none"] },
  { key: "connectors", label: "Connectors", kind: "set", values: ["door", "corridor", "entrance", "exit"], min: 1 },
]

const descriptors: RoomDescConfig["descriptors"] = {
  material: {
    masonry: ["fitted stone masonry", "walls of dressed stone blocks"],
    cave: ["rough natural rock", "raw, unworked cave stone"],
    hewn: ["stone hewn straight from the bedrock", "chisel-scarred rock walls"],
    brick: ["crumbling old brickwork", "courses of weathered brick"],
  },
  size: {
    cramped: ["cramped and low", "barely big enough to stand in"],
    small: ["small", "modest in size"],
    modest: ["of ordinary size", "neither large nor small"],
    large: ["large and spacious", "generously sized"],
    cavernous: ["cavernous and echoing", "vast"],
  },
  shape: {
    round: ["a perfectly round floorplan", "curved, circular walls"],
    "rounded-corners": ["softly rounded corners", "corners worn smooth and round"],
    apse: ["a vaulted apse bulging from one wall", "a semicircular apse"],
    alcoves: ["a row of shallow wall alcoves", "several niche-like alcoves"],
  },
  water: {
    dry: ["bone dry", "dry underfoot"],
    damp: ["damp, its floor slick", "clammy and damp"],
    puddled: ["dotted with shallow puddles", "puddled here and there"],
    pooled: ["part-covered by a dark, still pool", "pooled with standing water"],
    flooded: ["flooded to the shins", "half-submerged under black water"],
  },
  illumination: {
    dark: ["near-total darkness", "a suffocating gloom"],
    torchlit: ["the guttering light of a lone torch", "flickering torchlight"],
    glowing: ["a soft phosphorescent glow", "a dim fungal luminescence"],
    daylit: ["pale daylight from a crack above", "thin light leaking through the ceiling"],
    witchlit: ["cold blue witch-light with no source", "an eerie, sourceless glow"],
    embers: ["the dull red embers of a long-dead fire", "the last glow of dying embers"],
  },
  sound: {
    dripping: ["water dripping somewhere unseen", "a slow, persistent drip"],
    echoing: ["a distant, echoing drip", "far-off echoes you cannot place"],
    silent: ["an oppressive, total silence", "a silence so complete it rings"],
    skittering: ["a faint skittering within the walls", "small things moving in the dark"],
    draft: ["a low draft moaning through hidden gaps", "wind sighing through unseen cracks"],
    creaking: ["the slow creak of settling stone", "the groan of shifting rock"],
  },
  smell: {
    mildew: ["damp mildew and wet stone", "a musty, mildewed damp"],
    decay: ["rot and decay", "the sickly sweetness of decay"],
    mineral: ["cold, mineral-tinged air", "a sharp mineral tang"],
    dust: ["dry dust that catches in the throat", "stale, choking dust"],
    blood: ["the coppery tang of old blood", "the iron scent of dried blood"],
    smoke: ["cold ash and old smoke", "woodsmoke long gone cold"],
  },
  condition: {
    crumbling: ["crumbling, its walls cracked and bowed", "badly decayed and unstable"],
    flooded: ["half-flooded with brackish water", "ankle-deep in stagnant water"],
    cobwebbed: ["draped in thick grey cobwebs", "heavy with dusty webs"],
    scorched: ["scorched and blackened as if by fire", "fire-blackened throughout"],
    intact: ["remarkably intact and dry", "solid and untouched by time"],
    rubble: ["choked with fallen rubble", "half-buried under collapsed stone"],
  },
  object: {
    chain: ["a rusted chain bolted to one wall", "a heavy, corroded chain"],
    chair: ["the splintered remains of a wooden chair", "a broken wooden chair"],
    bones: ["a heap of gnawed bones", "scattered, gnawed bones"],
    crate: ["an overturned, empty crate", "a smashed wooden crate"],
    altar: ["a cracked stone altar", "a defaced stone altar"],
    none: ["nothing of note", "no sign of anything"],
  },
  connectors: {
    door: ["a door", "a heavy doorway"],
    corridor: ["a low corridor", "a narrow passage"],
    entrance: ["a stair climbing up and out", "an entrance stairwell"],
    exit: ["a stair descending deeper", "a shaft dropping away below"],
  },
}

const sentences: RoomDescConfig["sentences"] = {
  material: ["The room is built of {material}.", "Its walls are {material}.", "The construction is {material}."],
  size: ["It is {size}.", "The chamber is {size}.", "The space is {size}."],
  shape: ["Its layout features {shape}.", "The room's plan shows {shape}.", "Notable in the stonework: {shape}."],
  water: ["The floor is {water}.", "Underfoot it is {water}.", "The chamber is {water}."],
  illumination: ["The chamber lies in {illumination}.", "{illumination} is all that holds back the dark.", "What light there is comes as {illumination}."],
  sound: ["The only sound is {sound}.", "You catch {sound}.", "The air carries {sound}."],
  smell: ["The place smells of {smell}.", "The air is thick with {smell}.", "{smell} hangs heavy here."],
  condition: ["The room is {condition}.", "Structurally it is {condition}.", "The stonework is {condition}."],
  object: ["Against one wall rests {object}.", "Someone left behind {object}.", "In the far corner lies {object}."],
  connectors: ["Ways out lead off by {connectors}.", "The room is reached by {connectors}.", "Leading away are {connectors}."],
}

const emptySetDesc: RoomDescConfig["emptySetDesc"] = {
  shape: "a plain rectangular plan",
  connectors: "no obvious way out",
}

// The default (built-in) template document. The editor can supply an edited one.
export const defaultConfig: RoomDescConfig = { properties, descriptors, sentences, emptySetDesc }
// Back-compat convenience for callers that just want the default property list.
export const PROPERTIES = defaultConfig.properties

export type Room = Record<string, string | string[]> // enum props = string; set props = token[]

// Generate a random Room from a config: one value per enum prop, a random subset per set prop.
export function generateRoom(config: RoomDescConfig = defaultConfig, rng: Rng = Math.random): Room {
  const room: Room = {}
  for (const p of config.properties) {
    if (p.kind === "set") {
      let sel = p.values.filter(() => rng() < 0.5)
      while (sel.length < (p.min ?? 0)) { const v = pick(p.values, rng); if (!sel.includes(v)) sel.push(v) }
      room[p.key] = shuffle(sel, rng)
    } else {
      room[p.key] = pick(p.values, rng)
    }
  }
  return room
}

// Replace {key} placeholders using the given string lookup.
export const fill = (tmpl: string, lookup: Record<string, string>): string =>
  tmpl.replace(/\{(\w+)\}/g, (_, k: string) => lookup[k] ?? `{${k}}`)

const capitalize = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s)

function roomStrings(room: Room, config: RoomDescConfig): Record<string, string> {
  const out: Record<string, string> = {}
  for (const p of config.properties) { const v = room[p.key]; out[p.key] = Array.isArray(v) ? v.join(", ") : (v ?? "") }
  return out
}

function descriptorsFor(room: Room, config: RoomDescConfig, rng: Rng): Record<string, string> {
  const strs = roomStrings(room, config)
  const desc: Record<string, string> = {}
  for (const p of config.properties) {
    const val = room[p.key]
    if (Array.isArray(val)) {
      if (val.length === 0) { desc[p.key] = config.emptySetDesc[p.key] ?? "nothing of note"; continue }
      desc[p.key] = listJoin(val.map(t => fill(pick(config.descriptors[p.key]?.[t] ?? [t], rng), strs)))
    } else {
      desc[p.key] = fill(pick(config.descriptors[p.key]?.[val] ?? [val], rng), strs)
    }
  }
  return desc
}

// Build the description: descriptors → sentences (shuffled order) → paragraphs of ≤4 sentences.
export function describeRoom(room: Room, config: RoomDescConfig = defaultConfig, rng: Rng = Math.random): string[] {
  const desc = descriptorsFor(room, config, rng)
  const keys = shuffle(config.properties.map(p => p.key), rng)
  const sentences = keys.map(key => capitalize(fill(pick(config.sentences[key] ?? [`{${key}}`], rng), desc)))
  const paras: string[] = []
  for (let i = 0; i < sentences.length; i += 4) paras.push(sentences.slice(i, i + 4).join(" "))
  return paras
}

// Lightweight config validation (no dep). errors block Apply; warnings are informational.
export function validateConfig(obj: unknown): { errors: string[]; warnings: string[] } {
  const errors: string[] = [], warnings: string[] = []
  const c = obj as any
  if (!c || typeof c !== "object") return { errors: ["Config must be an object."], warnings }
  if (!Array.isArray(c.properties)) errors.push("`properties` must be an array.")
  if (!c.descriptors || typeof c.descriptors !== "object") errors.push("`descriptors` must be an object.")
  if (!c.sentences || typeof c.sentences !== "object") errors.push("`sentences` must be an object.")
  if (errors.length) return { errors, warnings }

  const keys = new Set<string>()
  for (const p of c.properties) {
    if (!p || typeof p.key !== "string" || !p.key) { errors.push("Each property needs a non-empty string `key`."); continue }
    keys.add(p.key)
    if (typeof p.label !== "string") errors.push(`Property "${p.key}": missing string \`label\`.`)
    if (p.kind !== "enum" && p.kind !== "set") errors.push(`Property "${p.key}": \`kind\` must be "enum" or "set".`)
    if (!Array.isArray(p.values) || p.values.length === 0) errors.push(`Property "${p.key}": \`values\` must be a non-empty array.`)
    if (!Array.isArray(c.sentences[p.key]) || c.sentences[p.key].length === 0) errors.push(`Property "${p.key}": needs at least one sentence template.`)
    const desc = c.descriptors[p.key]
    if (!desc || typeof desc !== "object") warnings.push(`Property "${p.key}": no descriptors (values fall back to raw text).`)
    else if (Array.isArray(p.values)) for (const v of p.values) if (!Array.isArray(desc[v]) || desc[v].length === 0) warnings.push(`Property "${p.key}": value "${v}" has no descriptor.`)
  }
  for (const [pk, tmpls] of Object.entries(c.sentences)) {
    if (!Array.isArray(tmpls)) { errors.push(`sentences["${pk}"] must be an array of strings.`); continue }
    for (const t of tmpls as unknown[]) {
      for (const ph of String(t).match(/\{(\w+)\}/g) ?? []) {
        const k = ph.slice(1, -1)
        if (!keys.has(k)) errors.push(`sentences["${pk}"]: placeholder ${ph} references unknown property.`)
      }
    }
  }
  return { errors, warnings }
}
