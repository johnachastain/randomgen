import { useState } from 'react';
import { getItem, getLongName, getRandom } from '../functions/functions';
import { Character, Gender, SocialClass, Alignment } from '../model/Character';
import { d_name_male, d_name_female, d_silly, d_nasty } from '../lists/deity_lists';


export enum Generic { 
  All = 'all' 
}

export type TaggedItem = { 
  name: string, 
  tags: string[] 
}

export type Updater<T> = { (obj: T): T }

export const getTaggedItem = (arr: TaggedItem[]): string => 
  (arr[getRandom(arr.length)]?.name)

export const containsAll = (required: string[], target: string[]) => (
  required.every((s: string) => target.includes(s))
);

const getFilteredList = (required: string[], list: TaggedItem[]) => {
  const array = list.filter(
    ({tags}) => containsAll(required, tags))
  return getTaggedItem(array)
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

const getName = (gender: Gender): string => {
  const firstName  = gender === Male ? getItem(d_name_male) : getItem(d_name_female)
  const lastName = `${getItem(d_silly)}${getItem(d_nasty)}`
  return `${firstName} ${lastName}`
}

const configArray: Updater<Character>[] = [
  
  (obj) => ({ ...obj, gender: getItem(gender) }),

  (obj) => {
    const { gender = Neutral } = obj
    const name = getName(gender)
    return { ...obj, name }
  },

  (obj) => ({ ...obj, age: getItem(age) }),
  // (obj) => ({ ...obj, socialStatus: getItem(socialStatus) }),
  (obj) => ({ ...obj, socialClass: getItem(socialClass) }),
  (obj) => ({ ...obj, wealth: getItem(wealth) }),

  (obj) => {
    const { gender = Neutral, socialClass = Labor } = obj
    const result = getFilteredList([gender, socialClass], title)
    return { ...obj, title: result }
  },

  (obj) => {
    const { socialClass = Labor } = obj
    const result = getFilteredList([socialClass], occupation)
    return { ...obj, occupation: result }
  },
  
  // (obj) => ({ ...obj, profession: getItem(profession) }),
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