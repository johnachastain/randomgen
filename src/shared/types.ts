export type Updater<T> = { (obj: T): T }

// tuple of [ weight, Updater ]
export type WeighedVariantUpdater = [number, Function]

export type TaggedItem = { value: string, tags: string[] }

export type TaggedTuple = [string, string[]]

export type WeightedTaggedTuple = [string, string[], number]

export enum Generic { All = 'all' }

export type WeightedTaggedItem = { value: string, tags?: string[], weight?: number, index?: number }