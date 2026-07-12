import { Link, useLocation } from "wouter"

const PAGES = [
  { path: "/geomorph",      label: "Geomorph" },
  { path: "/geomorph-walk", label: "Drunken Walk" },
  { path: "/geomorph-dfs",  label: "Backtracker" },
  { path: "/geomorph-bsp",  label: "BSP Rooms" },
  { path: "/geomorph-ca",   label: "Cave" },
  { path: "/geomorph-prim", label: "Prim's" },
  { path: "/geomorph-wfc",  label: "WFC" },
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
