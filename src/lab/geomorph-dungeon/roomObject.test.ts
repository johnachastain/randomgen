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

  it("inherits root-context tags (a dungeon-level theme flows down)", () => {
    // profileToTags(cistern) has no rotunda tag; a root theme:rotunda comes first in the child ctx →
    // the structure noun is drawn from the rotunda pool (parent→child inheritance in action).
    const rotundaNouns = new Set(["Rotunda", "Ring", "Round Hall", "Circle"])
    const root = rootContext(5, ["theme:rotunda"])
    const rng = mulberry32(5)
    let hits = 0
    for (let i = 0; i < 200; i++) {
      const name = buildRoomObject(profile, root, rng, i).properties.name
      if ([...rotundaNouns].some(w => name.includes(w))) hits++
    }
    expect(hits).toBeGreaterThan(0) // the inherited theme reached the room's name rule
  })
})
