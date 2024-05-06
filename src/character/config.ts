import { Character } from '../character/Character';
import { Updater } from '../shared/types';
import { Labor, Neutral, age, demeanor, gender, occupationTuple, socialClass, title, wealth } from '../character/lists';
import { getItem } from '../shared/functions';
import { filterTaggedList, filterTaggedTupleList, } from './functions';
import { getName } from './names';

export const characterConfig: Updater<Character>[] = [
  (obj) => ({ ...obj, gender: getItem(gender) }),

  (obj) => {
    const { gender = Neutral } = obj
    const name = getName(gender)
    return { ...obj, name }
  },

  (obj) => ({ ...obj, age: getItem(age) }),
  (obj) => ({ ...obj, socialClass: getItem(socialClass) }),
  (obj) => ({ ...obj, wealth: getItem(wealth) }),

  (obj) => {
    const { gender = Neutral, socialClass = Labor } = obj
    const result = filterTaggedList([gender, socialClass], title)
    return { ...obj, title: result }
  },

  (obj) => {
    const { socialClass = Labor } = obj
    const result = filterTaggedTupleList([socialClass], occupationTuple)
    return { ...obj, occupation: result }
  },

  (obj) => ({ ...obj, demeanor: getItem(demeanor) })

]