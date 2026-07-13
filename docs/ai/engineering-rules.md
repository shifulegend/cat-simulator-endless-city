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
- When adding new visual features, prefer free high-quality PBR textures and glTF/GLB models (Poly Haven, ambientCG, Sketchfab CC0/CC-BY) over placeholder/generated geometry, if performance budget allows.
