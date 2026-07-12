// Maps a dungeon RoomProfile → the shared namespaced tag taxonomy (core/model).
// Lives in the dungeon FEATURE (not core) so core stays a generic tag consumer — the boundary rule:
// features map their own objects → tags; core never imports feature types. These tags feed the room's
// GenContext, which drives naming (Step 4) and later descriptions / prop placement.

import type { Tag } from "../../core/select"
import { NS, tag, TRAIT_WET } from "../../core/model"
import type { RoomProfile } from "./types"

export function profileToTags(p: RoomProfile): Tag[] {
  const tags: Tag[] = [
    tag(NS.theme, p.type),
    tag(NS.water, p.water),
    tag(NS.size, p.size),
    tag(NS.material, p.material),
  ]
  if (p.water !== "dry") tags.push(TRAIT_WET)
  if (p.pillared) tags.push(tag(NS.trait, "pillared"))
  for (const f of p.features) tags.push(tag(NS.feature, f))
  return tags
}
