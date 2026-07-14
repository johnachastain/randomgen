// Bridge: turn a non-room MapElement into a short, reproducible description, mirroring roomDescribe.ts.
// Unlike rooms (the room-shaped mad-libs engine), elements use core/text's lighter tracery-lite `expand`
// + `fill` over a compact per-kind grammar driven by the element's own profile facts. Each element gets
// a per-element SUB-SEED (seed ^ kindSalt ^ num·φ) so its text is independent + stable across re-renders.

import { expand, fill, capitalize, type Grammar } from "../../core/text"
import { mulberry32, type Rng } from "../../core/rng"
import type { MapElement } from "./types"

const PHI = 0x9e3779b1
const KIND_SALT: Record<MapElement["kind"], number> = { hall: 0x1111, stair: 0x2222, connector: 0x3333, portal: 0x4444 }

const DIR: Record<string, string> = { n: "north", s: "south", e: "east", w: "west" }
const NUMWORD = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"]
const numWord = (n: number) => NUMWORD[n] ?? String(n)
const HALL_NOUN: Record<string, string> = { passage: "passage", gallery: "gallery", "flooded-channel": "water channel" }

// Build one sentence: expand #symbols#, then fill {slots} with concrete facts, then capitalize.
function sentence(template: string, grammar: Grammar, lookup: Record<string, string>, rng: Rng): string {
  return capitalize(fill(expand(template, grammar, rng), lookup))
}

export function describeElement(el: MapElement, seed: number): string[] {
  const rng = mulberry32((seed ^ KIND_SALT[el.kind] ^ (el.num * PHI)) >>> 0)

  if (el.kind === "hall") {
    const p = el.profile
    let t = `a #len# ${HALL_NOUN[p.type] ?? "passage"} #verb# between Room {a} and Room {b}`
    if (p.water) t += `, #wet#`
    if (p.levelChange !== 0) t += p.levelChange > 0 ? `, climbing toward the far end` : `, dropping toward the far end`
    t += `.`
    const grammar: Grammar = {
      len: ["long", "winding", "short", "narrow", "crooked", "straight"],
      verb: ["runs", "winds", "stretches", "leads", "threads"],
      wet: ["awash with black water", "half-submerged", "ankle-deep in still water", "slick with damp"],
    }
    return [sentence(t, grammar, { a: String(p.connects[0]), b: String(p.connects[1]) }, rng)]
  }

  if (el.kind === "stair") {
    const p = el.profile
    const climbing = p.levelDelta > 0
    const levels = Math.abs(p.levelDelta)
    let t = `a ${numWord(p.steps)}-step ${p.type} ${climbing ? "climbing" : "descending"} to the ${DIR[p.direction] ?? p.direction}`
    t += `, ${climbing ? "rising" : "dropping"} ${numWord(levels)} level${levels === 1 ? "" : "s"}`
    const [a, b] = p.connects
    if (a > 0 && b > 0) t += ` between Room {a} and Room {b}`
    else if (a > 0 || b > 0) t += ` from Room {x}`
    t += `.`
    return [sentence(t, {}, { a: String(a), b: String(b), x: String(a > 0 ? a : b) }, rng)]
  }

  if (el.kind === "connector") {
    const [a, b] = el.profile.joins
    let joinClause: string
    if (a > 0 && b > 0) joinClause = `joining Room {a} and Room {b}`
    else if (a > 0 || b > 0) joinClause = `opening from Room {x} onto a corridor`
    else joinClause = `set into a corridor wall`
    const t = `#adj.a# ${el.profile.style} ${joinClause}.` // .a → correct "a"/"an" for vowel-initial adjectives
    const grammar: Grammar = { adj: ["stout", "iron-bound", "heavy", "narrow", "low", "rotting", "oaken", "studded"] }
    return [sentence(t, grammar, { a: String(a), b: String(b), x: String(a > 0 ? a : b) }, rng)]
  }

  // portal
  const p = el.profile
  const dirClause = p.portalKind === "entrance" ? "climbing up and out of the level" : "dropping away into the deep"
  const t = `an ${p.portalKind} #pnoun# at the ${DIR[p.side] ?? p.side} edge, ${dirClause}.`
  const grammar: Grammar = { pnoun: ["stairwell", "shaft", "stair"] }
  return [sentence(t, grammar, {}, rng)]
}
