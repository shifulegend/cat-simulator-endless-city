# Agentic Test Plan

## Goal
Use an autonomous browser agent on the GitHub Pages build to validate Cat 1 thoroughly before deployment.

## Tool stack
- Playwright Test as the deterministic test runner.
- Playwright tracing/screenshots for full visual evidence.
- browser-use as the autonomous agent layer when we want a higher-level "play the game like a human" loop.
- Keep screenshots and traces as artifacts for every run.

## Flow to test
1. Load the GitHub Pages site.
2. Click Start.
3. Choose Cat 1 only.
4. Confirm the game world loads.
5. Perform joystick drags in four directions.
6. Capture screenshots after each movement and release.
7. Verify:
   - left/right displacement matches input,
   - facing direction matches movement,
   - idle pose is stable after release,
   - no sky bleed appears on ground at camera edges.
8. Reload the page and repeat once to catch stale state bugs.

## Evidence required
- Screenshot before test.
- Screenshot after each joystick direction.
- Screenshot after release/idle.
- Full Playwright trace.
- Console log capture.

## What not to do
- No numeric-only pass/fail checks without screenshots.
- No manual visual claims without saved evidence.
- No one-off heuristic scripts instead of a reusable test flow.

## Autonomous agent role
The agent should navigate and act; Playwright should still be the execution and evidence layer. That avoids reinventing the wheel and keeps the run reproducible.

## Deployment gate
Do not promote the build unless Cat 1 passes this full visual test sequence on the live GitHub Pages URL.
