export type Updater<T> = { (obj: T): T }

export type VariantFilter = { (tags: Array<string>): string }

export type WeightedVariantFilter = [number, VariantFilter]

export type TaggedItem = [string, string[], number]

// export enum Generic { All = 'all' }