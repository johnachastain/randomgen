import { describe, it, expect } from "vitest"
import { mulberry32 } from "../rng"
import { rootContext } from "../model"
import { createItem, rerollProperty, createRegistry, type Config } from "./index"

// A tiny example object type for the tests.
type Widget = { size: "small" | "large"; label: string; tagged: boolean }

const widgetConfig: Config<Widget> = {
  size: { updater: (_i, _ctx, rng) => (rng() < 0.5 ? "small" : "large") },
  // cross-property: label reads the already-generated size
  label: { updater: (i) => `${i.properties.size}-widget` },
  // context influence: tagged iff the ctx carries "special"
  tagged: { updater: (_i, ctx) => ctx.tags.includes("special") },
}

describe("core/config — createItem (Step 6a)", () => {
  it("runs rules in order; later rules see earlier properties", () => {
    const item = createItem("widget", widgetConfig, rootContext(1), mulberry32(1), { id: "w1" })
    expect(item.type).toBe("widget")
    expect(item.id).toBe("w1")
    expect(item.properties.label).toBe(`${item.properties.size}-widget`)
  })

  it("threads the GenContext into rules", () => {
    const rng = mulberry32(1)
    expect(createItem("widget", widgetConfig, rootContext(1, ["special"]), rng).properties.tagged).toBe(true)
    expect(createItem("widget", widgetConfig, rootContext(1), rng).properties.tagged).toBe(false)
  })

  it("is deterministic for a given seed", () => {
    const gen = (seed: number) => createItem("widget", widgetConfig, rootContext(seed), mulberry32(seed)).properties
    expect(gen(42)).toEqual(gen(42))
  })
})

describe("core/config — rerollProperty (pure/immutable)", () => {
  it("returns a new item with one property changed, original untouched", () => {
    const item = createItem("widget", widgetConfig, rootContext(1), mulberry32(1), { id: "w1" })
    const next = rerollProperty(item, "label", () => "custom", rootContext(1), mulberry32(2))
    expect(next.properties.label).toBe("custom")
    expect(next.properties.size).toBe(item.properties.size) // untouched
    expect(item.properties.label).not.toBe("custom")        // original not mutated
    expect(next).not.toBe(item)
  })
})

describe("core/config — registry", () => {
  it("registers, queries, and creates by type", () => {
    const reg = createRegistry()
    expect(reg.has("widget")).toBe(false)
    reg.register<Widget>("widget", widgetConfig)
    expect(reg.has("widget")).toBe(true)
    expect(reg.types()).toEqual(["widget"])
    expect(reg.get<Widget>("widget")).toBe(widgetConfig)
    const item = reg.create<Widget>("widget", rootContext(1), mulberry32(1), { id: "w2" })
    expect(item.id).toBe("w2")
    expect(item.properties.label).toContain("widget")
  })

  it("throws when creating an unregistered type", () => {
    const reg = createRegistry()
    expect(() => reg.create("missing", rootContext(1), mulberry32(1))).toThrow()
  })
})
