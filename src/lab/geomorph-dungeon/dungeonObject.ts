// The dungeon-as-a-whole modeled as the ROOT config object of the map's object tree, mirroring
// roomObject.ts / elementObject.ts. Its GenContext is the dungeon root that rooms + elements already
// inherit from (they set parentId: "dungeon"). Today the only generated property is `name` (via
// core/naming's dungeonName); this establishes the top-level object so a later `type`/theme property
// can be generated here and flow DOWN into every child's context (parent → child tag inheritance).

import type { Rng } from "../../core/rng"
import { type GenContext, NS, tag } from "../../core/model"
import type { Tag } from "../../core/select"
import { createItem, type Config, type ItemRecord } from "../../core/config"
import { dungeonName, dungeonType } from "../../core/naming"

const DUNGEON_ID = "dungeon" // the tree root's id (rooms/elements are its children)

export type DungeonObject = {
  type: string  // the dungeon's overall theme (crypt/cistern/warren/mine/prison/vault) — inherited down
  name: string
}

// `type` is generated first; `name` reads it (cross-property influence) and is themed by it. The type
// then flows to every child via dungeonToTags → childContext (parent → child tag inheritance).
export const dungeonConfig: Config<DungeonObject> = {
  type: { updater: (_item, _ctx, rng) => dungeonType(rng) },
  name: { updater: (item, _ctx, rng) => dungeonName([tag(NS.theme, item.properties.type)], rng) },
}

// The dungeon's own tags to hand down to children (its theme).
export const dungeonToTags = (obj: ItemRecord<DungeonObject>): Tag[] => [tag(NS.theme, obj.properties.type)]

// Build the dungeon root object from its context. No parentId — it's the top of the tree.
export function buildDungeonObject(root: GenContext, rng: Rng): ItemRecord<DungeonObject> {
  return createItem("dungeon", dungeonConfig, root, rng, { id: DUNGEON_ID })
}
