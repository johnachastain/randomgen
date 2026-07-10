import { DungeonSize, LevelType } from './enums'

export type DungeonProperties = {
  name: string
  size: DungeonSize
  levels: string[]       // IDs of Level items
}

export type LevelProperties = {
  name: string
  type: LevelType
  number: number
  rooms: string[]        // IDs of Room items
}

export type RoomProperties = {
  name: string
  number: number
  monsters: string[]     // IDs of Monster items
  treasures: string[]    // IDs of Treasure items
}

export type MonsterProperties = {
  name: string           // based on Being model — more properties added later
}

export type TreasureProperties = {
  name: string           // based on Item model — more properties added later
  value: number
}
