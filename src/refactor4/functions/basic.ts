import { getDefaultStore } from 'jotai'
import { uuid } from './random'
import { Config, ItemRecord, Updater } from './types'
import { ItemFamily, ItemIndexState, ItemState } from './state'

export function createItm<T>(
  type: string,
  config: Config<T>,
  parentId?: string
): { id: string } {
  const properties = {} as T
  const item: ItemRecord<T> = { type, id: uuid(), parentId, properties }

  for (const key in config) {
    properties[key] = config[key].updater(item)
  }

  const store = getDefaultStore()
  store.set(ItemFamily(item.id), item)
  store.set(ItemState, prev => [...prev, item])
  store.set(ItemIndexState, prev => [...prev, { id: item.id, parentId, type }])

  return { id: item.id }
}

export function rerollProperty<T>(
  id: string,
  key: keyof T,
  updater: Updater<ItemRecord<T>, T[keyof T]>
): void {
  const store = getDefaultStore()
  const item = store.get(ItemFamily(id)) as ItemRecord<T> | null
  if (!item) return
  store.set(ItemFamily(id), {
    ...item,
    properties: { ...item.properties, [key]: updater(item) },
  })
}
