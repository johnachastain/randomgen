export interface ItemRecord<T> {
  type: string
  id: string
  parent?: string
  properties: T
}

export type Updater<T, V> = { (obj: T): V }

export type Config<T> = {
  [K in keyof T]: {required: boolean, updater: Updater<ItemRecord<T> , T[K]>};
};




