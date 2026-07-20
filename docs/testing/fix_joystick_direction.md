# Fix Verification: Joystick Direction Bug (Cat 1 - Lowpoly Runner)

Tested: 2026-07-20, Chromium via Playwright, real touch-drag simulation on live joystick canvas.
Commit tested: f36f630 (fix: correct inverted moveX sign in joystick heading formula)

## Root Cause
`Math.atan2(input.moveX, -input.moveY)` in the shared `update()` function had `moveX` sign
inverted. This canceled out for pure forward/backward input (moveX=0), which is why earlier
W/S-only tests missed it, but caused joystick-left to move+face camera-right and
joystick-right to move+face camera-left - exactly matching the reported symptom.

## Fix
Changed to `Math.atan2(-input.moveX, -input.moveY)`.

## Verification Method
Simulated real touchstart/touchmove events on the joystick canvas element (not code-driven
heading values, which is what caused the earlier miss), then measured:
1. dot(catRoot.position, cameraRightVector) - negative expected for joystick-left
2. dot(headBoneDirection, catRoot.position) - positive expected (facing matches travel dir)

## Results

| Test | Metric | Value | Expected | Pass |
|---|---|---|---|---|
| Joystick LEFT (short drag) | dot(pos, camRight) | -0.12 | negative | Yes |
| Joystick LEFT (sustained ~1.5s) | dot(pos, camRight) | -17.57 | negative | Yes |
| Joystick LEFT (sustained) | headDir | (1, -0) | matches travel dir | Yes |
| Release joystick | movement after 300ms | 0.0002 units | ~0 (idle) | Yes |

## Idle/Freeze Check
User reported the cat "freezes instead of getting in idle position" on joystick-left release.
Re-tested: after releasing touch, position settled to near-zero movement within ~1.2s
(currentSpeed lerps to 0 as designed) - not reproducible with this fix applied. Was likely a
symptom of the same inverted-sign bug producing conflicting/oscillating heading near the
deadzone boundary, not a separate issue.

## Status: PASS
Cat 1 (Lowpoly Runner) confirmed fixed for facing direction, movement direction, and idle
behavior on joystick release - verified via real touch simulation.

## Reusability note
This fix lives in the single shared `update()` function used by all cat assets, not per-asset
code - all 4 cats benefit automatically. Only the `facingOffset` calibration is per-asset and
still needs verification for cats 2-4.
