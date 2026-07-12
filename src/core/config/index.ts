// core/config — the config-object model + registry (design target E, structural half).
//
// A generated object is an ItemRecord: a typed property bag + tree metadata. A Config declares, per
// property, a Rule that computes its value from the (partially built) item + the GenContext + a seeded
// rng. This is the PURE, store-free upgrade of configDungeonGen's jotai `createItm`/`rerollProperty`
// (which mutate a global store in place → not reproducible): here generation returns a new object and
// reroll returns a new object, so the caller owns the tree and the whole thing is seedable.
//
// Zod validation of tables/configs lands in Step 6b (a separate, dependency-adding step).

import type { Rng } from "../rng"
import type { GenContext } from "../model"

// A generated object: typed properties + tree metadata (id / optional parent for nesting).
export type ItemRecord<T> = {
  type: string
  id: string
  parentId?: string
  properties: T
}

// Computes ONE property's value. `item` is the object built so far (earlier properties are already
// set → cross-property influence); `ctx` carries inherited tags + seed; `rng` is the seeded stream.
export type Rule<T, K extends keyof T = keyof T> = (item: ItemRecord<T>, ctx: GenContext, rng: Rng) => T[K]

// Per-property generation rules. `required` is advisory (used by validation later).
export type Config<T> = { [K in keyof T]: { updater: Rule<T, K>; required?: boolean } }

// Build an object from a config: run each property's rule in declaration order (so a later rule can
// read earlier properties off `item`). Pure — returns a fresh ItemRecord, touches no store.
export function createItem<T>(
  type: string,
  config: Config<T>,
  ctx: GenContext,
  rng: Rng,
  opts: { id?: string; parentId?: string } = {},
): ItemRecord<T> {
  const item: ItemRecord<T> = { type, id: opts.id ?? type, parentId: opts.parentId, properties: {} as T }
  for (const key in config) {
    item.properties[key as keyof T] = config[key as keyof T].updater(item, ctx, rng)
  }
  return item
}

// Re-generate a single property, returning a NEW item (original untouched). The value's own sub-stream
// isolation (so this doesn't scramble other properties) is the sub-seeding work of Idea 11 (§6) — here
// the caller passes whatever rng it wants for the field.
export function rerollProperty<T, K extends keyof T>(
  item: ItemRecord<T>,
  key: K,
  updater: Rule<T, K>,
  ctx: GenContext,
  rng: Rng,
): ItemRecord<T> {
  const next: ItemRecord<T> = { ...item, properties: { ...item.properties } }
  next.properties[key] = updater(next, ctx, rng)
  return next
}

// A registry holds each object type's Config by name → generators look up a config by type and can
// nest children by type. Factory (not a global singleton) so tests/callers stay isolated.
export type Registry = {
  register<T>(type: string, config: Config<T>): void
  get<T>(type: string): Config<T> | undefined
  has(type: string): boolean
  types(): string[]
  create<T>(type: string, ctx: GenContext, rng: Rng, opts?: { id?: string; parentId?: string }): ItemRecord<T>
}

export function createRegistry(): Registry {
  const configs = new Map<string, Config<unknown>>()
  return {
    register(type, config) { configs.set(type, config as Config<unknown>) },
    get<T>(type: string) { return configs.get(type) as Config<T> | undefined },
    has(type) { return configs.has(type) },
    types() { return [...configs.keys()] },
    create<T>(type: string, ctx: GenContext, rng: Rng, opts?: { id?: string; parentId?: string }) {
      const config = configs.get(type) as Config<T> | undefined
      if (!config) throw new Error(`createRegistry.create: no config registered for type "${type}"`)
      return createItem(type, config, ctx, rng, opts)
    },
  }
}
