// import { getDefaultStore, atom, useAtom, useAtomValue } from 'jotai'
import { d6x3, uuid } from '../random'
// import { CreateItm, UpdateItm } from './types'
// import { Child, createChild } from './refactorChild'


// const updateGenericProperty = <T, K extends keyof T>(obj: T, key: K, value: T[K]): void => {
//   obj[key] = value;
// };

export type Updater<T> = { (obj: T, key: string): T }

type Updatable<T, V> = {
  updater?: UpdaterV2<T, V>
  value: V
}

// returns value instead of type
export type UpdaterV2<T, V> = { (obj: T): V }

export type Options =  {
  required?: boolean
} 

export enum Attributes {
  Strength = 'strength',
  Intelligence = 'intelligence',
  Wisdom = 'wisdom',
  Dexterity = 'dexterity',
  Constitution = 'constitution',
  Charisma = 'charisma',
  Child = 'child'
}

export type DynamicItem<T, V> = string | number | boolean | undefined | Updatable<T, V>
export type DynamicData<T, V> = Record<string, DynamicItem<T, V>>

export type Base = {
  id: string
  parentId?: string

  [Attributes.Strength]?: Updatable<Base, number>
  [Attributes.Intelligence]?: Updatable<Base, number>
  [Attributes.Wisdom]?: Updatable<Base, number>
  [Attributes.Dexterity]?: Updatable<Base, number>
  [Attributes.Constitution]?: Updatable<Base, number>
  [Attributes.Charisma]?: Updatable<Base, number>
  
  // [Attributes.Child]?: Child
}

const updater: Updater<Base> = (obj, key) => ({ ...obj, [key]: d6x3() })

const updaterV2: UpdaterV2<Base, number> = (obj) => d6x3() 

const uuidUpdater: UpdaterV2<Base, string> = (obj) => uuid() 

// const ChildUpdater: Updater<Base> = (obj, key) => ({ ...obj, [key]: createChild({parentId: obj.id}) })


export const dispatchTable: Record<string, UpdaterV2<Base, number | string>> = {
  id: uuidUpdater,
  [Attributes.Strength]: updaterV2,
  [Attributes.Intelligence]: updaterV2,
  [Attributes.Wisdom]: updaterV2,
  [Attributes.Dexterity]: updaterV2,
  [Attributes.Constitution]: updaterV2,
  [Attributes.Charisma]: updaterV2,
  [Attributes.Child]: updaterV2
}


//  V3
export const configV3: Record<string, Options> = {
  id: {required: true},
  [Attributes.Strength]: {required: true},
  [Attributes.Intelligence]: {required: true},
  [Attributes.Wisdom]: {required: true},
  [Attributes.Dexterity]: {required: true},
  [Attributes.Constitution]: {required: true},
  [Attributes.Charisma]: {required: true},
  [Attributes.Child]: {required: true}
}






export type UpdaterV3<T> = { (obj: T): any }

export type Config<T> =  {
  required?: boolean
  updater?: UpdaterV3<T>
} 

export const configV4: Record<string, Config<Base>> = {
  id: {required: true},
  [Attributes.Strength]: {required: true},
  [Attributes.Intelligence]: {required: true},
  [Attributes.Wisdom]: {required: true},
  [Attributes.Dexterity]: {required: true},
  [Attributes.Constitution]: {required: true},
  [Attributes.Charisma]: {required: true},
  [Attributes.Child]: {required: true}
}





function assign<K extends keyof Base>(base: Base, key: K, value: Base[K]): void {
  base[key] = value;
}



type Config2<T> = {
  [K in keyof T]: () => T[K];
};

export const getConfigV5 = <T>(config: Config2<T>): T => {
  // const store = getDefaultStore()

  const result = {} as T;

  for (const key in config) {
    result[key] = config[key]();
  }

  return result;
}


// Jotai state
// export const BaseState = atom([] as Array<Base>);


// CRUD operations

// export const updateCharacter: UpdateItm<Base> = (character) => {
//   const [List, setList] = useAtom(BaseState);
//   const filtered =  List.filter(({id}) => id === character.id)
//   const update = [ ...filtered, character ]
//   setList(update)
//   return character
// }

// export const createCharacter: CreateItm<Base> = (options: any) => {
//   const [List, setList] = useAtom(BaseState);

//   let result:Base = {
//     id: uuid()
//   } as Base

//   for (const [key, value] of Object.entries(configV3)) {
//     const k = key as keyof Base
//     result = dispatchTable[k]?.(result, key)
//   }
  
//   setList([ ...List, result ])
//   return result
// }

// export const updateProperty = (characterId: string, target: Attributes) => {
//   // const [List, setList] = useAtom(BaseState);
//   const store = getDefaultStore()
//   const List = store.get(BaseState)

//   const item: Base | undefined = List.find(({id}) => id === characterId)

//   if (!item) { return }

//   const updatedItem: Base = dispatchTable[target]?.(item, target)
//   const filteredList =  List.filter(({id}) => id !== characterId)

//   store.set(BaseState, [
//     ...filteredList,
//     updatedItem
//   ])
// }




