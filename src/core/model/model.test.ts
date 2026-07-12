import { describe, it, expect } from "vitest"
import { NS, tag, TRAIT_WET, rootContext, childContext } from "./index"

describe("core/model — taxonomy + GenContext (Step 4)", () => {
  it("tag() builds namespaced tokens", () => {
    expect(tag(NS.theme, "cistern")).toBe("theme:cistern")
    expect(tag(NS.water, "full")).toBe("water:full")
    expect(TRAIT_WET).toBe("trait:wet")
  })

  it("rootContext holds the seed and starting tags", () => {
    const c = rootContext(42, ["theme:crypt"])
    expect(c.seed).toBe(42)
    expect(c.tags).toEqual(["theme:crypt"])
    expect(rootContext(1).tags).toEqual([])
  })

  it("childContext inherits parent tags (parent-first) and shares the seed", () => {
    const root = rootContext(7, ["theme:crypt"])
    const child = childContext(root, ["water:full", TRAIT_WET])
    expect(child.seed).toBe(7)
    expect(child.tags).toEqual(["theme:crypt", "water:full", "trait:wet"])
    // parent is not mutated
    expect(root.tags).toEqual(["theme:crypt"])
  })
})
