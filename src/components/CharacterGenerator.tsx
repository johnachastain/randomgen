import { useState } from 'react';
import { getItem, getLongName, getRandom } from '../functions/functions';
import { Character, Gender } from '../model/Character';

export type TaggedItem = { 
  name: string, 
  tags: String[] 
}

export type Updater<T> = { (obj: T): T }

export const getTaggedItem = (arr: TaggedItem[]): string => 
  (arr[getRandom(arr.length)].name)

export const containsAll = (required: string[], target: string[]) => (
  required.every((s: string) => target.includes(s))
);

const age = [
  'Child',
  'Adolescent',
  'Young adult',
  'Middle-aged',
  'Aged',
  'Elderly',
  'Ancient'
]

const socialStatus =[
  'Royal',
  'Noble',
  'Guildsman',
  'Gentry'
]

const wealth = [
  'Destitute',
  'Impoverished',
  'Working class',
  'Middle class',
  'Prosperous',
  'Decadent'
]

const gender = [
  Gender.Male,
  Gender.Female,
  Gender.Neutral
]

const title = [
  {name: 'Master', tags: [ Gender.Neutral, 'Artisan', 'All' ]},
  {name: 'Apprentice', tags: [ Gender.Neutral, 'Artisan', 'All' ]},
  {name: 'Chamberlain', tags: [ Gender.Neutral, 'Royal', 'All' ]},
  {name: 'Sheriff', tags: [ Gender.Neutral, 'Royal', 'All' ]},
  {name: 'Alderman', tags: [ Gender.Neutral, 'Royal', 'All' ]},
  {name: 'Lord Mayor', tags: [ Gender.Neutral, 'Royal', 'All' ]},
  {name: 'Burgomaster', tags: [ Gender.Neutral, 'Royal', 'All' ]},
  {name: 'Chancellor', tags: [ Gender.Neutral, 'Royal', 'All' ]},
  {name: 'Governor', tags: [ Gender.Neutral, 'Royal', 'All' ]},
  {name: 'Minister', tags: [ Gender.Neutral, 'Royal', 'All' ]},
  {name: 'Magistrate', tags: [ Gender.Neutral, 'Royal', 'All' ]},
  {name: 'Bishop', tags: [ Gender.Neutral, 'Ecclesiastical', 'All' ]},
  {name: 'Curate', tags: [ Gender.Neutral, 'Ecclesiastical', 'All' ]},
  {name: 'Vicar', tags: [ Gender.Male, 'Ecclesiastical', 'All' ]},
  {name: 'Brother', tags: [ Gender.Male, 'Ecclesiastical', 'All' ]},
  {name: 'Abbot', tags: [ Gender.Male, 'Ecclesiastical', 'All' ]},
  {name: 'Prior', tags: [ Gender.Male, 'Ecclesiastical', 'All' ]},
  {name: 'Friar', tags: [ Gender.Male, 'Ecclesiastical', 'All' ]},
  {name: 'Lord', tags: [ Gender.Male, 'Royal', 'All' ]},
  {name: 'King', tags: [ Gender.Male, 'Royal', 'All' ]},
  {name: 'Prince', tags: [ Gender.Male, 'Royal', 'All' ]},
  {name: 'Duke', tags: [ Gender.Male, 'Royal', 'All' ]},
  {name: 'Marquis', tags: [ Gender.Male, 'Royal', 'All' ]},
  {name: 'Earl/Count', tags: [ Gender.Male, 'Royal', 'All' ]},
  {name: 'Baron', tags: [ Gender.Male, 'Royal', 'All' ]},
  {name: 'Lady', tags: [ Gender.Female, 'Royal', 'All' ]},
  {name: 'Queen', tags: [ Gender.Female, 'Royal', 'All' ]},
  {name: 'Princess', tags: [ Gender.Female, 'Royal', 'All' ]},
  {name: 'Duchess', tags: [ Gender.Female, 'Royal', 'All' ]},
  {name: 'Marchioness', tags: [ Gender.Female, 'Royal', 'All' ]},
  {name: 'Countess', tags: [ Gender.Female, 'Royal', 'All' ]},
  {name: 'Baroness', tags: [ Gender.Female, 'Royal', 'All' ]},
  {name: 'Sister', tags: [ Gender.Female, 'Ecclesiastical', 'All' ]},
  {name: 'Abbess', tags: [ Gender.Female, 'Ecclesiastical', 'All' ]},
  {name: 'Prioress', tags: [ Gender.Female, 'Ecclesiastical', 'All' ]},
]

const bTitle = [
  'Master',
  'Apprentice',
  'Chamberlain',
  'Sheriff',
  'Alderman',
  'Lord Mayor',
  'Burgomaster',
  'Chancellor',
  'Governor',
  'Minister',
  'Magistrate',
]

// export type Title = {
//   male: string[],
//   female: string[],
//   neutral: string[]
// }

const demeanor = [
  'Abrasive',
  'Arrogant',
  'Calm',
  'Confident',
  'Courteous',
  'Eccentric',
  'Flamboyant',
  'Friendly',
  'Humble',
  'Naive',
  'Nervous',
  'Reserved',
  'Stubborn',
  'Suspicious',
  'Impatient',
  'Absent-minded',
  'Judgemental',
  'Cantankerous',
  'Curmudgeonly',
  'Clumsy',
  'Fidgety',
  'Glib',
  'Ornery',
  'Pompous',
  'Fretful',
  'Silent',
  'Jovial',
  'Snooty',
  'Lazy',
  'Bitter',
  'Vindictive',
  'Conflicted',
  'Sullen'
]

const profession = [
  'Criminal',
  'Poor',
  'Merchant',
  'Artisan',
  'Elite',
  'Military',
  'Ecclesiastical'
]



// export type UpdateCharacter = (character: Character) => Character

// export type Config = {
//   name: UpdateCharacter
//   age: UpdateCharacter
//   socialStatus: UpdateCharacter
//   wealth: UpdateCharacter
//   gender: UpdateCharacter
//   title: UpdateCharacter
//   profession: UpdateCharacter
//   demeanor: UpdateCharacter
// }

// const config: Config = {
//   name: (character) => ({ ...character, name: getLongName() }),
//   gender: (character) => ({ ...character, gender: getItem(gender) }),
//   age: (character) => ({ ...character, age: getItem(age) }),
//   socialStatus: (character) => ({ ...character, socialStatus: getItem(socialStatus) }),
//   wealth: (character) => ({ ...character, wealth: getItem(wealth) }),
//   title: (character) => {
//     const gender = character.gender || Gender.Neutral
//     const array = title.filter((i) => containsAll([gender], i.tags))
//     const r = getRandom(array.length)
//     return { ...character, title: array[r].name }
//   },
//   profession: (character) => ({ ...character, profession: getItem(profession) }),
//   demeanor: (character) => ({ ...character, demeanor: getItem(demeanor) })
// }

// const getCharacter = () => {
//   let result: Character = {}
//   for (const prop in config) {
//     const updateCharacter = config[ prop as keyof Config ]
//     result = updateCharacter(result)
//   }
//   return result
// }

const configArray: Updater<Character>[] = [
  (obj) => ({ ...obj, name: getLongName() }),
  (obj) => ({ ...obj, gender: getItem(gender) }),
  (obj) => ({ ...obj, age: getItem(age) }),
  (obj) => ({ ...obj, socialStatus: getItem(socialStatus) }),
  (obj) => ({ ...obj, wealth: getItem(wealth) }),

  (obj) => {
    const { gender = Gender.Neutral } = obj
    const array: TaggedItem[] = title.filter(
      (i) => containsAll([gender], i.tags))
    return { ...obj, title: getTaggedItem(array) }
  },
  
  (obj) => ({ ...obj, profession: getItem(profession) }),
  (obj) => ({ ...obj, demeanor: getItem(demeanor) })
]

const getConfig = (configArray: Function[]) => {
  let result = {}
  for (const updater of configArray) {
    result = updater(result)
  }
  return result
}


export const CharacterGenerator = () => {
  const [character, setCharacter] =useState<Character>(getConfig(configArray))

  console.log('character', character)

  return (
    <div>
      {/* <h3>Character Generator</h3>
      { Object.keys(character).map(key => (
          <p key={key}>{`${key}: ${character[key as keyof Character]}`}</p>
        ))
      } */}
    </div>
  )
}