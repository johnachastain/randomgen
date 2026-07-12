import { WeightedVariantFilter, TaggedItem, VariantFilter } from '../shared/types';
import { filterTaggedList, getTaggedItem, makeTaggedList } from '../character/functions';
import { nameWords, twoTagSets } from './lists';
import { capitalizeInitial, getRandom } from '../shared/functions';


export const getWordByLetter = (
  letter: string,
  tags: Array<string>,
  list: Array<TaggedItem>
): string => {
  const taggedList = makeTaggedList(tags, list, [])
  const filteredList = taggedList.filter((i) => {
    const key = i[0].toLowerCase().substring(0, 1)
    const initial = letter.toLowerCase()
    return key === initial
  })

  return getTaggedItem(filteredList)
}


export const getTwoWordName: VariantFilter = (tags) => (
  `${filterTaggedList(tags, nameWords)}${filterTaggedList(tags, nameWords)}`
)

export const getAlliterativeName: VariantFilter = (tags) => {
  const first = filterTaggedList(tags, nameWords)
  const second = getWordByLetter(first.substring(0, 1), tags, nameWords)

  return `${first}${second}`
}

export const getTagSetName: VariantFilter = (tags) => {
  const length: number = twoTagSets.length
  const index: number = getRandom(length)
  const tagSet: Array<any> = twoTagSets[index]

  const first = filterTaggedList([tagSet[0]], nameWords)
  const second = filterTaggedList([tagSet[1]], nameWords)

  return `${capitalizeInitial(first)}${second}`
}


// prefix/suffix two word name
// prefix/base/suffix invented name

export const weightedVariants: WeightedVariantFilter[] = [
  [1, getTwoWordName],
  [1, getAlliterativeName],
  [1, getTagSetName]
]