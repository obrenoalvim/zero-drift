<div align="center">

<img src=".github/logo.svg" alt="Zero Drift logo" width="120" height="120">

# Zero Drift

**A Claude Code skill that keeps long AI sessions grounded.**<br>
Replies open with your name. Tasks keep a `TASK.md` that the next session resumes from.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/obrenoalvim/zero-drift?style=flat&logo=github&color=22d3ee)](https://github.com/obrenoalvim/zero-drift/stargazers)
[![Claude Code plugin](https://img.shields.io/badge/Claude_Code-plugin-5B5BD6)](#quick-start)

**English** · [Português](README.pt.md) · [Español](README.es.md)

[The problem](#the-problem) · [Quick start](#quick-start) · [The two rules](#the-two-rules) · [How it works](#how-it-works) · [Install](#install) · [FAQ](#faq)

</div>

---

Zero Drift is a Claude Code skill with two rules, applied from the first response to the last. Install it as a plugin and it loads at the start of each session.

## The Problem

Long sessions break down. The context window fills up, so you open a fresh Claude instance and burn ten minutes re-explaining what you were doing. By then the AI has started drifting: it invents work it never did and forgets decisions you already made.

Zero Drift gives you a way to catch the drift early and hand off cleanly.

## Quick start

```
/plugin marketplace add obrenoalvim/zero-drift
/plugin install zero-drift@zero-drift
```

Open a new Claude Code window. If the first reply starts with your name, Zero Drift is active. Other install options are under [Install](#install).

---

## The Two Rules

### 1. Named Response
The AI opens every reply with your name. This keeps replies personal and easy to scan in a long log.

```
Breno: the auth bug is in middleware.ts:42, token expiry uses < instead of <=.
```

The AI reads your name from `git config user.name` or your `CLAUDE.md`. If it finds nothing, it asks you once.

**The name is your hallucination detector.** When the model starts to drift, the name breaks first: it drops, changes, or reads slightly off. That is your signal the session is degrading. Open a new window, say *"read the TASK.md and continue"*, and resume from a clean state.

### 2. Living Task Document
Each task gets a `TASK.md` in the project root. After every meaningful prompt the AI records what it did, what broke, what it fixed, and where things stand now.

The Log is a record, not a diary. The AI cannot assert "fixed X". It shows proof: the command run, its output, the exit code. No proof, no Log entry; unproven work goes to `Unverified / Pending`. `Current State` may only claim something works if that proof sits in the Log. When context degrades the model drifts toward fluency before truth, so the evidence rule is what keeps a handoff trustworthy instead of a plausible story.

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
- Added retry to fetchUser(): `npm test auth` -> 12 passed, exit 0
- Fixed null deref in parse(): `cargo test parse` -> ok. 3 passed, exit 0

## Unverified / Pending
- Refactored cache layer: NOT tested yet, no proof

## Errors & Fixes
| Error | Cause | Fix | Evidence |
|-------|-------|-----|----------|

## Current State
Handoff paragraph for a fresh instance. Rewrite it each time so it always
describes right now. Only claim something works if its proof is in the Log;
otherwise say "implemented, not verified".
```

---

## How it works

1. A `SessionStart` hook ([`hooks/inject.js`](hooks/inject.js)) reads [`skills/zero-drift/SKILL.md`](skills/zero-drift/SKILL.md) and adds it to the context of each new session.
2. Claude looks for your name in this order: `git config user.name`; a name line in `CLAUDE.md`, `AGENTS.md` or `GEMINI.md`; an introduction earlier in the session. If all three come up empty, it asks once.
3. When you start a task with a name and a goal ("build X", "fix this bug"), Claude creates `TASK.md` in the project root and updates it after each prompt that moves the task forward.

---

## Install

### Recommended: install as a plugin (global, automatic)

This is the only option that turns Zero Drift on in **every** session by itself. The plugin ships a `SessionStart` hook that injects the rules into each new Claude Code window, so you never invoke anything or set up anything per session.

```
/plugin marketplace add obrenoalvim/zero-drift
/plugin install zero-drift@zero-drift
```

Then open a new Claude Code window. From that point on, every session starts with Zero Drift active: replies open with your name and tasks get a `TASK.md`. To confirm it loaded, check that the first reply in a fresh window starts with your name.

**Requirement:** Node.js on your `PATH`. The hook runs `node hooks/inject.js`.

> **Note on terms:** a *plugin* is the package; the `SessionStart` hook inside it is what makes the behavior *global and automatic*. Installing the plugin gives you both. The manual options below make the skill available but do **not** auto-activate it.

### Manual alternatives (no plugin)

These work without installing the plugin, but they require setup and do not auto-activate globally.

**Paste into CLAUDE.md**: add this to `~/.claude/CLAUDE.md` (global) or a project `CLAUDE.md`:

```markdown
# Zero Drift
Follow the Zero Drift skill rules:
1. Start every response with my name (detect from git config or ask)
2. For every specific task, maintain TASK.md in the project root and update it after every prompt
Full rules: https://github.com/obrenoalvim/zero-drift/blob/main/skills/zero-drift/SKILL.md
```

**Point the AI at this repo**: start a session and say:
> "Read https://github.com/obrenoalvim/zero-drift and follow the Zero Drift skill."

The AI reads the SKILL.md and applies the two rules.

**Copy the skill file**: copy `skills/zero-drift/SKILL.md` into your own skills directory and load it through your plugin system, such as superpowers.

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

The automatic `SessionStart` hook is specific to Claude Code. For the others, use the [manual alternatives](#manual-alternatives-no-plugin).

---

## FAQ

**Does Zero Drift send my data anywhere?**
No. The hook reads one file from disk and prints it as session context. It makes no network calls. If the file is missing, the hook prints nothing, so a broken install never blocks a session from starting.

**What should I do when Claude drops or changes my name?**
Take it as the signal that the session is degrading. Open a new window and say "Read the TASK.md and continue."

**Can I use it with Cursor, Codex or Copilot?**
Yes. Put the snippet from [Manual alternatives](#manual-alternatives-no-plugin) in your `AGENTS.md` or rules file.

---

## Contributing

Found a gap in the rules, or an edge case the skill misses? Open a PR. The SKILL.md is the source of truth. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [changelog](CHANGELOG.md).

## License

[MIT](LICENSE)

---

<div align="center">

If Zero Drift saves you a re-explain, a ⭐ helps other Claude Code users find it.

<sub>**Topics:** claude-code · claude-skill · claude-code-plugin · context-management · session-handoff · hallucination · ai-agents · prompt-engineering · cursor · llm</sub>

</div>
