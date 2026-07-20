# RCA: "Sky" Visible on Ground (Flat Background Bleed-Through)

## Symptom
User screenshots show a flat, sky-colored (blue/purple gradient) rectangular patch appearing
directly on the ground plane / horizon line, especially at low camera angles or near the edge
of loaded terrain chunks.

## Root Cause
Two compounding issues in the rendering setup:

1. **`scene.background` is a flat 2D CanvasTexture, not a skydome/cubemap.**
   ```js
   const skyTex = new THREE.CanvasTexture(skyCanvas);
   scene.background = skyTex;
   ```
   In three.js, setting `scene.background` to a plain 2D texture renders it as a static
   full-screen image behind everything, with no 3D depth or camera-direction mapping. It is
   NOT a sphere/dome wrapping the world. Wherever there is a gap in world geometry - most
   commonly at the horizon where terrain chunks end, or during chunk streaming pop-in - the
   raw flat image shows through directly, including in screen regions that visually
   correspond to "the ground" from certain camera angles.

2. **Fog density is too low relative to loaded terrain extent to mask the seam.**
   - `CHUNK = 56`, `ACTIVE_RADIUS = 2` -> loaded terrain extends ~140 units from the player.
   - `scene.fog = new THREE.FogExp2(0xcbdcea, 0.0095)` -> at 140 units, fog opacity is only
     ~74%, meaning ~26% of the raw background is still visible through the fog at the edge
     of loaded chunks instead of being fully obscured before the geometry ends.

## Why this wasn't caught earlier
Previous testing focused on movement/facing/animation state (numeric checks), not full-scene
visual composition at varying camera angles and chunk-boundary positions.

## Proposed Fix (not yet implemented - filed as issue for tracking)
1. Increase `FogExp2` density (or switch to `THREE.Fog` linear with a near/far tuned to
   `ACTIVE_RADIUS * CHUNK`) so the horizon fully fades to a solid color before the raw
   background is visible.
2. OR replace the flat CanvasTexture background with a proper skydome: a large
   `THREE.SphereGeometry` (BackSide material) using the same gradient texture, added as a
   scene object that follows the camera position (not rotation) - this gives correct
   perspective-correct sky at all camera angles instead of a flat screen-space image.
3. Re-verify visually (actual screenshot inspection, not just numeric state) at multiple
   camera pitches and at chunk-streaming boundaries.

## Status
OPEN - root cause identified, fix not yet implemented.
