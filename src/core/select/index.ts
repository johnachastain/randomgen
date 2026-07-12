// core/select — the shared seeded selection engine (design target A + B).
//
// Step 1: the Row/Table content shape + a seeded weighted pick, no array
// duplication. Step 2 (now): an optional SelectContext adds hard include/exclude
// tag filters + the recovered SOFT-BOOST (matching a theme raises a row's weight
// but never excludes non-matching rows — from the oldest engine's
// `num = (matches+1) * odds`). Consumers come later.
//
// Readability-first (see plans/generation-engine.md §3): the value shape stays
// positional/compact but its columns are LABELED tuple elements, so an editor
// shows `value · tags · weight` on hover.

import type { Rng } from "../rng"

// A Tag is a plain string; enum members compile to these (e.g. "theme:cave",
// "rarity:rare", or the naming taxonomy's Neutral/Artisan/NOUN…).
export type Tag = string

// A Row is one selectable item: the columns are value · tags · weight.
export type Row = [value: string, tags: Tag[], weight: number]

// A Table is a named list of Rows (lists become `...Table`, e.g. titleTable).
export type Table = Row[]

// Optional constructor — raw `[...]` literals remain the default; this is just a
// readability nicety for authoring by hand.
export function row(value: string, tags: Tag[] = [], weight = 1): Row {
  return [value, tags, weight]
}

// Optional selection context. All fields optional → an empty ctx (the default)
// makes pickWeighted behave exactly like Step 1 (pure weighted pick).
export type SelectContext = {
  tags?: Tag[]     // theme/context tags — matching rows get a soft weight boost
  include?: Tag[]  // HARD filter: a row must have ALL of these tags to be eligible
  exclude?: Tag[]  // HARD filter: a row with ANY of these tags is dropped
  boost?: number   // soft-boost strength (default 1): weight × (1 + boost·matches)
}

// Seeded weighted pick. Cumulative-weight scan (O(n), no array duplication);
// non-integer weights are fine. Rows with weight <= 0 are skipped.
//
// With a ctx: include/exclude prune eligible rows (hard), then each surviving
// row's weight is soft-boosted by how many of its tags are in ctx.tags — so a
// theme biases the pick without ever excluding off-theme rows. Throws if no row
// survives with a positive weight (a caller-visible bug, not a silent empty).
export function pickWeighted(table: Table, rng: Rng, ctx: SelectContext = {}): Row {
  const { tags = [], include = [], exclude = [], boost = 1 } = ctx

  const eligible: Row[] = []
  const weights: number[] = []
  let total = 0
  for (const r of table) {
    const [, rtags, base] = r
    if (base <= 0) continue
    if (include.length && !include.every(t => rtags.includes(t))) continue
    if (exclude.length && exclude.some(t => rtags.includes(t))) continue
    let matches = 0
    if (tags.length) for (const t of rtags) if (tags.includes(t)) matches++
    const w = base * (1 + boost * matches)
    eligible.push(r)
    weights.push(w)
    total += w
  }
  if (total <= 0) throw new Error("pickWeighted: no eligible positive-weight rows")

  let t = rng() * total
  for (let i = 0; i < eligible.length; i++) {
    t -= weights[i]
    if (t < 0) return eligible[i]
  }
  return eligible[eligible.length - 1] // float-rounding fallback
}
