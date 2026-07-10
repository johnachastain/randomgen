import { Difficulty } from '../../enums/Difficulty'
import { Object } from './Object'

export interface Lock extends Object {
  locked?: boolean
  difficulty?: Difficulty
}