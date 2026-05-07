import { atom, useAtom } from 'jotai'
import { d6x3, uuid } from './random'
import { createItm } from './basic'
import { createChild } from './refactorChild'

export enum Attributes {
  Strength = 'strength',
  Intelligence = 'intelligence',
  Wisdom = 'wisdom',
  Dexterity = 'dexterity',
  Constitution = 'constitution',
  Charisma = 'charisma',
  Treasures = 'treasures'
}

export type Properties =  {
  [Attributes.Strength]?: number
  [Attributes.Intelligence]?: number
  [Attributes.Wisdom]?: number
  [Attributes.Dexterity]?: number
  [Attributes.Constitution]?: number
  [Attributes.Charisma]?: number
  [Attributes.Treasures]?: Array<String>
}

export interface ItemRecord<T> {
  id: string
  parent?: string
  properties: T
}

// Jotai state
export const BaseState = atom([] as Array<ItemRecord<any>>);

export type Updater<T, V> = { (obj: T): V }
const baseUpdater: Updater<Properties, number> = (obj) => d6x3() 
const treasureUpdater: Updater<Properties, any> = (obj) => createChild()

type Config<T> = {
  [K in keyof T]: {required: boolean, updater: Updater<T, T[K]>};
};

const config: Config<Properties> = {
  [Attributes.Strength]: {required: true, updater: baseUpdater},
  [Attributes.Intelligence]: {required: true, updater: baseUpdater},
  [Attributes.Wisdom]: {required: true, updater: baseUpdater},
  [Attributes.Dexterity]: {required: true, updater: baseUpdater},
  [Attributes.Constitution]: {required: true, updater: baseUpdater},
  [Attributes.Charisma]: {required: true, updater: baseUpdater},
  [Attributes.Treasures]: {required: true, updater: treasureUpdater}
}

// const build = <T>(config: Config<T>, parentId?: string): ItemRecord<T> => {
//   const [state, setState] = useAtom(BaseState);
//   const properties = {} as T

//   for (const key in config) {
//     properties[key] = config[key].updater(properties);
//   }

//   const result = {
//     id: uuid(),
//     parentId: parentId,
//     properties
//   } as ItemRecord<T>

//   setState([ ...state, result as ItemRecord<T> ])
//   return result
// }

export const create = (parentId?: string): ItemRecord<Properties> => {
   return  createItm<Properties>(config, parentId)
}

