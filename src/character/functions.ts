import { VariantUpdater, TaggedItem } from '../shared/types';
import { getItem, getRandom } from '../shared/functions';

export const d4 = (): number => getRandom(4)
export const d6 = (): number => getRandom(6)
export const d8 = (): number => getRandom(8)
export const d10 = (): number => getRandom(10)
export const d12 = (): number => getRandom(12)
export const d20 = (): number => getRandom(20)
export const d6x3 = (): number => getRandom(6) + getRandom(6) + getRandom(6)

// Populate Objects using a config of updaters
export const getConfig = (configArray: Function[]) => {
  let result = {}
  for (const updater of configArray) {
    result = updater(result)
  }
  return result
}

// table of updaters with weighted variant syntax functions
export const makeVariantTable = (tuples: VariantUpdater<any>[]) => {
  let table: Function[] = []
  for (const tuple of tuples) {
    const [weight, updater] = tuple
    // the higher the weight the more times it appears in the table
    for (let i = 0; i < weight; i++) {
      table = [...table, updater]
    }
  }
  return table
}

// gets one variant item based on tags
export const getVariantItem = (config: VariantUpdater<any>[], tags: string[]) => {
  const table: Function[] = makeVariantTable(config)
  const updater: Function = getItem(table)
  return updater(tags)
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

export const filterTaggedList = (
  required: string[] = [],
  list: TaggedItem[] = [],
  excluded: string[] = []) => {
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

  return getTaggedItem(sum)
}

// export type filterTaggedList2Props = {
//   required?: string[],
//   list?: any[],
//   excluded?: string[],
//   accumulator?: any
// }

// export const filterTaggedList2 = (
//   {
//     required = [],
//     list = [],
//     excluded = [],
//     accumulator = {}
//   }: filterTaggedList2Props
// ) => {
//   const array = list
//     .filter(([_, tags]) => containsAll(required, tags))
//     .filter(([_, tags]) => excludesAll(excluded, tags))

//   let sum: TaggedItem[] = []

//   for (const item of array) {
//     const [_, __, n] = item
//     for (let i = 0; i < n; i++) {
//       sum = [...sum, item]
//     }
//   }

//   return getTaggedItem(sum)
// }

// Records (keyed object of arrays)
export const getFromRecord = (list: Record<string, string[]>, key: string): string =>
  (getItem(list[key as keyof typeof list]))


// taggedItem (keyed objects)
// export const getTaggedItem = (arr: TaggedItem[]): string =>
//   (arr[getRandom(arr.length)]?.value)

// export const filterTaggedList = (required: string[], list: TaggedItem[]) => {
//   const array = list.filter(
//     ({ tags }) => containsAll(required, tags))
//   return getTaggedItem(array)
// }

// export const getTaggedItem = (arr: TaggedItem[]): string =>
//   (arr[getRandom(arr.length)]?.[0])

// export const filterTaggedList = (
//   required: string[], list: TaggedItem[]
// ) => {
//   const filtered = list.filter(
//     ([_, tags]) => containsAll(required, tags))

//   let sum: TaggedItem[] = []

//   for (const item of filtered) {
//     const [_, __, n] = item
//     for (let i = 0; i < n; i++) {
//       sum = [...sum, item]
//     }
//   }

//   return getTaggedItem(sum)
// }


// export const getWeightedTaggedItem = (arr: WeightedTaggedItem[]): string =>
//   (arr[getRandom(arr.length)]?.value)

// export const filterWeightedTaggedItemList = (
//   required: string[], list: WeightedTaggedItem[]
// ) => {
//   const filtered = list.filter(
//     ({ tags }) => containsAll(required, tags ?? []))

//   let sum: WeightedTaggedItem[] = []

//   for (const item of filtered) {
//     const { weight = 1 } = item
//     for (let i = 0; i < weight; i++) {
//       sum = [...sum, item]
//     }
//   }

//   return getWeightedTaggedItem(sum)
// }
