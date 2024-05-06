import { TableItem, TaggedItem, TaggedTuple, WeightedTaggedTuple } from '../shared/types';
import { getItem, getRandom } from '../shared/functions';

// Populate Objects using a config of updaters
export const getConfig = (configArray: Function[]) => {
    let result = {}
    for (const updater of configArray) {
      result = updater(result)
    }
    return result
}

// tuple weighted tables
export const makeTable =(tuples: TableItem[], tags: string[]) => {
  let sum: Function[] = []
  for (const tuple  of tuples) {
    const [range, updater] = tuple
    for (let i=0; i < range; i++) {
      sum = [ ...sum, updater]
    }
  }
  return sum
}

export const getTableItem = (config: TableItem[], tags: string[]) => {
  const table: Function[] = makeTable(config, tags)
  const getter: Function = getItem(table)
  return getter(tags)
}

// taggedItem (keyed objects)
export const getTaggedItem = (arr: TaggedItem[]): string => 
  (arr[getRandom(arr.length)]?.name)

export const containsAll = (required: string[], target: string[]) => (
  required.every((s: string) => target.includes(s))
);

export const filterTaggedList = (required: string[], list: TaggedItem[]) => {
  const array = list.filter(
    ({tags}) => containsAll(required, tags))
  return getTaggedItem(array)
}

// taggedTuples
export const getTaggedTuple = (arr: TaggedTuple[]): string => 
  (arr[getRandom(arr.length)]?.[0])

export const filterTaggedTupleList = (required: string[], list: TaggedTuple[]) => {
  const array = list.filter(
    ([_, tags]) => containsAll(required, tags))
  return getTaggedTuple(array)
}

export const getWeightedTaggedTuple = (arr: WeightedTaggedTuple[]): string => 
  (arr[getRandom(arr.length)]?.[0])

export const filterWeightedTaggedTupleList = (
  required: string[], list: WeightedTaggedTuple[]
) => {
  const filtered = list.filter(
    ([_, tags]) => containsAll(required, tags))

    let sum: WeightedTaggedTuple[] = []

    for (const item of filtered) {
      const [_, __, n] = item
      for (let i=0; i < n; i++) {
        sum = [ ...sum, item]
      }
    }

  return getWeightedTaggedTuple(sum)
}

// Records (keyed object of arrays)
export const getFromRecord= (list: Record<string, string[]>, set: string): string => 
  (getItem(list[set as keyof typeof list]))
