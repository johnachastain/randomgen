import { SyntaxTemplate } from '../types/types'

export const wildernessTemplates: SyntaxTemplate[] = [
  { parts: ['adj', 'base'],                         weight: 50 },
  { parts: ['optAdj', 'base'],                      weight: 24 },
  { parts: ['base', 'prep'],                        weight: 19 },
  { parts: ['optAdj', 'adj', 'base'],               weight: 2  },
  { parts: ['adj', 'base', 'prep'],                 weight: 2  },
  { parts: ['optAdj', 'base', 'prep'],              weight: 2  },
  { parts: ['optAdj', 'adj', 'base', 'prep'],       weight: 1  },
]

// Dungeon strategies: unique draws fire 25% of the time if uniqueItems pool is non-empty.
// If no uniqueItems configured, 'unique' falls through to 'adj base'.
export const dungeonTemplates: SyntaxTemplate[] = [
  { parts: ['unique'],                    weight: 25 },
  { parts: ['optAdj', 'base'],            weight: 25 },
  { parts: ['adj', 'base'],               weight: 25 },
  { parts: ['base', 'prep'],              weight: 19 },
  { parts: ['optAdj', 'adj', 'base'],     weight: 2  },
  { parts: ['adj', 'base', 'prep'],       weight: 2  },
  { parts: ['optAdj', 'base', 'prep'],    weight: 2  },
]

export const tavernTemplates: SyntaxTemplate[] = [
  { parts: ['adj', 'base'],               weight: 22 },
  { parts: ['base', 'prep'],              weight: 22 },
  { parts: ['optAdj', 'base'],            weight: 22 },
  { parts: ['possessive', 'base'],        weight: 22 },
  { parts: ['participle', 'base'],        weight: 22 },
  { parts: ['twoWord', 'base'],           weight: 10 },
]

export const riverTemplates: SyntaxTemplate[] = [
  { parts: ['adj', 'base'],              weight: 25 },
  { parts: ['twoWord', 'base'],          weight: 50 },
  { parts: ['optAdj', 'adj', 'base'],    weight: 25 },
]

// twoWord: full name is a compound word (prefix+suffix, no space), no separate base
export const twoWordTemplates: SyntaxTemplate[] = [
  { parts: ['twoWord'], weight: 100 },
]

// city: fixed base+prep pattern with optional adj
export const cityTemplates: SyntaxTemplate[] = [
  { parts: ['adj', 'base'],              weight: 60 },
  { parts: ['base', 'prep'],             weight: 30 },
  { parts: ['adj', 'base', 'prep'],      weight: 10 },
]

// Map from StrategyType to its template set (prefixed and deity handled in engine)
export const strategyTemplates: Record<string, SyntaxTemplate[]> = {
  wilderness: wildernessTemplates,
  dungeon:    dungeonTemplates,
  tavern:     tavernTemplates,
  river:      riverTemplates,
  twoWord:    twoWordTemplates,
  city:       cityTemplates,
}
