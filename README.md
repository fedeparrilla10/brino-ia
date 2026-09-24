# Parri Harness for OpenCode

Minimal harness for running one feature at a time with four roles:

- `orchestrator`: coordinates the work, runs `check.sh` before and after implementation, and maintains state.
- `sdd-creator`: prepares or revises the SDD documents when requested.
- `implementer`: implements task by task and runs affected tests in every cycle.
- `reviewer`: reviews without editing code, evaluates those tests, and runs them independently.

## Installation

Restart OpenCode after installation.

## First use in a project

From the root of a Git repository:

```text
/setup-harness
```

Setup creates and configures:

```text
.ai/features.json
.ai/features/
.ai/progress/history.md
docs/engineering.md
check.sh
```

`check.sh` runs the full suite and, when declared by the project, lint and typecheck. Setup discovers those commands in public files and asks only when there are multiple choices or no suite is configured.

An SDD feature moves through `pending -> spec_ready`, stops for human approval, and only then continues to `in_progress`. Without SDD, it moves directly from `pending` to `in_progress` after a passing baseline.

## Register a feature

After setup, ask OpenCode to create or register a feature. The `to-feature` skill derives a concise, verifiable contract and appends it to `.ai/features.json` without implementing it.

Only `--sdd` enables SDD; otherwise features do not use it. SDD features receive a directory under `.ai/features/`, which `sdd-creator` populates later.

## Installed structure

OpenCode automatically discovers files in `agents/`, `commands/`, `skills/`, and `plugins/` within its global configuration directory.
