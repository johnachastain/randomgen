export type Updater<T> = { (obj: T): T }

// tuple of [ weight, Updater ]
export type VariantUpdater<T> = [number, Updater<T>]

export type TaggedItem = [string, string[], number]

export enum Generic { All = 'all' }

// export type TaggedItem = { value: string, tags: string[] }
// export type TaggedTuple = [string, string[]]
// export type WeightedTaggedItem = { value: string, tags?: string[], weight?: number, index?: number }