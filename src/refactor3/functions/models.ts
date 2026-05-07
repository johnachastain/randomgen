import { CharacterProps, TreasureProps } from "./enums"

export type CharacterProperties = {
  [CharacterProps.Strength]?: number
  [CharacterProps.Intelligence]?: number
  [CharacterProps.Wisdom]?: number
  [CharacterProps.Dexterity]?: number
  [CharacterProps.Constitution]?: number
  [CharacterProps.Charisma]?: number
  [CharacterProps.Treasures]?: Array<String>
}

export type TreasureProperties = {
  [TreasureProps.Type]?: string
  [TreasureProps.Condition]?: string
  [TreasureProps.Value]?: number
}