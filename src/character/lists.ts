import { Gender, SocialClass, Alignment } from './Character';
import { d_name_male, d_name_female } from '../lists/deity_lists';
import { Generic, TaggedTuple, WeightedTaggedTuple } from '../shared/types';

export const { All } = Generic
export const { Male, Female, Neutral } = Gender
export const gender = [...Object.values(Gender)]

export const {
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

export const socialClass = [...Object.values(SocialClass)]
export const alignment = [...Object.values(Alignment)]

export const age = [
  'Child',
  'Adolescent',
  'Young adult',
  'Middle-aged',
  'Aged',
  'Elderly',
  'Ancient'
]

export const wealth = [
  'in debt',
  'Destitute',
  'Impoverished',
  'Working class',
  'Middle class',
  'Prosperous',
  'Decadent'
]

export const titleTuple: WeightedTaggedTuple[] = [
  ['Master', [Neutral, Artisan, All], 1],
  ['Apprentice', [Neutral, Artisan, All], 1],
  ['Chamberlain', [Neutral, Royal, All], 1],
  ['Sheriff', [Neutral, Royal, All], 1],
  ['Alderman', [Neutral, Royal, All], 1],
  ['Lord Mayor', [Neutral, Royal, All], 1],
  ['Burgomaster', [Neutral, Royal, All], 1],
  ['Chancellor', [Neutral, Royal, All], 1],
  ['Governor', [Neutral, Royal, All], 1],
  ['Minister', [Neutral, Royal, All], 1],
  ['Magistrate', [Neutral, Royal, All], 1],
  ['Bishop', [Neutral, Ecclesiastical, All], 1],
  ['Curate', [Neutral, Ecclesiastical, All], 1],
  ['Vicar', [Male, Ecclesiastical, All], 1],
  ['Brother', [Male, Ecclesiastical, All], 1],
  ['Abbot', [Male, Ecclesiastical, All], 1],
  ['Prior', [Male, Ecclesiastical, All], 1],
  ['Friar', [Male, Ecclesiastical, All], 1],
  ['Lord', [Male, Royal, All], 1],
  ['King', [Male, Royal, All], 1],
  ['Prince', [Male, Royal, All], 1],
  ['Duke', [Male, Royal, All], 1],
  ['Marquis', [Male, Royal, All], 1],
  ['Earl/Count', [Male, Royal, All], 1],
  ['Baron', [Male, Royal, All], 1],
  ['Lady', [Female, Royal, All], 1],
  ['Queen', [Female, Royal, All], 1],
  ['Princess', [Female, Royal, All], 1],
  ['Duchess', [Female, Royal, All], 1],
  ['Marchioness', [Female, Royal, All], 1],
  ['Countess', [Female, Royal, All], 1],
  ['Baroness', [Female, Royal, All], 1],
  ['Sister', [Female, Ecclesiastical, All], 1],
  ['Abbess', [Female, Ecclesiastical, All], 1],
  ['Prioress', [Female, Ecclesiastical, All], 1],
]

// export const title = [
//   {
//     value: 'Master',
//     tags: [Neutral, Artisan, All]
//   },
//   {
//     value: 'Apprentice',
//     tags: [Neutral, Artisan, All]
//   },
//   {
//     value: 'Chamberlain',
//     tags: [Neutral, Royal, All]
//   },
//   {
//     value: 'Sheriff',
//     tags: [Neutral, Royal, All]
//   },
//   {
//     value: 'Alderman',
//     tags: [Neutral, Royal, All]
//   },
//   {
//     value: 'Lord Mayor',
//     tags: [Neutral, Royal, All]
//   },
//   {
//     value: 'Burgomaster',
//     tags: [Neutral, Royal, All]
//   },
//   {
//     value: 'Chancellor',
//     tags: [Neutral, Royal, All]
//   },
//   {
//     value: 'Governor',
//     tags: [Neutral, Royal, All]
//   },
//   {
//     value: 'Minister',
//     tags: [Neutral, Royal, All]
//   },
//   {
//     value: 'Magistrate',
//     tags: [Neutral, Royal, All]
//   },
//   {
//     value: 'Bishop',
//     tags: [Neutral, Ecclesiastical, All]
//   },
//   {
//     value: 'Curate',
//     tags: [Neutral, Ecclesiastical, All]
//   },
//   {
//     value: 'Vicar',
//     tags: [Male, Ecclesiastical, All]
//   },
//   {
//     value: 'Brother',
//     tags: [Male, Ecclesiastical, All]
//   },
//   {
//     value: 'Abbot',
//     tags: [Male, Ecclesiastical, All]
//   },
//   {
//     value: 'Prior',
//     tags: [Male, Ecclesiastical, All]
//   },
//   {
//     value: 'Friar',
//     tags: [Male, Ecclesiastical, All]
//   },
//   {
//     value: 'Lord',
//     tags: [Male, Royal, All]
//   },
//   {
//     value: 'King',
//     tags: [Male, Royal, All]
//   },
//   {
//     value: 'Prince',
//     tags: [Male, Royal, All]
//   },
//   {
//     value: 'Duke',
//     tags: [Male, Royal, All]
//   },
//   {
//     value: 'Marquis',
//     tags: [Male, Royal, All]
//   },
//   {
//     value: 'Earl/Count',
//     tags: [Male, Royal, All]
//   },
//   {
//     value: 'Baron',
//     tags: [Male, Royal, All]
//   },
//   {
//     value: 'Lady',
//     tags: [Female, Royal, All]
//   },
//   {
//     value: 'Queen',
//     tags: [Female, Royal, All]
//   },
//   {
//     value: 'Princess',
//     tags: [Female, Royal, All]
//   },
//   {
//     value: 'Duchess',
//     tags: [Female, Royal, All]
//   },
//   {
//     value: 'Marchioness',
//     tags: [Female, Royal, All]
//   },
//   {
//     value: 'Countess',
//     tags: [Female, Royal, All]
//   },
//   {
//     value: 'Baroness',
//     tags: [Female, Royal, All]
//   },
//   {
//     value: 'Sister',
//     tags: [Female, Ecclesiastical, All]
//   },
//   {
//     value: 'Abbess',
//     tags: [Female, Ecclesiastical, All]
//   },
//   {
//     value: 'Prioress',
//     tags: [Female, Ecclesiastical, All]
//   },
// ]
export const occupationTuple: WeightedTaggedTuple[] = [
  ['Gravedigger', [Labor, All], 1],
  ['Plague Doctor', [Artisan, All], 1],
  ['Inquisitor', [Ecclesiastical, All], 1],
  ['Hangman', [Labor, All], 1],
  ['Smuggler', [Criminal, All], 1],
  ['Tax collector', [Administration, All], 1],
  ['Scrivener', [Administration, All], 1],
  ['Scribe', [Ecclesiastical, All], 1],
  ['Barrelmaker', [Artisan, All], 1],
  ['Cheesemaker', [Artisan, All], 1],
  ['Fishmonger', [Merchant, All], 1],
  ['Butcher', [Merchant, All], 1],
  ['Apothecary', [Merchant, All], 1],
  ['Mason', [Artisan, All], 1],
  ['Carpenter', [Artisan, All], 1],
  ['Weaver', [Artisan, All], 1],
  ['Farmer', [Labor, All], 1],
  ['Fisherman', [Labor, All], 1],
  ['Armorer', [Artisan, All], 1],
  ['Baker', [Artisan, All], 1],
  ['Barrister', [Administration, All], 1],
  ['Basketweaver', [Artisan, All], 1],
  ['Barber', [Labor, All], 1],
  ['Beekeeper', [Labor, All], 1],
  ['Blacksmith', [Artisan, All], 1],
  ['Bookbinder', [Artisan, All], 1],
  ['Bowyer', [Artisan, All], 1],
  ['Brewer', [Artisan, All], 1],
  ['Dyer', [Artisan, All], 1],
  ['Embroiderer', [Artisan, All], 1],
  ['Engraver', [Artisan, All], 1],
  ['Fletcher', [Artisan, All], 1],
  ['Lamplighter', [Labor, All], 1],
  ['Laundress', [Labor, All], 1],
  ['Leatherworker', [Artisan, All], 1],
  ['Locksmith', [Artisan, All], 1],
  ['Midwife', [Female, Labor, All], 1],
  ['Miller', [Labor, All], 1],
  ['Moneychanger', [Administration, All], 1],
  ['Needleworker', [Labor, All], 1],
  ['Candlemaker', [Artisan, All], 1],
  ['Cartwright', [Artisan, All], 1],
  ['Chimney sweep', [Labor, All], 1],
  ['Clerk', [Administration, All], 1],
  ['Clothier', [Merchant, All], 1],
  ['Cobbler', [Artisan, All], 1],
  ['Cooper', [Artisan, All], 1],
  ['Coppersmith', [Artisan, All], 1],
  ['Crier', [Labor, All], 1],
  ['Glassblower', [Artisan, All], 1],
  ['Goldsmith', [Artisan, All], 1],
  ['Haberdasher', [Merchant, All], 1],
  ['Herbalist', [Merchant, All], 1],
  ['Innkeeper', [Labor, All], 1],
  ['Jailer', [Administration, All], 1],
  ['Jester', [Labor, All], 1],
  ['Jeweler', [Artisan, All], 1],
  ['Lacemaker', [Artisan, All], 1],
  ['Limner', [Artisan, All], 1],
  ['Perfumemaker', [Artisan, All], 1],
  ['Porter', [Labor, All], 1],
  ['Potter', [Artisan, All], 1],
  ['Ropemaker', [Artisan, All], 1],
  ['Sailor', [Labor, All], 1],
  ['Seamstress', [Labor, All], 1],
  ['Shipwright', [Labor, All], 1],
  ['Shoemaker', [Artisan, All], 1],
  ['Silversmith', [Artisan, All], 1],
  ['Soapmaker', [Artisan, All], 1],
  ['Stonecarver', [Artisan, All], 1],
  ['Storyteller', [Labor, All], 1],
  ['Tailor', [Artisan, All], 1],
  ['Tanner', [Labor, All], 1],
  ['Tavernkeeper', [Labor, All], 1],
  ['Taxidermist', [Artisan, All], 1],
  ['Thatcher', [Labor, All], 1],
  ['Rat catcher', [Labor, All], 1],
  ['Vintner', [Labor, All], 1],
  ['Wainwright', [Artisan, All], 1],
  ['Weaponsmith', [Artisan, All], 1],
  ['Wheelwright', [Artisan, All], 1],
  ['Woodcarver', [Artisan, All], 1],
]

// export const occupation = [
//   {
//     value: 'Gravedigger',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Plague Doctor',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Inquisitor',
//     tags: [Ecclesiastical, All]
//   },
//   {
//     value: 'Hangman',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Smuggler',
//     tags: [Criminal, All]
//   },
//   {
//     value: 'Tax collector',
//     tags: [Administration, All]
//   },
//   {
//     value: 'Scrivener',
//     tags: [Administration, All]
//   },
//   {
//     value: 'Scribe',
//     tags: [Ecclesiastical, All]
//   },
//   {
//     value: 'Barrelmaker',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Cheesemaker',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Fishmonger',
//     tags: [Merchant, All]
//   },
//   {
//     value: 'Butcher',
//     tags: [Merchant, All]
//   },
//   {
//     value: 'Apothecary',
//     tags: [Merchant, All]
//   },
//   {
//     value: 'Mason',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Carpenter',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Weaver',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Farmer',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Fisherman',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Armorer',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Baker',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Barrister',
//     tags: [Administration, All]
//   },
//   {
//     value: 'Basketweaver',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Barber',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Beekeeper',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Blacksmith',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Bookbinder',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Bowyer',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Brewer',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Dyer',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Embroiderer',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Engraver',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Fletcher',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Lamplighter',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Laundress',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Leatherworker',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Locksmith',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Midwife',
//     tags: [Female, Labor, All]
//   },
//   {
//     value: 'Miller',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Moneychanger',
//     tags: [Administration, All]
//   },
//   {
//     value: 'Needleworker',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Candlemaker',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Cartwright',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Chimney sweep',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Clerk',
//     tags: [Administration, All]
//   },
//   {
//     value: 'Clothier',
//     tags: [Merchant, All]
//   },
//   {
//     value: 'Cobbler',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Cooper',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Coppersmith',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Crier',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Glassblower',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Goldsmith',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Haberdasher',
//     tags: [Merchant, All]
//   },
//   {
//     value: 'Herbalist',
//     tags: [Merchant, All]
//   },
//   {
//     value: 'Innkeeper',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Jailer',
//     tags: [Administration, All]
//   },
//   {
//     value: 'Jester',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Jeweler',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Lacemaker',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Limner',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Perfumemaker',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Porter',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Potter',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Ropemaker',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Sailor',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Seamstress',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Shipwright',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Shoemaker',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Silversmith',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Soapmaker',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Stonecarver',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Storyteller',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Tailor',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Tanner',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Tavernkeeper',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Taxidermist',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Thatcher',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Rat catcher',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Vintner',
//     tags: [Labor, All]
//   },
//   {
//     value: 'Wainwright',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Weaponsmith',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Wheelwright',
//     tags: [Artisan, All]
//   },
//   {
//     value: 'Woodcarver',
//     tags: [Artisan, All]
//   },
// ]

export const demeanor = [
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

export const names = {
  male: [...d_name_male],
  female: [...d_name_female],
  neutral: [...d_name_male, ...d_name_female]
}
