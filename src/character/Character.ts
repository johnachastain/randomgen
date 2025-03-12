import { Being } from '../model/Being'

export enum Gender {
  Male = 'male',
  Female = 'female',
  Neutral = 'neutral'
}

export enum Alignment {
  Good = 'good',
  Evil = 'evil'
}

export enum SocialClass {
  Servant = 'servant',
  Labor = 'labor',
  Merchant = 'merchant',
  Artisan = 'artisan',
  Elite = 'elite',
  Military = 'military',
  Ecclesiastical = 'ecclesiastical',
  Royal = 'royal',
  Administration = 'administration',
  Criminal = 'criminal',
  Governmental = 'governmental',
  Craftsman = 'craftsman'
}

export interface Character extends Being {
  firstName?: string
  lastName?: string
  middleName?: string
  name?: string
  age?: string
  wealth?: string
  gender?: Gender
  socialClass?: SocialClass
  title?: string
  occupation?: string
  demeanor?: string
  strength?: number
  intelligence?: number
  wisdom?: number
  constitution?: number
  dexterity?: number
  charisma?: number
}