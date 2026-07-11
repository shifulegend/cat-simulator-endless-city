# Contributing to Endless City Cat

Thanks for wanting to jump in on the cat simulator — this project is better
with more people poking at it, not less. There's no formal gatekeeping here:
if you have an idea, a fix, or even just a question, you're welcome.

## Ways to contribute (not just code)

- **Play it and report bugs** — you don't need to read a line of code to help.
- **Suggest features** — open an issue, even if it's rough.
- **Fix a bug or add a feature** — see the Roadmap in the README for ideas,
  or bring your own.
- **Improve docs** — typos, unclear setup steps, missing explanations all count.
- **Test on devices** — different browsers, phones, tablets; report what breaks.
- **Review PRs** — a second pair of eyes on someone else's PR is genuinely useful.

No contribution is too small. First-time contributors are especially welcome —
look for issues labeled `good first issue`.

## Quick start

```bash
git clone https://github.com/shifulegend/cat-simulator-endless-city.git
cd cat-simulator-endless-city
python3 -m http.server 8000
# open http://localhost:8000
```

No install step. `index.html` is self-contained.

## Branching & commits

Follow the conventions in [`docs/BRANCHES.md`](docs/BRANCHES.md) and
[`docs/ai/commit-log-guidance.md`](docs/ai/commit-log-guidance.md):

- Branch from `main` using `feat/*`, `fix/*`, or `chore/*` prefixes.
- Keep each PR focused on one change (one feature, one fix).
- Write a clear commit message describing what changed and why.

## Before opening a PR

- Test in a browser: load `index.html` locally and confirm no console errors.
- Run through the control scheme (WASD/arrows, mouse-drag look, Space to
  meow, and touch joysticks if you can test on a touch device).
- If you touch procedural generation, verify revisiting a chunk still
  reproduces the same layout (determinism matters here — see
  [`docs/ai/architecture.md`](docs/ai/architecture.md)).
- If CI (`.github/workflows/ci.yml`) runs Playwright smoke tests, make sure
  they still pass.

## What to include in a PR

- What changed and why.
- How you tested it (manual steps or automated).
- Screenshots or a short clip for visual/gameplay changes — they're worth it
  for a game.
- Any known limitations or follow-up work.

## Scope

This project is actively open to contributors of all experience levels.
Small, well-scoped contributions (bug fixes, small
features, docs improvements) are the easiest to review and merge and are a
great way to get started. For bigger ideas, open an issue first so we can
talk through direction together before you invest a lot of time — that's
collaboration, not a barrier.

## Code style

- Vanilla ES6, no build tooling, no external CDN dependencies.
- Keep new code inside the existing IIFE scoping pattern in `index.html`
  unless there's a good reason to split files.
- Prefer readable code over cleverness — this project has no test framework
  beyond the Playwright smoke tests, so regressions are easy to miss.

## Reporting bugs / requesting features

Use the issue templates — they're there to make it easy, not to add red tape.
See [`SECURITY.md`](SECURITY.md) for how to report security issues instead of
filing a public issue.

## Say hi

If you open a first issue or PR, expect a real response, not silence. This is
a community project and every contributor deserves a reply.
