// Seeded pseudo-random number generator (T1). The 2nd `src/core/` resident (after naming).
// One shared, seedable PRNG so generation is reproducible: same seed → same output. Feature
// generators (dungeon map, naming, descriptions) take an `Rng` and default to Math.random, so
// seeding is opt-in and the unseeded path is unchanged.

// A 0..1 random source, drop-in compatible with Math.random.
export type Rng = () => number

// mulberry32 — a tiny, fast, well-distributed 32-bit PRNG (no dependency). Given the same seed
// it always yields the same sequence.
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// A fresh random 32-bit seed (for the unseeded path — pick a seed, then generate reproducibly
// from it, so the seed can be shown/shared to replay the exact result).
export function randomSeed(): number {
  return (Math.random() * 4294967296) >>> 0
}
