import { Link } from "wouter"

// Simple landing index: a link to every app page, grouped by type. Keep this in
// sync with the routes in src/App.tsx when pages are added or removed.
type PageLink = { path: string; label: string }
type Group = { title: string; pages: PageLink[] }

const GROUPS: Group[] = [
  {
    title: "Generators",
    pages: [
      { path: "/base", label: "Wilderness Location Generator" },
      { path: "/geomorph", label: "Map Generator" },
      { path: "/character", label: "Character" },
    ],
  },
  {
    title: "Lab",
    pages: [
      { path: "/refactor/geomorph-dungeon", label: "Dungeon (bitmask)" },
      { path: "/lab/room-description", label: "Room Description Generator" },
      { path: "/lab/room-description/edit", label: "Room Description — template editor" },
    ],
  },
  {
    title: "Geomorphs — original",
    pages: [
      { path: "/geomorph-walk", label: "Drunken Walk" },
      { path: "/geomorph-dfs", label: "Backtracker" },
      { path: "/geomorph-bsp", label: "BSP Rooms" },
      { path: "/geomorph-ca", label: "Cave" },
      { path: "/geomorph-prim", label: "Prim's" },
      { path: "/geomorph-wfc", label: "WFC" },
    ],
  },
  {
    title: "Geomorphs — refactor",
    pages: [
      { path: "/refactor/geomorph", label: "Geomorph" },
      { path: "/refactor/geomorph-walk", label: "Drunken Walk" },
      { path: "/refactor/geomorph-dfs", label: "Backtracker" },
      { path: "/refactor/geomorph-bsp", label: "BSP Rooms" },
      { path: "/refactor/geomorph-ca", label: "Cave" },
      { path: "/refactor/geomorph-prim", label: "Prim's" },
      { path: "/refactor/geomorph-wfc", label: "WFC" },
    ],
  },
  {
    title: "Snapshots (frozen dungeon baselines)",
    pages: [
      { path: "/refactor/geomorph-dungeon-v1", label: "Dungeon v1" },
      { path: "/refactor/geomorph-dungeon-v2", label: "Dungeon v2" },
      { path: "/refactor/geomorph-dungeon-v3", label: "Dungeon v3" },
      { path: "/refactor/geomorph-dungeon-v4", label: "Dungeon v4" },
      { path: "/refactor/geomorph-dungeon-v5", label: "Dungeon v5" },
    ],
  },
  {
    title: "Hex terrain & transitions",
    pages: [
      { path: "/hex-terrain/wfc", label: "Hex Terrain WFC" },
      { path: "/refactor/hex-terrain/wfc", label: "Hex Terrain WFC (refactor)" },
      { path: "/refactor/hex-transitions/wfc", label: "Hex Transitions WFC" },
      { path: "/refactor/hex-transitions/v2", label: "Hex Transitions v2" },
    ],
  },
  {
    title: "Refactor experiments",
    pages: [
      { path: "/baseRefactor", label: "Wilderness Location (refactor)" },
      { path: "/config-character", label: "Config Character Generator" },
      { path: "/config-dungeon", label: "Config Dungeon Generator" },
    ],
  },
]

export function Home() {
  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", lineHeight: 1.6 }}>
      <h2>randomgen — page index</h2>
      {GROUPS.map(group => (
        <section key={group.title} style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 4 }}>{group.title}</h3>
          <ul style={{ margin: 0, paddingLeft: 22 }}>
            {group.pages.map(page => (
              <li key={page.path}>
                <Link href={page.path}>{page.label}</Link>{" "}
                <span style={{ color: "#888", fontSize: 12 }}>{page.path}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
