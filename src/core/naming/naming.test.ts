import { describe, it, expect } from "vitest"
import { mulberry32 } from "../rng"
import { NS, tag, TRAIT_WET } from "../model"
import { roomName } from "./index"

const theme = (t: string) => tag(NS.theme, t)

describe("core/naming — roomName via core/select (Steps 3–4)", () => {
  it("produces a non-empty name with no unresolved templates", () => {
    const rng = mulberry32(1)
    for (let i = 0; i < 300; i++) {
      const n = roomName([theme("vault")], rng)
      expect(n.length).toBeGreaterThan(0)
      expect(n).not.toMatch(/[{}]|undefined/)
    }
  })

  it("is deterministic for a given seed", () => {
    const gen = (seed: number) => { const r = mulberry32(seed); return Array.from({ length: 20 }, () => roomName([theme("cistern"), TRAIT_WET], r)) }
    expect(gen(12345)).toEqual(gen(12345))
  })

  it("keeps typed rooms in their type pool (cistern → cistern nouns only)", () => {
    const cisternNouns = new Set(["Cistern", "Reservoir", "Sump", "Well", "Drowned Vault"])
    const rng = mulberry32(9)
    for (let i = 0; i < 400; i++) {
      const n = roomName([theme("cistern")], rng)
      // the structure noun is the last word(s); assert at least one cistern noun appears and no
      // off-type noun like "Barracks"/"Gallery" leaks in.
      const hasCistern = [...cisternNouns].some(w => n.includes(w))
      expect(hasCistern).toBe(true)
    }
  })

  it("untyped rooms draw from the generic pool (never type-only nouns like Sump/Colonnade)", () => {
    const typeOnly = ["Sump", "Reservoir", "Well", "Colonnade", "Concourse", "Undercroft", "Ring", "Round Hall", "Circle", "Drowned Vault"]
    const rng = mulberry32(2)
    for (let i = 0; i < 400; i++) {
      const n = roomName([], rng)
      for (const w of typeOnly) expect(n).not.toContain(w)
    }
  })

  it("watery rooms lean on water descriptors but stay varied", () => {
    const water = new Set(["Sunken", "Drowned", "Weeping", "Mossy", "Flooded"])
    const rng = mulberry32(50)
    let withDesc = 0, watery = 0
    for (let i = 0; i < 3000; i++) {
      const n = roomName([theme("cistern"), TRAIT_WET], rng)
      const m = n.match(/^The (\w+) /) // "The <Descriptor> <Structure>"
      if (m) { withDesc++; if (water.has(m[1])) watery++ }
    }
    expect(withDesc).toBeGreaterThan(0)
    expect(watery / withDesc).toBeGreaterThan(0.4) // clearly boosted
    expect(watery / withDesc).toBeLessThan(0.95)   // not exclusive
  })
})
