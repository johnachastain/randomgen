// core/model — the shared tag taxonomy + generation context (design target C).
//
// Tags are namespaced strings, "namespace:value" (e.g. "theme:cistern", "water:full",
// "trait:wet"). Namespacing keeps vocabularies from colliding and lets a generator ask
// "which theme is this?" by prefix. A GenContext carries the accumulated tags (and the
// seed) DOWN an object tree: a parent builds a root context, each child inherits it and
// adds its own tags, and a leaf generator's table query reads ctx.tags.
//
// Kept generic: no feature/dungeon import. Features map their own objects → tags (e.g. the
// dungeon's roomTags.ts maps a RoomProfile → tags) and keep core a pure consumer of tags.

import type { Tag } from "../select"

// Tag namespaces. Add values as generators need them; the set is intentionally open.
export const NS = {
  theme: "theme",       // room/element type — rotunda, cistern, vault, hall, chamber, cell…
  water: "water",       // water condition — dry, pool, partial, full
  size: "size",         // small, medium, large
  material: "material", // masonry, … (cave/stone later)
  feature: "feature",   // apse, alcove, circle, round-corners, pillars, stairs
  trait: "trait",       // derived boolean-ish traits — wet, pillared, …
  rarity: "rarity",     // rare, uncommon, common
} as const
export type Namespace = (typeof NS)[keyof typeof NS]

// Build a namespaced tag: tag(NS.theme, "cistern") → "theme:cistern".
export const tag = (ns: Namespace, value: string): Tag => `${ns}:${value}`

// Common derived trait: an element that holds water. Content rows tagged with this are
// soft-boosted for any watery context, independent of the specific water:* condition.
export const TRAIT_WET = tag(NS.trait, "wet")

// The context that flows parent → child down the generated object tree.
export type GenContext = { seed: number; tags: Tag[] }

// A root context (top of the tree) with optional starting tags.
export const rootContext = (seed: number, tags: Tag[] = []): GenContext => ({ seed, tags })

// A child inherits the parent's tags (parent-first) and appends its own.
export const childContext = (parent: GenContext, tags: Tag[]): GenContext => ({
  seed: parent.seed,
  tags: [...parent.tags, ...tags],
})
