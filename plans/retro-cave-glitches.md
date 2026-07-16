# Retro — organic caves (Idea 7) took too many rounds

A working-notes retrospective on why resolving the cave-rendering glitches (organic look, corner
rounding, portals, pointed-arch "alcoves") took far more back-and-forth than it should have, and
what to do differently. Kept alongside `dungeon-roadmap.md` / `architecture.md` as a process note.

## The single biggest cause
**"Fixed" was repeatedly declared from an offscreen render that didn't match what the reviewer
actually saw.** The verification script drew base cells + corner tiles only, while the app (and the
tile *atlas* being reviewed) included things the proxy omitted — or rendered at a scale/mode where
the artifact showed and the proxy's didn't. So nearly every "done" was premature: same glitch comes
back, repeat. It only stuck once the offscreen render faithfully reproduced the real render logic
(pocket domes + stairs-skip). That gap accounts for roughly half the churn.

## Other recurring mistakes
- **Patched the wrong layer before diagnosing root cause.** "Still looks rectangular" is a
  *geometry* problem, but it was addressed with tile *texture* twice before moving to geometry, then
  to corner-transition rendering.
- **Over-interpreted an ambiguous word.** "Variety" was built as a grab-bag (arcs + chamfers + rough)
  instead of confirming the intended set (rounded corners + apses + alcoves) — a whole extra round.
- **Guessed at culprits instead of isolating the mechanism.** The "pointed-arch alcoves" were first
  blamed on unused fringe tiles (no effect). A hand-built test grid with one deliberate 1-cell pocket
  revealed the true cause immediately (two corner arcs meeting off-center). That should have been
  step one on the first report.
- **Left dead artifacts around.** Generated-but-unused `cave_wall_trim` tiles cluttered the tile set
  under review and misdirected the diagnosis.

## What to change
1. **Verify against ground truth, never a proxy.** Reproduce the real render path (same tiles/layers/
   scale/mode) or drive the actual app; if full verification isn't possible, say so — don't claim
   "fixed" from a render that could omit the artifact.
2. **When a glitch can't be reproduced, resolve that discrepancy first** — faithful/controlled repro,
   or ask precisely *what and where* (rendered map vs. tile atlas vs. generated files) — before any fix.
3. **Isolate the mechanism with a minimal controlled test before fixing.**
4. **Pin ambiguous intent to concrete examples up front** (show 2–3 options rather than guessing).
5. **Fix the layer that owns the problem** — diagnose root cause before implementing.
6. **Delete superseded artifacts**, don't just stop referencing them.

## Fair caveat
Some rounds were legitimate *aesthetic* iteration — those are the reviewer's call and are best served
by putting options in front of them (the direction-comparison did work). That churn is expected; the
avoidable rework above is the part to fix.
