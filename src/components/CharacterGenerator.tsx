import { useState } from 'react';
import { getItem, getRandom } from '../functions/functions';
import { Character, Gender, SocialClass, Alignment } from '../model/Character';
import { d_name_male, d_name_female, d_silly, d_nasty } from '../lists/deity_lists';

export enum Generic { 
  All = 'all' 
}

export type Updater<T> = { (obj: T): T }

// tuple weighted tables
export type TableItem = [number, Function]

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
export type TaggedItem = { 
  name: string, 
  tags: string[] 
}
export const getTaggedItem = (arr: TaggedItem[]): string => 
  (arr[getRandom(arr.length)]?.name)

export const containsAll = (required: string[], target: string[]) => (
  required.every((s: string) => target.includes(s))
);

const filterTaggedList = (required: string[], list: TaggedItem[]) => {
  const array = list.filter(
    ({tags}) => containsAll(required, tags))
  return getTaggedItem(array)
}


// taggedTuples
export type TaggedTuple = [ string, string[] ] 
export const getTaggedTuple = (arr: TaggedTuple[]): string => 
  (arr[getRandom(arr.length)]?.[0])

const filterTaggedTupleList = (required: string[], list: TaggedTuple[]) => {
  const array = list.filter(
    ([_, tags]) => containsAll(required, tags))
  return getTaggedTuple(array)
}

// Records (keyed object of arrays)
const getFromRecord= (list: Record<string, string[]>, set: string): string => 
  (getItem(list[set as keyof typeof list]))


// Populate Objects using a config of updaters
const getConfig = (configArray: Function[]) => {
  let result = {}
  for (const updater of configArray) {
    result = updater(result)
  }
  return result
}

const { All } = Generic
const { Male, Female, Neutral } = Gender
const gender = [ Male, Female, Neutral ]

const { 
  Servant, 
  Labor, 
  Merchant, 
  Artisan, 
  Elite, 
  Military, 
  Ecclesiastical, 
  Royal, 
  Criminal, 
  Administration 
} = SocialClass

// const socialClass = [
//   Servant,
//   Labor,
//   Merchant,
//   Artisan,
//   Elite,
//   Military,
//   Ecclesiastical,
//   Royal, 
//   Criminal, 
//   Administration
// ]

const socialClass = [ ...Object.values(SocialClass) ]

// const { Good, Evil } = Alignment
const alignment = [ ...Object.values(Alignment) ]

const age = [
  'Child',
  'Adolescent',
  'Young adult',
  'Middle-aged',
  'Aged',
  'Elderly',
  'Ancient'
]

// const socialStatus =[
//   'Royal',
//   'Noble',
//   'Guildsman',
//   'Gentry'
// ]

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
const occupationTuple = [
  [ 'Gravedigger', [ Labor, All ] ],
  [ 'Plague Doctor', [ Artisan, All ] ],
  [ 'Inquisitor', [ Ecclesiastical, All ] ],
  [ 'Hangman', [ Labor, All ] ],
  [ 'Smuggler', [ Criminal, All ] ],
  [ 'Tax collector', [ Administration, All ] ],
  [ 'Scrivener', [ Administration, All ] ],
  [ 'Scribe', [ Ecclesiastical, All ] ],
  [ 'Barrelmaker', [ Artisan, All ] ],
  [ 'Cheesemaker', [ Artisan, All ] ],
  [ 'Fishmonger', [ Merchant, All ] ],
  [ 'Butcher', [ Merchant, All ] ],
  [ 'Apothecary', [ Merchant, All ] ],
  [ 'Mason', [ Artisan, All ] ],
  [ 'Carpenter', [ Artisan, All ] ],
  [ 'Weaver', [ Artisan, All ] ],
  [ 'Farmer', [ Labor, All ] ],
  [ 'Fisherman', [ Labor, All ] ],
  [ 'Armorer', [ Artisan, All ] ],
  [ 'Baker', [ Artisan, All ] ],
  [ 'Barrister', [ Administration, All ] ],
  [ 'Basketweaver', [ Artisan, All ] ],
  [ 'Barber', [ Labor, All ] ],
  [ 'Beekeeper', [ Labor, All ] ],
  [ 'Blacksmith', [ Artisan, All ] ],
  [ 'Bookbinder', [ Artisan, All ] ],
  [ 'Bowyer', [ Artisan, All ] ],
  [ 'Brewer', [ Artisan, All ] ],
  [ 'Dyer', [ Artisan, All ] ],
  [ 'Embroiderer', [ Artisan, All ] ],
  [ 'Engraver', [ Artisan, All ] ],
  [ 'Fletcher', [ Artisan, All ] ],
  [ 'Lamplighter', [ Labor, All ] ],
  [ 'Laundress', [ Labor, All ] ],
  [ 'Leatherworker', [ Artisan, All ] ],
  [ 'Locksmith', [ Artisan, All ] ],
  [ 'Midwife', [ Female, Labor, All ] ],
  [ 'Miller', [ Labor, All ] ],
  [ 'Moneychanger', [ Administration, All ] ],
  [ 'Needleworker', [ Labor, All ] ],
  [ 'Candlemaker', [ Artisan, All ] ],
  [ 'Cartwright', [ Artisan, All ] ],
  [ 'Chimney sweep', [ Labor, All ] ],
  [ 'Clerk', [ Administration, All ] ],
  [ 'Clothier', [ Merchant, All ] ],
  [ 'Cobbler', [ Artisan, All ] ],
  [ 'Cooper', [ Artisan, All ] ],
  [ 'Coppersmith', [ Artisan, All ] ],
  [ 'Crier', [ Labor, All ] ],
  [ 'Glassblower', [ Artisan, All ] ],
  [ 'Goldsmith', [ Artisan, All ] ],
  [ 'Haberdasher', [ Merchant, All ] ],
  [ 'Herbalist', [ Merchant, All ] ],
  [ 'Innkeeper', [ Labor, All ] ],
  [ 'Jailer', [ Administration, All ] ],
  [ 'Jester', [ Labor, All ] ],
  [ 'Jeweler', [ Artisan, All ] ],
  [ 'Lacemaker', [ Artisan, All ] ],
  [ 'Limner', [ Artisan, All ] ],
  [ 'Perfumemaker', [ Artisan, All ] ],
  [ 'Porter', [ Labor, All ] ],
  [ 'Potter', [ Artisan, All ] ],
  [ 'Ropemaker', [ Artisan, All ] ],
  [ 'Sailor', [ Labor, All ] ],
  [ 'Seamstress', [ Labor, All ] ],
  [ 'Shipwright', [ Labor, All ] ],
  [ 'Shoemaker', [ Artisan, All ] ],
  [ 'Silversmith', [ Artisan, All ] ],
  [ 'Soapmaker', [ Artisan, All ] ],
  [ 'Stonecarver', [ Artisan, All ] ],
  [ 'Storyteller', [ Labor, All ] ],
  [ 'Tailor', [ Artisan, All ] ],
  [ 'Tanner', [ Labor, All ] ],
  [ 'Tavernkeeper', [ Labor, All ] ],
  [ 'Taxidermist', [ Artisan, All ] ],
  [ 'Thatcher', [ Labor, All ] ],
  [ 'Rat catcher', [ Labor, All ] ],
  [ 'Vintner', [ Labor, All ] ],
  [ 'Wainwright', [ Artisan, All ] ],
  [ 'Weaponsmith', [ Artisan, All ] ],
  [ 'Wheelwright', [ Artisan, All ] ],
  [ 'Woodcarver', [ Artisan, All ] ], 
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
		tags: [ Criminal, All ] },
  { name: 'Tax collector', 
		tags: [ Administration, All ] },
  { name: 'Scrivener', 
		tags: [ Administration, All ] },
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
    tags: [ Artisan, All ] },
  { name: 'Baker', 
    tags: [ Artisan, All ] },
  { name: 'Barrister', 
    tags: [ Administration, All ] },
  { name: 'Basketweaver', 
    tags: [ Artisan, All ] },
  { name: 'Barber', 
    tags: [ Labor, All ] },
  { name: 'Beekeeper', 
    tags: [ Labor, All ] },
  { name: 'Blacksmith', 
    tags: [ Artisan, All ] },
  { name: 'Bookbinder', 
    tags: [ Artisan, All ] },
  { name: 'Bowyer', 
    tags: [ Artisan, All ] },
  { name: 'Brewer', 
    tags: [ Artisan, All ] },
  { name: 'Dyer', 
    tags: [ Artisan, All ] },
  { name: 'Embroiderer', 
    tags: [ Artisan, All ] },
  { name: 'Engraver', 
    tags: [ Artisan, All ] },
  { name: 'Fletcher', 
    tags: [ Artisan, All ] },
  { name: 'Lamplighter', 
    tags: [ Labor, All ] },
  { name: 'Laundress', 
    tags: [ Labor, All ] },
  { name: 'Leatherworker', 
    tags: [ Artisan, All ] },
  { name: 'Locksmith', 
    tags: [ Artisan, All ] },
  { name: 'Midwife', 
    tags: [ Female, Labor, All ] },
  { name: 'Miller', 
    tags: [ Labor, All ] },
  { name: 'Moneychanger', 
    tags: [ Administration, All ] },
  { name: 'Needleworker', 
    tags: [ Labor, All ] },
  { name: 'Candlemaker', 
    tags: [ Artisan, All ] },
  { name: 'Cartwright', 
    tags: [ Artisan, All ] },
  { name: 'Chimney sweep', 
    tags: [ Labor, All ] },
  { name: 'Clerk', 
    tags: [ Administration, All ] },
  { name: 'Clothier', 
    tags: [ Merchant, All ] },
  { name: 'Cobbler', 
    tags: [ Artisan, All ] },
  { name: 'Cooper', 
    tags: [ Artisan, All ] },
  { name: 'Coppersmith', 
    tags: [ Artisan, All ] },
  { name: 'Crier', 
    tags: [ Labor, All ] },
  { name: 'Glassblower', 
    tags: [ Artisan, All ] },
  { name: 'Goldsmith', 
    tags: [ Artisan, All ] },
  { name: 'Haberdasher', 
    tags: [ Merchant, All ] },
  { name: 'Herbalist', 
    tags: [ Merchant, All ] },
  { name: 'Innkeeper', 
    tags: [ Labor, All ] },
  { name: 'Jailer', 
    tags: [ Administration, All ] },
  { name: 'Jester', 
    tags: [ Labor, All ] },
  { name: 'Jeweler', 
    tags: [ Artisan, All ] },
  { name: 'Lacemaker', 
    tags: [ Artisan, All ] },
  { name: 'Limner', 
    tags: [ Artisan, All ] },
  { name: 'Perfumemaker', 
    tags: [ Artisan, All ] },
  { name: 'Porter', 
    tags: [ Labor, All ] },
  { name: 'Potter', 
    tags: [ Artisan, All ] },
  { name: 'Ropemaker', 
    tags: [ Artisan, All ] },
  { name: 'Sailor', 
    tags: [ Labor, All ] },
  { name: 'Seamstress', 
    tags: [ Labor, All ] },
  { name: 'Shipwright', 
    tags: [ Labor, All ] },
  { name: 'Shoemaker', 
    tags: [ Artisan, All ] },
  { name: 'Silversmith', 
    tags: [ Artisan, All ] },
  { name: 'Soapmaker', 
    tags: [ Artisan, All ] },
  { name: 'Stonecarver', 
    tags: [ Artisan, All ] },
  { name: 'Storyteller', 
    tags: [ Labor, All ] },
  { name: 'Tailor', 
    tags: [ Artisan, All ] },
  { name: 'Tanner', 
    tags: [ Labor, All ] },
  { name: 'Tavernkeeper', 
    tags: [ Labor, All ] },
  { name: 'Taxidermist', 
    tags: [ Artisan, All ] },
  { name: 'Thatcher', 
    tags: [ Labor, All ] },
  { name: 'Rat catcher', 
    tags: [ Labor, All ] },
  { name: 'Vintner', 
    tags: [ Labor, All ] },
  { name: 'Wainwright', 
    tags: [ Artisan, All ] },
  { name: 'Weaponsmith', 
    tags: [ Artisan, All ] },
  { name: 'Wheelwright', 
    tags: [ Artisan, All ] },
  { name: 'Woodcarver', 
    tags: [ Artisan, All ] }, 
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

// const profession = [
//   'Criminal',
//   'Poor',
//   'Merchant',
//   'Artisan',
//   'Elite',
//   'Military',
//   'Ecclesiastical'
// ]

// type Names = {
//   male: string[]
//   female: string[]
//   neutral: string[]
// }
 const names = {
  male: [ ...d_name_male ],
  female: [...d_name_female ],
  neutral: [...d_name_male, ...d_name_female ]
}

const getName = (gender: Gender): string => {
  const firstName = getFromRecord(names, gender)
  // const firstName = getItem(names[gender as keyof Names])
  // const firstName  = gender === Male ? getItem(d_name_male) : getItem(d_name_female)
  const lastName = `${getItem(d_silly)}${getItem(d_nasty)}`
  return `${firstName} ${lastName}`
}

const characterConfig: Updater<Character>[] = [
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
    const result = filterTaggedList([socialClass], occupation)
    return { ...obj, occupation: result }
  },

  (obj) => ({ ...obj, demeanor: getItem(demeanor) })
  // (obj) => ({ ...obj, socialStatus: getItem(socialStatus) }),
  // (obj) => ({ ...obj, profession: getItem(profession) }),

]

const getNameVariant1 = (tags: string[]) => 'one'
const getNameVariant2 = (tags: string[]) => 'two'
const getNameVariant3 = (tags: string[]) => 'three'

const tableConfig: TableItem[] = [
  [1, (tags: string[]) => getNameVariant1(tags)],
  [2, (tags: string[]) => getNameVariant2(tags)],
  [3, (tags: string[]) => getNameVariant3(tags)]
]




export const CharacterGenerator = () => {
  const [character, setCharacter] =useState<Character>(getConfig(characterConfig))
  // console.log('character1', getConfig(characterConfig))
  console.log(makeTable(tableConfig, []))
  console.log(getTableItem(tableConfig, []))

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