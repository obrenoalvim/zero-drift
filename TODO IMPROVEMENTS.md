# TODO IMPROVEMENTS

### Multiple concurrent tasks in one project
- **Category:** Feature
- **What:** SKILL.md says every specific task gets a `TASK.md` in the project root, but doesn't say what to do when a second, unrelated task starts while an existing `TASK.md` belongs to a different (possibly finished) task — currently it would just get overwritten or confusingly appended to.
- **Where:** skills/zero-drift/SKILL.md ("When to create" section)
- **Why:** Real usage often has more than one active thread per repo (a bugfix and a feature in parallel, or a stale finished task left behind). Silent overwrite loses the old task's history.
- **Risk:** Changes core behavior — could mean per-task filenames (`TASK-<slug>.md`) or an archive step, both of which affect the handoff instructions users already rely on.
- **Effort:** Medium

### Non-interactive / CI sessions and the name-ask fallback
- **Category:** Bug
- **What:** Rule 1's fallback ("if nothing found, ask once") assumes an interactive user who can answer. In CI, scripted, or headless Claude Code runs there's no one to answer, and `git config user.name` may resolve to a bot/service account name.
- **Where:** skills/zero-drift/SKILL.md ("How to find the name" section)
- **Why:** The skill's `when_to_use: always` implies it also engages in non-interactive contexts, where blocking on a question stalls the run.
- **Risk:** Touches the core Rule 1 fallback logic; needs a policy decision (skip naming vs. use a generic placeholder) rather than a wording tweak.
- **Effort:** Low

### PreCompact hook for mid-session reinforcement
- **Category:** Feature
- **What:** `hooks/hooks.json` only wires a `SessionStart` hook. Drift is described as something that creeps in as context fills up, but the rules are only re-injected at the very start of a session, not around compaction/summarization events.
- **Where:** hooks/hooks.json, hooks/inject.js
- **Why:** A `PreCompact` (or equivalent) hook re-injecting the same `additionalContext` could reinforce the rules exactly when drift risk is highest, which is the stated problem the skill exists to solve.
- **Risk:** New hook wiring is easy to add safely, but changes what gets injected and when — flagging instead of doing it silently since it changes plugin runtime behavior.
- **Effort:** Low
