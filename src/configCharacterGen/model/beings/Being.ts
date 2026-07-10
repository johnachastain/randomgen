import { Base } from '../base/Base'
import { Object } from '../Objects/Object'

export interface Being extends Base {
  name?: string
  age?: string
  possessions?: Object[]
}