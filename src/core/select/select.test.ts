import { describe, it, expect } from "vitest"
import { mulberry32 } from "../rng"
import { row, pickWeighted, type Table } from "./index"

describe("core/select — pickWeighted (Step 1)", () => {
  it("row() builds a labeled tuple with defaults", () => {
    expect(row("A")).toEqual(["A", [], 1])
    expect(row("B", ["t"], 3)).toEqual(["B", ["t"], 3])
  })

  it("always returns the sole positive-weight row", () => {
    const t: Table = [["A", [], 1]]
    const rng = mulberry32(1)
    for (let i = 0; i < 50; i++) expect(pickWeighted(t, rng)[0]).toBe("A")
  })

  it("never returns a weight<=0 row", () => {
    const t: Table = [["A", [], 0], ["B", [], 1], ["C", [], 0]]
    const rng = mulberry32(7)
    for (let i = 0; i < 200; i++) expect(pickWeighted(t, rng)[0]).toBe("B")
  })

  it("is deterministic for a given seed", () => {
    const t: Table = [["A", [], 1], ["B", [], 1], ["C", [], 2]]
    const seqA = Array.from({ length: 20 }, (() => { const r = mulberry32(12345); return () => pickWeighted(t, r)[0] })())
    const seqB = Array.from({ length: 20 }, (() => { const r = mulberry32(12345); return () => pickWeighted(t, r)[0] })())
    expect(seqA).toEqual(seqB)
  })

  it("respects weights proportionally over many picks", () => {
    const t: Table = [["A", [], 3], ["B", [], 1]] // expect ~75% A / ~25% B
    const rng = mulberry32(999)
    const N = 4000
    let a = 0
    for (let i = 0; i < N; i++) if (pickWeighted(t, rng)[0] === "A") a++
    const ratio = a / N
    expect(ratio).toBeGreaterThan(0.70)
    expect(ratio).toBeLessThan(0.80)
  })

  it("supports non-integer weights", () => {
    const t: Table = [["A", [], 0.25], ["B", [], 0.75]]
    const rng = mulberry32(42)
    const N = 4000
    let b = 0
    for (let i = 0; i < N; i++) if (pickWeighted(t, rng)[0] === "B") b++
    const ratio = b / N
    expect(ratio).toBeGreaterThan(0.70)
    expect(ratio).toBeLessThan(0.80)
  })

  it("throws when no row has a positive weight", () => {
    expect(() => pickWeighted([], mulberry32(1))).toThrow()
    expect(() => pickWeighted([["A", [], 0]], mulberry32(1))).toThrow()
  })
})

describe("core/select — tag-aware selection (Step 2)", () => {
  it("include is a hard AND filter (row must have all include tags)", () => {
    const t: Table = [["A", ["theme:cave"], 1], ["B", ["theme:tomb"], 1], ["C", ["theme:cave", "rarity:rare"], 1]]
    const rng = mulberry32(3)
    for (let i = 0; i < 200; i++) {
      const v = pickWeighted(t, rng, { include: ["theme:cave"] })[0]
      expect(["A", "C"]).toContain(v) // B excluded (no theme:cave)
    }
  })

  it("exclude drops any row carrying an excluded tag", () => {
    const t: Table = [["A", ["rarity:rare"], 1], ["B", [], 1], ["C", ["rarity:rare"], 1]]
    const rng = mulberry32(5)
    for (let i = 0; i < 200; i++) expect(pickWeighted(t, rng, { exclude: ["rarity:rare"] })[0]).toBe("B")
  })

  it("soft-boost biases matching rows but never excludes off-theme rows", () => {
    // A matches theme:cave (weight ×2), B does not (weight ×1) → ~2:1, but B still appears.
    const t: Table = [["A", ["theme:cave"], 1], ["B", [], 1]]
    const rng = mulberry32(21)
    const N = 4000
    let a = 0, b = 0
    for (let i = 0; i < N; i++) (pickWeighted(t, rng, { tags: ["theme:cave"] })[0] === "A" ? a++ : b++)
    expect(b).toBeGreaterThan(0) // off-theme never excluded
    expect(a / N).toBeGreaterThan(0.60)
    expect(a / N).toBeLessThan(0.72) // ~0.667
  })

  it("more matching tags → stronger boost", () => {
    // A matches 2 tags (×3), B matches 1 (×2), C matches 0 (×1).
    const t: Table = [["A", ["theme:cave", "wet"], 1], ["B", ["theme:cave"], 1], ["C", [], 1]]
    const rng = mulberry32(88)
    const N = 6000
    const c: Record<string, number> = { A: 0, B: 0, C: 0 }
    for (let i = 0; i < N; i++) c[pickWeighted(t, rng, { tags: ["theme:cave", "wet"] })[0]]++
    expect(c.A).toBeGreaterThan(c.B)
    expect(c.B).toBeGreaterThan(c.C)
    expect(c.C).toBeGreaterThan(0)
  })

  it("boost:0 disables the soft-boost (matches don't change weight)", () => {
    const t: Table = [["A", ["theme:cave"], 1], ["B", [], 1]]
    const rng = mulberry32(4)
    const N = 4000
    let a = 0
    for (let i = 0; i < N; i++) if (pickWeighted(t, rng, { tags: ["theme:cave"], boost: 0 })[0] === "A") a++
    expect(a / N).toBeGreaterThan(0.45)
    expect(a / N).toBeLessThan(0.55) // ~0.5, no bias
  })

  it("empty ctx matches Step 1 behavior (deterministic)", () => {
    const t: Table = [["A", ["x"], 1], ["B", ["y"], 2]]
    const seq = (ctx?: object) => Array.from({ length: 15 }, (() => { const r = mulberry32(77); return () => pickWeighted(t, r, ctx)[0] })())
    expect(seq({})).toEqual(seq(undefined))
  })

  it("throws when a hard filter leaves nothing eligible", () => {
    const t: Table = [["A", ["theme:cave"], 1]]
    expect(() => pickWeighted(t, mulberry32(1), { include: ["theme:tomb"] })).toThrow()
    expect(() => pickWeighted(t, mulberry32(1), { exclude: ["theme:cave"] })).toThrow()
  })
})
