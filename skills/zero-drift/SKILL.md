---
name: Zero Drift
description: Two-rule grounding system — named responses and a living task document for seamless context handoff
when_to_use: always — activate at session start as global behavior baseline
version: 1.2.0
languages: all
---

# Zero Drift

> No hallucination. No drift. No losing track.

Two rules. Active every response. No exceptions.

---

## Rule 1: Named Response

Every reply starts with the user's name.

**Purpose — hallucination detector.** The name is the canary. When the model starts drifting or hallucinating, the name is the first thing to break: dropped, altered, or off-tone. The user watches for this. The instant it slips, the session is degrading — the user opens a fresh window, says "read the TASK.md and continue", and resumes clean. So: never drop the name, never alter it. A consistent name = a grounded session.

### How to find the name

Run these in order, stop at the first hit:

1. `git config user.name` — use the result
2. Scan `CLAUDE.md` / `AGENTS.md` / `GEMINI.md` for a line like `MY_NAME=` or `name:` in a personal/user section
3. Check if the user introduced themselves earlier in this session
4. **If nothing found → ask once:**
   > "What's your name? I'll use it throughout our session."
   Store the answer for the rest of the session.

### Format

```
[Name]: [rest of response]
```

Example:
```
Breno: the login bug is in auth/middleware.ts:42 — token expiry uses `<` instead of `<=`.
```

**Never skip the name. Never forget mid-session.**

---

## Rule 2: Living Task Document

Every specific task gets a `TASK.md` in the project root. Update it after every prompt that advances the task.

### When to create

Create `TASK.md` when the user starts something specific:
- "Let's build X"
- "Fix this bug"
- "I want to create a Y"
- Any session where the work has a name and a goal

If a `TASK.md` already exists in the project root, **read it before doing anything else in that task**.

### When NOT to auto-read

A new Claude instance does **not** read `TASK.md` automatically. The user must ask explicitly:

> "Read the TASK.md and continue" / "Leia o TASK.md e continue"

Only then load and follow the document.

### Document structure

```markdown
# TASK: [Task Name]
> Created: YYYY-MM-DD | Updated: YYYY-MM-DD HH:MM

## Goal
[What we're building/fixing — 2-3 sentences max]

## Plan
- [x] Completed step
- [ ] Pending step

## Log
### YYYY-MM-DD
- Added retry to fetchUser() — `npm test auth` → 12 passed, exit 0
- Fixed null deref in parse() — `cargo test parse` → ok. 3 passed, exit 0
- Ran migration 0007 — `psql -f 0007.sql` → ALTER TABLE, exit 0

## Unverified / Pending
- Refactored cache layer — NOT tested yet, no proof
- Believe the timeout bug is fixed — could not reproduce, unconfirmed

## Errors & Fixes
| Error | Cause | Fix | Evidence |
|-------|-------|-----|----------|
| `TypeError: X` | Missing null check | Added guard at line 42 | `npm test` → exit 0 |

## Current State
[1-2 paragraphs for a fresh Claude instance: what was built, what works,
what's broken, what's next. Write this last. Keep it current.
Only claim something works if its proof is in the Log. No proof → say
"implemented, not verified", not "done".]
```

### Update rules

- Update **after every prompt** that does something meaningful
- `Current State` always reflects right now — rewrite it, don't append
- Keep the file readable — no noise, no filler

#### Evidence rule (the anti-drift core)

The Log is a **record, not a diary**. The model does not get to assert what it did — it shows proof. When context degrades, the model pulls toward fluency before truth: it writes "fixed X" because that reads well, not because X is fixed. The fix is to ban the assertion and demand the evidence.

- **Log = evidence only.** Every line claiming "did / fixed / works" carries raw proof inline: the command run + its output + exit code. Test result, build output, a reproduced behavior. No proof, no Log entry.
- **No proof → `Unverified / Pending`.** Work done but not yet proven goes here, marked plainly: "NOT tested", "unconfirmed", "could not reproduce". Never launder it into the Log.
- **`Current State` is derived, not declared.** It can only claim something works if that proof sits in the Log. Otherwise the strongest allowed phrasing is "implemented, not verified". A fresh instance trusts this file because every "works" is backed — it reads a record, not a story.
- **Logged a fix? Log both sides with proof:** what broke (error + how it surfaced) and the evidence it's now fixed (command + exit code).

### Handoff protocol

When starting a new session on an ongoing task, the user will say something like:
- "Read the TASK.md and continue"
- "Leia o TASK.md e continue"
- "Continue from where we left off — check TASK.md"

On that trigger:
1. Read `Current State` first
2. Read `Log` (most recent entries)
3. Read `Plan` (check vs uncheck)
4. Confirm understanding: "Got it. We're at [X], next is [Y]. Continuing."
5. Do not redo completed steps

---

## Activation

Recommended — install as a plugin so a `SessionStart` hook activates these rules in every session automatically:

```
/plugin marketplace add obrenoalvim/zero-drift
/plugin install zero-drift@zero-drift
```

Manual fallback — paste this into `~/.claude/CLAUDE.md`:

```markdown
# Zero Drift Skill
Always follow the Zero Drift rules from: https://github.com/obrenoalvim/zero-drift

Rules:
1. Start every response with the user's name (detect from git config, CLAUDE.md, or ask)
2. For every specific task, maintain and update TASK.md in the project root
```

Or paste the full SKILL.md content directly into your CLAUDE.md.

---

## Quick Reference

| Situation | Action |
|-----------|--------|
| First response, name unknown | Ask for name, then use it |
| Name found in git config | Use it immediately |
| New task starts | Create TASK.md |
| Task already has TASK.md | Read it first |
| New session, same task | Wait for explicit "read TASK.md" |
| After every meaningful prompt | Update TASK.md log + Current State |
| Claiming "fixed / works" | Only in Log with raw proof (command + output + exit code) |
| Done but not tested | Goes in `Unverified / Pending`, never the Log |
