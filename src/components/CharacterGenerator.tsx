import { useState } from 'react';
import { getItem, getLongName } from '../functions/functions';
import { Character, Gender } from '../model/Character';




const containsAll = (required: string[], target: string[]) => (
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

// const gender = [
//   'male',
//   'female',
//   'neutral'
// ]

const gender = [
  Gender.Male,
  Gender.Female,
  Gender.Neutral
]

const title = [
  {name: 'Master', tags: [ Gender.Neutral, 'Artisan' ]},
  {name: 'Apprentice', tags: [ Gender.Neutral, 'Artisan' ]},
  {name: 'Chamberlain', tags: [ Gender.Neutral, 'Royal' ]},
  {name: 'Sheriff', tags: [ Gender.Neutral, 'Royal' ]},
  {name: 'Alderman', tags: [ Gender.Neutral, 'Royal' ]},
  {name: 'Lord Mayor', tags: [ Gender.Neutral, 'Royal' ]},
  {name: 'Burgomaster', tags: [ Gender.Neutral, 'Royal' ]},
  {name: 'Chancellor', tags: [ Gender.Neutral, 'Royal' ]},
  {name: 'Governor', tags: [ Gender.Neutral, 'Royal' ]},
  {name: 'Minister', tags: [ Gender.Neutral, 'Royal' ]},
  {name: 'Magistrate', tags: [ Gender.Neutral, 'Royal' ]},
  {name: 'Bishop', tags: [ Gender.Neutral, 'Ecclesiastical' ]},
  {name: 'Curate', tags: [ Gender.Neutral, 'Ecclesiastical' ]},
  {name: 'Vicar', tags: [ Gender.Male, 'Ecclesiastical' ]},
  {name: 'Brother', tags: [ Gender.Male, 'Ecclesiastical' ]},
  {name: 'Abbot', tags: [ Gender.Male, 'Ecclesiastical' ]},
  {name: 'Prior', tags: [ Gender.Male, 'Ecclesiastical' ]},
  {name: 'Friar', tags: [ Gender.Male, 'Ecclesiastical' ]},
  {name: 'Lord', tags: [ Gender.Male, 'Royal' ]},
  {name: 'King', tags: [ Gender.Male, 'Royal' ]},
  {name: 'Prince', tags: [ Gender.Male, 'Royal' ]},
  {name: 'Duke', tags: [ Gender.Male, 'Royal' ]},
  {name: 'Marquis', tags: [ Gender.Male, 'Royal' ]},
  {name: 'Earl/Count', tags: [ Gender.Male, 'Royal' ]},
  {name: 'Baron', tags: [ Gender.Male, 'Royal' ]},
  {name: 'Lady', tags: [ Gender.Female, 'Royal' ]},
  {name: 'Queen', tags: [ Gender.Female, 'Royal' ]},
  {name: 'Princess', tags: [ Gender.Female, 'Royal' ]},
  {name: 'Duchess', tags: [ Gender.Female, 'Royal' ]},
  {name: 'Marchioness', tags: [ Gender.Female, 'Royal' ]},
  {name: 'Countess', tags: [ Gender.Female, 'Royal' ]},
  {name: 'Baroness', tags: [ Gender.Female, 'Royal' ]},
  {name: 'Sister', tags: [ Gender.Female, 'Ecclesiastical' ]},
  {name: 'Abbess', tags: [ Gender.Female, 'Ecclesiastical' ]},
  {name: 'Prioress', tags: [ Gender.Female, 'Ecclesiastical' ]},
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

const bReligiousTitle = [
  'Bishop',
  'Curate',
  'Vicar'
]

const mReligiousTitle = [
  'Brother',
  'Abbot',
  'Prior',
  'Friar'
]

const mRoyalTitle = [
  'Lord',
  'King',
  'Prince',
  'Duke',
  'Marquis',
  'Earl/Count',
  'Baron',
]

const fRoyalTitle = [
  'Lady',
  'Queen',
  'Princess',
  'Duchess',
  'Marchioness',
  'Countess',
  'Baroness',
]

const fReligiousTitle = [
  'Sister',
  'Abbess',
  'Prioress'
]

export type Title = {
  male: string[],
  female: string[],
  neutral: string[]
}

// const title: Title = {
//   male: [ ...bTitle, ...mRoyalTitle ],
//   female: [ ...bTitle, ...fRoyalTitle ],
//   neutral: bTitle
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

export type TaggedItem = { 
  name: string, 
  tags: String[] 
}

export type Config = {
  name: Function
  age: String[]
  socialStatus: String[]
  wealth: String[]
  gender: String[]
  // title: {
  //   male: String[], 
  //   female: String[]
  // }
  title: TaggedItem[]
  profession: String[]
  demeanor: String[]
}

const config: Config = {
  name: getLongName,
  gender,
  age,
  socialStatus,
  wealth,
  title,
  profession,
  demeanor
}

const getCharacter = () => {
  let baseCharacter: Character = {}

  for (const prop in config) {
    const functionOrArray = config[ prop as keyof Config ]
    let result
    if (functionOrArray instanceof Function) {
      result = functionOrArray()

    } else if ('tags' in functionOrArray) {
      const gender = baseCharacter.gender || Gender.Neutral
      const array = functionOrArray.filter(({ tags }) => tags ? containsAll([gender], tags) : false)
      result = getItem(array)

    } else if (Array.isArray(functionOrArray)) {
      result = getItem(functionOrArray)

    } 
    baseCharacter[prop as keyof Character] = result
  }
  return baseCharacter
}

export const CharacterGenerator = () => {
  const [character, setCharacter] =useState<Character>(getCharacter())

  return (
    <div>
      <h3>Character Generator</h3>
      { Object.keys(character).map(key => (
          <p key={key}>{`${key}: ${character[key as keyof Character]}`}</p>
        ))
      }
    </div>
  )
}