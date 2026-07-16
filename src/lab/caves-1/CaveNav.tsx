import { Link, useLocation } from "wouter"

// The cave track's own nav — one link per prototype, plus a way back to the bitmask dungeon (which
// still carries the original Cave toggle until the track picks a final candidate).
//
// Deliberately NOT the legacy GeomorphNav: that one carries a dozen older geomorph/snapshot links
// irrelevant to this track, and lab/geomorph-dungeon importing it from legacy/ inverts the repo's own
// dependency rule (architecture.md §1). Not copying that forward.
//
// Add a line here per new prototype.
const PAGES = [
  { path: "/refactor/geomorph-dungeon", label: "Dungeon (bitmask)" },
  { path: "/lab/caves/1", label: "Caves 1 — CA blobs" },
]

export function CaveNav() {
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
