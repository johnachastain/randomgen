import { useState } from 'react'
import { useAtomValue, useStore } from 'jotai'
import { ItemFamily } from '../functions/state'
import { generateDungeon, updateProperty } from '../functions/generate'
import { DungeonProperties, LevelProperties, MonsterProperties, RoomProperties, TreasureProperties } from '../functions/models'
import { ItemRecord } from '../functions/types'

// ---------------------------------------------------------------------------
// Generic recursive view
// ---------------------------------------------------------------------------

function ItemView({ id }: { id: string }) {
  const item = useAtomValue(ItemFamily(id))
  if (!item) return null
  const entries = Object.entries(item.properties as Record<string, unknown>)
    .sort(([a], [b]) => a === 'name' ? -1 : b === 'name' ? 1 : 0)

  return (
    <div style={{ marginLeft: 0, marginBottom: 8 }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0' }}>
        {entries.map(([key, value]) => {
          if (Array.isArray(value)) {
            if (value.length === 0) return null
            return (
              <li key={key}>
                <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: '6px 10px', marginTop: 8 }}>
                  <strong>{key}:</strong>
                  <ul style={{ paddingLeft: 0 }}>
                    {(value as string[]).map(childId => (
                      <ItemView key={childId} id={childId} />
                    ))}
                  </ul>
                </div>
              </li>
            )
          }
          return (
            <li key={key}>
              <span style={{ color: '#888' }}>{key === 'name' ? item.type : key}: </span>
              <button onClick={() => updateProperty(id, key)}>
                {String(value)}
              </button>
            </li>
          )
        })}
      </ul>
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
      {dungeonId && <ItemView id={dungeonId} />}
    </div>
  )
}
