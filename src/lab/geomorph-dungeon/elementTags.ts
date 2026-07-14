// Maps a non-room MapElement → the shared namespaced tag taxonomy (core/model), mirroring roomTags.ts.
// Feature-side (core stays a generic tag consumer): the element's tags feed its GenContext, which drives
// naming (elementName) and later descriptions. TRAIT_WET is what elementName soft-boosts on, so flooded
// halls (and other watery elements) carry it.

import type { Tag } from "../../core/select"
import { NS, tag, TRAIT_WET } from "../../core/model"
import type { MapElement } from "./types"

export function elementTags(el: MapElement): Tag[] {
  const tags: Tag[] = [tag(NS.theme, el.kind)]
  switch (el.kind) {
    case "hall":
      tags.push(tag(NS.theme, el.profile.type)) // passage | gallery | flooded-channel
      if (el.profile.water) tags.push(TRAIT_WET)
      break
    case "stair":
      tags.push(tag(NS.theme, el.profile.type)) // stair | flight
      break
    case "connector":
      tags.push(tag(NS.theme, el.profile.style)) // door (portcullis/archway later)
      break
    case "portal":
      tags.push(tag(NS.theme, el.profile.portalKind)) // entrance | exit
      break
  }
  return tags
}
