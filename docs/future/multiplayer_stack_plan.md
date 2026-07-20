# Future Plan: Multiplayer Support (Research Notes)

## Can GitHub Pages be the multiplayer server?
No. GitHub Pages only serves static files (HTML/CSS/JS/assets) over HTTP - it has no backend
runtime, cannot hold persistent WebSocket connections, and cannot run server-side game logic
or a database. It can continue to host the game client exactly as it does today, but a
separate always-on (or edge-serverless) backend is required for real-time multiplayer state
sync between players.

## Recommended free/open-source stack

| Layer | Recommendation | Why |
|---|---|---|
| Realtime server framework | Colyseus (Node.js, MIT license) | Open-source authoritative multiplayer framework with built-in state sync, matchmaking, and room-based architecture; has a JS client SDK that plugs directly into a Three.js game. |
| Alternative (edge-native) | PartyKit / partyserver (open-source runtime, built on Cloudflare Workers + Durable Objects) | If we want a serverless, globally-distributed option instead of a single Node.js process. Free tier available; open-source runtime even though hosting is Cloudflare-managed. |
| Hosting for Colyseus server | Render.com free tier (sleeps after ~15 min idle) for prototyping; Fly.io (~2 USD/mo per always-on small instance) for a persistent low-cost production server | Render's free tier is genuinely free but cold-starts after idling, which is fine for testing, not ideal for players expecting instant join. Fly.io has no free tier but is the cheapest way to keep a small game server always-on. |
| Client transport | Native WebSocket (already what Colyseus and PartyKit use) | No extra dependency; works directly from the existing Three.js/vanilla-JS client. |
| Player/world state persistence (optional, for saved progress/leaderboards) | Supabase (open-source Firebase alternative, Postgres-based) or MongoDB Atlas free tier | Supabase is fully open-source and self-hostable, with a generous free tier and a Postgres database if we want persistent player stats, positions, or leaderboards beyond in-memory session state. |
| Self-hosting option (if avoiding all managed platforms) | Docker + a single VPS (e.g. free-tier Oracle Cloud Always Free instance) running Colyseus + Postgres | Fully self-hosted, zero recurring cost beyond the free VPS tier, but requires more ops work (systemd/Docker Compose, TLS via Let's Encrypt, etc).

## Suggested architecture sketch
1. Keep the existing Three.js client hosted on GitHub Pages exactly as now.
2. Stand up a small Colyseus room server (Node.js) that:
   - Accepts WebSocket connections from clients.
   - Tracks each connected player's cat position/rotation/animation state.
   - Broadcasts state diffs to all clients in the same "room" (world instance) at a fixed
     tick rate (e.g. 15-20Hz), which is standard for casual multiplayer games.
3. Client changes needed: on connect, join a Colyseus room; send local input state upward;
   render remote players' cats using the same `CatController` model-loading code we already
   have (fully reusable - just instantiate additional `catModelGroup`-style objects per
   remote player id).
4. Start with Render.com free tier for early testing; move to Fly.io (or a free-tier VPS) once
   ready for real players who need low-latency, always-on connections.

## Status
PLANNING ONLY - no implementation yet. This is a research note for a future milestone, filed
alongside the current single-player bug-fixing work on Cat 1.
