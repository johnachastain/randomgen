// Room furnishings (Idea 14 leaf layer): static room-child config-objects placed into rooms weighted by
// the room's profile. Each TYPE is a config-object registered in a core/config registry; its `name` is
// generated with the inherited dungeon ⊕ floor ⊕ room mood (furnishingName). The play layer will later
// add interactability/state keyed by furnishing id; occupants (movable) follow the same pattern.

import { createRegistry, type ItemRecord } from "../../core/config"
import { furnishingName } from "../../core/naming"
import { expand, fill, capitalize, type Grammar } from "../../core/text"
import type { GenContext } from "../../core/model"
import { mulberry32, type Rng } from "../../core/rng"
import type { RoomProfile, Furnishing } from "./types"

// FNV-1a string hash → a per-item sub-seed offset (so each furnishing's text is independent + stable).
const hashStr = (s: string): number => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }

export type FurnishingObject = { name: string }

// A furnishing TYPE: display (glyph/colour for the PoC marker — real tile art later) + a placement weight
// keyed off the room's profile (a crypt favours altars/sarcophagi, a hall favours tables, …).
export type FurnishingDef = {
  id: string
  label: string
  glyph: string
  color: string
  weightFor: (p: RoomProfile) => number
}

export const furnishingDefs: FurnishingDef[] = [
  { id: "chest",       label: "Chest",       glyph: "▤", color: "#c9a227", weightFor: p => p.type === "vault" ? 4 : 2 },
  { id: "altar",       label: "Altar",       glyph: "⛊", color: "#b0b0c8", weightFor: p => p.type === "crypt" ? 4 : p.type === "vault" ? 2 : 1 },
  { id: "sarcophagus", label: "Sarcophagus", glyph: "▬", color: "#9aa0b0", weightFor: p => p.type === "crypt" ? 5 : 1 },
  { id: "table",       label: "Table",       glyph: "◫", color: "#b07a46", weightFor: p => p.type === "hall" || p.type === "chamber" ? 3 : 1 },
]
const defById: Record<string, FurnishingDef> = Object.fromEntries(furnishingDefs.map(d => [d.id, d]))
export const furnishingDef = (id: string): FurnishingDef | undefined => defById[id]

// Registry: each type generates a `name` from its label + the inherited context mood.
const registry = createRegistry()
for (const d of furnishingDefs) {
  registry.register<FurnishingObject>(d.id, { name: { updater: (_item, ctx, rng) => furnishingName(d.label, ctx.tags, rng) } })
}

// Weighted pick of a furnishing type for a room (cumulative over weightFor; all weights ≥ 0, ≥1 total).
export function pickFurnishingType(profile: RoomProfile, rng: Rng): FurnishingDef {
  const weights = furnishingDefs.map(d => Math.max(0, d.weightFor(profile)))
  const total = weights.reduce((a, b) => a + b, 0) || 1
  let x = rng() * total
  for (let i = 0; i < furnishingDefs.length; i++) { x -= weights[i]; if (x < 0) return furnishingDefs[i] }
  return furnishingDefs[furnishingDefs.length - 1]
}

// Build a furnishing object under the room's context (→ mood-inherited name), parented to the room.
export function buildFurnishing(typeId: string, roomCtx: GenContext, rng: Rng, id: string, roomId: string): ItemRecord<FurnishingObject> {
  return registry.create<FurnishingObject>(typeId, roomCtx, rng, { id, parentId: roomId })
}

// A short, reproducible description of a placed furnishing (per-item sub-seed → independent + stable).
export function describeFurnishing(f: Furnishing, seed: number): string[] {
  const rng = mulberry32((seed ^ hashStr(f.id)) >>> 0)
  const grammar: Grammar = {
    verb: ["stands", "rests", "sits", "looms", "waits"],
    place: ["against one wall", "near the centre", "in a shadowed corner", "beside the doorway", "half in shadow"],
    detail: ["long undisturbed", "layered in dust", "its purpose long forgotten", "cold to the touch", "worn by the years"],
  }
  const s = capitalize(fill(expand("the {name} #verb# #place#, #detail#.", grammar, rng), { name: f.name }))
  return [s]
}
