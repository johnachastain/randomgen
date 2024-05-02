import { useState } from 'react';
import { getItem, getLongName, getRandom } from '../functions/functions';
import { Character, Gender, SocialClass } from '../model/Character';

export enum Generic { 
  All = 'all' 
}

export type TaggedItem = { 
  name: string, 
  tags: String[] 
}

export type Updater<T> = { (obj: T): T }

export const getTaggedItem = (arr: TaggedItem[]): string => 
  (arr[getRandom(arr.length)]?.name)

export const containsAll = (required: string[], target: string[]) => (
  required.every((s: string) => target.includes(s))
);

const { All } = Generic
const { Male, Female, Neutral } = Gender
const gender = [ Male, Female, Neutral ]

const { Servant, Labor, Merchant, Artisan, Elite, Military, Ecclesiastical, Royal } = SocialClass
const socialClass = [
  Servant,
  Labor,
  Merchant,
  Artisan,
  Elite,
  Military,
  Ecclesiastical,
  Royal
]


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
  'in debt',
  'Destitute',
  'Impoverished',
  'Working class',
  'Middle class',
  'Prosperous',
  'Decadent'
]



const title = [
  { name: 'Master', 
		tags: [ Neutral, Artisan, All ] },
  { name: 'Apprentice', 
		tags: [ Neutral, Artisan, All ] },
  { name: 'Chamberlain', 
		tags: [ Neutral, Royal, All ] },
  { name: 'Sheriff', 
		tags: [ Neutral, Royal, All ] },
  { name: 'Alderman', 
		tags: [ Neutral, Royal, All ] },
  { name: 'Lord Mayor', 
		tags: [ Neutral, Royal, All ] },
  { name: 'Burgomaster', 
		tags: [ Neutral, Royal, All ] },
  { name: 'Chancellor', 
		tags: [ Neutral, Royal, All ] },
  { name: 'Governor', 
		tags: [ Neutral, Royal, All ] },
  { name: 'Minister', 
		tags: [ Neutral, Royal, All ] },
  { name: 'Magistrate', 
		tags: [ Neutral, Royal, All ] },
  { name: 'Bishop', 
		tags: [ Neutral, Ecclesiastical, All ] },
  { name: 'Curate', 
		tags: [ Neutral, Ecclesiastical, All ] },
  { name: 'Vicar', 
		tags: [ Male, Ecclesiastical, All ] },
  { name: 'Brother', 
		tags: [ Male, Ecclesiastical, All ] },
  { name: 'Abbot', 
		tags: [ Male, Ecclesiastical, All ] },
  { name: 'Prior', 
		tags: [ Male, Ecclesiastical, All ] },
  { name: 'Friar', 
		tags: [ Male, Ecclesiastical, All ] },
  { name: 'Lord', 
		tags: [ Male, Royal, All ] },
  { name: 'King', 
		tags: [ Male, Royal, All ] },
  { name: 'Prince', 
		tags: [ Male, Royal, All ] },
  { name: 'Duke', 
		tags: [ Male, Royal, All ] },
  { name: 'Marquis', 
		tags: [ Male, Royal, All ] },
  { name: 'Earl/Count', 
		tags: [ Male, Royal, All ] },
  { name: 'Baron', 
		tags: [ Male, Royal, All ] },
  { name: 'Lady', 
		tags: [ Female, Royal, All ] },
  { name: 'Queen', 
		tags: [ Female, Royal, All ] },
  { name: 'Princess', 
		tags: [ Female, Royal, All ] },
  { name: 'Duchess', 
		tags: [ Female, Royal, All ] },
  { name: 'Marchioness', 
		tags: [ Female, Royal, All ] },
  { name: 'Countess', 
		tags: [ Female, Royal, All ] },
  { name: 'Baroness', 
		tags: [ Female, Royal, All ] },
  { name: 'Sister', 
		tags: [ Female, Ecclesiastical, All ] },
  { name: 'Abbess', 
		tags: [ Female, Ecclesiastical, All ] },
  { name: 'Prioress', 
		tags: [ Female, Ecclesiastical, All ] },
]

const occupation = [
  { name: 'Gravedigger', 
		tags: [ Labor, All ] },
  { name: 'Plague Doctor', 
		tags: [ Artisan, All ] },
  { name: 'Inquisitor', 
		tags: [ Ecclesiastical, All ] },
  { name: 'Hangman', 
		tags: [ Labor, All ] },
  { name: 'Smuggler', 
		tags: [ Labor, All ] },
  { name: 'Tax collector', 
		tags: [ Labor, All ] },
  { name: 'Scrivener', 
		tags: [ Artisan, All ] },
  { name: 'Scribe', 
		tags: [ Ecclesiastical, All ] },
  { name: 'Barrelmaker', 
		tags: [ Artisan, All ] },
  { name: 'Cheesemaker', 
		tags: [ Artisan, All ] },
  { name: 'Fishmonger', 
		tags: [ Merchant, All ] },
  { name: 'Butcher', 
		tags: [ Merchant, All ] },
  { name: 'Apothecary', 
		tags: [ Merchant, All ] },
  { name: 'Mason', 
		tags: [ Artisan, All ] },
  { name: 'Carpenter', 
		tags: [ Artisan, All ] },
  { name: 'Weaver', 
		tags: [ Artisan, All ] },
  { name: 'Farmer', 
		tags: [ Labor, All ] },
  { name: 'Fisherman', 
		tags: [ Labor, All ] },
  { name: 'Armorer', 
    tags: [ Labor, All ] },
  { name: 'Baker', 
    tags: [ Labor, All ] },
  { name: 'Barrister', 
    tags: [ Labor, All ] },
  { name: 'Basketweaver', 
    tags: [ Labor, All ] },
  { name: 'Barber', 
    tags: [ Labor, All ] },
  { name: 'Beekeeper', 
    tags: [ Labor, All ] },
  { name: 'Blacksmith', 
    tags: [ Labor, All ] },
  { name: 'Bookbinder', 
    tags: [ Labor, All ] },
  { name: 'Bowyer', 
    tags: [ Labor, All ] },
  { name: 'Brewer', 
    tags: [ Labor, All ] },
  { name: 'Dyer', 
    tags: [ Labor, All ] },
  { name: 'Embroiderer', 
    tags: [ Labor, All ] },
  { name: 'Engraver', 
    tags: [ Labor, All ] },
  { name: 'Fletcher', 
    tags: [ Labor, All ] },
  { name: 'Lamplighter', 
    tags: [ Labor, All ] },
  { name: 'Laundress', 
    tags: [ Labor, All ] },
  { name: 'Leatherworker', 
    tags: [ Labor, All ] },
  { name: 'Locksmith', 
    tags: [ Labor, All ] },
  { name: 'Midwife', 
    tags: [ Labor, All ] },
  { name: 'Miller', 
    tags: [ Labor, All ] },
  { name: 'Moneychanger', 
    tags: [ Labor, All ] },
  { name: 'Needleworker', 
    tags: [ Labor, All ] },
  { name: 'Candlemaker', 
    tags: [ Labor, All ] },
  { name: 'Cartwright', 
    tags: [ Labor, All ] },
  { name: 'Chimney sweep', 
    tags: [ Labor, All ] },
  { name: 'Clerk', 
    tags: [ Labor, All ] },
  { name: 'Clothier', 
    tags: [ Labor, All ] },
  { name: 'Cobbler', 
    tags: [ Labor, All ] },
  { name: 'Cooper', 
    tags: [ Labor, All ] },
  { name: 'Coppersmith', 
    tags: [ Labor, All ] },
  { name: 'Crier', 
    tags: [ Labor, All ] },
  { name: 'Glassblower', 
    tags: [ Labor, All ] },
  { name: 'Goldsmith', 
    tags: [ Labor, All ] },
  { name: 'Haberdasher', 
    tags: [ Labor, All ] },
  { name: 'Herald', 
    tags: [ Labor, All ] },
  { name: 'Herbalist', 
    tags: [ Labor, All ] },
  { name: 'Innkeeper', 
    tags: [ Labor, All ] },
  { name: 'Jailer', 
    tags: [ Labor, All ] },
  { name: 'Jester', 
    tags: [ Labor, All ] },
  { name: 'Jeweler', 
    tags: [ Labor, All ] },
  { name: 'Lacemaker', 
    tags: [ Labor, All ] },
  { name: 'Limner', 
    tags: [ Labor, All ] },
  { name: 'Perfumemaker', 
    tags: [ Labor, All ] },
  { name: 'Porter', 
    tags: [ Labor, All ] },
  { name: 'Potter', 
    tags: [ Labor, All ] },
  { name: 'Ropemaker', 
    tags: [ Labor, All ] },
  { name: 'Sailor', 
    tags: [ Labor, All ] },
  { name: 'Seamstress', 
    tags: [ Labor, All ] },
  { name: 'Shipwright', 
    tags: [ Labor, All ] },
  { name: 'Shoemaker', 
    tags: [ Labor, All ] },
  { name: 'Silversmith', 
    tags: [ Labor, All ] },
  { name: 'Soapmaker', 
    tags: [ Labor, All ] },
  { name: 'Spy', 
    tags: [ Labor, All ] },
  { name: 'Stonecarver', 
    tags: [ Labor, All ] },
  { name: 'Storyteller', 
    tags: [ Labor, All ] },
  { name: 'Tailor', 
    tags: [ Labor, All ] },
  { name: 'Tanner', 
    tags: [ Labor, All ] },
  { name: 'Tavernkeeper', 
    tags: [ Labor, All ] },
  { name: 'Taxidermist', 
    tags: [ Labor, All ] },
  { name: 'Thatcher', 
    tags: [ Labor, All ] },
  { name: 'Rat catcher', 
    tags: [ Labor, All ] },
  { name: 'Vintner', 
    tags: [ Labor, All ] },
  { name: 'Wainwright', 
    tags: [ Labor, All ] },
  { name: 'Weaponsmith', 
    tags: [ Labor, All ] },
  { name: 'Wheelwright', 
    tags: [ Labor, All ] },
  { name: 'Woodcarver', 
    tags: [ Labor, All ] }, 
]

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
//     const gender = character.gender || Neutral
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
  (obj) => ({ ...obj, socialClass: getItem(socialClass) }),
  (obj) => ({ ...obj, wealth: getItem(wealth) }),

  (obj) => {
    const { gender = Neutral } = obj
    const { socialClass = Labor } = obj
    const array: TaggedItem[] = title.filter(
      (i) => containsAll([gender, socialClass], i.tags))
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