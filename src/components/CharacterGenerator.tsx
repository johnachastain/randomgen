import { useState } from 'react';
import { getItem, getLongName } from '../functions/functions';
import { Character } from '../model/Character';
// import { Character } from '../model/Character';

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
  'male',
  'female',
  'neutral'
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
  'Bishop',
  'Abbot',
  'Curate'
]

const mTitle = [
  'Lord',
  'King',
  'Prince',
  'Duke',
  'Marquis',
  'Earl/Count',
  'Baron',
  'Brother'
]

const fTitle = [
  'Lady',
  'Queen',
  'Princess',
  'Duchess',
  'Marchioness',
  'Countess',
  'Baroness',
  'Sister'
]

export type Title = {
  male: string[],
  female: string[],
  neutral: string[]
}

const title: Title = {
  male: [ ...bTitle, ...mTitle ],
  female: [ ...bTitle, ...fTitle ],
  neutral: bTitle
}



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

export type Config = {
  name: Function
  age: String[]
  socialStatus: String[]
  wealth: String[]
  gender: String[]
  title: {
    male: String[], 
    female: String[]
  }
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

    }  else if (Array.isArray(functionOrArray)) {
      result = getItem(functionOrArray)

    } else {
      const gender = baseCharacter.gender
      const array = functionOrArray[gender as keyof typeof functionOrArray]
      result = getItem(array)

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