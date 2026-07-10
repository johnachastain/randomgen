
import { atom} from 'jotai'
import { getRandomV2, getRandom } from './random'
import { ItemRecord, Updater } from './create';
import { createItm } from './basic';

export const BaseState = atom([] as Array<ItemRecord<any>>);

export enum Attributes {
  Type = 'type',
  Condition = 'condition',
  Value = 'value',
}

export type Properties = {
  [Attributes.Type]?: string
  [Attributes.Condition]?: string
  [Attributes.Value]?: number
}

export const conditions = [
"Dusty", 
"Ancient", 
"Dull", 
"Greasy", 
"Repaired", 
"Fine", 
"Grand", 
"Pristine", 
"Ornate", 
"Engraved", 
"Sturdy", 
"Gilded", 
"Broken", 
"Flawed", 
"Faulty", 
"Chipped", 
"Worn",  
"Warped", 
"Rotting", 
"Rusty", 
"Tarnished", 
"Moldy", 
"Rusting"
];

export const types = [
"Dagger",
"Ring",
"Bone",
"Key"
];

export const getItem = (arr: Array<string>) => arr[getRandom(arr.length)]

const typeUpdater: Updater<Properties, string> = (obj) => getItem(types)
const conditionUpdater: Updater<Properties, string> = (obj) => getItem(conditions) 
const valuenUpdater: Updater<Properties, number> = (obj) => getRandomV2(10_000)

export const config: any = {
  [Attributes.Type]: {required: true, updater: typeUpdater},
  [Attributes.Condition]: {required: true, updater: conditionUpdater},
  [Attributes.Value]: {required: true, updater: valuenUpdater},
}

export const createChild = (parentId?: string): ItemRecord<Properties> => {
   return  createItm<Properties>(config, parentId)
}




