# Endless City Cat 🐱🏙️

A browser-based 3D cat simulator built with Three.js. Roam an infinitely streaming, procedurally generated city as a stray cat — chase pigeons, dodge traffic, and explore plazas, fountains, and skyscrapers that regenerate seamlessly in every direction with no visible edges or loading seams.

**Play now:** https://shifulegend.github.io/cat-simulator-endless-city/

## Features

- **True 2D endless streaming** — a 5x5 pool of reusable city chunks continuously reassigns itself around the player based on grid position, so the world has no boundary in any direction (north, south, east, west).
- **Deterministic procedural generation** — each city block's buildings, plazas, and props are generated from a seeded hash of its grid coordinates, so revisiting a location always reproduces the same layout.
- **Realistic PBR-textured assets** — canvas-generated brick, window, asphalt, and grass textures feed physically-based materials (MeshStandardMaterial) instead of flat-colored blocks.
- **Multi-tier buildings** — each building is assembled from a base plus 1-3 setback tiers with cornices, rooftop water tanks, AC units, or antennas for skyline variety.
- **Organic cat rig** — inverse-kinematics-driven legs, a jointed tail, and rounded sphere-based body geometry replace boxy placeholder shapes.
- **Interactive pigeons** — pigeons flee when the cat gets close, incrementing a chase counter and playing a chirp sound.
- **Procedural audio** — a synthesized purr, ambient wind, traffic honks, and a meow are generated in-browser via the Web Audio API (no external audio files).
- **Dual input schemes** — WASD/Arrow keys + mouse-drag look on desktop; dual virtual joysticks (movement + camera look) on touch devices.

## Controls

| Input | Action |
|---|---|
| `W` / `↑` | Move forward (cat faces away from camera, walks with its back to you) |
| `S` / `↓` | Move backward |
| `A` / `←`, `D` / `→` | Strafe / turn |
| Mouse drag (hold + move) | Rotate camera |
| `Space` | Meow |
| Left touch joystick | Move |
| Right touch joystick | Camera look |
| MEOW button (on-screen) | Meow |

## Tech Stack

- **Rendering**: Three.js (r128, self-hosted, no CDN dependency)
- **Audio**: Web Audio API (procedural synthesis, zero audio asset files)
- **Textures**: Runtime-generated HTML5 Canvas textures (no external image assets)
- **Hosting**: GitHub Pages (static site, zero build step)
- **Language**: Vanilla JavaScript (ES6, IIFE-scoped, single `index.html`)

## Project Structure

```
.
├── index.html              # Entire game: markup, styles, Three.js library, and game logic
├── docs/
│   ├── ai/                 # AI agent session memory (architecture, mistakes, decisions)
│   ├── SETUP.md            # Local development / testing setup
│   └── BRANCHES.md         # Branching and release strategy
├── .github/
│   ├── workflows/          # CI: HTML/JS validation + Playwright smoke tests
│   └── dependabot.yml      # Dependency update automation
└── LICENSE                 # MIT
```

## Local Development

This is a static, zero-build single-file game. To run locally:

```bash
git clone https://github.com/shifulegend/cat-simulator-endless-city.git
cd cat-simulator-endless-city
python3 -m http.server 8000
# open http://localhost:8000
```

No `npm install` or build step is required — `index.html` is self-contained.

## Testing

Automated smoke tests use Playwright to load the live page in a headless browser and verify:
- The start overlay renders and dismisses on click
- Keyboard (WASD/Arrows), mouse-drag look, and Space-to-meow all register
- Touch joystick (movement + look) works via synthetic `TouchEvent`s
- No uncaught JavaScript errors during a full control pass
- Cat orientation is correct relative to camera and movement direction (forward input shows the cat's back/tail receding from the camera)

See `docs/ai/testing-strategy.md` for the full test matrix and known issues log.

## Known Limitations

- No collision detection yet — the cat can currently walk through buildings, lamps, and benches. AABB-based collision is the top-priority next feature (tracked in `docs/ai/mistakes.md` and project backlog).
- Cars loop within their spawn chunk only; they do not yet react to the player or to traffic lights.
- Audio requires a user gesture (the Start button) to unlock the Web Audio context, per browser autoplay policy.

## Build this with us

This game is a sandbox, and the invitation is open: bring your own ideas and
build them in. It's not just about fixing bugs — this is a place to
experiment. Want to add a skateboard, a jetpack, a rival cat, seasons,
weather, a whole new neighborhood, a soundtrack, minigames, or something
nobody's thought of yet? That's exactly the kind of contribution this
project wants.

- **Bring your creativity.** Prototype a weird idea in a fork and open a PR
  even if it's rough — half-built and fun beats polished and boring.
- **Start a conversation.** Use [Discussions](https://github.com/shifulegend/cat-simulator-endless-city/discussions)
  to pitch a feature, share a build, or riff on where this could go.
- **New here?** [`good first issue`](https://github.com/shifulegend/cat-simulator-endless-city/labels/good%20first%20issue)
  and [`help wanted`](https://github.com/shifulegend/cat-simulator-endless-city/labels/help%20wanted)
  are easy entry points, but they're not the ceiling — they're just a way in.
- Setup, branch conventions, and PR checklist: [`CONTRIBUTING.md`](CONTRIBUTING.md).
- Community expectations: [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
- Found a security issue? See [`SECURITY.md`](SECURITY.md) instead of filing a public issue.

## Roadmap / ideas to pick up

These are starting points, not a to-do list assigned to anyone — claim one in
an issue/discussion comment before starting so two people don't duplicate
work, or skip this list entirely and bring something of your own:

- Collision detection (buildings, lamps, benches) — see `docs/ai/mistakes.md`
- Cars reacting to the player / traffic lights
- New city props, building styles, weather, or day/night cycle
- New creatures, NPCs, or a rival/companion animal
- New movement abilities, minigames, or emergent mechanics
- Accessibility improvements (colorblind-friendly UI, remappable controls)
- More automated test coverage alongside the existing Playwright smoke tests

Got a different idea? Open an issue or a discussion — this list exists to
spark ideas, not limit them.

## Contributors

Thanks to everyone who plays, gives feedback, files issues, opens PRs, or
builds something new on top of this — that's what makes this a shared
project instead of a static repo. Contributors are credited in PR history
and release notes; ping a maintainer if you'd like a shoutout here too.

## License

MIT — see [LICENSE](LICENSE).
