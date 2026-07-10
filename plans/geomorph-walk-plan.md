# Geomorph Drunken Walk Variation — Implementation Plan

## Context

The existing geomorph feature (`src/pages/geomorph/`, `src/geomorph/`) generates a tile-based map grid using a **neighbor-edge-matching** algorithm: it iterates the grid left-to-right/top-to-bottom, and for each cell picks a tile image whose edges match the already-placed neighbors. This is constraint-satisfaction driven.

The new variation uses a **drunken walk** (random walk) algorithm instead: a walker starts at a random outer-edge cell, stumbles through the grid marking cells as "path", and the path topology determines which tile image each cell gets. Non-visited cells are solid walls.

This variation lives in `src/geomorph-walk/` — a peer of `src/configCharacterGen/` (was `refactor3`). (The old `src/refactor/` and `src/refactor2/` experiments have since been archived under `src/snapshots/`.) It is wired into the router as a new route (e.g., `/geomorph-walk`). The click-to-edit tile overlay from the original implementation is preserved.

Goal: **maximum simplicity and readability** — no external state library, minimal abstraction.

---

## Folder Structure

```
src/geomorph-walk/
├── types.ts          — Cell and Grid type definitions (< 30 lines)
├── config.ts         — re-export tile image configs from src/geomorph/geomorphConfig.ts
├── walk.ts           — drunken walk algorithm (pure function, ~40 lines)
├── tiles.ts          — assign tile images to cells after walk (pure function, ~40 lines)
├── Tile.tsx          — single tile: image + click-to-edit overlay (< 80 lines)
└── Page.tsx          — page: state, controls (rows/cols/regenerate), grid render (< 80 lines)
```

Route added to `src/App.tsx`: `/geomorph-walk` → `<GeomorphWalkPage />`

---

## Types (`types.ts`)

```typescript
export type Direction = "top" | "right" | "bottom" | "left"

export type Cell = {
  col: number
  row: number
  isPath: boolean
  connects: Record<Direction, boolean>  // which edges connect to another path cell
  src: string                           // tile image path, e.g. "./png/03.png"
}

export type Grid = Cell[][]
```

---

## Algorithm: `walk.ts`

Pure function. Takes `cols` and `rows`, returns a `Set<string>` of visited cell keys (`"col,row"`).

```
drunkenWalk(cols, rows, steps?):
  1. Pick a random starting cell on any outer edge
  2. current = startCell
  3. visited = new Set([key(current)])
  4. Repeat for (steps ?? cols * rows * 3) iterations:
     a. Pick a random direction: up / down / left / right
     b. Compute next = current + direction
     c. If next is within bounds: current = next, visited.add(key(next))
     d. If out of bounds: skip (stay in place), try again next step
  5. Return visited
```

The walk naturally self-intersects, creating loops and dead-ends — this is the desired dungeon feel.

---

## Tile Assignment: `tiles.ts`

Pure function. Takes the `Set<string>` from the walk and the grid dimensions. Returns a `Grid`.

```
buildGrid(visited, cols, rows):
  For each cell (col, row):
    isPath = visited.has(key(col, row))

    If isPath:
      connects = {
        top:    visited.has(key(col, row-1)),
        right:  visited.has(key(col+1, row)),
        bottom: visited.has(key(col, row+1)),
        left:   visited.has(key(col-1, row)),
      }
      src = pickTileImage(connects)   // same matching logic as current geomorphs
    Else:
      connects = all false
      src = solidTileImage            // e.g. "./png/37.png"

  Return grid
```

`pickTileImage(connects)` reuses the existing `getGeomorphsByEdges()` logic from `src/geomorph/geomorphs.ts` — no new matching code needed.

---

## Tile Component: `Tile.tsx`

Mirrors `MapItem.tsx` from the original. Props:

```typescript
{ cell: Cell, onEdit: (cell: Cell) => void }
```

Renders:
- `<img src={cell.src} />`
- If `cell === editingCell`: overlay with 4 edge-direction checkboxes, Save and Close buttons

When the user saves an edited tile, `onEdit` is called with the updated `Cell`. The parent (`Page.tsx`) updates that cell in state and then re-evaluates all 4 neighbors: each neighbor's `connects` is recalculated based on its current path neighbors (including the newly edited cell), and its `src` is re-selected via `pickTileImage()`.

---

## Page Component: `Page.tsx`

All state lives here in plain `useState`:

```typescript
const [cols, setCols] = useState(5)
const [rows, setRows] = useState(5)
const [grid, setGrid] = useState<Grid>(() => generateGrid(cols, rows))
const [editingCell, setEditingCell] = useState<Cell | null>(null)
```

`generateGrid(cols, rows)`: calls `drunkenWalk()` then `buildGrid()` — one line each.

Controls: sliders for cols/rows (regenerate on change), a Regenerate button.

CSS grid layout: `grid-template-columns: repeat(cols, 1fr)`.

---

## Reuse from Existing Geomorph Code

| Existing file | What to reuse |
|---|---|
| `src/geomorph/geomorphConfig.ts` | Tile config array (import directly or re-export via `config.ts`) |
| `src/geomorph/geomorphs.ts` | `getGeomorphsByEdges()` for tile image selection |
| `src/geomorph/Geomorph.ts` | `Edge`, `Edges`, `Geomorph` types (import directly) |
| `public/png/*.png` | Same tile images, no changes |

The walk variation does **not** use Recoil or Jotai — state stays local to `Page.tsx`.

---

## Route Wiring (`src/App.tsx`)

Add one import and one `<Route>`:

```tsx
import GeomorphWalkPage from "./geomorph-walk/Page"
// ...
<Route path="/geomorph-walk" component={GeomorphWalkPage} />
```

Add a nav link in `src/components/Header.tsx` if applicable.

---

## Key Design Decisions

1. **No state library** — `useState` in `Page.tsx` is enough; keep it visible and obvious.
2. **Neighbor cascade on edit** — when a user saves an edited tile, all 4 adjacent tiles are re-evaluated: their `connects` object is updated to reflect the new neighbor state, and their `src` is re-selected via `pickTileImage()`. This mirrors the original's `updateNeighbors()` behavior and keeps the grid visually consistent after manual edits.
3. **Two-pass generation** — walk first, assign images second. Easier to reason about than interleaved constraint satisfaction.
4. **Reuse tile images and matching logic** — the walk changes *how* connectivity is determined, not *which images* represent connectivity.
5. **`steps` defaults to `cols * rows * 3`** — ensures a reasonably dense path without requiring a UI control. Can be exposed later if desired.

---

## Verification

1. `npm run dev` — visit `/geomorph-walk`, confirm grid renders
2. Vary cols/rows — confirm grid updates and walk produces visually varied results
3. Click a tile — confirm overlay appears with edge checkboxes
4. Change checkboxes, click Save — confirm tile image updates correctly
5. Click Close — confirm no change
6. `npm run lint` — zero warnings
7. `tsc --noEmit` — no type errors
