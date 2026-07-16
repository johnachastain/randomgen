// The pre-generated tiles this prototype uses, beyond the cave skin in caveTileConfig.ts.
// Only stairs + portal markers — caves have no doors, pillars, water trim, or wall/corner fringe, so
// the dungeon's other ~10 tile manifests don't come along.
//
// The SVGs themselves stay shared with the dungeon (generated assets are shared; code is forked —
// see plans/cave-prototypes.md). Fork scripts/generateDungeonTiles.ts only when a prototype needs art
// the shared set can't give it.

export const STAIR_TILES = { n: "/dungeonTiles/stairs_n.svg", s: "/dungeonTiles/stairs_s.svg", e: "/dungeonTiles/stairs_e.svg", w: "/dungeonTiles/stairs_w.svg" }

export const PORTAL_TILES = { entrance: "/dungeonTiles/portal_entrance.svg", exit: "/dungeonTiles/portal_exit.svg" }
