import { Being } from './Being'

export enum Gender {
  Male = 'male',
  Female = 'female',
  Neutral = 'neutral'
}

export interface Character extends Being {
  name?: string
  age?: string
  socialStatus?: string
  wealth?: string
  // gender?: 'male' | 'female' | 'neutral'
  gender?: Gender
  title?: string
  profession?: string
  demeanor?: string
}