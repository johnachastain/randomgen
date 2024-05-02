import { Being } from './Being'

export enum Gender {
  Male = 'male',
  Female = 'female',
  Neutral = 'neutral'
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
  Criminal = 'criminal'
}

export interface Character extends Being {
  name?: string
  age?: string
  socialStatus?: string
  wealth?: string
  gender?: Gender
  socialClass?: SocialClass
  title?: string
  profession?: string
  demeanor?: string
}