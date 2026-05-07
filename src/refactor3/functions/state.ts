import { atom } from "jotai"
import { ItemRecord } from "./types"
import { atomFamily } from "jotai-family"

export const ItemState = atom([] as Array<ItemRecord<any>>)

export const ItemFamily = atomFamily(
  (id: string) => atom<ItemRecord<unknown> | null>(null),
  (a, b) => a === b
)

export type Index = {
  id: string
  parentId?: string
  type: string
}

export const ItemIndex = atom<Array<Index>>([]);