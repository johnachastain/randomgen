export type Updater<T> = { (obj: T): T }
export type TableItem = [number, Function]
export type TaggedItem = { 
    name: string, 
    tags: string[] 
  }
export type TaggedTuple = [ string, string[] ] 