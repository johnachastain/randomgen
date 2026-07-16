// Bridge: turn a cave chamber's RoomProfile into a mad-libs description via the room-description
// engine.
//
// This is the ONE tolerated cross-lab import in the cave track (the rule bars importing
// geomorph-dungeon or a sibling caves-N — see plans/cave-prototypes.md). The description engine is a
// pending `core/text` promotion that no cave prototype has any reason to diverge from, so copying its
// 233 lines would be duplication with no upside. Confined to this file: when the promotion lands,
// only the import below moves.

import { generateRoom, describeRoom, defaultConfig, type Room } from "../room-description/roomDescription"
import { mulberry32 } from "../../core/rng"
import type { RoomInfo, RoomProfile } from "./types"

// RoomProfile uses coarse tokens; the description engine has a richer vocabulary. Map the ones that
// carry real map signal; leave the rest (illumination/sound/smell/condition/object) to roll randomly.
// The dungeon's version also mapped shape/apse/alcove/round-corners — a cave chamber is an organic
// blob with none of those, so `shape` is left empty and rolls free.
const SIZE: Record<string, string> = { small: "small", medium: "modest", large: "large" }
const WATER: Record<string, string> = { dry: "dry", pool: "puddled", partial: "pooled", full: "flooded" }

function profileToOverrides(p: RoomProfile): Room {
  return {
    material: p.material,
    size: SIZE[p.size] ?? p.size,
    water: WATER[p.water] ?? p.water,
    shape: [],
  }
}

// A reproducible, profile-reflecting description for one cave chamber. Seeded from the cave seed +
// the room number (a per-room SUB-SEED), so each chamber's text is independent and stable across
// re-renders / re-runs of the same seed.
export function describeCaveRoom(rm: RoomInfo, seed: number): string[] {
  if (!rm.profile) return []
  const rng = mulberry32((seed ^ (rm.num * 0x9e3779b1)) >>> 0)
  const room = generateRoom(defaultConfig, rng, profileToOverrides(rm.profile))
  return describeRoom(room, defaultConfig, rng)
}
