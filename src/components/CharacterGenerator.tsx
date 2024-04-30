import { useState } from 'react';
import { getLongName } from '../functions/functions';
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
  'Male',
  'Female',
  'Neutral'
]

const title = [
  'Lord',
  'Lady',
  'Master',
  'Apprentice',
  'King/Queen',
  'Prince/Princess',
  'Duke/Duchess',
  'Marquis/Marchioness',
  'Earl/Count/Countess',
  'Baron/Baroness',
  'Chamberlain',
  'Sheriff',
  'Alderman',
  'Lord Mayor',
  'Burgomaster',
  'Chancelor',
  'Governor',
  'Minister',
  'Magistrate',
  'Bishop',
  'Abbot',
  'Brother',
  'Sister',
  'Curate'
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

const CharacterDefinition = {
  name: getLongName,
  age,
  socialStatus,
  wealth,
  gender,
  title,
  profession,
  demeanor
}


export const CharacterGenerator = () => {
  const [character, setCharacter] =useState()

  return (
    <div>
      <h3>Character Generator</h3>
    </div>
  )
}