import { describe, it, expect } from "vitest"
import { mulberry32 } from "../rng"
import type { Table } from "../select"
import { fill, capitalize, article, expand, type Grammar } from "./index"

describe("core/text — helpers", () => {
  it("fill substitutes {key} and leaves unknown keys", () => {
    expect(fill("The {x} and {y}.", { x: "cat", y: "dog" })).toBe("The cat and dog.")
    expect(fill("Hi {missing}.", {})).toBe("Hi {missing}.")
  })
  it("capitalize + article", () => {
    expect(capitalize("hall")).toBe("Hall")
    expect(capitalize("")).toBe("")
    expect(article("Cistern")).toBe("a")
    expect(article("Oubliette")).toBe("an")
    expect(article("  ancient")).toBe("an")
  })
})

describe("core/text — expand (tracery-lite, Step 5)", () => {
  const grammar: Grammar = {
    adj: ["sunken", "grim", "mossy"],
    noun: ["Vault", "Cistern"],
    phrase: ["#adj# #noun#"],           // recursion: a value that references more symbols
  }

  it("expands a #symbol# from a string[] pool", () => {
    const out = expand("The #noun#.", grammar, mulberry32(1))
    expect(["The Vault.", "The Cistern."]).toContain(out)
  })

  it("recursively expands nested symbols", () => {
    const out = expand("#phrase#", grammar, mulberry32(3))
    expect(out).toMatch(/^(sunken|grim|mossy) (Vault|Cistern)$/)
  })

  it("applies .capitalize and .a modifiers", () => {
    expect(expand("#noun.capitalize#", { noun: ["vault"] }, mulberry32(1))).toBe("Vault")
    expect(expand("#noun.a#", { noun: ["oubliette"] }, mulberry32(1))).toBe("an oubliette")
    expect(expand("#noun.a#", { noun: ["vault"] }, mulberry32(1))).toBe("a vault")
  })

  it("leaves unknown or empty symbols literal", () => {
    expect(expand("a #bogus# b", grammar, mulberry32(1))).toBe("a #bogus# b")
    expect(expand("x #empty# y", { empty: [] }, mulberry32(1))).toBe("x #empty# y")
  })

  it("is deterministic for a given seed", () => {
    const gen = (seed: number) => { const r = mulberry32(seed); return Array.from({ length: 15 }, () => expand("#phrase#", grammar, r)) }
    expect(gen(77)).toEqual(gen(77))
  })

  it("draws from a weighted Table pool and honours ctx tag-boost", () => {
    const g: Grammar = { s: [["Cave", ["theme:cave"], 1], ["Hall", [], 1]] as Table }
    const rng = mulberry32(21)
    let cave = 0
    const N = 3000
    for (let i = 0; i < N; i++) if (expand("#s#", g, rng, { tags: ["theme:cave"] }) === "Cave") cave++
    expect(cave / N).toBeGreaterThan(0.60) // boosted (~0.667), off-theme still appears
    expect(cave / N).toBeLessThan(0.72)
  })
})
