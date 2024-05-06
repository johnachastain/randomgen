import { Gender } from '../character/Character';
import { d_silly, d_nasty } from './names_lists';
import { TableItem  } from '../shared/types';
import { names } from '../character/lists';
import { getItem } from '../shared/functions';
import { getFromRecord } from './functions';


export const getName = (gender: Gender): string => {
  const firstName = getFromRecord(names, gender)
  const lastName = `${getItem(d_silly)}${getItem(d_nasty)}`
  return `${firstName} ${lastName}`
}

export enum WordPosition {
  Prefix = 'prefix',
  Suffix = 'suffix',
  Root = 'root'
}

export enum WordType {
  Agentive = 'agentivenoun'
}

export enum NounGroup {
  Animal = 'animal',
  Material = 'material',
  Anatomical = 'anatomical',
  Weapon = 'weapon',
  Fluid = 'fluid',
  Color = 'color'
}

export enum VerbGroup {}

export enum AdjectiveGroups {}

const weightedTaggedNames = [
  [ 'Bob', ['male', 'evil', 'royal'], 3],
  [ 'Fred', ['male', 'good', 'artisan'], 2],
  [ 'Phil', ['male', 'good', 'criminal'], 1],
]
const getNameVariant1 = (tags: string[]) => 'one'
const getNameVariant2 = (tags: string[]) => 'two'
const getNameVariant3 = (tags: string[]) => 'three'

export const tableConfig: TableItem[] = [
  [1, (tags: string[]) => getNameVariant1(tags)],
  [2, (tags: string[]) => getNameVariant2(tags)],
  [3, (tags: string[]) => getNameVariant3(tags)]
]