import { Base } from './Base'
import { Object } from './Object'

export interface Being extends Base {
  name: string
  age: string
  possessions: Object[]
}