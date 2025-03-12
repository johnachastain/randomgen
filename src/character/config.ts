import { Character } from '../character/Character';
import { Updater } from '../shared/types';
import { Labor, Neutral, ageTuple, demeanorTuple, gender, nameFirstTuple, occupationTuple, socialClass, titleTuple, wealthTuple } from '../character/lists';
import { getItem } from '../shared/functions';
import { d6x3, filterTaggedList } from './functions';
import { Prefix, Suffix, weightedTaggedNameTuples } from './names';

export const characterConfig: Updater<Character>[] = [
  (obj) => ({ ...obj, gender: getItem(gender) }),

  (obj) => {
    const { gender = Neutral } = obj
    return { ...obj, firstName: filterTaggedList([gender], nameFirstTuple) }
  },

  (obj) => {
    const prefix = filterTaggedList([Prefix], weightedTaggedNameTuples)
    const suffix = filterTaggedList([Suffix], weightedTaggedNameTuples)
    return { ...obj, lastName: `${prefix}${suffix}` }
  },

  (obj) => ({ ...obj, age: filterTaggedList([], ageTuple) }),
  (obj) => ({ ...obj, socialClass: getItem(socialClass) }),
  (obj) => ({ ...obj, wealth: filterTaggedList([], wealthTuple) }),

  (obj) => {
    const { gender = Neutral, socialClass = Labor } = obj
    const result = filterTaggedList([gender, socialClass], titleTuple)
    return { ...obj, title: result }
  },

  (obj) => {
    const { socialClass = Labor } = obj
    const result = filterTaggedList([socialClass], occupationTuple)
    return { ...obj, occupation: result }
  },

  (obj) => ({ ...obj, demeanor: filterTaggedList([], demeanorTuple) }),

  (obj) => ({ ...obj, strength: d6x3() }),
  (obj) => ({ ...obj, intelligence: d6x3() }),
  (obj) => ({ ...obj, wisdom: d6x3() }),
  (obj) => ({ ...obj, dexterity: d6x3() }),
  (obj) => ({ ...obj, constitution: d6x3() }),
  (obj) => ({ ...obj, charisma: d6x3() }),

]







// export type CharacterConfigItem = {
//   key: string,
//   method(tags: Array<string>, list: Array<any>): string | number,
//   list?: Array<TaggedItem>
// }

// export type CharacterConfigTuple = [
//   string,
//   (args: filterTaggedList2Props) => string | number,
//   Array<any>,
//   boolean
// ]

// export const getItemWrapper = ({ list }: filterTaggedList2Props) => {
//   return getItem(list)
// }
// export const getNameWrapper = ({ required = [], list = [] }: filterTaggedList2Props): string => {
//   const g = required?.find(r => gender.includes(r as Gender)) ?? Gender.Neutral
//   return getName(g, list)
// }

// export const characterConfig2: CharacterConfigItem[] = [
//   // { key: 'gender', method: getItem, list: gender},
//   // { key: 'name', method: getName, list: []},
//   { key: 'age', method: filterTaggedList, list: ageTuple },
//   // { key: 'socialClass', method: getItem, list: socialClass},
//   { key: 'wealth', method: filterTaggedList, list: wealthTuple },
//   { key: 'title', method: filterTaggedList, list: titleTuple },
//   { key: 'occupation', method: filterTaggedList, list: occupationTuple },
//   { key: 'demeanor', method: filterTaggedList, list: demeanorTuple },

//   { key: 'strength', method: d6x3 },
//   { key: 'intelligence', method: d6x3 },
//   { key: 'wisdom', method: d6x3 },
//   { key: 'dexterity', method: d6x3 },
//   { key: 'constitution', method: d6x3 },
//   { key: 'charisma', method: d6x3 }
// ]

// export const characterConfig3: CharacterConfigTuple[] = [
//   // ['gender', getItem, gender],
//   ['name', getNameWrapper, [], false],
//   ['age', filterTaggedList2, ageTuple, false],
//   ['socialClass', getItemWrapper, socialClass, false],
//   ['wealth', filterTaggedList2, wealthTuple, false],
//   ['title', filterTaggedList2, titleTuple, false],
//   ['occupation', filterTaggedList2, occupationTuple, false],
//   ['demeanor', filterTaggedList2, demeanorTuple, false],

//   ['strength', d6x3, [], false],
//   ['intelligence', d6x3, [], false],
//   ['wisdom', d6x3, [], false],
//   ['dexterity', d6x3, [], false],
//   ['constitution', d6x3, [], false],
//   ['charisma', d6x3, [], false],
// ]

// export const characterConfigBuilder = (config: CharacterConfigTuple[]) => {
//   let required: Array<string> = []
//   let excluded: Array<string> = []

//   return config.reduce((prev, curr) => {
//     const key = curr[0]
//     const method = curr[1]
//     const list = curr[2]
//     const props: filterTaggedList2Props = { required, list, excluded }
//     const value: string | number = method(props)
//     const isRequired = curr[3]
//     if (isRequired) {
//       required = [...required, value.toString()]
//     }

//     return { ...prev, [key]: value }
//   }, {})
// }

// export const characterConfigUpdater = (
//   accumulator: Character,
//   configItem: CharacterConfigTuple,
//   required: Array<string>,
//   excluded: Array<string>
// ) => {
//   const key = configItem[0]
//   const method = configItem[1]
//   const list = configItem[2]

//   const props: filterTaggedList2Props = { required, list, excluded, accumulator }
//   const value: string | number = method(props)
//   return { [key]: value }

// }