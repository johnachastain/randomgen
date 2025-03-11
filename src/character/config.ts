import { Character } from '../character/Character';
import { Updater } from '../shared/types';
import { Labor, Neutral, ageTuple, demeanorTuple, gender, occupationTuple, socialClass, titleTuple, wealthTuple } from '../character/lists';
import { getItem } from '../shared/functions';
import { filterTaggedList } from './functions';
import { getName } from './names';

export const characterConfig: Updater<Character>[] = [
  (obj) => ({ ...obj, gender: getItem(gender) }),

  (obj) => {
    const { gender = Neutral } = obj
    const name = getName(gender, [])
    return { ...obj, name }
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

  (obj) => ({ ...obj, demeanor: filterTaggedList([], demeanorTuple) })

]