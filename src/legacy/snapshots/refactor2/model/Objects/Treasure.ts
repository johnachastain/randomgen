import { TreasureItem } from "./TreasureItem"

export interface Treasure extends Object {
  value?: string
  items?: Array<TreasureItem>
}