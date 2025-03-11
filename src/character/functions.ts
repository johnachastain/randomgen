import { WeighedVariantUpdater, TaggedItem, TaggedTuple, WeightedTaggedTuple, WeightedTaggedItem } from '../shared/types';
import { getItem, getRandom } from '../shared/functions';

// Populate Objects using a config of updaters
export const getConfig = (configArray: Function[]) => {
  let result = {}
  for (const updater of configArray) {
    result = updater(result)
  }
  return result
}

// table of updaters with weighted variant syntax functions
export const makeVariantTable = (tuples: WeighedVariantUpdater[], tags: string[]) => {
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
export const getVariantItem = (config: WeighedVariantUpdater[], tags: string[]) => {
  const table: Function[] = makeVariantTable(config, tags)
  const updater: Function = getItem(table)
  return updater(tags)
}



// taggedItem (keyed objects)
export const getTaggedItem = (arr: TaggedItem[]): string =>
  (arr[getRandom(arr.length)]?.value)

export const containsAll = (required: string[], target: string[]) => (
  required.every((s: string) => target.includes(s))
);

export const filterTaggedList = (required: string[], list: TaggedItem[]) => {
  const array = list.filter(
    ({ tags }) => containsAll(required, tags))
  return getTaggedItem(array)
}



// taggedTuples similar to taggedItem but array tuple instead of keyed object
export const getTaggedTuple = (arr: WeightedTaggedTuple[]): string =>
  (arr[getRandom(arr.length)]?.[0])

export const filterTaggedTupleList = (required: string[], list: WeightedTaggedTuple[]) => {
  const array = list.filter(
    ([_, tags]) => containsAll(required, tags))

  let sum: WeightedTaggedTuple[] = []

  for (const item of array) {
    const [_, __, n] = item
    for (let i = 0; i < n; i++) {
      sum = [...sum, item]
    }
  }

  return getTaggedTuple(sum)
}



// export const getWeightedTaggedTuple = (arr: WeightedTaggedTuple[]): string =>
//   (arr[getRandom(arr.length)]?.[0])




// export const filterWeightedTaggedTupleList = (
//   required: string[], list: WeightedTaggedTuple[]
// ) => {
//   const filtered = list.filter(
//     ([_, tags]) => containsAll(required, tags))

//   let sum: WeightedTaggedTuple[] = []

//   for (const item of filtered) {
//     const [_, __, n] = item
//     for (let i = 0; i < n; i++) {
//       sum = [...sum, item]
//     }
//   }

//   return getWeightedTaggedTuple(sum)
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




// Records (keyed object of arrays)
export const getFromRecord = (list: Record<string, string[]>, set: string): string =>
  (getItem(list[set as keyof typeof list]))
