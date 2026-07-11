# Context & Token Efficiency Rules
<!-- DYNAMIC FILE -->
<!-- Last updated: TIMESTAMP -->
<!-- Additive canonical file — does not replace or duplicate engineering-rules.md.
     This is the single source of truth for HOW agents should explore, search, and manage
     context/tokens efficiently. Referenced by tool entrypoints; never restated elsewhere. -->

## Why This Exists
Agents commonly waste a large share of their context window on: speculative directory listing,
reading whole files to find one function, ingesting raw uncompressed terminal/tool output, and
breaking prompt caching by mixing dynamic content into otherwise-static prompt sections. Each of
these is avoidable with the right tool choice and prompt structure — with zero loss of accuracy
or capability. This file defines the required approach.

---

## 1. Codebase Exploration — Structural Search Over Whole-File Reads

**Rule: never speculatively list directories or read entire files to locate code.** Use
precise search tools that return only file paths, line ranges, and minimal snippets.

| Tool | Use For | Why |
|---|---|---|
| **ripgrep (`rg`)** | Fast literal/regex text search across the repo | The baseline layer — near-instant, respects `.gitignore`, returns file:line matches instead of full files. Use for known strings, error messages, config keys. |
| **ast-grep** (or **tree-sitter** queries directly) | Structural code search — "find all calls to function X," "find all React components using hook Y" | Text/regex search over-counts: a benchmarked real-world refactor showed ripgrep returning 122% more matches than ast-grep (138 vs 62 hits) because it can't distinguish a string literal or comment from actual code usage. ast-grep understands syntax via tree-sitter ASTs, so it returns only real code-structure matches — directly cutting wasted tokens spent investigating false positives. |
| **Semantic/embedding search** (when available via IDE or MCP) | Conceptual queries — "where is authentication handled," when you don't know the exact function/string name | Use only when ripgrep/ast-grep can't locate the right anchor term; semantic search is the most expensive per-query layer, so it's the last resort, not the default. |

**Decision order**: try ripgrep first (cheapest, fastest) → escalate to ast-grep/tree-sitter for
structural precision → escalate to semantic search only if the first two fail to locate the
target. Never open a full file "just to look around" — search first, then read only the
specific line range returned.

---

## 2. Context Mapping — Maintain a Compact Repo Map, Don't Re-Derive It

**Rule: maintain a generated, compact Markdown repository map so agents get instant
orientation without re-scanning the codebase every session.**

- Generate `docs/ai/repo-map.md` via a script (tree-sitter-based, similar to Aider's repo-map
  approach) that lists key files, their primary exported symbols/functions/classes, and one-line
  purpose — not full contents.
- Aider's implementation is the reference pattern: it builds a full-repo symbol map, then uses a
  graph-ranking algorithm (files as nodes, dependencies as edges) to select only the most
  relevant portion of the map for the current task, fit to a token budget (default ~1k tokens)
  rather than dumping the entire map every time.
- **Regenerate `repo-map.md` via script whenever the file structure changes materially** — do
  not let an agent hand-write or manually maintain this file; that reintroduces the token waste
  and staleness this pattern is meant to eliminate.
- Keep `repo-map.md` under version control alongside the code it maps, so it's always available
  without a live scan.

Script location: `scripts/generate-repo-map.*` (implementation language matches the repo's stack).
Output: `docs/ai/repo-map.md`.

---

## 3. Compressing Tool & Log Outputs

**Rule: never feed raw, uncompressed terminal output, logs, or large JSON tool responses
directly into context. Summarize or truncate before continuing.**

- Terminal errors/stack traces: extract only the relevant error type, message, and top 3-5
  frames of the stack — not the full scroll-back.
- Large JSON API/tool responses: extract only the fields relevant to the current task; do not
  paste multi-KB raw JSON into the working context.
- Long log files: grep/filter for the relevant time window or error signature before reading —
  same principle as Section 1, applied to logs instead of code.
- If using an MCP server or proxy layer that supports response compression/summarization
  (context-compression middleware), enable it for any tool whose typical output exceeds a few
  hundred tokens.
- When a build/test/lint tool produces verbose output, prefer its "quiet" or "summary" flag
  (e.g. `--reporter=dot`, `-q`) over the fully verbose default, and only re-run verbosely if the
  summary doesn't localize the failure.

---

## 4. Prompt Caching — Static-First, Dynamic-Last Ordering

**Rule: structure prompts so static content (system instructions, stable repo maps, tool
definitions) always precedes dynamic content (conversation history, current user turn).**

This is the single highest-leverage token-cost lever available, per Anthropic's own published
guidance: prompt caching prices cached input tokens at roughly 10% of the standard input rate —
up to a 90% cost reduction on the cached portion, with published production case studies
reporting monthly bills dropping from $4,200 to $680 purely from prompt reordering (no model
change).

**The ordering rule** — arrange every prompt/context payload in this order:
1. System prompt / persistent instructions (rarely changes)
2. Tool/function definitions (rarely change)
3. Stable repo map / canonical `docs/ai/` content (changes occasionally)
4. Retrieved documents specific to this session (changes per session)
5. Conversation history (grows by appending only — never edit or prune from the middle)
6. Current user turn (always new — this is the only part that should differ call-to-call)

**Practical rules to avoid silently breaking the cache:**
- Never inject a timestamp, UUID, or other per-call-unique value into the static/system portion
  of the prompt — that alone invalidates the entire cached prefix.
- Keep static text byte-identical across calls — re-templating the same content with different
  whitespace/indentation breaks the exact-prefix match caching relies on.
- If content must be trimmed for length, trim from the start of conversation history, never
  from the middle — mid-history edits break the cached prefix for everything after the edit point.
- Don't reorder tool/function definitions between calls — sort deterministically (e.g. by name)
  if tools are serialized from a dict, since key order can otherwise shift silently.

**When this applies in this template**: `docs/ai/` canonical files (engineering rules,
documentation standard, commit discipline, etc.) and `repo-map.md` are exactly the kind of
stable, rarely-changing content that belongs early/static in any tool-level prompt construction
built on top of this template — keep them consolidated and rarely-churned (see the context
optimization pass already applied to this template) so they remain cache-friendly, not just
token-lean.

---

## Summary Checklist (Every Session)
- [ ] Used ripgrep/ast-grep to locate code — never speculative full-file reads or directory walks
- [ ] Consulted `docs/ai/repo-map.md` for orientation before deep exploration; regenerated it via
      script if repo structure changed materially this session
- [ ] Summarized/filtered any large tool, log, or terminal output before carrying it forward in context
- [ ] Kept static canonical content (`docs/ai/`, system instructions) stable and front-loaded if the
      tool/harness in use supports prompt caching
