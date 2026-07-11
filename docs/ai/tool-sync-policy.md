# Tool Sync Policy
<!-- DYNAMIC FILE — update when sync rules improve -->

## Canonical Source of Truth
`docs/ai/**` is the primary source of truth for all project memory, rules, and decisions.

## Adapter Files (Synchronized from docs/ai/)
| Tool           | Adapter Files |
|----------------|--------------|
| GitHub Copilot | `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `.github/prompts/*.prompt.md` |
| Claude Code    | `CLAUDE.md`, `.claude/rules/*.md`, `.claude/skills/**/SKILL.md` |
| Antigravity    | `gemini/GEMINI.md`, `AGENTS.md`, `.agents/rules/*.md`, `.agents/workflows/*.md` |

## Sync Rules
1. Update shared `docs/ai/` files FIRST.
2. Then synchronize relevant tool-specific adapter files.
3. Record the change in `docs/ai/change-trace.md`.
4. Propose a commit checkpoint.

## When Adapter Files Must Be Updated
- When a durable repo-wide rule is added or changed → update all tool entrypoint files
- When a scoped rule changes → update the relevant scoped files for each tool
- When a workflow improves → update the relevant prompt/skill/workflow file
- When a mistake produces a prevention rule → update rules + entrypoints

## Conflict Resolution
If a conflict exists between a tool-specific file and `docs/ai/`, the shared doc wins.
Update the tool-specific file to match, and log the correction in `docs/ai/change-trace.md`.

## Context & Token Efficiency
`docs/ai/context-efficiency.md` defines token-minimization rules: structural code search (ripgrep/ast-grep over speculative file reads), a maintained `docs/ai/repo-map.md` for instant orientation, tool/log output compression before it enters context, and static-first prompt ordering for cache efficiency. All tool entrypoints reference this file rather than restating it — see `.github/copilot-instructions.md`, `CLAUDE.md`, `gemini/GEMINI.md`, `AGENTS.md`.
