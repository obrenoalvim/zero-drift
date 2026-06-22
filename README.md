# claude-skills

Personal Claude Code skills — compatible with the [superpowers](https://github.com/obra/superpowers) plugin.

## Structure

```
skills/
  {category}/
    {skill-name}/
      SKILL.md          # Main skill file (required)
      supporting.*      # Scripts, templates, etc. (optional)
```

### Categories used

| Category | Purpose |
|----------|---------|
| `automation` | Workflow and task automation patterns |
| `collaboration` | Multi-agent and human-AI collaboration |
| `debugging` | Debugging techniques and strategies |
| `development` | Coding and software development patterns |
| `research` | Research and information gathering |

## SKILL.md frontmatter

```yaml
---
name: Human-Readable Name
description: One-line summary of what this skill does
when_to_use: when [trigger/situation that signals this skill applies]
version: 1.0.0
languages: all | [typescript, python, ...]
---
```

## Installation with superpowers

If using the superpowers plugin, point `SUPERPOWERS_SKILLS_ROOT` to this directory or symlink the `skills/` folder alongside your other skills.

## Contributing

Skills added here are personal/private. For broadly useful skills, consider contributing to [obra/superpowers-skills](https://github.com/obra/superpowers-skills).
