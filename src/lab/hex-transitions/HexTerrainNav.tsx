import { Link, useLocation } from "wouter"

const PAGES = [
  { path: "/refactor/hex-transitions/wfc", label: "WFC" },
  { path: "/refactor/hex-transitions/v2", label: "WFC v2" },
]

export function HexTerrainNav() {
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
