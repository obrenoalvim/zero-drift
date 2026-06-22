// Zero Drift — SessionStart hook
// Injects the skill rules into every new Claude Code session so the plugin
// is active globally without the user invoking anything. Reads SKILL.md at
// runtime, so the rules stay in sync with the source of truth.
//
// Cross-platform: runs under Node on Windows, macOS, and Linux. Fails silent
// so a missing file or environment never blocks session start.

const fs = require('fs');
const path = require('path');

const root = process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, '..');

try {
  const skillPath = path.join(root, 'skills', 'zero-drift', 'SKILL.md');
  const skill = fs.readFileSync(skillPath, 'utf8');

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext:
          'ZERO-DRIFT GLOBAL BASELINE ACTIVE. Apply these rules in every response of this session:\n\n' +
          skill,
      },
    })
  );
} catch (e) {
  // Never block session start — emit nothing on failure.
}
