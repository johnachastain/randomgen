// Bridge: turn a dungeon room's real RoomProfile into a mad-libs description via the room-description
// engine. Isolates the (experimental-zone) cross-lab import in one place. The description engine is a
// future `core/text` promotion; when that lands, only the imports here move.

import { generateRoom, describeRoom, defaultConfig, type Room } from "../room-description/roomDescription"
import { mulberry32 } from "../../core/rng"
import type { RoomInfo, RoomProfile } from "./types"

// RoomProfile uses coarse tokens; the description engine has a richer vocabulary. Map the ones that
// carry real map signal; leave the rest (illumination/sound/smell/condition/object + connector KINDS)
// to roll randomly. `material` is masonry until cave generation (Idea 7); `connectors` is a lossy
// COUNT on the profile (no kinds) so it stays random until the profile is enriched.
const SIZE: Record<string, string> = { small: "small", medium: "modest", large: "large" }
const WATER: Record<string, string> = { dry: "dry", pool: "puddled", partial: "pooled", full: "flooded" }

function profileToOverrides(p: RoomProfile): Room {
  const shape: string[] = []
  if (p.shape === "circle") shape.push("round")
  else if (p.shape === "rounded") shape.push("rounded-corners")
  if (p.features.includes("round-corners") && !shape.includes("rounded-corners")) shape.push("rounded-corners")
  if (p.features.includes("apse")) shape.push("apse")
  if (p.features.includes("alcove")) shape.push("alcoves")
  return {
    material: p.material,
    size: SIZE[p.size] ?? p.size,
    water: WATER[p.water] ?? p.water,
    shape,
  }
}

// A reproducible, profile-reflecting description for one dungeon room. Seeded from the dungeon seed +
// the room number (a per-room SUB-SEED — a concrete instance of the `subRng(seed, path)` idea, so each
// room's text is independent and stable across re-renders / re-runs of the same seed).
export function describeDungeonRoom(rm: RoomInfo, seed: number): string[] {
  if (!rm.profile) return []
  const rng = mulberry32((seed ^ (rm.num * 0x9e3779b1)) >>> 0)
  const room = generateRoom(defaultConfig, rng, profileToOverrides(rm.profile))
  return describeRoom(room, defaultConfig, rng)
}
