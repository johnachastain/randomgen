import { atom, getDefaultStore, useAtom, useAtomValue } from 'jotai'
import { uuid } from './random'

// export type ItemPropertes =  {
//   name: string
// }

export interface ItemRecord<T> {
  id: string
  parent?: string
  properties: T
}

// const testSet: ItemRecord<ItemPropertes> ={
//   id: '123',
//   properties: {
//     name: 'name'
//   }
// }

export const ItemState = atom([] as Array<ItemRecord<any>>);

export const getItem = <T>(id: string): ItemRecord<T> | undefined => {
  const state = useAtomValue(ItemState);
  return state.find((itm) => id === itm.id) as ItemRecord<T>
}
// const test = getItem<string>('123')


export const getItems = <T>(ids: Array<string>): Array<ItemRecord<T>> => {
  const state = useAtomValue(ItemState);
  return state.filter((itm) => ids.includes(itm.id)) ?? [] as Array<ItemRecord<T>>
}
// const test2 = getItems<string>(['123', '456'])

export const deleteItem = <T>(id: string): Array<ItemRecord<T>> => {
  const [state, setState] = useAtom(ItemState);
  const update =  state.filter((itm) => id !== itm.id)
  setState(update)
  return update
}

export const deleteItems = <T>(ids: Array<string>): Array<ItemRecord<T>> => {
  const [state, setState] = useAtom(ItemState);
  const update =  state.filter((itm) => !ids.includes(itm.id))
  setState(update)
  return update
}

export const updateProperty = <T>(
  id: string, 
  target: keyof T,
  value: T[keyof T]
): Array<ItemRecord<T>>=> {
  const [state, setState] = useAtom(ItemState);

  const item = state.find((itm) => id === itm.id) as ItemRecord<T>
  item.properties[target] = value;

  setState([...state, item])

  return [item]
}


export type Updater<T, V> = { (obj: T): V }

type Config<T> = {
  [K in keyof T]: {required: boolean, updater: Updater<T, T[K]>};
};

export const createItm = <T>(config: Config<T>, parentId?: string): ItemRecord<T> => {
  // const [state, setState] = useAtom(ItemState);
  const store = getDefaultStore()
  const properties = {} as T

  for (const key in config) {
    // to-do: check required and if false use random 
    properties[key] = config[key].updater(properties);
  }

  const result = {
    id: uuid(),
    parentId: parentId,
    properties
  } as ItemRecord<T>

  // setState([ ...state, result as ItemRecord<T> ])

  store.set(ItemState, [result])
  return result
}





