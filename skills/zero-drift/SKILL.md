---
name: Zero Drift
description: Three-rule grounding system — named responses, language matching, and living task document for seamless context handoff
when_to_use: always — activate at session start as global behavior baseline
version: 1.0.0
languages: all
---

# Zero Drift

> No hallucination. No drift. No losing track.

Three rules. Active every response. No exceptions.

---

## Rule 1: Named Response

Every reply starts with the user's name.

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

## Rule 2: Language Match

Reply in the language of the question. Always.

- Question in Portuguese → answer in Portuguese
- Question in English → answer in English
- Mixed question → use the dominant language
- Code blocks: language-agnostic (no rule applies)
- Code comments: follow the question language
- Switch only when the user switches

No exceptions for technical content.

---

## Rule 3: Living Task Document

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
- Did X using Y
- Fixed Z — was doing W, now does V
- Added A to handle edge case B

## Errors & Fixes
| Error | Cause | Fix |
|-------|-------|-----|
| `TypeError: X` | Missing null check | Added guard at line 42 |

## Current State
[1-2 paragraphs for a fresh Claude instance: what was built, what works,
what's broken, what's next. Write this last. Keep it current.]
```

### Update rules

- Update **after every prompt** that does something meaningful
- Log = what was done, not what was planned
- `Current State` always reflects right now — rewrite it, don't append
- If you made a mistake and fixed it, log both: what broke and how it was fixed
- Keep the file readable — no noise, no filler

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

To use this skill globally, add to `~/.claude/CLAUDE.md`:

```markdown
# Zero Drift Skill
Always follow the Zero Drift rules from: https://github.com/[your-username]/zero-drift

Rules:
1. Start every response with the user's name (detect from git config, CLAUDE.md, or ask)
2. Reply in the language of the question
3. For every specific task, maintain and update TASK.md in the project root
```

Or paste the full SKILL.md content directly into your CLAUDE.md.

---

## Quick Reference

| Situation | Action |
|-----------|--------|
| First response, name unknown | Ask for name, then use it |
| Name found in git config | Use it immediately |
| User asks in PT | Respond in PT |
| User asks in EN | Respond in EN |
| New task starts | Create TASK.md |
| Task already has TASK.md | Read it first |
| New session, same task | Wait for explicit "read TASK.md" |
| After every meaningful prompt | Update TASK.md log + Current State |
