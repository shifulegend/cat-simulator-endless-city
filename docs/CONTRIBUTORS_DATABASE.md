# External Contributors & Database Setup (Inactive — Do Not Implement Yet)

> **Status**: **INACTIVE / DORMANT** — This document is a placeholder for future use.  
> **Do not** implement any of the database, Supabase, or RLS-related steps described here until the project maintainers explicitly announce that database integration has begun.  
> This file exists solely to capture best practices in advance; it is not an active instruction set.

---

## Purpose

This document defines the recommended workflow for external contributors once the project adopts a backend database (e.g., Supabase, Postgres, or similar) for features like leaderboards, save data, or user-generated content.

Until database integration is officially enabled:

- The game runs entirely client-side with no persistent backend.
- Contributors should ignore all database-related sections in this file.
- No Supabase project, RLS policies, or migration scripts need to be created.

---

## High-Level Principles

When database integration becomes active, the following principles will apply:

1. **No secrets in the repository**  
   - The repo will never contain real database credentials, service role keys, or production `.env` files.
   - Only `.env.example` with placeholder values will be committed.

2. **Isolated development environments**  
   - Each contributor will use their own local or personal database instance (e.g., their own Supabase project) for development and testing.
   - This ensures contributors can experiment freely without risking production data.

3. **Production access restricted to maintainers**  
   - Production database credentials and configuration will be managed exclusively by project maintainers.
   - Production environment variables will be stored in GitHub Actions secrets or similar CI/CD secret stores, never in the repo.

4. **Security via Row Level Security (RLS), not secrecy**  
   - Public-facing API keys (e.g., Supabase `anon` key) are designed to be exposed in frontend code.
   - Real security comes from database-level access controls (RLS policies), which strictly limit what the public key can do.

---

## Contributor Workflow (Future — Not Yet Active)

Once database integration is enabled, the following workflow will apply to all external contributors:

### 1. Set Up Your Own Development Database

You will need to create your own isolated database project for local development:

**For Supabase (likely choice):**

1. Visit [https://supabase.com](https://supabase.com) and create a free account.
2. Create a new project (choose a region close to you for lower latency).
3. Once the project is ready, navigate to **Settings → API** in the Supabase dashboard.
4. Copy the following values into a new `.env` file in your local clone of this repo (do **not** commit this file):

   ```bash
   # .env (DO NOT COMMIT — already in .gitignore)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   ```

5. Do **not** copy or use the `service_role` key anywhere in your local code or `.env` file. That key is for server-side use only and will never be needed for frontend development.

**For other databases:**

Maintainers will provide equivalent setup instructions when the time comes.

---

### 2. Run the Project Locally

Once your `.env` file is configured:

```bash
git clone https://github.com/shifulegend/cat-simulator-endless-city.git
cd cat-simulator-endless-city
npm install
npm run dev
```

The game will connect to your personal database instance, not the production one.

---

### 3. Develop and Test Against Your Own Data

- You can freely create, modify, or delete data in your own database without affecting anyone else.
- If you're adding features that touch the database (e.g., leaderboard submission, save/load), test them thoroughly against your own instance before opening a pull request.
- If you break your own database schema or data, simply reset your Supabase project or re-run migrations — no impact on production.

---

### 4. Submit Pull Requests as Usual

- All contributions go through pull requests (PRs) — no direct pushes to `main`.
- In your PR description, mention any database-related changes (new tables, RLS policies, migrations) so reviewers can pay extra attention.
- Do not include screenshots or logs that reveal your personal database credentials.

---

## Production Deployment (Maintainers Only)

This section is for maintainers and will not be relevant until database integration is active.

### GitHub Actions & Environment Secrets

When the project is ready for production database use:

1. **Store production credentials in GitHub Secrets**  
   - Go to the repository's **Settings → Secrets and variables → Actions**.
   - Add the following secrets:
     - `VITE_SUPABASE_URL` (production project URL)
     - `VITE_SUPABASE_ANON_KEY` (production public anon key)
   - Never add `SUPABASE_SERVICE_ROLE_KEY` to GitHub Actions unless you have a specific server-side function that requires it (and even then, handle with extreme care).

2. **Update the CI/CD workflow**  
   - Ensure the GitHub Actions workflow that builds and deploys to GitHub Pages injects these secrets into the build environment.
   - The resulting static bundle will contain the production `anon` key and URL — this is safe and expected.

3. **Database migrations**  
   - Maintain migration scripts (SQL files) in a `supabase/migrations/` folder.
   - Apply migrations to the production database manually via the Supabase dashboard or CLI, or automate via a trusted CI job with appropriate access controls.

---

## Security Model: Row Level Security (RLS)

When database integration is active, the following security model will apply:

### What the `anon` Key Can Do

The public `anon` key (visible in the deployed site and in `.env.example`) will be restricted via RLS policies such as:

- **Read**: Allowed on public tables (e.g., leaderboard scores).
- **Insert**: Allowed with strict constraints (e.g., score range, name length limits).
- **Update/Delete**: Explicitly **not allowed** for the `anon` role on most tables.

Example RLS policy (for future reference):

```sql
-- Enable RLS on the leaderboard table
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Anyone can read all scores
CREATE POLICY "leaderboard_public_read"
  ON leaderboard FOR SELECT
  USING (true);

-- Anyone can insert a score, but only within sane bounds
CREATE POLICY "leaderboard_public_insert"
  ON leaderboard FOR INSERT
  WITH CHECK (
    score >= 0
    AND score <= 100000
    AND length(player_name) BETWEEN 1 AND 30
  );

-- No UPDATE or DELETE policies for anon → those operations are forbidden
```

### What the `service_role` Key Can Do

The `service_role` key bypasses RLS and has full admin access. It will:

- Never appear in the repo, `.env`, or any file contributors can see.
- Only be used in server-side contexts (e.g., Supabase Edge Functions, Cloudflare Workers) where secrets can be safely stored as environment variables.
- Be used only by maintainers for:
  - Admin scripts.
  - Anti-cheat validation.
  - Data cleanup or migration tasks.

---

## What Contributors Must NOT Do

Even when database integration is active, the following rules will be strict:

- **Do not commit `.env` files** — they are already in `.gitignore` for a reason.
- **Do not share your `service_role` key** with anyone, including other contributors.
- **Do not hard-code database credentials** in any file that could be committed (e.g., `config.js`, `constants.js`).
- **Do not attempt to access production data** — use your own development database only.
- **Do not write RLS policies that grant unrestricted access** (e.g., `FOR ALL USING (true)`).

Violations of these rules will result in immediate PR rejection and may lead to revocation of contributor access.

---

## FAQ (Future)

### Q: Can someone mess with the production database if they see the anon key?

**A:** Only to the extent that RLS policies allow. Properly configured RLS ensures that even with the public key, a malicious actor can only perform limited, low-risk operations (e.g., inserting fake leaderboard scores within defined bounds). They cannot delete tables, modify schema, or access sensitive data.

### Q: Do I need to create my own Supabase project to contribute?

**A:** Yes, once database integration is active. This ensures complete isolation and prevents accidental impact on production or other contributors' work.

### Q: What if I accidentally break my own database schema?

**A:** No problem — it's your own development database. You can reset it, re-run migrations, or create a fresh project. This is precisely why isolated environments are recommended.

### Q: Will I ever need the `service_role` key?

**A:** Almost certainly not. The `service_role` key is for server-side administrative tasks only. As a frontend contributor, you will only ever use the public `anon` key in your `.env` file.

---

## When This Document Becomes Active

Project maintainers will announce database integration by:

1. Removing the "INACTIVE / DORMANT" status from the top of this file.
2. Opening a tracking issue or milestone labeled `backend` or `database`.
3. Providing concrete setup instructions (e.g., migration scripts, schema diagrams) in the repo.

Until then, treat this document as a **reference-only placeholder** — interesting, but not actionable.

---

**Last updated**: 2026-07-13 (dormant draft)  
**Owner**: Project maintainers (to activate when backend work begins)
