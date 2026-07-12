import { getDefaultStore } from 'jotai'
import * as roomLists from '../../lists/original/dungeon_rooms'
import { DungeonSize, LevelType, ConfigTypes } from './enums'
import { DungeonProperties, LevelProperties, MonsterProperties, RoomProperties, TreasureProperties } from './models'
import { getRandom, getRandomV2, pickRandom, randomInRange } from './random'
import { ItemFamily, ItemIndexState, ItemState } from './state'
import { Config, ItemRecord, Updater } from './types'
import { createItm } from './basic'

// ---------------------------------------------------------------------------
// Name data
// ---------------------------------------------------------------------------

const dungeonAdjectives = [
  'Ancient', 'Dark', 'Forsaken', 'Haunted', 'Ruined',
  'Sunken', 'Lost', 'Cursed', 'Fallen', 'Sundered',
]
const dungeonStructures = [
  'Keep', 'Fortress', 'Crypt', 'Labyrinth', 'Vault',
  'Dungeon', 'Depths', 'Warren', 'Caverns', 'Hold',
]

const levelNamesByType: Record<LevelType, string[]> = {
  [LevelType.Tomb]:    ['The Burial Halls', 'The Catacombs', 'The Ossuary', 'Halls of the Dead'],
  [LevelType.Temple]:  ['The Consecrated Halls', 'The Sanctum', 'Temple of Shadows', 'The Holy Depths'],
  [LevelType.Cavern]:  ['The Natural Caverns', 'The Underground Depths', 'The Stone Warrens', 'The Dark Grotto'],
  [LevelType.Dungeon]: ['The Prison Level', 'The Lower Depths', 'The Guard Level', 'The Dark Halls'],
  [LevelType.Magical]: ['The Arcane Laboratory', 'The Enchanted Halls', "The Wizard's Sanctum", 'The Mystic Depths'],
}

const monsterNames = [
  'Skeleton', 'Zombie', 'Ghoul', 'Goblin', 'Orc', 'Giant Rat',
  'Giant Spider', 'Bat Swarm', 'Green Slime', 'Wight', 'Wraith',
  'Troll', 'Ogre', 'Hobgoblin', 'Cave Lizard', 'Death Worm',
]

const treasureItems = [
  'Gold Coin', 'Silver Ring', 'Dagger', 'Gem', 'Amulet',
  'Healing Potion', 'Scroll', 'Old Key', 'Necklace', 'Ruby',
  'Sapphire', 'Bone Wand', 'Leather Pouch', 'Iron Sword', 'Magic Stone',
]

// How many levels each dungeon size can have: [min, max]
const levelCountBySize: Record<DungeonSize, [number, number]> = {
  [DungeonSize.Small]:  [1, 2],
  [DungeonSize.Medium]: [2, 4],
  [DungeonSize.Large]:  [3, 6],
  [DungeonSize.Massive]: [5, 10],
}

// ---------------------------------------------------------------------------
// Room name — picks from the appropriate dungeon_rooms lists by level type
// ---------------------------------------------------------------------------

export function generateRoomName(levelType: LevelType): string {
  switch (levelType) {
    case LevelType.Tomb:
      return `${pickRandom(roomLists.tomb_adjective)} ${pickRandom(roomLists.tomb_objects)}`
    case LevelType.Temple:
      return getRandom(3) === 0
        ? pickRandom(roomLists.temple_special_rooms)
        : `${pickRandom(roomLists.temple_adjective)} ${pickRandom(roomLists.temple_objects)}`
    case LevelType.Cavern:
      return getRandom(3) === 0
        ? pickRandom(roomLists.cavern_special_rooms)
        : `${pickRandom(roomLists.cavern_adjective)} ${pickRandom(roomLists.cavern_objects)}`
    case LevelType.Magical:
      return getRandom(3) === 0
        ? pickRandom(roomLists.magical_special_rooms)
        : `${pickRandom(roomLists.magical_adjective)} ${pickRandom(roomLists.magical_objects)}`
    case LevelType.Dungeon:
    default:
      return getRandom(3) === 0
        ? pickRandom(roomLists.dungeon_special_rooms)
        : `${pickRandom(roomLists.dungeon_adjective)} ${pickRandom(roomLists.dungeon_objects)}`
  }
}

// ---------------------------------------------------------------------------
// Monster
// ---------------------------------------------------------------------------

export const monsterNameUpdater: Updater<ItemRecord<MonsterProperties>, string> = () =>
  pickRandom(monsterNames)

const monsterConfig: Config<MonsterProperties> = {
  name: { required: true, updater: monsterNameUpdater },
}

function createMonster(parentId: string): string {
  return createItm(ConfigTypes.Monster, monsterConfig, parentId).id
}

// ---------------------------------------------------------------------------
// Treasure
// ---------------------------------------------------------------------------

export const treasureNameUpdater: Updater<ItemRecord<TreasureProperties>, string> = () =>
  pickRandom(treasureItems)

export const treasureValueUpdater: Updater<ItemRecord<TreasureProperties>, number> = () =>
  getRandomV2(1000)

const treasureConfig: Config<TreasureProperties> = {
  name:  { required: true, updater: treasureNameUpdater },
  value: { required: true, updater: treasureValueUpdater },
}

function createTreasure(parentId: string): string {
  return createItm(ConfigTypes.Treasure, treasureConfig, parentId).id
}

// ---------------------------------------------------------------------------
// Room — config is built per room so the name updater knows the level type
// ---------------------------------------------------------------------------

const roomMonstersUpdater: Updater<ItemRecord<RoomProperties>, string[]> = (room) =>
  Array.from({ length: getRandom(3) + 1 }, () => createMonster(room.id))

const roomTreasuresUpdater: Updater<ItemRecord<RoomProperties>, string[]> = (room) =>
  Array.from({ length: getRandom(2) + 1 }, () => createTreasure(room.id))

export const roomNameUpdater: Updater<ItemRecord<RoomProperties>, string> = (room) => {
  const store = getDefaultStore()
  const level = store.get(ItemFamily(room.parentId!)) as ItemRecord<LevelProperties> | null
  return generateRoomName(level?.properties.type ?? LevelType.Dungeon)
}

const roomConfig: Config<RoomProperties> = {
  name:     { required: true, updater: roomNameUpdater },
  number:   { required: true, updater: (room) => room.properties.number },
  monsters: { required: true, updater: roomMonstersUpdater },
  treasures:{ required: true, updater: roomTreasuresUpdater },
}

function createRoom(parentId: string, roomNumber: number): string {
  const config: Config<RoomProperties> = {
    ...roomConfig,
    number: { required: true, updater: () => roomNumber },
  }
  return createItm(ConfigTypes.Room, config, parentId).id
}

// ---------------------------------------------------------------------------
// Level — type is generated first so name and rooms can use it
// ---------------------------------------------------------------------------

export const levelTypeUpdater: Updater<ItemRecord<LevelProperties>, LevelType> = () =>
  pickRandom(Object.values(LevelType))

export const levelNameUpdater: Updater<ItemRecord<LevelProperties>, string> = (level) =>
  pickRandom(levelNamesByType[level.properties.type ?? LevelType.Dungeon])

const levelRoomsUpdater: Updater<ItemRecord<LevelProperties>, string[]> = (level) => {
  const count = getRandom(4) + 1
  return Array.from({ length: count }, (_, i) => createRoom(level.id, i + 1))
}

const levelConfig: Config<LevelProperties> = {
  type:   { required: true, updater: levelTypeUpdater },
  name:   { required: true, updater: levelNameUpdater },
  number: { required: true, updater: (level) => level.properties.number },
  rooms:  { required: true, updater: levelRoomsUpdater },
}

function createLevel(parentId: string, levelNumber: number): string {
  const config: Config<LevelProperties> = {
    ...levelConfig,
    number: { required: true, updater: () => levelNumber },
  }
  return createItm(ConfigTypes.Level, config, parentId).id
}

// ---------------------------------------------------------------------------
// Dungeon — size is generated first so the levels updater can use it
// ---------------------------------------------------------------------------

export const dungeonNameUpdater: Updater<ItemRecord<DungeonProperties>, string> = () =>
  `The ${pickRandom(dungeonAdjectives)} ${pickRandom(dungeonStructures)}`

export const dungeonSizeUpdater: Updater<ItemRecord<DungeonProperties>, DungeonSize> = () =>
  pickRandom(Object.values(DungeonSize))

const dungeonLevelsUpdater: Updater<ItemRecord<DungeonProperties>, string[]> = (dungeon) => {
  const [min, max] = levelCountBySize[dungeon.properties.size]
  const count = randomInRange(min, max)
  return Array.from({ length: count }, (_, i) => createLevel(dungeon.id, i + 1))
}

const dungeonConfig: Config<DungeonProperties> = {
  name:   { required: true, updater: dungeonNameUpdater },
  size:   { required: true, updater: dungeonSizeUpdater },
  levels: { required: true, updater: dungeonLevelsUpdater },
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export function generateDungeon(): { id: string } {
  const store = getDefaultStore()
  store.set(ItemState, [])
  store.set(ItemIndexState, [])
  return createItm(ConfigTypes.Dungeon, dungeonConfig)
}

// ---------------------------------------------------------------------------
// Generic property update — looks up the correct updater via config registry
// ---------------------------------------------------------------------------

const configRegistry: Record<string, Config<any>> = {
  [ConfigTypes.Monster]:  monsterConfig,
  [ConfigTypes.Treasure]: treasureConfig,
  [ConfigTypes.Room]:     roomConfig,
  [ConfigTypes.Level]:    levelConfig,
  [ConfigTypes.Dungeon]:  dungeonConfig,
}

export function updateProperty(id: string, key: string): void {
  const store = getDefaultStore()
  const item = store.get(ItemFamily(id)) as ItemRecord<any> | null
  if (!item) return
  const config = configRegistry[item.type]
  if (!config?.[key]) return
  store.set(ItemFamily(id), {
    ...item,
    properties: { ...item.properties, [key]: config[key].updater(item) },
  })
}
