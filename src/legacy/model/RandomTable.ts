import { Base } from "./Base"
import { RandomItem } from "./RandomItem"

export interface RandomTable extends Base {
  tags: Array<any>
  odds: number
  list: RandomItem[]
}