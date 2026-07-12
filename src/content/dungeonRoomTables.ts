// content/ — domain vocabulary ADAPTED to the engine's Row/Table format (design target F, additive).
//
// This is NOT core (core = generic primitives) and NOT a copy of the vocab: it IMPORTS the existing
// legacy arrays from lists/original (read-only) and wraps them into tagged Tables at load, so the
// legacy files stay the single source of truth and are never edited. The theme was encoded in each
// array's NAME (tomb_adjective, cavern_objects…); here it becomes a real `theme:<t>` tag column so the
// deep vocab is filterable/soft-boostable by any core/select consumer.

import type { Table } from "../core/select"
import { NS, tag } from "../core/model"
import {
  tomb_adjective, temple_adjective, cavern_adjective, dungeon_adjective, magical_adjective,
  tomb_objects, temple_objects, cavern_objects, dungeon_objects, magical_objects,
  temple_special_rooms, cavern_special_rooms, dungeon_special_rooms, magical_special_rooms,
} from "../lists/original/dungeon_rooms"

// Wrap a plain word array into Rows carrying the given tags (uniform weight).
const tagArray = (words: readonly string[], tags: string[], weight = 1): Table =>
  words.map(w => [w, tags, weight])

// Concatenate several theme-partitioned arrays into one table, each partition tagged with its theme.
const byTheme = (parts: Array<[theme: string, words: readonly string[]]>): Table =>
  parts.flatMap(([t, words]) => tagArray(words, [tag(NS.theme, t)]))

export const roomAdjectiveTable: Table = byTheme([
  ["tomb", tomb_adjective], ["temple", temple_adjective], ["cavern", cavern_adjective],
  ["dungeon", dungeon_adjective], ["magical", magical_adjective],
])

export const roomObjectTable: Table = byTheme([
  ["tomb", tomb_objects], ["temple", temple_objects], ["cavern", cavern_objects],
  ["dungeon", dungeon_objects], ["magical", magical_objects],
])

// tomb has no special_rooms array in the legacy vocab → omitted here.
export const roomSpecialTable: Table = byTheme([
  ["temple", temple_special_rooms], ["cavern", cavern_special_rooms],
  ["dungeon", dungeon_special_rooms], ["magical", magical_special_rooms],
])
