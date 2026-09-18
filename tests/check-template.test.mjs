import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const template = await readFile(
  path.resolve("skills/setup-harness/assets/check.sh"),
  "utf8",
);
const shellQuote = (value) => `'${value.replaceAll("'", `'"'"'`)}'`;

const createFixture = async ({ lint = true, typecheck = true, lintFails = false } = {}) => {
  const directory = await mkdtemp(path.join(tmpdir(), "parri-check-"));
  await writeFile(
    path.join(directory, "lint.mjs"),
    `process.stdout.write("lint ejecutado\\n"); process.exit(${lintFails ? 1 : 0});\n`,
  );
  await writeFile(
    path.join(directory, "typecheck.mjs"),
    'process.stdout.write("typecheck ejecutado\\n");\n',
  );
  await writeFile(
    path.join(directory, "tests.mjs"),
    'process.stdout.write("tests ejecutados\\n");\n',
  );

  const command = (file) => `${shellQuote(process.execPath)} ${shellQuote(file)}`;
  const script = template
    .replace("__PARRI_LINT_COMMAND__", lint ? command("lint.mjs") : "")
    .replace("__PARRI_TYPECHECK_COMMAND__", typecheck ? command("typecheck.mjs") : "")
    .replace("__PARRI_TEST_COMMAND__", command("tests.mjs"));
  await writeFile(path.join(directory, "check.sh"), script);
  return directory;
};

const run = (directory, args = []) =>
  spawnSync("bash", ["check.sh", ...args], { cwd: directory, encoding: "utf8" });

test("ejecuta todos los checks aunque uno falle", async () => {
  const directory = await createFixture({ lintFails: true });
  try {
    const result = run(directory);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /lint ejecutado/);
    assert.match(result.stdout, /typecheck ejecutado/);
    assert.match(result.stdout, /tests ejecutados/);
    assert.match(result.stderr, /\[FAIL\] Linter/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("admite lint y typecheck ausentes", async () => {
  const directory = await createFixture({ lint: false, typecheck: false });
  try {
    const result = run(directory);
    assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
    assert.match(result.stdout, /tests ejecutados/);
    assert.doesNotMatch(result.stdout, /lint ejecutado|typecheck ejecutado/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("rechaza argumentos", async () => {
  const directory = await createFixture();
  try {
    const result = run(directory, ["--skip-tests"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /no acepta argumentos/);
    assert.doesNotMatch(result.stdout, /ejecutado/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
