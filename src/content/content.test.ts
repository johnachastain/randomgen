import { describe, it, expect } from "vitest"
import { mulberry32 } from "../core/rng"
import { pickWeighted } from "../core/select"
import { validateTable } from "../core/select/schema"
import { NS, tag } from "../core/model"
import { cavern_adjective } from "../legacy/lists/original/dungeon_rooms"
import { createTableRegistry, contentRegistry, roomLabel, roomAdjectiveTable, roomObjectTable, roomSpecialTable } from "./index"

describe("content — adapted dungeon-room tables (Step 7)", () => {
  it("adapter produces non-empty, valid tables", () => {
    for (const t of [roomAdjectiveTable, roomObjectTable, roomSpecialTable]) {
      expect(t.length).toBeGreaterThan(0)
      expect(validateTable(t).ok).toBe(true)
    }
  })

  it("every row carries a theme:* tag", () => {
    for (const [, tags] of roomAdjectiveTable) {
      expect(tags.some(t => t.startsWith(`${NS.theme}:`))).toBe(true)
    }
  })

  it("theme tagging is faithful: include theme:cavern → only cavern_adjective words", () => {
    const cavern = new Set(cavern_adjective)
    const rng = mulberry32(4)
    for (let i = 0; i < 500; i++) {
      const w = pickWeighted(roomAdjectiveTable, rng, { include: [tag(NS.theme, "cavern")] })[0]
      expect(cavern.has(w)).toBe(true)
    }
  })
})

describe("content — table registry", () => {
  it("registers, queries, and lists ids", () => {
    expect(contentRegistry.has("room-adjective")).toBe(true)
    expect(contentRegistry.ids()).toEqual(expect.arrayContaining(["room-adjective", "room-object", "room-special"]))
    expect(contentRegistry.get("room-object").length).toBeGreaterThan(0)
  })

  it("get() throws on unknown id", () => {
    expect(() => contentRegistry.get("nope")).toThrow()
  })

  it("register() rejects a malformed table", () => {
    const reg = createTableRegistry()
    expect(() => reg.register("bad", [["A", [], "1"]] as never)).toThrow()
  })
})

describe("content — roomLabel consumer", () => {
  it("produces a non-empty themed phrase, seeded/deterministic", () => {
    const gen = (seed: number) => { const r = mulberry32(seed); return Array.from({ length: 10 }, () => roomLabel("cavern", r)) }
    const a = gen(123)
    for (const label of a) { expect(label.length).toBeGreaterThan(0); expect(label).toContain(" ") }
    expect(gen(123)).toEqual(a) // deterministic
  })
})
