import { useState } from 'react'
import { useAtomValue, useStore } from 'jotai'
import { ItemFamily } from '../functions/state'
import {
  generateDungeon,
  dungeonNameUpdater, dungeonSizeUpdater,
  levelTypeUpdater, levelNameUpdater,
  roomNameUpdater,
  monsterNameUpdater,
  treasureNameUpdater, treasureValueUpdater,
} from '../functions/generate'
import { rerollProperty } from '../functions/basic'
import { DungeonProperties, LevelProperties, MonsterProperties, RoomProperties, TreasureProperties } from '../functions/models'
import { ItemRecord } from '../functions/types'

// ---------------------------------------------------------------------------
// Leaf views
// ---------------------------------------------------------------------------

function MonsterView({ id }: { id: string }) {
  const item = useAtomValue(ItemFamily(id)) as ItemRecord<MonsterProperties> | null
  if (!item) return null
  return (
    <li>
      <button onClick={() => rerollProperty<MonsterProperties>(id, 'name', monsterNameUpdater)}>
        {item.properties.name}
      </button>
    </li>
  )
}

function TreasureView({ id }: { id: string }) {
  const item = useAtomValue(ItemFamily(id)) as ItemRecord<TreasureProperties> | null
  if (!item) return null
  return (
    <li>
      <button onClick={() => rerollProperty<TreasureProperties>(id, 'name', treasureNameUpdater)}>
        {item.properties.name}
      </button>
      {' '}(
      <button onClick={() => rerollProperty<TreasureProperties>(id, 'value', treasureValueUpdater)}>
        {item.properties.value}
      </button>
      {' '}gp)
    </li>
  )
}

// ---------------------------------------------------------------------------
// Room view
// ---------------------------------------------------------------------------

function RoomView({ id }: { id: string }) {
  const item = useAtomValue(ItemFamily(id)) as ItemRecord<RoomProperties> | null
  if (!item) return null
  const { name, monsters, treasures } = item.properties

  return (
    <div style={{ marginLeft: 24, marginBottom: 8 }}>
      <strong>
        <button onClick={() => rerollProperty<RoomProperties>(id, 'name', roomNameUpdater)}>
          {name}
        </button>
      </strong>
      <ul style={{ margin: '4px 0 4px 16px' }}>
        {monsters.map(mid => <MonsterView key={mid} id={mid} />)}
      </ul>
      <ul style={{ margin: '4px 0 4px 16px' }}>
        {treasures.map(tid => <TreasureView key={tid} id={tid} />)}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Level view
// ---------------------------------------------------------------------------

function LevelView({ id, levelNumber }: { id: string; levelNumber: number }) {
  const item = useAtomValue(ItemFamily(id)) as ItemRecord<LevelProperties> | null
  if (!item) return null
  const { name, type, rooms } = item.properties

  return (
    <div style={{ marginLeft: 16, marginBottom: 12 }}>
      <h4 style={{ margin: '8px 0 4px' }}>
        Level {levelNumber}:{' '}
        <button onClick={() => rerollProperty<LevelProperties>(id, 'name', levelNameUpdater)}>{name}</button>
        {' '}
        <em style={{ fontWeight: 'normal' }}>
          (<button onClick={() => rerollProperty<LevelProperties>(id, 'type', levelTypeUpdater)}>{type}</button>)
        </em>
      </h4>
      {rooms.map(rid => <RoomView key={rid} id={rid} />)}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dungeon view
// ---------------------------------------------------------------------------

function DungeonView({ id }: { id: string }) {
  const item = useAtomValue(ItemFamily(id)) as ItemRecord<DungeonProperties> | null
  if (!item) return null
  const { name, size, levels } = item.properties

  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ margin: '0 0 4px' }}>
        <button onClick={() => rerollProperty<DungeonProperties>(id, 'name', dungeonNameUpdater)}>{name}</button>
        {' '}
        <em style={{ fontWeight: 'normal' }}>
          (<button onClick={() => rerollProperty<DungeonProperties>(id, 'size', dungeonSizeUpdater)}>{size}</button>)
        </em>
      </h3>
      {levels.map((lid, index) => <LevelView key={lid} id={lid} levelNumber={index + 1} />)}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function DungeonPage() {
  const [dungeonId, setDungeonId] = useState<string | null>(null)
  const store = useStore()

  function handleGenerate() {
    const { id } = generateDungeon()
    setDungeonId(id)
  }

  function handleDownload() {
    if (!dungeonId) return
    const dungeon = store.get(ItemFamily(dungeonId)) as ItemRecord<DungeonProperties> | null
    if (!dungeon) return

    const { name, size, levels } = dungeon.properties
    const lines: string[] = [`# ${name} (${size} dungeon)`]

    for (const lid of levels) {
      const level = store.get(ItemFamily(lid)) as ItemRecord<LevelProperties> | null
      if (!level) continue
      lines.push('', `## ${level.properties.name} (${level.properties.type})`)

      for (const rid of level.properties.rooms) {
        const room = store.get(ItemFamily(rid)) as ItemRecord<RoomProperties> | null
        if (!room) continue
        lines.push('', `### ${room.properties.name}`)

        if (room.properties.monsters.length > 0) {
          lines.push('', '**Monsters:**')
          for (const mid of room.properties.monsters) {
            const monster = store.get(ItemFamily(mid)) as ItemRecord<MonsterProperties> | null
            if (monster) lines.push(`- ${monster.properties.name}`)
          }
        }

        if (room.properties.treasures.length > 0) {
          lines.push('', '**Treasures:**')
          for (const tid of room.properties.treasures) {
            const treasure = store.get(ItemFamily(tid)) as ItemRecord<TreasureProperties> | null
            if (treasure) lines.push(`- ${treasure.properties.name} (${treasure.properties.value} gp)`)
          }
        }
      }
    }

    const md = lines.join('\n')
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Dungeon Generator</h2>
      <button onClick={handleGenerate}>Generate Dungeon</button>
      {dungeonId && <button onClick={handleDownload} style={{ marginLeft: 8 }}>Download Markdown</button>}
      {dungeonId && <DungeonView id={dungeonId} />}
    </div>
  )
}
