import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const pluginPath = path.resolve("plugins/parri-safety.js");
const { ParriSafety } = await import(pathToFileURL(pluginPath));

const fixture = async (enabled) => {
  const directory = await mkdtemp(path.join(tmpdir(), "parri-plugin-"));
  if (enabled) {
    await mkdir(path.join(directory, ".ai"));
    await writeFile(path.join(directory, ".ai", "features.json"), "[]\n");
  }
  const hooks = await ParriSafety({ directory });
  return { directory, before: hooks["tool.execute.before"] };
};

test("protege archivos de entorno incluso sin arnés", async () => {
  const { directory, before } = await fixture(false);
  try {
    await assert.rejects(
      before({ tool: "read" }, { args: { filePath: ".env.testing" } }),
      /BLOQUEADO/,
    );
    await assert.doesNotReject(
      before({ tool: "read" }, { args: { filePath: ".env.example" } }),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("activa las restricciones de comandos solo en proyectos con arnés", async () => {
  const disabled = await fixture(false);
  const enabled = await fixture(true);
  try {
    await assert.doesNotReject(
      disabled.before({ tool: "bash" }, { args: { command: "php artisan migrate" } }),
    );
    await assert.rejects(
      enabled.before({ tool: "bash" }, { args: { command: "php artisan migrate" } }),
      /Artisan/,
    );
    await assert.rejects(
      enabled.before({ tool: "bash" }, { args: { command: "psql app" } }),
      /base de datos/,
    );
    await assert.doesNotReject(
      enabled.before({ tool: "bash" }, { args: { command: "npm test" } }),
    );
  } finally {
    await rm(disabled.directory, { recursive: true, force: true });
    await rm(enabled.directory, { recursive: true, force: true });
  }
});
