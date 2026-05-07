import { Base } from "./Base"

export interface RandomItem extends Base {
  tags: Array<any>
  odds: number
}