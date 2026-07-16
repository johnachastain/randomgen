// Rough-edge geometry now lives in the shared core module `src/core/tile-roughness/`
// (consumed by both this studio and `scripts/generateDungeonTiles.ts`). Re-exported here so
// the studio's imports stay stable.
export { roughen, linePath, smoothPath, edgePath, point } from '../../core/tile-roughness'
export type { Pt, EdgeMode, RoughEdgeConfig } from '../../core/tile-roughness'
