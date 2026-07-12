import { describe, it, expect } from "vitest"
import { validateTable, RowSchema } from "./schema"
import { pickWeighted } from "./index"
import { mulberry32 } from "../rng"

describe("core/select — table validation (Step 6b, zod)", () => {
  it("accepts a well-formed table and returns it typed", () => {
    const data = [["Vault", ["theme:vault"], 1], ["Cistern", ["theme:cistern"], 3]]
    const res = validateTable(data)
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.table).toEqual(data)
      // the validated table is usable by the engine
      expect(typeof pickWeighted(res.table, mulberry32(1))[0]).toBe("string")
    }
  })

  it("accepts an empty tags array and weight 0", () => {
    expect(validateTable([["A", [], 0]]).ok).toBe(true)
  })

  it("rejects a non-array", () => {
    expect(validateTable({ nope: true }).ok).toBe(false)
    expect(validateTable("x").ok).toBe(false)
  })

  it("rejects malformed rows (bad arity / types)", () => {
    expect(validateTable([["A", []]]).ok).toBe(false)              // missing weight
    expect(validateTable([["A", [], "1"]]).ok).toBe(false)          // weight not a number
    expect(validateTable([["A", "theme:x", 1]]).ok).toBe(false)     // tags not an array
    expect(validateTable([[1, [], 1]]).ok).toBe(false)              // value not a string
  })

  it("rejects an empty value and a negative weight", () => {
    expect(validateTable([["", [], 1]]).ok).toBe(false)
    expect(validateTable([["A", [], -2]]).ok).toBe(false)
  })

  it("reports readable errors with a path", () => {
    const res = validateTable([["A", [], "bad"]])
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.errors.length).toBeGreaterThan(0)
      expect(res.errors[0]).toMatch(/0\.2/) // row 0, element 2 (weight)
    }
  })

  it("round-trips a JSON-loaded table", () => {
    const json = JSON.stringify([["Ossuary", ["theme:tomb"], 2], ["Grotto", ["theme:cavern"], 1]])
    const res = validateTable(JSON.parse(json))
    expect(res.ok).toBe(true)
  })

  it("RowSchema validates a single row", () => {
    expect(RowSchema.safeParse(["A", ["t"], 1]).success).toBe(true)
    expect(RowSchema.safeParse(["A", ["t"]]).success).toBe(false)
  })
})
