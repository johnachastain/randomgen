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

const getNameVariant1 = (tags: string[]) => 'one'
const getNameVariant2 = (tags: string[]) => 'two'
const getNameVariant3 = (tags: string[]) => 'three'

export const tableConfig: TableItem[] = [
  [1, (tags: string[]) => getNameVariant1(tags)],
  [2, (tags: string[]) => getNameVariant2(tags)],
  [3, (tags: string[]) => getNameVariant3(tags)]
]