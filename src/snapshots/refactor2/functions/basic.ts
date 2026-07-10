import { getDefaultStore, useAtom, useAtomValue } from 'jotai'
import { uuid } from './random'
import { ConfigTypes } from './enums'
import { Config, ItemRecord } from './types'
import { ItemState } from './state'
import { characterConfig, treasureConfig } from './configs'


export const getItem = <T>(id: string): ItemRecord<T> | undefined => {
  const state = useAtomValue(ItemState);
  return state.find((itm) => id === itm.id) as ItemRecord<T>
}

export const getItems = <T>(ids: Array<string>): Array<ItemRecord<T>> => {
  const state = useAtomValue(ItemState);
  return state.filter((itm) => ids.includes(itm.id)) ?? [] as Array<ItemRecord<T>>
}

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

export const getConfig: Record<string, Config<unknown>> = {
  [ConfigTypes.Character]: characterConfig,
  [ConfigTypes.Treasure]: treasureConfig
}

export const updateProperty = <T>(
  id: string, 
  target: keyof T
): Array<ItemRecord<T>>=> {

  const store = getDefaultStore()
  const state = store.get(ItemState)
  const item = state.find((itm) => id === itm.id) as ItemRecord<T>
  const filtered = state.filter((itm) => id !== itm.id)

  const { type } = item ?? {}
  const config =  getConfig[type] as Config<T>
  const configItm = config[target as keyof Config<T>]
  const newValue = configItm.updater(item)

  item.properties[target] = newValue;
  store.set(ItemState, [...filtered, item])
  return [item]
}

export const createItm = <T>(type: ConfigTypes, config: Config<T>, parentId?: string ): ItemRecord<T> => {

  const properties = {} as T
  const result = {
    type,
    id: uuid(),
    parentId: parentId,
    properties
  } as ItemRecord<T>

  for (const key in config) {
    // to-do: check required and if false use random 
    properties[key] = config[key].updater(result);
  }

  const store = getDefaultStore()
  const state = store.get(ItemState)
  store.set(ItemState, [...state, result])
  
  // to-do return uuid instead of full result
  return result
}





