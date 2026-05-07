import { TaggedItem, TypeConfig, SyntaxPart, SyntaxTemplate } from '../types/types'
import { typeConfigMap } from '../config/typeConfig'
import { strategyTemplates, wildernessTemplates } from '../config/templates'

import {
  base_adjective, tavern_participle,
} from '../lists/adjective_lists'

import {
  base,
} from '../lists/base_lists'

import {
  possessive, optional_adjective,
  prefixes, suffixes,
  prepositional_singular, prepositional_plural,
  abstraction, objects,
  any_dungeon_type,
} from '../lists/misc_lists'

import {
  d_name_male, d_name_female,
  d_title_prefix_good, d_title_prefix_evil, d_title_prefix_neutral,
  d_title_good, d_title_evil, d_title_neutral, d_title_male, d_title_female,
  d_domain_good, d_domain_evil, d_domain_neutral,
  d_silly, d_nasty,
  l_pre, l_mid, l_suf,
  d_surname_good, d_surname_evil, d_surname_neutral,
  d_surname_male, d_surname_female,
} from '../lists/deity_lists'

// ── CORE UTILITIES ────────────────────────────────────────────────────────────

export const getRandom = (n: number) => Math.floor(Math.random() * n)

const expandByWeight = (items: TaggedItem[]): string[] =>
  items.flatMap(([v, _, w]) => Array(w).fill(v) as string[])

const pickFrom = (items: TaggedItem[]): string => {
  if (!items.length) return ''
  const pool = expandByWeight(items)
  return pool[getRandom(pool.length)] ?? ''
}

const pickTemplate = (templates: SyntaxTemplate[]): SyntaxTemplate => {
  const total = templates.reduce((s, t) => s + t.weight, 0)
  let r = getRandom(total)
  for (const t of templates) {
    r -= t.weight
    if (r < 0) return t
  }
  return templates[templates.length - 1]
}

const getPlural = (str: string): string => {
  const last = str.charAt(str.length - 1)
  if (last === 's' || last === 'x' || last === 'o') return str + 'es'
  if (last === 'h') {
    const prev = str.charAt(str.length - 2)
    if (prev === 's' || prev === 'c') return str + 'es'
  }
  return str + 's'
}

// ── PREPOSITIONAL PHRASE ──────────────────────────────────────────────────────

const getPrep = (config: TypeConfig): string => {
  const prep = config.prepPool ?? prepositional_singular
  const adj  = config.adjectivePool ?? base_adjective
  const noun = pickFrom(prep)
  const mod  = pickFrom(adj)

  switch (getRandom(6)) {
    case 0: return `of ${getPlural(noun)}`
    case 1: return `of the ${noun}`
    case 2: return `of ${noun}`
    case 3: return `of ${mod} ${getPlural(noun)}`
    case 4: return `of the ${mod} ${noun}`
    default: return `of the ${mod} ${noun}`
  }
}

// ── PART RESOLVER ─────────────────────────────────────────────────────────────

const getPart = (part: SyntaxPart, config: TypeConfig, strategy: string): string => {
  switch (part) {
    case 'adj': {
      // Wilderness/river/prefixed: 50% chance of prefix+suffix compound adjective
      const wantsCompound = strategy === 'wilderness' || strategy === 'river' || strategy === 'prefixed'
      if (wantsCompound && Math.random() < 0.5) {
        const pre = pickFrom(config.prefixPool ?? prefixes)
        const suf = pickFrom(config.suffixPool ?? suffixes)
        return pre + suf.toLowerCase()
      }
      return pickFrom(config.adjectivePool ?? base_adjective)
    }
    case 'optAdj': {
      // 33% possessive ("Wizard's"), 67% relative/the
      if (Math.random() < 0.33) {
        const poss = pickFrom(config.possessivePool ?? possessive)
        return poss + "'s"
      }
      return pickFrom(optional_adjective)
    }
    case 'base':
      return pickFrom(config.basePool ?? base)
    case 'prep':
      return getPrep(config)
    case 'twoWord': {
      const pre = pickFrom(config.prefixPool ?? prefixes)
      const suf = pickFrom(config.suffixPool ?? suffixes)
      return pre + suf.toLowerCase()
    }
    case 'unique': {
      if (!config.uniqueItems?.length) return ''
      return pickFrom(config.uniqueItems)
    }
    case 'possessive': {
      const poss = pickFrom(config.possessivePool ?? possessive)
      return poss + "'s"
    }
    case 'participle':
      return pickFrom(tavern_participle)
    default:
      return ''
  }
}

// ── COMPOSE ───────────────────────────────────────────────────────────────────

const compose = (parts: SyntaxPart[], config: TypeConfig, strategy: string): string =>
  parts
    .map(p => getPart(p, config, strategy))
    .filter(s => s !== '')
    .join(' ')
    .trim()

// ── DEITY GENERATION ─────────────────────────────────────────────────────────

const getDeityAlignment = (): 'Good' | 'Evil' | 'Neutral' => {
  const r = getRandom(3)
  if (r === 0) return 'Good'
  if (r === 1) return 'Evil'
  return 'Neutral'
}

const getDeityGender = (): 'Male' | 'Female' =>
  getRandom(2) === 0 ? 'Male' : 'Female'

const getSilly = (): string => {
  let a = pickFrom(d_silly), b = a
  while (b === a) b = pickFrom(d_silly)
  const str = a + b.toLowerCase()
  return getRandom(4) === 0 ? getPlural(str) : str
}

const getNasty = (): string => {
  let a = pickFrom(d_nasty), b = a
  while (b === a) b = pickFrom(d_nasty)
  const str = a + b.toLowerCase()
  return getRandom(4) === 0 ? getPlural(str) : str
}

const getLongName = (): string =>
  `${pickFrom(l_pre)}${pickFrom(l_mid)}${pickFrom(l_suf)}`

const getDeityTitle = (algn: 'Good' | 'Evil' | 'Neutral', gndr: 'Male' | 'Female'): string => {
  let str = ', '
  const r = getRandom(4)

  if (r === 0 || r === 3) {
    const prefixPool = algn === 'Good' ? d_title_prefix_good
      : algn === 'Evil' ? d_title_prefix_evil
      : d_title_prefix_neutral
    str += pickFrom(prefixPool) + ' '
  }

  if (r <= 1) {
    const titlePool = algn === 'Good' ? d_title_good
      : algn === 'Evil' ? d_title_evil
      : d_title_neutral
    str += pickFrom(titlePool)
  } else {
    const genderPool = gndr === 'Male' ? d_title_male : d_title_female
    str += pickFrom(genderPool)
  }

  return str + ' of '
}

const getDeityEpithet = (algn: 'Good' | 'Evil' | 'Neutral', gndr: 'Male' | 'Female'): string => {
  const r = getRandom(8)
  if (r === 0) {
    const pool = algn === 'Good' ? d_surname_good
      : algn === 'Evil' ? d_surname_evil
      : d_surname_neutral
    return ` the ${pickFrom(pool)}`
  }
  if (r === 1) return ` the ${getLongName()}`
  if (r === 2 || r === 3) {
    const gPool = gndr === 'Male' ? d_surname_male : d_surname_female
    return ` the ${pickFrom(gPool)}`
  }
  if (r >= 4 && r <= 6) {
    const epithet = algn === 'Evil' ? getNasty() : getSilly()
    return ` the ${epithet}`
  }
  return ''
}

const getDeity = (): string => {
  const align  = getDeityAlignment()
  const gender = getDeityGender()

  const namePool = gender === 'Male' ? d_name_male : d_name_female
  const name     = pickFrom(namePool)
  const epithet  = getDeityEpithet(align, gender)
  const title    = getDeityTitle(align, gender)

  const domainPool = align === 'Good' ? d_domain_good
    : align === 'Evil' ? d_domain_evil
    : d_domain_neutral

  return `${name}${epithet}${title}${pickFrom(domainPool)}`
}

// ── STRATEGY DISPATCHER ───────────────────────────────────────────────────────

const getSyntax = (typ: string, _adj: string): string => {
  // Resolve any_dungeon_room to a concrete type
  if (typ === 'any_dungeon_room') {
    typ = any_dungeon_type[getRandom(any_dungeon_type.length)]
  }

  const config   = typeConfigMap[typ] ?? { strategy: 'wilderness' as const }
  const strategy = config.strategy

  if (strategy === 'deity') return getDeity()

  if (strategy === 'prefixed') {
    if (Math.random() < 0.25) {
      const pre = pickFrom(config.prefixPool ?? prefixes)
      const suf = pickFrom(config.suffixPool ?? suffixes)
      return `${pre} ${suf}`
    }
    const template = pickTemplate(wildernessTemplates)
    return compose(template.parts, config, 'wilderness')
  }

  const templates = strategyTemplates[strategy] ?? wildernessTemplates
  const template  = pickTemplate(templates)

  // If 'unique' fires but uniqueItems is empty, fall back to adj+base
  if (template.parts[0] === 'unique' && !config.uniqueItems?.length) {
    return compose(['adj', 'base'], config, strategy)
  }

  return compose(template.parts, config, strategy)
}

// ── PUBLIC API ────────────────────────────────────────────────────────────────

export const getSyntaxList = (n: number, typ: string, adj: string): string[] =>
  Array.from({ length: n }, () => getSyntax(typ, adj) ?? '')
