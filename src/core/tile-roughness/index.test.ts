import { describe, it, expect } from 'vitest'
import { mulberry32 } from '../rng'
import { roughen, linePath, smoothPath, point } from './index'

const clean = () => [point(0, 0, true), point(100, 0, true), point(100, 100, true), point(0, 100, true)]

describe('tile-roughness', () => {
  it('is deterministic for a given seed', () => {
    const a = roughen(clean(), 4, 6, mulberry32(42), true)
    const b = roughen(clean(), 4, 6, mulberry32(42), true)
    expect(a).toEqual(b)
  })

  it('produces different output for different seeds', () => {
    const a = roughen(clean(), 4, 6, mulberry32(1), true)
    const b = roughen(clean(), 4, 6, mulberry32(2), true)
    expect(a).not.toEqual(b)
  })

  it('pins the original vertices (un-displaced) so tiles connect seamlessly', () => {
    const src = clean()
    const out = roughen(src, 4, 20, mulberry32(7), true)
    // Every emitted vertex flagged pin must sit exactly on an original clean vertex.
    const cleanKeys = new Set(src.map(p => `${p.x},${p.y}`))
    for (const p of out) {
      if (p.pin) expect(cleanKeys.has(`${p.x},${p.y}`)).toBe(true)
    }
    // ...and each original vertex appears once, unmoved.
    expect(out.filter(p => p.pin).length).toBe(src.length)
  })

  it('amp 0 leaves points on their clean vertices', () => {
    const out = roughen(clean(), 4, 0, mulberry32(9), true)
    for (const p of out) {
      expect(Number.isInteger(p.x) && (p.x === 0 || p.x === 25 || p.x === 50 || p.x === 75 || p.x === 100)).toBe(true)
    }
  })

  it('emits valid path strings', () => {
    const pts = clean()
    expect(linePath(pts, true).startsWith('M ')).toBe(true)
    expect(linePath(pts, true).endsWith('Z')).toBe(true)
    expect(smoothPath(pts, true)).toContain('C')
  })
})
