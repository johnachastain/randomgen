import { describe, it, expect } from "vitest"
import { mulberry32 } from "../../core/rng"
import { rootContext, childContext } from "../../core/model"
import { roomName } from "../../core/naming"
import type { RoomProfile } from "./types"
import { profileToTags } from "./roomTags"
import { buildRoomObject } from "./roomObject"

const profile: RoomProfile = {
  type: "cistern", material: "masonry", size: "large", water: "full",
  pillared: false, shape: "rect", elevation: 0, connectors: 2, features: [],
}

describe("geomorph-dungeon — room as a config object (Step 8)", () => {
  it("builds an ItemRecord with tree metadata + a generated name", () => {
    const item = buildRoomObject(profile, rootContext(1), mulberry32(1), 3)
    expect(item.type).toBe("room")
    expect(item.id).toBe("room-3")
    expect(item.parentId).toBe("dungeon")
    expect(item.properties.name.length).toBeGreaterThan(0)
  })

  it("is behavior-preserving: name === the direct roomName(ctx.tags, rng)", () => {
    const seed = 999
    const viaObject = buildRoomObject(profile, rootContext(seed), mulberry32(seed), 1).properties.name
    const ctx = childContext(rootContext(seed), profileToTags(profile))
    const direct = roomName(ctx.tags, mulberry32(seed))
    expect(viaObject).toBe(direct)
  })

  it("is deterministic for a given seed", () => {
    const gen = (seed: number) => buildRoomObject(profile, rootContext(seed), mulberry32(seed), 1).properties.name
    expect(gen(42)).toBe(gen(42))
  })

  it("inherits root-context tags: a dungeon theme colors the MOOD, the room's own theme keeps the noun", () => {
    // profile = cistern (own type, added LAST → drives the structure noun); a root theme:crypt (inherited,
    // FIRST) soft-boosts the descriptor toward the crypt mood. Parent → child inheritance, mood-coloring.
    const cisternNouns = ["Cistern", "Reservoir", "Sump", "Well", "Drowned Vault"]
    const cryptMood = new Set(["Silent", "Grim", "Forgotten", "Withered", "Hollow", "Bloodied"])
    const withRng = mulberry32(5), baseRng = mulberry32(5)
    let structOwn = 0, moodWith = 0, moodBase = 0
    for (let i = 0; i < 400; i++) {
      const name = buildRoomObject(profile, rootContext(5, ["theme:crypt"]), withRng, i).properties.name
      if (cisternNouns.some(w => name.includes(w))) structOwn++ // own theme wins for structure
      const m = name.match(/^The (\w+) /); if (m && cryptMood.has(m[1])) moodWith++
      const base = buildRoomObject(profile, rootContext(5), baseRng, i).properties.name
      const mb = base.match(/^The (\w+) /); if (mb && cryptMood.has(mb[1])) moodBase++
    }
    expect(structOwn).toBe(400)                 // every name keeps a cistern noun — inherited theme never overrides structure
    expect(moodWith).toBeGreaterThan(moodBase)  // the inherited crypt theme reached the descriptor mood
  })
})
