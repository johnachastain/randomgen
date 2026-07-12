import { WeightedVariantFilter, TaggedItem, Updater, VariantFilter } from '../shared/types';
import { getItem, getRandom } from '../shared/functions';
import { configTuple } from './config';
import { Character } from './Character';

export const d4 = (): number => getRandom(4)
export const d6 = (): number => getRandom(6)
export const d8 = (): number => getRandom(8)
export const d10 = (): number => getRandom(10)
export const d12 = (): number => getRandom(12)
export const d20 = (): number => getRandom(20)
export const d6x3 = (): number => getRandom(6) + getRandom(6) + getRandom(6)

export const getTupleConfig = (configArray: Array<configTuple>) => {

  let result = {}
  for (const tuple of configArray) {
    const optional = tuple[2]
    if (optional) {
      // random to determine to add element
      const rand = getRandom(20)
      if (rand <= 10) {
        continue
      }
    }

    const updater = tuple[1] as Updater<Character>
    result = updater(result)
  }
  return result
}

// table of updaters with weighted variant syntax functions
export const makeVariantTable = (tuples: WeightedVariantFilter[]): VariantFilter[] => {
  let table: VariantFilter[] = []
  for (const tuple of tuples) {
    const [weight, variantFilter] = tuple
    // the higher the weight the more times it appears in the table
    for (let i = 0; i < weight; i++) {
      table = [...table, variantFilter]
    }
  }
  return table
}

// gets one variant item based on tags
export const getVariantItem = (config: WeightedVariantFilter[], tags: string[]) => {
  const table: VariantFilter[] = makeVariantTable(config)
  const variantFilter: VariantFilter = getItem(table)
  return variantFilter(tags)
}

export const containsAll = (required: string[], target: string[]) => (
  required.every((s: string) => target.includes(s))
);

export const excludesAll = (required: string[], target: string[]) => (
  required.every((s: string) => !target.includes(s))
);


// console.log('containsAll 1', containsAll([], [])) // true
// console.log('containsAll 2', containsAll([], ['test'])) // true
// console.log('containsAll 3', containsAll(['test'], [])) // false
// console.log('containsAll 4', containsAll(['test'], ['test']))// true
// console.log('excludesAll 1', excludesAll([], [])) // true
// console.log('excludesAll 2', excludesAll([], ['test'])) // true
// console.log('excludesAll 3', excludesAll(['test'], [])) // true
// console.log('excludesAll 4', excludesAll(['test'], ['test'])) // false

// taggedTuples similar to taggedItem but array tuple instead of keyed object
export const getTaggedItem = (arr: TaggedItem[]): string =>
  (arr[getRandom(arr.length)]?.[0])


export const makeTaggedList = (
  required: string[] = [],
  list: TaggedItem[] = [],
  excluded: string[] = []
): TaggedItem[] => {
  const array = list
    .filter(([_, tags]) => containsAll(required, tags))
    .filter(([_, tags]) => excludesAll(excluded, tags))

  let sum: TaggedItem[] = []

  for (const item of array) {
    const [_, __, n] = item
    for (let i = 0; i < n; i++) {
      sum = [...sum, item]
    }
  }
  return sum
}

export const filterTaggedList = (
  required: string[] = [],
  list: TaggedItem[] = [],
  excluded: string[] = []) => {

  const sum = makeTaggedList(required, list, excluded)
  return getTaggedItem(sum)
}

// Records (keyed object of arrays)
export const getFromRecord = (list: Record<string, string[]>, key: string): string =>
  (getItem(list[key as keyof typeof list]))
