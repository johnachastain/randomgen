// A non-room map element modeled as a config OBJECT on core/config, mirroring roomObject.ts (design
// target: map as a view of the generated object tree). Feature-side (owns the element → tags mapping);
// core stays generic. Today the only generated property is `name` (via core/naming's elementName), so
// this is behavior-additive — it establishes the same pattern rooms use, and richer per-element content
// (themed label, description) becomes more rules reading the same GenContext.

import type { Rng } from "../../core/rng"
import { type GenContext, childContext } from "../../core/model"
import { createItem, type Config, type ItemRecord } from "../../core/config"
import { elementName } from "../../core/naming"
import type { MapElement } from "./types"
import { elementTags } from "./elementTags"

const DUNGEON_ID = "dungeon" // the root object's id (elements are its children in the tree)

export type ElementObject = {
  name: string
}

// `item.type` carries the element kind (createItem is called with el.kind), so the name rule picks the
// right noun pool.
export const elementConfig: Config<ElementObject> = {
  name: { updater: (item, ctx, rng) => elementName(item.type, ctx.tags, rng) },
}

// Build an element as a config object: its context inherits the dungeon root's tags and adds the
// element's own tags. Returns the ItemRecord (typed properties + tree metadata: id + parentId).
export function buildElementObject(el: MapElement, root: GenContext, rng: Rng): ItemRecord<ElementObject> {
  const ctx = childContext(root, elementTags(el))
  return createItem(el.kind, elementConfig, ctx, rng, { id: el.id, parentId: DUNGEON_ID })
}
