import { TypeConfig, filterByTag } from '../types/types'

import {
  MOUNTAIN, HILLS, RIVER, FOREST, OCEAN, CAVE, CANYON, SWAMP, DESERT, STONE,
  FORTIFICATION, TEMPLE, TOMB, ARTIFACT, SHELTER, MECHANICAL, SECURITY,
  CITY, BRIDGE, TOWER, TAVERN, UNDERGROUND,
  UNDEAD, RELIGIOUS, MAGICAL_PERSON,
} from '../lists/tags'

import {
  base_adjective,
  natural_mountain_adjective, natural_hills_adjective,
  natural_river_adjective, natural_woodlands_adjective,
  natural_marshes_adjective, natural_depression_adjective,
  natural_underground_adjective, natural_saltwater_adjective,
  natural_stone_adjective,
  construction_fortification_adjective, construction_religious_adjective,
  construction_underground_adjective,
  construction_bridge_adjective, construction_tower_adjective,
  dungeon_room_adjective, tomb_room_adjective,
  temple_room_adjective, cavern_room_adjective, magical_room_adjective,
  district_special_adjective,
  creatures,
} from '../lists/adjective_lists'

import {
  base, naturals, constructions,
  political_district,
  dungeon_room, tomb_room, temple_room, cavern_room, magical_room,
} from '../lists/base_lists'

import {
  persons, possessive,
  prefixes, suffixes, suffix_town,
  prefix_mountain, suffix_mountain,
  prefix_fortification,
  suffix_river, suffix_forest,
  prepositional_singular,
  dungeon_prepositional, tomb_prepositional,
  temple_prepositional, cavern_prepositional, magical_prepositional,
} from '../lists/misc_lists'

import {
  dungeon_unique, cavern_unique, magical_unique,
} from '../lists/dungeon_rooms'

export const typeConfigMap: Record<string, TypeConfig> = {

  // ── DEFAULT / CATCH-ALL ──────────────────────────────────────────────────────
  'base':         { strategy: 'wilderness', basePool: base },
  'natural':      { strategy: 'wilderness', basePool: naturals },
  'construction': { strategy: 'wilderness', basePool: constructions },

  // ── NATURAL ─────────────────────────────────────────────────────────────────
  'natural_mountain': {
    strategy: 'prefixed',
    adjectivePool: natural_mountain_adjective,
    basePool:      filterByTag(MOUNTAIN, naturals),
    prefixPool:    prefix_mountain,
    suffixPool:    suffix_mountain,
  },
  'natural_highlands': {
    strategy: 'wilderness',
    adjectivePool: natural_mountain_adjective,
    basePool:      filterByTag(MOUNTAIN, naturals),
  },
  'natural_hills': {
    strategy: 'wilderness',
    adjectivePool: natural_hills_adjective,
    basePool:      filterByTag(HILLS, naturals),
  },
  'natural_river': {
    strategy: 'river',
    adjectivePool: natural_river_adjective,
    basePool:      filterByTag(RIVER, naturals),
    prefixPool:    prefixes,
    suffixPool:    suffix_river,
  },
  'natural_freshwater': {
    strategy: 'river',
    adjectivePool: natural_river_adjective,
    basePool:      filterByTag(RIVER, naturals),
    prefixPool:    prefixes,
    suffixPool:    suffix_river,
  },
  'natural_woodlands': {
    strategy: 'wilderness',
    adjectivePool: natural_woodlands_adjective,
    basePool:      filterByTag(FOREST, naturals),
    suffixPool:    suffix_forest,
  },
  'natural_saltwater': {
    strategy: 'wilderness',
    adjectivePool: natural_saltwater_adjective,
    basePool:      filterByTag(OCEAN, naturals),
  },
  'natural_underground': {
    strategy: 'wilderness',
    adjectivePool: natural_underground_adjective,
    basePool:      filterByTag(CAVE, naturals),
  },
  'natural_depression': {
    strategy: 'wilderness',
    adjectivePool: natural_depression_adjective,
    basePool:      filterByTag(CANYON, naturals),
  },
  'natural_marshes': {
    strategy: 'wilderness',
    adjectivePool: natural_marshes_adjective,
    basePool:      filterByTag(SWAMP, naturals),
  },
  'natural_desert': {
    strategy: 'wilderness',
    basePool: filterByTag(DESERT, naturals),
  },
  'natural_misc': {
    strategy: 'wilderness',
    basePool: naturals,
  },
  'natural_stone': {
    strategy: 'wilderness',
    adjectivePool: natural_stone_adjective,
    basePool:      filterByTag(STONE, naturals),
  },

  // ── CONSTRUCTION ────────────────────────────────────────────────────────────
  'construction_town': {
    strategy: 'twoWord',
    prefixPool: prefixes,
    suffixPool: suffix_town,
  },
  'construction_city': {
    strategy: 'city',
    basePool:      filterByTag(CITY, constructions),
    prepPool:      prepositional_singular,
  },
  'construction_fortification': {
    strategy: 'prefixed',
    adjectivePool: construction_fortification_adjective,
    basePool:      filterByTag(FORTIFICATION, constructions),
    prefixPool:    prefix_fortification,
    suffixPool:    suffixes,
  },
  'construction_tavern': {
    strategy: 'tavern',
    basePool:       filterByTag(TAVERN, constructions),
    adjectivePool:  base_adjective,
    possessivePool: possessive,
    prefixPool:     prefixes,
    prepPool:       prepositional_singular,
  },
  'construction_religious': {
    strategy: 'wilderness',
    adjectivePool: construction_religious_adjective,
    basePool:      filterByTag(TEMPLE, constructions),
  },
  'construction_underground': {
    strategy: 'wilderness',
    adjectivePool: construction_underground_adjective,
    basePool:      filterByTag(UNDERGROUND, constructions),
  },
  'construction_funerary': {
    strategy: 'wilderness',
    basePool: filterByTag(TOMB, constructions),
  },
  'construction_artifact': {
    strategy: 'wilderness',
    basePool: filterByTag(ARTIFACT, constructions),
  },
  'construction_shelter': {
    strategy: 'wilderness',
    basePool: filterByTag(SHELTER, constructions),
  },
  'construction_mechanical': {
    strategy: 'wilderness',
    basePool: filterByTag(MECHANICAL, constructions),
  },
  'construction_security': {
    strategy: 'wilderness',
    basePool: filterByTag(SECURITY, constructions),
  },
  'construction_misc': {
    strategy: 'wilderness',
    basePool: constructions,
  },
  'construction_freshwater': {
    strategy: 'wilderness',
    basePool: filterByTag(RIVER, constructions),
  },
  'construction_bridge': {
    strategy: 'wilderness',
    adjectivePool: construction_bridge_adjective,
    basePool:      filterByTag(BRIDGE, constructions),
  },
  'construction_tower': {
    strategy: 'wilderness',
    adjectivePool: construction_tower_adjective,
    basePool:      filterByTag(TOWER, constructions),
  },

  // ── POLITICAL ───────────────────────────────────────────────────────────────
  'political_district': {
    strategy: 'city',
    adjectivePool: district_special_adjective,
    basePool:      political_district,
  },

  // ── DUNGEON ROOMS ───────────────────────────────────────────────────────────
  'dungeon_room': {
    strategy: 'dungeon',
    adjectivePool: dungeon_room_adjective,
    basePool:      dungeon_room,
    prepPool:      dungeon_prepositional,
    uniqueItems:   dungeon_unique,
  },
  'tomb_room': {
    strategy: 'dungeon',
    adjectivePool:  tomb_room_adjective,
    basePool:       tomb_room,
    possessivePool: filterByTag(UNDEAD, creatures),
    prepPool:       tomb_prepositional,
  },
  'temple_room': {
    strategy: 'dungeon',
    adjectivePool:  temple_room_adjective,
    basePool:       temple_room,
    possessivePool: filterByTag(RELIGIOUS, persons),
    prepPool:       temple_prepositional,
  },
  'cavern_room': {
    strategy: 'dungeon',
    adjectivePool:  cavern_room_adjective,
    basePool:       cavern_room,
    possessivePool: creatures,
    prepPool:       cavern_prepositional,
    uniqueItems:    cavern_unique,
  },
  'magical_room': {
    strategy: 'dungeon',
    adjectivePool:  magical_room_adjective,
    basePool:       magical_room,
    possessivePool: filterByTag(MAGICAL_PERSON, persons),
    prepPool:       magical_prepositional,
    uniqueItems:    magical_unique,
  },

  // ── DEITY ───────────────────────────────────────────────────────────────────
  'deity': {
    strategy: 'deity',
  },
}
