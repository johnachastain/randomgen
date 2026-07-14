// Room occupants (Idea 14): monsters & NPCs, the MOVABLE branch of room contents. Mirrors furnishings.ts
// but the object is richer — a `name` + a group `count`. Each TYPE is a config-object registered in a
// core/config registry; its name inherits the dungeon⊕floor⊕room mood. Placement is static for this PoC
// (occupants become movable `Entity`s in the play layer); child objects (loot, stats, dialogue) are later.

import { createRegistry, type ItemRecord } from "../../core/config"
import { furnishingName } from "../../core/naming" // generic "mood descriptor + label" name (reused)
import { expand, fill, capitalize, type Grammar } from "../../core/text"
import type { GenContext } from "../../core/model"
import { mulberry32, type Rng } from "../../core/rng"
import type { RoomProfile, Occupant } from "./types"

const hashStr = (s: string): number => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }

export type OccupantCategory = "monster" | "npc"
export type OccupantObject = { name: string; count: number } // multi-property config-object (count = group size)

// An occupant TYPE: category + display (glyph/colour marker) + a placement weight keyed off the room
// profile + a max group size.
export type OccupantDef = {
  id: string
  category: OccupantCategory
  label: string
  glyph: string
  color: string
  weightFor: (p: RoomProfile) => number
  maxCount: number
}

export const occupantDefs: OccupantDef[] = [
  // monsters (often in groups)
  { id: "skeleton", category: "monster", label: "Skeleton",   glyph: "☠", color: "#d8d0c0", weightFor: p => p.type === "crypt" ? 4 : p.type === "vault" ? 3 : 1, maxCount: 4 },
  { id: "rat",      category: "monster", label: "Giant Rat",  glyph: "🐀", color: "#8a7a5a", weightFor: p => p.type === "warren" || p.type === "mine" ? 3 : 1, maxCount: 4 },
  { id: "spider",   category: "monster", label: "Cave Spider", glyph: "🕷", color: "#6a5a7a", weightFor: p => p.type === "warren" ? 3 : p.type === "cistern" ? 2 : 1, maxCount: 3 },
  { id: "cultist",  category: "monster", label: "Cultist",    glyph: "†", color: "#b04040", weightFor: p => p.type === "crypt" ? 3 : p.type === "vault" ? 2 : 1, maxCount: 3 },
  // NPCs (usually alone)
  { id: "prisoner", category: "npc",     label: "Prisoner",   glyph: "☹", color: "#c0a060", weightFor: p => p.type === "prison" ? 5 : 0.5, maxCount: 1 },
  { id: "guard",    category: "npc",     label: "Guard",      glyph: "♞", color: "#7090c0", weightFor: p => p.type === "prison" ? 3 : p.type === "hall" ? 2 : 1, maxCount: 2 },
  { id: "hermit",   category: "npc",     label: "Hermit",     glyph: "☺", color: "#70b0a0", weightFor: p => p.type === "cell" ? 2 : 1, maxCount: 1 },
]
const defById: Record<string, OccupantDef> = Object.fromEntries(occupantDefs.map(d => [d.id, d]))
export const occupantDef = (id: string): OccupantDef | undefined => defById[id]

// Registry: each type generates a `name` (mood-inherited) + a group `count`.
const registry = createRegistry()
for (const d of occupantDefs) {
  registry.register<OccupantObject>(d.id, {
    name: { updater: (_item, ctx, rng) => furnishingName(d.label, ctx.tags, rng) },
    count: { updater: (_item, _ctx, rng) => 1 + Math.floor(rng() * d.maxCount) },
  })
}

// Weighted pick of an occupant type for a room (cumulative over weightFor).
export function pickOccupantType(profile: RoomProfile, rng: Rng): OccupantDef {
  const weights = occupantDefs.map(d => Math.max(0, d.weightFor(profile)))
  const total = weights.reduce((a, b) => a + b, 0) || 1
  let x = rng() * total
  for (let i = 0; i < occupantDefs.length; i++) { x -= weights[i]; if (x < 0) return occupantDefs[i] }
  return occupantDefs[occupantDefs.length - 1]
}

// Build an occupant object under the room's context (→ mood-inherited name), parented to the room.
export function buildOccupant(typeId: string, roomCtx: GenContext, rng: Rng, id: string, roomId: string): ItemRecord<OccupantObject> {
  return registry.create<OccupantObject>(typeId, roomCtx, rng, { id, parentId: roomId })
}

// A short, reproducible description of a placed occupant (per-item sub-seed). Phrasing handles singular
// vs group (count) and monster vs NPC so verb/article agreement stays correct.
export function describeOccupant(o: Occupant, seed: number): string[] {
  const rng = mulberry32((seed ^ hashStr(o.id)) >>> 0)
  const species = (occupantDef(o.typeId)?.label ?? o.typeId).toLowerCase()
  const grammar: Grammar = {
    adj: ["feral", "hulking", "skittering", "gaunt", "restless", "wretched", "ravenous"],
    mood: ["ready to strike", "stirring in the shadows", "guarding the way", "watching the entrance", "roused by your approach"],
    mv: ["lurk", "prowl", "skulk", "wait"],       // plural verb
    mvs: ["lurks", "prowls", "skulks", "waits"],  // singular verb
    npcv: ["watches you warily", "keeps to the shadows", "waits, wary of strangers", "eyes the doorway", "says nothing"],
  }
  let t: string
  if (o.category === "npc") t = `the {name} #npcv#.`
  else if (o.count > 1) t = `${o.count} #adj# ${species}s #mv# here, #mood#.`
  else t = `#adj.a# ${species} #mvs# here, #mood#.`
  return [capitalize(fill(expand(t, grammar, rng), { name: o.name }))]
}
