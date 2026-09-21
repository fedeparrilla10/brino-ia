---
name: code-architecture
description: Agree with the user on a project's architecture and practical conventions and save them in docs/engineering.md. Use when the user wants to define or update those rules, or when setup-harness requests it.
---

# Architecture and conventions

The goal is to maintain a single concise, authoritative guide in `docs/engineering.md`.

## Understand the project

Read `AGENTS.md`, existing technical documentation, and a representative sample of the code. Distinguish observed patterns from desired rules: legacy code doing something does not mean it should be repeated.

## Agree on direction

Present a short diagnosis and concrete recommendation. Ask one at a time only about decisions that genuinely change how code will be built. Do not impose named architectures, layers, or abstractions without a project need.

Prioritize practical rules for:

- business-logic location;
- controller, service, model, or component responsibilities;
- validation and error handling;
- persistence and integrations when relevant;
- test criteria;
- legacy-code treatment.

The recommended legacy policy is to apply the guide to new code and adapt existing code only when the current feature requires it.

## Write the guide

Create or minimally update `docs/engineering.md`. Use this format:

```markdown
# Engineering

## Architecture

- Concrete rule.

## Conventions

- Concrete rule.
```

Aim for 5–10 rules and fewer than 40 lines. When `setup-harness` has identified checks, also record the full suite and optional lint or typecheck commands. Do not include file inventories, generic explanations, feature requirements, or refactoring backlogs.

If `AGENTS.md` does not reference the guide, propose adding this instruction and ask for approval before editing it:

> Before designing, implementing, or reviewing code, read `docs/engineering.md` and follow the rules relevant to the change.

Finish by stating the guide path and recorded decisions.
