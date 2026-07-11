# Mistake Log
<!-- DYNAMIC FILE — updated immediately by AI agents when any mistake is identified -->
<!-- Newest entries first. Read this FIRST at the start of every session. -->

## Entry Template
```
### [TIMESTAMP] — <Short Title>
- **Summary**: What went wrong
- **Root Cause**: Why it happened
- **Affected Files/Modules**: 
- **Detection Method**: How it was found
- **Correction**: What was done to fix it
- **Prevention Rule**: Rule to avoid recurrence
```

---

### [2026-07-11] — Third-person camera faced the wrong way (showed cat's face, not tail)
- **Summary**: Pressing forward (W/ArrowUp) moved the cat away from the camera as intended, but the camera itself was positioned in front of the cat rather than behind it, so the player saw the cat's face approaching instead of its back/tail receding.
- **Root Cause**: The camera-follow offset calculation multiplied `camOffset.z` by an extra `*-1` when projecting it onto world X/Z via `Math.sin(camAngle)` / `Math.cos(camAngle)`, flipping the offset to the opposite side of the cat from where the cat's forward vector pointed.
- **Affected Files/Modules**: `index.html` — `update()` function, `idealCamPos.set(...)` block.
- **Detection Method**: Automated Playwright smoke test driving ArrowUp/ArrowDown/ArrowLeft/ArrowRight and manually verifying camera-relative cat orientation matched the expected third-person "chase-cam" behavior (cat's back should face the camera during forward movement).
- **Correction**: Removed the erroneous `*-1` multiplier from both the X and Z components of `idealCamPos`, so the camera offset now points in the same direction as the cat's heading, placing the camera behind the cat.
- **Prevention Rule**: Any change to camera-follow math must be verified with a scripted orientation test (forward/backward/left/right) before merging, not just a visual glance — sign errors in trig-based offsets are easy to miss.

---

<!-- No entries yet. First mistake will be logged here. -->
