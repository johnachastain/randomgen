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
      { path: "/refactor/geomorph-dungeon", label: "Dungeon (bitmask)" },
      { path: "/refactor/geomorph-dungeon-v1", label: "Dungeon v1 (frozen baseline)" },
      { path: "/refactor/geomorph-dungeon-v2", label: "Dungeon v2 (frozen baseline)" },
      { path: "/refactor/geomorph-dungeon-v3", label: "Dungeon v3 (frozen baseline)" },
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
      { path: "/refactor3", label: "Refactor 3" },
      { path: "/refactor4", label: "Refactor 4" },
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
