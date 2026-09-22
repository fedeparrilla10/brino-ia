---
name: feature
description: Register a new feature in the current project's .ai/features.json, deriving a concise contract and deciding whether SDD is needed. Use whenever the user asks to create, add, queue, or register feature work, including requests with --direct, --sdd, or --no-sdd.
---

# Feature intake

Register work for the orchestrator. Do not implement code, generate specifications, design a solution, create tasks, or review changes.

## Input modes

- Default: derive the feature from the current request and relevant decisions already established in the conversation.
- `--direct`: use only the text supplied with the current instruction. Do not summarize earlier conversation.
- `--sdd`: force `sdd: true`.
- `--no-sdd`: force `sdd: false`.

Reject `--sdd` combined with `--no-sdd`. If direct mode has no feature text, ask for it. Ask questions only when the available context cannot produce a concrete description and observable acceptance criteria.

## Require the harness

Work in the current project root. Require all of these artifacts:

```text
.ai/features.json
.ai/features/
.ai/progress/history.md
docs/engineering.md
check.sh
```

If any is missing, tell the user to run `/setup-harness` and stop. Do not create, repair, migrate, or overwrite harness state.

Parse and validate `.ai/features.json` before editing. It must be a JSON array of feature entries with unique IDs in the `F-NNN` format. Stop rather than repairing invalid state.

When valid existing entries predate the `path` field, normalize only that missing field to `null` while appending the new feature. Do not otherwise change existing entries. A pre-existing SDD feature with a missing or null path, or with a path outside `.ai/features/`, requires explicit repair before execution; never migrate it or rediscover its directory with a wildcard.

## Build the feature contract

Create exactly one entry:

```json
{
  "id": "F-001",
  "title": "Concise action-oriented title",
  "description": "What observable problem or behavior should change.",
  "acceptance_criteria": ["Observable outcome"],
  "path": null,
  "sdd": false,
  "status": "pending"
}
```

Choose the next ID by taking the highest numeric `F-NNN` ID and adding one, starting at `F-001`. Never reuse a missing or deleted number. Preserve all existing entries and their order, then append the new entry. Use the user's language.

Write acceptance criteria as specific observable outcomes. Include unchanged behavior or relevant error behavior when it materially protects against regression. Do not add implementation steps, file paths, architecture choices, test plans, or speculative scope.

## Decide SDD

Use `sdd: false` for a small, localized, obvious, low-ambiguity change such as copy, simple validation, or a focused bug fix.

Use `sdd: true` when the work introduces non-trivial behavior, spans layers or modules, requires technical decisions, has multiple cases or edge cases, changes migrations, contracts, or APIs, or carries meaningful regression risk.

An explicit override always wins. Otherwise, prefer `sdd: true` when uncertainty is material; do not turn every feature into SDD.

Only when SDD is true, create `.ai/features/<feature-id>-<slug>/` and store its repository-relative path, for example `"path": ".ai/features/F-001-filter-products"`. Derive a concise lowercase kebab-case slug from the title, remove diacritics, and use only `a-z`, `0-9`, and hyphens; use `feature` if no usable characters remain. The feature ID is the stable identity. Never create a second directory with the same `<feature-id>-` prefix.

Do not add a placeholder file solely to track the empty directory in Git. The orchestrator will populate the directory with the SDD artifacts before the feature is committed.

When SDD is false, keep `path: null` and do not create a feature directory.

## Finish

Write valid, consistently formatted JSON. Return the feature ID, title, SDD decision with one short reason, and the feature directory when SDD is enabled.
