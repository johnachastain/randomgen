import { Object } from './Object'
import { Lock } from './Lock'
import { KeyItem } from './KeyItem'

export interface Container extends Object {
  slots: number
  lock?: Lock
  keyItem?: KeyItem
}