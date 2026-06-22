# Zero Drift

[🇧🇷 Leia em Português](README.pt.md)

**Stop losing context. Stop repeating yourself. Stop starting over.**

Zero Drift is a Claude Code skill that keeps your AI assistant grounded across every session — with three simple rules applied from the first response to the last.

---

## The Problem

Long sessions break down. Context fills up. You open a new Claude instance and spend 10 minutes re-explaining what you were doing. The AI drifts, hallucinates what was done, forgets what was decided.

Zero Drift fixes this.

---

## The Three Rules

### 1. Named Response
Every reply starts with your name. Keeps responses personal and immediately identifiable in long logs.

```
Breno: the auth bug is in middleware.ts:42 — token expiry uses < instead of <=.
```

The AI detects your name automatically from `git config user.name` or your `CLAUDE.md`. If it can't find it, it asks once.

**Why this matters — it's a hallucination detector.** When the AI starts drifting or hallucinating, the name is the first thing to break: it gets dropped, changed, or feels off. The moment you notice that, the session is degrading. Stop, open a new window, say *"read the TASK.md and continue"*, and pick up clean from where you left off.

### 2. Language Match
The AI always replies in the language you asked in. Ask in Portuguese, get Portuguese. Ask in English, get English. No configuration. No drift.

### 3. Living Task Document
Every specific task gets a `TASK.md` in the project root. The AI writes to it after every meaningful prompt — what was done, what broke, what was fixed, and a clear summary of the current state.

When your context fills up, open a new session and say:
> "Read the TASK.md and continue."

That's it. Full context restored.

---

## TASK.md Structure

```markdown
# TASK: [Task Name]
> Created: YYYY-MM-DD | Updated: YYYY-MM-DD HH:MM

## Goal
What we're building or fixing.

## Plan
- [x] Done step
- [ ] Pending step

## Log
### YYYY-MM-DD
- Did X using Y
- Fixed Z — was doing W, now does V

## Errors & Fixes
| Error | Cause | Fix |
|-------|-------|-----|

## Current State
Fresh-instance handoff paragraph. Always current. Rewritten, not appended.
```

---

## How to Use

### Option A — Paste into CLAUDE.md (global, any AI)

Add to `~/.claude/CLAUDE.md` (or `CLAUDE.md` in your project):

```markdown
# Zero Drift
Follow the Zero Drift skill rules:
1. Start every response with my name (detect from git config or ask)
2. Reply in the language of the question
3. For every specific task, maintain TASK.md in the project root and update it after every prompt
Full rules: https://github.com/obrenoalvim/zero-drift/blob/main/skills/zero-drift/SKILL.md
```

### Option B — Point the AI directly at this repo

Start a session and say:
> "Read https://github.com/obrenoalvim/zero-drift and follow the Zero Drift skill."

The AI reads the SKILL.md and applies all three rules immediately.

### Option C — Copy the skill file

Copy `skills/zero-drift/SKILL.md` into your own skills directory and load it through your plugin system (superpowers, etc.).

---

## Context Handoff

The key workflow for long projects:

1. Session fills up → AI updates `Current State` in TASK.md
2. Open new Claude Code session
3. Say: **"Read the TASK.md and continue"**
4. AI reads, confirms state, picks up exactly where you left off

No re-explaining. No repeated context. No drift.

---

## Compatibility

Works with any AI that can read a markdown file:
- Claude Code (claude.ai/code)
- Cursor
- GitHub Copilot (via AGENTS.md)
- Codex
- Any Claude API usage

---

## Contributing

Found a gap in the rules? Edge case not covered? Open a PR — the SKILL.md is the source of truth.
