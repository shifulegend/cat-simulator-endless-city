# Change Trace
<!-- DYNAMIC FILE — updated by AI agents after each meaningful implementation sub-step -->
<!-- Newest entries first -->

## Entry Template
```
### [TIMESTAMP] — <Change Title>
- **What Changed**: 
- **Why**: 
- **Affected Areas**: 
- **Related Commit**: 
- **Risks / Follow-ups**: 
```

---

### [2026-07-11 03:05 IST] — Token minimization rules embedded (search, repo-map, compression, caching)
- **What Changed**: Added `docs/ai/context-efficiency.md` as a new, purely additive canonical
  file defining four token-minimization practices: (1) structural code search via ripgrep first,
  ast-grep/tree-sitter for precision, semantic search as last resort — never speculative
  directory listing or whole-file reads; (2) a maintained, script-generated
  `docs/ai/repo-map.md` (pattern from Aider's repo-map) for instant codebase orientation
  without re-scanning; (3) compressing/filtering large terminal, log, and JSON tool output
  before it enters context, rather than pasting raw output; (4) static-first, dynamic-last
  prompt ordering to maximize prompt-cache hit rates (per Anthropic's official prompt-caching
  docs — cached tokens cost ~10% of standard input rate, with published case studies showing
  90% cost reduction from reordering alone, no model change). Added a scaffold script
  `scripts/generate-repo-map.js` implementing the repo-map generation pattern (tree-sitter-based,
  to be wired to the repo's actual language parser). Wired lightweight one-paragraph pointers
  into all 4 top-level tool entrypoints (`.github/copilot-instructions.md`, `CLAUDE.md`,
  `gemini/GEMINI.md`, `AGENTS.md`), `docs/ai/tool-sync-policy.md`, and `README.md`'s file index
  — no existing file content was rewritten or removed, this is purely additive.
- **Why**: User researched and proposed embedding token-minimization practices used by leading
  AI coding tools (Aider's repo-map, ast-grep's structural search, Anthropic's prompt-caching
  guidance, MCP-based output compression) into the golden template, without losing any existing
  intelligence or rules.
- **Affected Areas**: docs/ai/, scripts/, .github/copilot-instructions.md, CLAUDE.md,
  gemini/GEMINI.md, AGENTS.md, README.md, docs/ai/tool-sync-policy.md
- **Related Commit**: docs(context-efficiency): add token minimization rules (search, repo-map, compression, caching)
- **Compliance Impact**: None — process/tooling standard only, no rule content removed.
- **Risks / Follow-ups**: `scripts/generate-repo-map.js` is a scaffold — `extractSymbols()` uses
  a naive regex placeholder and must be wired to an actual tree-sitter parser (or ast-grep) for
  the specific language(s) used once a real project is built from this template.

<!-- No entries yet. First change will be logged here. -->
