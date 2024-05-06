import { Gender } from '../character/Character';
import { d_silly, d_nasty } from '../lists/deity_lists';
import { TableItem  } from '../shared/types';
import { names } from '../character/lists';
import { getItem } from '../shared/functions';
import { getFromRecord } from './functions';


export const getName = (gender: Gender): string => {
  const firstName = getFromRecord(names, gender)
  // const firstName = getItem(names[gender as keyof Names])
  // const firstName  = gender === Male ? getItem(d_name_male) : getItem(d_name_female)
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