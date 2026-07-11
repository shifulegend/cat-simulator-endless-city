# Security Policy

This is a static, client-side, zero-backend browser game (single
`index.html`, no server, no user data storage, no authentication). The
practical attack surface is small, but please report anything you find.

## Reporting a vulnerability

- Do not open a public issue for security reports.
- Contact the maintainer (@shifulegend) directly via GitHub, or use GitHub's
  private vulnerability reporting (Security tab → "Report a vulnerability")
  if enabled for this repo.
- Include: affected file/area, reproduction steps, and potential impact.

## In scope

- Any XSS or injection vector reachable through the static page.
- Supply-chain concerns (e.g. compromised third-party script/CDN
  dependency — note this project is intentionally CDN-free and
  self-hosts Three.js).
- CI/workflow security issues in `.github/workflows/`.

## Out of scope

- Gameplay bugs, visual glitches, or missing features (use a normal issue).
- Anything requiring physical or privileged access to the host machine.

## Response

This is a solo/personal project maintained on a best-effort basis. There is
no guaranteed SLA, but security reports will be prioritized over feature
work.
