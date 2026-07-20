# Fix Verification: Cat Facing Direction Bug

Tested: 2026-07-20, local Chromium via Playwright, live GitHub Pages site (post-fix deploy).
Commit tested: 26648a0 (facingOffset: -Math.PI/2 for Lowpoly Runner)

## RCA Summary
Measured via skeleton bone world positions (head_05, tail_1_020) that the Lowpoly Runner's
native front-back axis runs along its local X, not Z. The previous blanket facingOffset of
Math.PI (180deg) only ever flipped the model between +X/-X - it never aligned with the engine's
+Z forward convention, causing the visual facing to be off by ~90deg from the actual direction
of travel at all times. Movement physics (catRoot.rotation.y driving position deltas) was
confirmed correct throughout - only the model's visual orientation inside catModelGroup was wrong.

## Fix
Added per-asset `facingOffset` field to catCatalog and calibrated Lowpoly Runner to -Math.PI/2,
determined by directly testing candidate Y-rotations against the real head->tail bone vector
in-browser until it matched the engine's forward convention.

## Verification (programmatic, exact)
Tested 4 cardinal headings (0, 90deg, 180deg, -90deg) and compared the model's actual
head-direction vector (from live bone positions) against the expected travel direction:

| Heading (rad) | Expected travel dir | Actual head dir | Match |
|---|---|---|---|
| 0.000 | (0, 1) | (0, 1) | Yes |
| 1.571 | (1, 0) | (1, 0) | Yes |
| 3.142 | (0, -1) | (0, -1) | Yes |
| -1.571 | (-1, 0) | (-1, 0) | Yes |

All 4 match exactly - facing now correctly tracks heading at every tested angle.

## Gameplay Test
- Moved forward (W) for 1.2s: catRoot advanced correctly along Z, rotation.y stayed at 0 (facing forward, matches travel)
- Moved right (D) after that: catRoot turned to rotation.y=1.46 rad (~84deg, expected ~90deg blend with prior heading), position updated in +X/+Z as expected
- Zero console errors throughout

## Status: PASS - facing direction bug fixed and confirmed for Lowpoly Runner.
Note: other 3 cat assets (Cartoon Cat, Simple, Sculpted) still use the default Math.PI offset
and have NOT been calibrated/verified yet - each will need its own bone-vector measurement
before being marked safe.
