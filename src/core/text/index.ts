// core/text — string composition (design target D): tracery-lite expansion + template fill +
// grammar helpers. Absorbs the room-description fill() engine and generalizes the per-generator
// `${pick(a)} ${pick(b)}` string assembly into one seeded, pool-referencing expander.

import type { Rng } from "../rng"
import { pickWeighted, type Table, type SelectContext } from "../select"

// {key} placeholder substitution from a flat lookup. Unknown keys are left as "{key}".
// (Promoted verbatim from lab/room-description.)
export const fill = (tmpl: string, lookup: Record<string, string>): string =>
  tmpl.replace(/\{(\w+)\}/g, (_, k: string) => lookup[k] ?? `{${k}}`)

// Capitalize the first letter.
export const capitalize = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s)

// Indefinite article for a word ("a" / "an") — simple leading-vowel test.
export const article = (word: string): string => (/^[aeiou]/i.test(word.trim()) ? "an" : "a")

// A grammar maps symbol names to pools — a weighted Table or a plain string[] (uniform pick).
export type Grammar = Record<string, Table | string[]>

const MAX_DEPTH = 20

// Tracery-lite: expand #symbol# references by drawing from the grammar and recursively expanding the
// result (so a picked value may contain further #symbol#s). An optional `.modifier` suffix applies
// `capitalize` or `a` (prepend the indefinite article). Seeded via rng; ctx (tags/include/exclude/
// boost) flows to weighted pools. Unknown or empty symbols are left as the literal "#symbol#".
export function expand(template: string, grammar: Grammar, rng: Rng, ctx: SelectContext = {}, depth = 0): string {
  if (depth > MAX_DEPTH) return template
  return template.replace(/#(\w+)(?:\.(\w+))?#/g, (whole, sym: string, mod?: string) => {
    const pool = grammar[sym]
    if (!pool || pool.length === 0) return whole
    let value = typeof pool[0] === "string"
      ? (pool as string[])[Math.floor(rng() * pool.length)]
      : pickWeighted(pool as Table, rng, ctx)[0]
    value = expand(value, grammar, rng, ctx, depth + 1)
    if (mod === "capitalize") value = capitalize(value)
    else if (mod === "a") value = `${article(value)} ${value}`
    return value
  })
}
