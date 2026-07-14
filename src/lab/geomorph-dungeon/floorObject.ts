// A dungeon FLOOR (a numerically-descending level) modeled as a config object between the Dungeon
// (root) and its Rooms — the `Dungeon → Level → Room` nesting layer (Idea 13). Mirrors dungeonObject.ts.
// A floor rolls its OWN `type` (theme) but its context inherits the DUNGEON's type as mood, and the
// floor's type then flows DOWN into the floor's rooms/elements (parent → child tag inheritance).

import type { Rng } from "../../core/rng"
import { type GenContext, NS, tag, childContext } from "../../core/model"
import type { Tag } from "../../core/select"
import { createItem, type Config, type ItemRecord } from "../../core/config"
import { dungeonName, dungeonType } from "../../core/naming"

const DUNGEON_ID = "dungeon" // floors are children of the dungeon root

export type FloorObject = {
  type: string
  name: string
}

// `type` first; `name` reads it (cross-property influence) and is themed by it. The context passed in
// is the DUNGEON's (carries the dungeon theme), so the floor's type is rolled + its name generated with
// the dungeon mood inherited; the floor's own type then flows to its rooms via floorToTags.
export const floorConfig: Config<FloorObject> = {
  type: { updater: (_item, _ctx, rng) => dungeonType(rng) },
  name: { updater: (item, ctx, rng) => dungeonName([...ctx.tags, tag(NS.theme, item.properties.type)], rng) },
}

// The floor's own tags to hand down to its rooms/elements.
export const floorToTags = (obj: ItemRecord<FloorObject>): Tag[] => [tag(NS.theme, obj.properties.type)]

// Build a floor object as a child of the dungeon context (which carries the dungeon theme).
export function buildFloorObject(parentCtx: GenContext, floorNumber: number, rng: Rng): ItemRecord<FloorObject> {
  return createItem("floor", floorConfig, parentCtx, rng, { id: `floor-${floorNumber}`, parentId: DUNGEON_ID })
}

// The floor's child context = the dungeon context ⊕ the floor's own tags (so rooms inherit dungeon ⊕ floor).
export const floorChildContext = (parentCtx: GenContext, obj: ItemRecord<FloorObject>): GenContext =>
  childContext(parentCtx, floorToTags(obj))
