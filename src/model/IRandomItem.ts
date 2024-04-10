import { IBase } from "./IBase"

export interface IRandomItem extends IBase {
  tags: Array<any>
  odds: number
}