# Project Overview
<!-- Last updated: 2026-07-11 -->
<!-- DYNAMIC FILE — updated automatically by AI agents every session as applicable -->

## Purpose
A browser-based 3D cat simulator ("Endless City Cat"). The player controls a cat roaming a procedurally generated, infinitely streaming city, chasing pigeons and exploring plazas and skyscrapers. Built for casual play directly in the browser, no install required.

## Stack & Key Dependencies
- **Language**: Modern JavaScript (ES modules), multi-file architecture preferred over a single-file build.
- **Rendering**: Three.js (npm package, via Vite/bundler), targeting a Ghost of Tsushima-level realism bar: PBR materials, HDRI image-based lighting, real-time shadows, post-processing (bloom, SSAO/GTAO, DOF, ACES tone mapping), atmospheric fog.
- **Audio**: Web Audio API for procedural synthesis, plus free/open-source CC0/CC-BY audio assets (e.g. Freesound.org) where realism benefits, credited in `credits.html`.
- **Textures/Models**: Prefer free/open-source PBR textures and glTF models (Poly Haven, ambientCG, Sketchfab CC0/CC-BY) over hand-rolled Canvas textures, for realism.
- **Hosting**: GitHub Pages, serving a built static output (a build step via Vite + GitHub Actions is expected and encouraged).
- **Dependencies**: No blanket restriction on external dependencies or frameworks — use the best free/open-source tool for the job; avoid reinventing solved problems.
- **Testing**: Playwright (Python) for headless browser smoke tests, run manually/via CI

## Architecture Overview
Single `index.html` file containing three sections:
1. **Head/UI** — CSS, start overlay, HUD, virtual joystick canvas, meow button
2. **Three.js library** — vendored, unminified, inline `<script>` block
3. **Game logic** — IIFE-scoped app script covering: scene/lighting setup, procedural texture generation, PBR materials, a `ChunkSlot` pool for endless 2D city streaming, cat rig (IK-driven legs, jointed tail), pigeon/car/traffic-light NPCs, input handling (keyboard, mouse, touch), procedural audio, and the main `update()` game loop.

City streaming works via a fixed pool of `ChunkSlot` objects (5x5 = 25 by default) that get reassigned to new grid coordinates as the player moves, using a seeded hash per (cx, cz) so revisited chunks regenerate identically.

The third-person camera follows the cat using a yaw-based offset (`camOffset`) rotated by `camYaw`; the offset must point in the same direction as the cat's forward vector so the camera trails behind the cat's back rather than in front of its face (see `docs/ai/mistakes.md` entry 2026-07-11 for a regression on this).

## Important Directories
| Directory | Purpose |
|-----------|---------|
| `index.html` | Entire game (markup, styles, library, logic) |
| `docs/ai/`   | AI agent session memory (architecture, mistakes, decisions) |
| `docs/`      | Human-facing setup/branch docs |
| `.github/`   | CI workflows, Dependabot config |

## Domain Terminology
- **Chunk**: One `CHUNK x CHUNK` (56x56 unit) square of city, containing one road intersection and either a plaza or a row of buildings.
- **ChunkSlot**: A reusable Three.js group representing one active chunk in the world; assigned/reassigned as the player moves.
- **Active radius**: Number of chunks kept loaded around the player in each direction (default 2, giving a 5x5 grid).
- **Heading**: The cat's target facing angle, derived from camera yaw + input direction.

## Major Integration Boundaries
- **GitHub Pages**: Static hosting; deploys automatically from `main` branch `index.html`.
- **No backend, no database, no external APIs.** The game is fully client-side and stateless (no save/persistence across sessions).
