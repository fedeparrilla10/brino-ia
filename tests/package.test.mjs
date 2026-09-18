import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const required = [
  "agents/orchestrator.md",
  "agents/implementer.md",
  "agents/reviewer.md",
  "commands/setup-harness.md",
  "plugins/parri-safety.js",
  "skills/setup-harness/SKILL.md",
  "skills/setup-harness/assets/check.sh",
  "skills/code-architecture/SKILL.md",
];

test("incluye todos los componentes mínimos", async () => {
  for (const relativePath of required) {
    await access(path.resolve(relativePath));
  }
});

test("los tres roles y el flujo humano quedan conectados", async () => {
  const orchestrator = await readFile(
    path.resolve("agents/orchestrator.md"),
    "utf8",
  );
  const implementer = await readFile(
    path.resolve("agents/implementer.md"),
    "utf8",
  );
  const reviewer = await readFile(path.resolve("agents/reviewer.md"), "utf8");

  assert.match(orchestrator, /mode: primary/);
  assert.match(orchestrator, /spec_ready/);
  assert.match(orchestrator, /aprobación humana explícita/);
  assert.match(orchestrator, /"implementer": allow/);
  assert.match(orchestrator, /"reviewer": allow/);
  assert.match(orchestrator, /ejecutá primero `\.\/check\.sh`/i);
  assert.match(
    orchestrator,
    /Cuando la revisión sea aprobada, ejecutá `\.\/check\.sh`/i,
  );
  assert.match(implementer, /Para cada tarea:/i);
  assert.match(
    implementer,
    /tests creados, modificados o directamente afectados/i,
  );
  assert.match(reviewer, /tests creados o modificados por el implementador/i);
  assert.match(reviewer, /no ejecutes `\.\/check\.sh`, la suite completa/i);
  assert.match(reviewer, /edit:\n    "\*": deny/);
});

test("no quedan placeholders fuera de la plantilla configurable", async () => {
  for (const relativePath of required.filter(
    (item) => !item.includes("skills/setup-harness/"),
  )) {
    const content = await readFile(path.resolve(relativePath), "utf8");
    assert.doesNotMatch(content, /__PARRI_/);
  }
});
