import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'
import { ItemRecord } from './types'

export const ItemState = atom([] as ItemRecord<unknown>[])

export const ItemFamily = atomFamily(
  () => atom<ItemRecord<unknown> | null>(null),
  (a, b) => a === b
)

export type ItemIndex = { id: string; parentId?: string; type: string }

export const ItemIndexState = atom([] as ItemIndex[])
