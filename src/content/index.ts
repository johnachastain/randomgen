// content/ — a table registry (tables by id) + an opt-in consumer proving the id → table → pick path.
// Additive: nothing in the legacy generators is touched; new features can pull adapted vocab from here.

import type { Rng } from "../core/rng"
import type { Table } from "../core/select"
import { validateTable } from "../core/select/schema"
import { NS, tag } from "../core/model"
import { expand } from "../core/text"
import { roomAdjectiveTable, roomObjectTable, roomSpecialTable } from "./dungeonRoomTables"

export type TableRegistry = {
  register(id: string, table: Table): void
  get(id: string): Table
  has(id: string): boolean
  ids(): string[]
}

// A registry of tables keyed by id. register() validates via the Step 6b zod schema and throws on a
// malformed table (catches bad adapted/loaded content early). get() throws on an unknown id.
export function createTableRegistry(): TableRegistry {
  const tables = new Map<string, Table>()
  return {
    register(id, table) {
      const res = validateTable(table)
      if (!res.ok) throw new Error(`table "${id}" invalid: ${res.errors.join("; ")}`)
      tables.set(id, res.table)
    },
    get(id) {
      const t = tables.get(id)
      if (!t) throw new Error(`no table registered for id "${id}"`)
      return t
    },
    has: id => tables.has(id),
    ids: () => [...tables.keys()],
  }
}

// The default content registry, with the adapted dungeon-room vocab registered by id.
export const contentRegistry = createTableRegistry()
contentRegistry.register("room-adjective", roomAdjectiveTable)
contentRegistry.register("room-object", roomObjectTable)
contentRegistry.register("room-special", roomSpecialTable)

// Consumer: a themed room label like "Dripping Grotto" — the new-engine parallel of configDungeonGen's
// `pickRandom(tomb_adjective) + tomb_objects`, but drawing adapted-vocab tables BY ID through
// core/select (theme soft-boost) + core/text (#adj# #object# expansion). Seeded → reproducible.
export function roomLabel(theme: string, rng: Rng, reg: TableRegistry = contentRegistry): string {
  const grammar = { adj: reg.get("room-adjective"), object: reg.get("room-object") }
  return expand("#adj# #object#", grammar, rng, { tags: [tag(NS.theme, theme)] })
}

export { roomAdjectiveTable, roomObjectTable, roomSpecialTable }
