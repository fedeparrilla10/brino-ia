---
name: setup-harness
description: Install or repair the Parri harness in the current Git project, create its state, and generate a minimal check.sh with the checks declared by the project.
---

# Harness setup

Install the harness without implementing production code. Preserve existing documentation, configuration, and state.

## Safe inspection

Read the structure, `AGENTS.md`, manifests, public configuration, and tests. Never read or request `.env`, `.env.*`, credentials, private keys, or logs with secrets. During setup, do not run tests, framework CLIs, database commands, deployments, or external services.

Verify that `git` is available and that the root belongs to a worktree with `git rev-parse --is-inside-work-tree`. If either condition is not met, stop; do not run `git init`.

## Initial state

Create only missing artifacts:

```text
.ai/features.json
.ai/features/
.ai/progress/history.md
docs/engineering.md
check.sh
```

A new `features.json` contains `[]`.

`history.md` starts with `# History`. Never overwrite existing state. If `features.json` is not valid JSON, stop and explain the error.

If `docs/engineering.md` does not exist, load `code-architecture` and complete that workflow. Do not infer desired rules from legacy code alone. With prior approval, ensure that the applicable `AGENTS.md` references `docs/engineering.md`.

## Discover checks

Search manifests, documentation, and public configuration for project-declared commands for:

- the full test suite, required;
- the linter, optional;
- typecheck, optional.

Do not infer a command solely from its conventional name. If there is one clear declaration, use it. If there are several candidates, show the user the concrete commands and ask which represents the corresponding check. If no full suite is declared, explain it and propose a concrete configuration; do not invent a command or complete setup.

Lint and typecheck commands must be check-only: never use autofix or write modes. Do not run any check during setup.

Record the full-suite command and found optional checks under `## Tests` in `docs/engineering.md`. Preserve the rest of the guide and do not duplicate the section.

## Generate check.sh

Read `assets/check.sh` from this skill and replace every `__PARRI_*__` token with safe shell arrays. Use separate executables and arguments; do not generate `eval` or `sh -c`. If a command declares environment variables, represent them with `env NAME=value`. The full suite is required. Use empty arrays for absent optional checks.

Create one executable `check.sh` at the root. If it already exists, show the user the proposed diff and obtain approval before replacing it.

Do not run `./check.sh` during setup. Validate only:

- that no `__PARRI_*__` tokens remain;
- `bash -n check.sh`;
- the executable bit.

## Optional initial feature

If the user has already described a feature or asks to create one during setup, register it with the next available `F-NNN` ID. For an SDD feature, create `.ai/features/F-NNN-slug/` and store that exact path. Do not create `requirements.md`, `design.md`, or `tasks.md` yet: the orchestrator creates them.

Each entry uses this contract:

```json
{
  "id": "F-001",
  "title": "Title",
  "description": "Expected outcome",
  "acceptance_criteria": ["Verifiable criterion"],
  "sdd": true,
  "path": ".ai/features/F-001-slug",
  "status": "pending"
}
```

For a feature without SDD, `path` must be `null`.

Finish by summarizing what was created, what was preserved, and which checks were configured.
