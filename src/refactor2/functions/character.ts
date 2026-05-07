import { createItm } from './basic'
import { characterConfig } from './configs'
import { ConfigTypes } from './enums'
import { CharacterProperties } from './models'
import { ItemRecord } from './types'

export const create = (parentId?: string): ItemRecord<CharacterProperties> => {
   return  createItm<CharacterProperties>(ConfigTypes.Character, characterConfig, parentId)
}

