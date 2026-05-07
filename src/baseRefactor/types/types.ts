// [value, tags, weight]  — weight: 1=rare, 2=normal, 3=common
export type TaggedItem = [string, string[], number]

export const filterByTag = (tag: string, items: TaggedItem[]): TaggedItem[] =>
  items.filter(([_, tags]) => tags.includes(tag))

export type StrategyType =
  | 'wilderness'  // adj + base + optional prep (default)
  | 'dungeon'     // unique | adj + base + prep
  | 'tavern'      // 6 distinct inn-name patterns
  | 'river'       // 3 waterway patterns
  | 'city'        // base + prep (fixed)
  | 'twoWord'     // prefix + suffix compound (towns)
  | 'prefixed'    // 25% prefix+twoword, 75% wilderness (mountains, forts)
  | 'deity'       // name + title + domain driven by alignment/gender

// Config for a specific location type — references tagged pools directly.
// Semantic tags on each word enable future adj-type filtering (e.g. adj selector)
// without needing to change the pool structure.
export type TypeConfig = {
  strategy: StrategyType
  adjectivePool?: TaggedItem[]   // adjective pool; defaults to base_adjective
  basePool?: TaggedItem[]        // base noun pool; defaults to lookup by type key
  prefixPool?: TaggedItem[]      // prefix pool for twoWord/prefixed strategies
  suffixPool?: TaggedItem[]      // suffix pool
  prepPool?: TaggedItem[]        // prepositional phrase nouns
  possessivePool?: TaggedItem[]  // possessive nouns (Wizard's, Dragon's...)
  uniqueItems?: TaggedItem[]     // special names drawn before normal generation
}

export type SyntaxPart =
  | 'optAdj'     // optional adjective (relative, "The", possessive)
  | 'adj'        // main adjective
  | 'base'       // base noun for the location type
  | 'prep'       // "of the X" prepositional phrase
  | 'twoWord'    // compound word via prefix+suffix
  | 'unique'     // draw from uniqueItems list
  | 'possessive' // possessive noun (e.g. "Wizard's")
  | 'participle' // participle adjective (Glowing, Limping...)

export type SyntaxTemplate = {
  parts: SyntaxPart[]
  weight: number  // higher = more common in the weighted pool
}
