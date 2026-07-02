import { Link, useLocation } from "wouter"

const PAGES = [
  { path: "/refactor/geomorph",      label: "Geomorph" },
  { path: "/refactor/geomorph-walk", label: "Drunken Walk" },
  { path: "/refactor/geomorph-dfs",  label: "Backtracker" },
  { path: "/refactor/geomorph-bsp",  label: "BSP Rooms" },
  { path: "/refactor/geomorph-ca",   label: "Cave" },
  { path: "/refactor/geomorph-prim", label: "Prim's" },
  { path: "/refactor/geomorph-wfc",  label: "WFC" },
  { path: "/refactor/geomorph-dungeon", label: "Dungeon (bitmask)" },
]

export function GeomorphNav() {
  const [location] = useLocation()

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
      {PAGES.map(({ path, label }) => (
        <Link key={path} href={path}>
          <button style={{ fontWeight: location === path ? "bold" : "normal" }}>
            {label}
          </button>
        </Link>
      ))}
    </div>
  )
}
