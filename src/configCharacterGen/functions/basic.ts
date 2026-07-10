import { getDefaultStore, useAtom, useAtomValue, atom } from 'jotai'
import { atomFamily } from 'jotai-family'
import { uuid } from './random'
import { ConfigTypes } from './enums'
import { Config, ItemRecord } from './types'
import { ItemFamily, ItemIndex, ItemState } from './state'
import { characterConfig, treasureConfig } from './configs'


// type Item = {
//   id: string;
//   name: string;
//   category: string;
// };

// const itemAtomFamily = atomFamily(
//   (id: string) => atom<Item | null>(null),
//   (a, b) => a === b
// );

// const store = getDefaultStore();

// const newItem: Item = { id: "item-1", name: "Widget", category: "Tools" };
// const newItem2: Item = { id: "item-2", name: "Widget2", category: "Tools2" };

// store.set(itemAtomFamily(newItem.id), newItem);
// store.set(itemAtomFamily(newItem2.id), newItem2);

// const retrieved = store.get(itemAtomFamily("item-1"));
// const retrieved2 = store.get(itemAtomFamily("item-2"));

// console.log(retrieved);
// console.log(retrieved2);



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
): any => {

  const store = getDefaultStore()
  const item = store.get(ItemFamily(id)) as ItemRecord<T>
  console.log('item', item)


  const { type } = item
  const config =  getConfig[type] as Config<T>
  const configItm = config[target as keyof Config<T>]
  const newValue = configItm.updater(item)

  item.properties[target] = newValue;

  store.set(ItemFamily(id), {...item});
  return {id}
}

export const createItm = <T>(type: ConfigTypes, config: Config<T>, parentId?: string ): any => {

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
  store.set(ItemFamily(result.id), result)

  store.set(ItemIndex, (prev) => [...prev, {id: result.id, parentId, type}])
  // store.set(ItemIndex, [{id: result.id, parentId, type}])


  const test = store.get(ItemIndex)
  console.log('ItemIndex', test)

  return {id: result.id}
}





