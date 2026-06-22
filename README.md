# Zero Drift

[🇧🇷 Leia em Português](README.pt.md)

A Claude Code skill that keeps your AI grounded across long sessions. Three rules, applied from the first response to the last.

---

## The Problem

Long sessions break down. The context window fills up, so you open a fresh Claude instance and burn ten minutes re-explaining what you were doing. By then the AI has started drifting: it invents work it never did and forgets decisions you already made.

Zero Drift gives you a way to catch the drift early and hand off cleanly.

---

## The Three Rules

### 1. Named Response
The AI opens every reply with your name. This keeps replies personal and easy to scan in a long log.

```
Breno: the auth bug is in middleware.ts:42, token expiry uses < instead of <=.
```

The AI reads your name from `git config user.name` or your `CLAUDE.md`. If it finds nothing, it asks you once.

**The name is your hallucination detector.** When the model starts to drift, the name breaks first: it drops, changes, or reads slightly off. That is your signal the session is degrading. Open a new window, say *"read the TASK.md and continue"*, and resume from a clean state.

### 2. Language Match
The AI answers in the language you asked in. Ask in Portuguese, get Portuguese. Ask in English, get English. You configure nothing.

### 3. Living Task Document
Each task gets a `TASK.md` in the project root. After every meaningful prompt the AI records what it did, what broke, what it fixed, and where things stand now.

When the context fills up, open a new session and tell it:
> "Read the TASK.md and continue."

The new instance reads the file and picks up where the last one stopped.

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
- Fixed Z (was doing W, now does V)

## Errors & Fixes
| Error | Cause | Fix |
|-------|-------|-----|

## Current State
Handoff paragraph for a fresh instance. Rewrite it each time so it always
describes right now.
```

---

## How to Use

### Option A — Paste into CLAUDE.md (global, any AI)

Add this to `~/.claude/CLAUDE.md`, or to a `CLAUDE.md` in your project:

```markdown
# Zero Drift
Follow the Zero Drift skill rules:
1. Start every response with my name (detect from git config or ask)
2. Reply in the language of the question
3. For every specific task, maintain TASK.md in the project root and update it after every prompt
Full rules: https://github.com/obrenoalvim/zero-drift/blob/main/skills/zero-drift/SKILL.md
```

### Option B — Point the AI at this repo

Start a session and say:
> "Read https://github.com/obrenoalvim/zero-drift and follow the Zero Drift skill."

The AI reads the SKILL.md and applies the three rules.

### Option C — Copy the skill file

Copy `skills/zero-drift/SKILL.md` into your own skills directory and load it through your plugin system, such as superpowers.

---

## Context Handoff

The workflow that carries a long project across instances:

1. The session fills up, so the AI updates `Current State` in TASK.md
2. You open a new Claude Code session
3. You say: **"Read the TASK.md and continue"**
4. The AI reads the file, confirms where things stand, and resumes from there

You skip the re-explaining and the AI skips the guessing.

---

## Compatibility

Works with any AI that can read a markdown file:
- Claude Code (claude.ai/code)
- Cursor
- GitHub Copilot (via AGENTS.md)
- Codex
- The Claude API

---

## Contributing

Found a gap in the rules, or an edge case the skill misses? Open a PR. The SKILL.md is the source of truth.
