// import { atom, useRecoilState } from "recoil"
import { getDefaultStore, atom, useAtom, useAtomValue } from 'jotai'
import { d6x3, uuid } from '../random'
// import { CreateItm, DeleteItm, DeleteItms, GetItm, GetItms, UpdateItm } from './types'
// import { Child, createChild } from './refactorChild'
// import { useState } from 'react'


const updateGenericProperty = <T, K extends keyof T>(obj: T, key: K, value: T[K]): void => {
  obj[key] = value;
};

export type Updater<T> = { (obj: T, key: string): T }

// return an updater with the data
// type Updatable<T, V> = {
//   updater?: UpdaterV2<T, V>
//   value: T
// }

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

// export type Base = {
//   id: string
//   parentId?: string
//   [Attributes.Strength]?: number
//   [Attributes.Intelligence]?: number
//   [Attributes.Wisdom]?: number
//   [Attributes.Dexterity]?: number
//   [Attributes.Constitution]?: number
//   [Attributes.Charisma]?: number
//   [Attributes.Child]?: Child
// }
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
  
  [Attributes.Child]?: Child
}

const updater: Updater<Base> = (obj, key) => ({ ...obj, [key]: d6x3() })

const updaterV2: UpdaterV2<Base, number> = (obj) => d6x3() 

const uuidUpdater: UpdaterV2<Base, string> = (obj) => uuid() 

const ChildUpdater: Updater<Base> = (obj, key) => ({ ...obj, [key]: createChild({parentId: obj.id}) })

// export const dispatchTable: Record<string, Updater<Base>> = {
//   [Attributes.Strength]: updater,
//   [Attributes.Intelligence]: updater,
//   [Attributes.Wisdom]: updater,
//   [Attributes.Dexterity]: updater,
//   [Attributes.Constitution]: updater,
//   [Attributes.Charisma]: updater,
//   [Attributes.Child]: ChildUpdater
// }

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






// export const getConfigV3 = () => {
//   const store = getDefaultStore()

//   let result:Base = {
//     id: uuid()
//   } as Base

//   for (const [key, value] of Object.entries(configV3)) {
//     const k = key as keyof Base
//     result = dispatchTable[k]?.(result, key)
//   }


//   store.set(BaseState, [result])
//   return result
// }

function assign<K extends keyof Base>(base: Base, key: K, value: Base[K]): void {
  base[key] = value;
}

export const getConfigV4 = () => {
  const store = getDefaultStore()

  let result:Base = {
    id: uuid()
  } as Base

  for (const [key, value] of Object.entries(configV3)) {
    const k = key as keyof Base
    const updater = dispatchTable[k]
    const value = updater?.(result)
    const updatable = {updater, value}

    assign(result, k, updatable)
  }

  store.set(BaseState, [result])
  return result
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

  // let result:Base = {
  //   id: uuid()
  // } as Base

  // for (const [key, value] of Object.entries(configV3)) {
  //   const k = key as keyof Base
  //   const updater = dispatchTable[k]
  //   const value = updater?.(result)
  //   const updatable = {updater, value}

  //   assign(result, k, updatable)
  // }

  // store.set(BaseState, [result])
  // return result

}



// Jotai state
export const BaseState = atom([] as Array<Base>);
// const [List, setList] = useAtom(BaseState);


// CRUD operations

export const getCharacter: GetItm<Base> = (characterId) => {
  const List = useAtomValue(BaseState);
  return List.find(({id}) => id === characterId)
}

export const getCharacters: GetItms<Base> = (characterIds) => {
  const List = useAtomValue(BaseState);
  return List.filter(({id}) => characterIds.includes(id)) ?? [] as Array<Base>
}

export const updateCharacter: UpdateItm<Base> = (character) => {
  const [List, setList] = useAtom(BaseState);
  const filtered =  List.filter(({id}) => id === character.id)
  const update = [ ...filtered, character ]
  setList(update)
  return character
}

export const deleteCharacter: DeleteItm<Base> = (characterId)  => {
  const [List, setList] = useAtom(BaseState);
  const update =  List.filter(({id}) => id !== characterId)
  setList(update)
  return update
}

export const deleteCharacters: DeleteItms<Base> = (characterIds) => {
  const [List, setList] = useAtom(BaseState);
  const update =  List.filter(({id}) => !characterIds.includes(id))
  setList(update)
  return update
}

export const createCharacter: CreateItm<Base> = (options: any) => {
  const [List, setList] = useAtom(BaseState);

  let result:Base = {
    id: uuid()
  } as Base

  for (const [key, value] of Object.entries(configV3)) {
    const k = key as keyof Base
    result = dispatchTable[k]?.(result, key)
  }
  
  setList([ ...List, result ])
  return result
}

export const updateProperty = (characterId: string, target: Attributes) => {
  // const [List, setList] = useAtom(BaseState);
  const store = getDefaultStore()
  const List = store.get(BaseState)

  const item: Base | undefined = List.find(({id}) => id === characterId)

  if (!item) { return }

  const updatedItem: Base = dispatchTable[target]?.(item, target)
  const filteredList =  List.filter(({id}) => id !== characterId)

  store.set(BaseState, [
    ...filteredList,
    updatedItem
  ])
}






// const updaters = [...Object.values(Attributes)].map((key) => ({key, updater}))

// export type ConfigItem = { 
//   key: string, 
//   options?: {
//     required?: boolean
//   } 
// }

// export const configV2: Array<ConfigItem> = [
//   { key: Attributes.Strength, options: {required: true} },
//   { key: Attributes.Intelligence, options: {required: true} },
//   { key: Attributes.Wisdom, options: {required: true} },
//   { key: Attributes.Dexterity, options: {required: true} },
//   { key: Attributes.Constitution, options: {required: true} },
//   { key: Attributes.Charisma, options: {required: true} }
// ]

// export const getConfigV2 = (config: Array<ConfigItem>) => {
//   let result:Base = {} as Base

//   for (const item of config) {
//     const k = item.key as keyof Base
//     result = dispatchTable[k]?.(result, item.key)
//   }

//   return result
// }

// //  recoil state
// const CharacterState = atom({
//   key: "Characters",
//   default: [] as Array<Base>
// });

// const [List, setList] = useRecoilState(CharacterState);