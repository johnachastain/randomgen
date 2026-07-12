import { KeyItem } from './KeyItem'
import { Object } from './Object'

export interface Door extends Object {
  lock?: Lock
  keyItem?: KeyItem
}