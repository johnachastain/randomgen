import { Character, SocialClass } from '../character/Character';
import { Updater } from '../shared/types';
import { Labor, Neutral, ageTuple, alignment, demeanorTuple, flawTuple, gender, occupationTuple, socialClass, titleTuple, wealthTuple } from '../character/lists';
import { getItem } from '../shared/functions';
import { d6x3, filterTaggedList, getVariantItem } from './functions';
import { getAlliterativeName, getTagSetName, getTwoWordName, weightedVariants } from '../names/functions';
import { nameFirstTuple } from '../names/firstNames';

const alignmentUpdater: Updater<Character> = (obj) => ({ ...obj, alignment: getItem(alignment) })

const genderUpdater: Updater<Character> = (obj) => ({ ...obj, gender: getItem(gender) })

const firstNameUpdater: Updater<Character> = (obj) => {
  const { gender = Neutral } = obj
  const tags = gender === Neutral ? [] : [gender]
  return { ...obj, firstName: filterTaggedList(tags, nameFirstTuple) }
}

const lastNameUpdater: Updater<Character> = (obj) => {
  return { ...obj, lastName: getVariantItem(weightedVariants, []) }
}

const ageUpdater: Updater<Character> = (obj) => ({ ...obj, age: filterTaggedList([], ageTuple) })

const socialClassUpdater: Updater<Character> = (obj) => ({ ...obj, socialClass: filterTaggedList([], socialClass) as SocialClass })

const wealthUpdater: Updater<Character> = (obj) => ({ ...obj, wealth: filterTaggedList([], wealthTuple) })

const titleUpdater: Updater<Character> = (obj) => {
  const { gender = Neutral, socialClass = Labor } = obj
  const result = filterTaggedList([socialClass], titleTuple)
  return result ? { ...obj, title: result } : obj
}

const occupationUpdater: Updater<Character> = (obj) => {
  const { socialClass = Labor } = obj
  const result = filterTaggedList([socialClass], occupationTuple)

  return result ? { ...obj, occupation: result } : obj
}

const demeanorUpdater: Updater<Character> = (obj) => ({ ...obj, demeanor: filterTaggedList([], demeanorTuple) })

const flawUpdater: Updater<Character> = (obj) => ({ ...obj, flaw: filterTaggedList([], flawTuple) })

const strengthUpdater: Updater<Character> = (obj) => ({ ...obj, strength: d6x3() })
const intelligenceUpdater: Updater<Character> = (obj) => ({ ...obj, intelligence: d6x3() })
const wisdomUpdater: Updater<Character> = (obj) => ({ ...obj, wisdom: d6x3() })
const dexterityUpdater: Updater<Character> = (obj) => ({ ...obj, dexterity: d6x3() })
const constitutionUpdater: Updater<Character> = (obj) => ({ ...obj, constitution: d6x3() })
const charismaUpdater: Updater<Character> = (obj) => ({ ...obj, charisma: d6x3() })

// export type configTuple = Array<string | Updater<Character>>
export type configTuple = [string, Updater<Character>, boolean]

export const characterConfigTuple: Array<configTuple> = [
  ['alignment', alignmentUpdater, false],
  ['gender', genderUpdater, false],
  ['firstName', firstNameUpdater, false],
  ['lastName', lastNameUpdater, false],
  ['age', ageUpdater, false],
  ['socialClass', socialClassUpdater, false],
  ['wealth', wealthUpdater, false],
  ['title', titleUpdater, false],
  ['occupation', occupationUpdater, false],
  ['demeanor', demeanorUpdater, false],
  ['strength', strengthUpdater, false],
  ['intelligence', intelligenceUpdater, false],
  ['wisdom', wisdomUpdater, false],
  ['dexterity', dexterityUpdater, false],
  ['constitution', constitutionUpdater, false],
  ['charisma', charismaUpdater, false],
  ['flaw', flawUpdater, true]
]
