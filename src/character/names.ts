import { Gender } from '../character/Character';
import { d_silly, d_nasty } from './names_lists';
import { VariantUpdater, TaggedItem } from '../shared/types';
import { Neutral, names } from '../character/lists';
import { filterTaggedList, getFromRecord } from './functions';

export enum WordPosition {
  Prefix = 'prefix',
  Suffix = 'suffix',
  Root = 'root'
}
export const { Prefix, Suffix, Root } = WordPosition

export const getFirstName = (
  gender: Gender
): string => getFromRecord(names, gender)

export const getLastNameByTags = (
  tags: string[]
): string => {
  const prefix = filterTaggedList([...tags, Prefix], weightedTaggedNameTuples)
  const suffix = filterTaggedList([...tags, Suffix], weightedTaggedNameTuples)
  return `${prefix}${suffix}`
}


// export const getName = (gender: string, tags: string[]): string => {
//   const firstName = getFirstName(gender as Gender)
//   const lastName = getLastNameByTags(tags)
//   return `${firstName} ${lastName}`
// }

export const getTwoWordItemByTags = (
  a: TaggedItem[],
  b: TaggedItem[],
  tags: string[]
): string => `${filterTaggedList(tags, a)}${filterTaggedList(tags, b)}`



export enum WordType {
  Agentive = 'agentivenoun',
  Collective = 'collectivenoun',
  Noun = 'noun',
  Verb = 'verb',
  Adjective = 'adjective',
  Adverb = 'adverb',
  Conjunction = 'conjunction',
  Preposition = 'preposition',
  Pronoun = 'pronoun',
  Determiner = 'determiner'
}

export enum NounGroup {
  Animal = 'animal',
  Plant = 'plant',
  Material = 'material',
  Anatomical = 'anatomical',
  Weapon = 'weapon',
  Armor = 'armor',
  Fluid = 'fluid',
  Color = 'color',
  Weather = 'weather',
  Abstraction = 'abstraction'
}

export enum VerbTense {
  Past = 'past',
  Present = 'present',
  Future = 'future',
  Continuous = 'continuous',
  Perfect = 'perfect',
  Simple = 'simple'
}

export enum VerbGroup { }

export enum AdjectiveGroups {
  Effect = 'effect',
  Condition = 'condition',
  Quality = 'quality',
}


// const taggedNames: TaggedItem[] = [
//   {
//     value: 'Master',
//     tags: [Neutral, All, Prefix, Suffix]
//   },
//   {
//     value: 'Apprentice',
//     tags: [Neutral, All, Prefix, Suffix]
//   },
//   {
//     value: 'Chamberlain',
//     tags: [Neutral, All, Prefix, Suffix]
//   },
// ]

export const weightedTaggedNameTuples: TaggedItem[] = [
  ['Master', [Neutral, Prefix, Suffix], 1],
  ['Apprentice', [Neutral, Prefix, Suffix], 1],
  ['Chamberlain', [Neutral, Prefix, Suffix], 1],
]

// const weightedTaggedNames: TaggedItem[] = [
//   ['Bob', ['male', 'evil', 'royal'], 3],
//   ['Fred', ['male', 'good', 'artisan'], 2],
//   ['Phil', ['male', 'good', 'criminal'], 1],
// ]

// const weightedTaggedNamesObj: WeightedTaggedItem[] = [
//   { value: 'Bob', tags: ['male', 'evil', 'royal'], weight: 3 },
//   { value: 'Fred', tags: ['male', 'good', 'artisan'], weight: 2 },
//   { value: 'Phil', tags: ['male', 'good', 'criminal'], weight: 1 },
// ]

const getNameVariant1 = (tags: string[]) => 'one'
const getNameVariant2 = (tags: string[]) => 'two'
const getNameVariant3 = (tags: string[]) => 'three'

export const weightedVariantConfig: VariantUpdater<any>[] = [
  [1, (tags: string[]) => getNameVariant1(tags)],
  [2, (tags: string[]) => getNameVariant2(tags)],
  [3, (tags: string[]) => getNameVariant3(tags)]
]