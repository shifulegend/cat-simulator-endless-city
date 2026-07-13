# Engineering Rules
<!-- Last updated: TIMESTAMP -->
<!-- DYNAMIC FILE — updated automatically by AI agents every session as applicable -->

## Modularity
- Develop to the smallest sensible unit possible.
- Prefer composition over large files, large classes, or tightly coupled modules.
- Every module must have a single, explicit responsibility.
- Prefer explicit interfaces over implicit dependencies.

## Zero Hard-Coding
- Nothing may be hard-coded unless there is a strong technical reason, documented explicitly.
- All configurable behavior lives in: config files, environment variables, schemas, feature flags, metadata, or databases.
- Treat configurability as the default design goal.
- Before implementing, inspect the repo for existing config/settings patterns and reuse them.

## Documentation
- Documentation is the backbone of the project.
- Document everything relevant, even if trivial.
- Add timestamps to documentation updates.
- Add timestamps to code comments for non-obvious decisions, risks, workarounds, or temporary constraints.

## Verification & Definition of Done
A change is done when:
- [ ] Tests pass (lint, typecheck, test, build)
- [ ] Relevant docs updated
- [ ] No hard-coded values introduced
- [ ] Change is modular and configurable
- [ ] Commit message explains what + why
- [ ] Mistake log checked and updated if applicable

## Security & Safety
- No secrets, credentials, or API keys in code or docs.
- All inputs must be validated.
- Security-sensitive areas must be documented and flagged.
- Report vulnerabilities via SECURITY.md process.

## Frameworks, Dependencies & Assets
- There is no restriction against external dependencies, build tooling, or a single-HTML-file architecture. Choose the best free/open-source framework, library, or asset pipeline for the job.
- Do not reinvent solved problems: prefer well-maintained open-source libraries (physics, animation, audio, UI) and free/open assets over hand-rolled equivalents when license permits.
- Every third-party library, model, texture, sound, or font added to the project must be recorded in `credits.html` with name, source URL, author, and license (MIT, CC0, CC-BY, Apache-2.0, etc.).
- Verify license compatibility before adding any asset or dependency; avoid anything with unclear or restrictive licensing (e.g. CC-BY-NC, proprietary EULAs) unless explicitly approved.

## Graphics Realism Bar
- Benchmark all rendering, lighting, material, and environment work against Ghost of Tsushima's visual quality as the aspirational target: physically based materials, HDRI/IBL lighting, dynamic shadows, atmospheric fog, and cinematic post-processing (bloom, SSAO/GTAO, depth of field, ACES filmic tone mapping, color grading).
- Prioritize believability of motion and physics (weight, momentum, secondary motion, foot/ground contact) alongside visual fidelity — "feel realistic" applies to gameplay feel, not just pixels.
- **Poly Haven / ambientCG are acceptable for generic ground/wall/prop PBR textures and HDRIs, but their photo-tiled, non-hero-asset quality does not match the bespoke, hand-authored, high-density detail Sucker Punch used for Tsushima's foliage, terrain, and characters.** Do not treat them as the primary source for anything meant to be a visual centerpiece (the cat itself, hero buildings, foreground foliage).
- For hero-quality assets, prefer, in order of preference:
  1. **Fab (formerly Quixel Megascans)** — https://www.fab.com/ — real-world photogrammetry scans (rock, bark, ground, foliage, fabric) at a fidelity level closer to what AAA studios like Sucker Punch use. Check current licensing per-asset (some free, some paid) before use; only use assets whose license permits redistribution in an open-source repo, or reference them as a "recommended purchase" in credits.html instead of vendoring them.
  2. **Sketchfab photogrammetry / hand-modeled hero assets (CC0/CC-BY only)** — https://sketchfab.com/ — filter to "Downloadable" + free license, and prefer scanned or hero-quality hand-sculpted models over generic low-poly kits.
  3. **SpeedTree free/indie tier or Blender-generated foliage** for grass/tree wind systems — Ghost of Tsushima's grass and wind are true 3D geometry driven by a shared windfield, not billboards; a Three.js equivalent should use GPU-instanced grass blades with a vertex shader driven by a wind field, not a flat animated texture.
  4. **Poly Haven / ambientCG** as a fallback only for background/non-hero surfaces (distant roads, generic walls) where budget or licensing rules out the above.

### Documented Reference Examples (Ghost of Tsushima Benchmark)
Use these as the concrete technical reference points when implementing or reviewing realism work — link to the relevant one in commit messages/PRs when a change targets a specific technique:
- **Lighting & atmosphere**: "Real-Time Samurai Cinema: Lighting, Atmosphere, and Tonemapping in Ghost of Tsushima" — SIGGRAPH 2021 Advances in Real-Time Rendering talk by Jasmin Patry (Sucker Punch). Covers SH irradiance probes, sky/sun bounce light, haze/cloud/particle multiple-scattering, and custom tone mapping. https://www.youtube.com/watch?v=GOee6lcEbWg
- **Wind & foliage system**: "Blowing from the West: Simulating Wind in Ghost of Tsushima" — GDC 2021 talk by Bill Rockenbeck (Sucker Punch). Describes the shared windfield driving grass, trees, banners, and cloth. https://www.youtube.com/watch?v=d61_o4CGQd8
- **Overall tech breakdown**: Digital Foundry's Ghost of Tsushima tech review, covering foliage density, LOD strategy, and post-processing choices. https://www.digitalfoundry.net/articles/digitalfoundry-2020-ghost-of-tsushima-tech-review
- **Three.js-native realism precedent**: real-time path-traced global illumination in Three.js (Erich Loftis's THREE.js-PathTracing-Renderer) as a proof that near-photorealistic lighting is achievable in a browser context; use as inspiration for GI/reflection approaches even if full path tracing is too expensive for this game's real-time budget. https://github.com/erichlof/THREE.js-PathTracing-Renderer
- When proposing a new rendering feature (grass, water, skin/fur shading, atmospheric scattering), cite which of the above techniques it is approximating and note any deliberate simplification made for real-time browser performance.
