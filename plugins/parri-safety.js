import { existsSync } from "node:fs";
import { join } from "node:path";

const normalizeCommand = (command) =>
  String(command ?? "")
    .replace(/\\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isProtectedEnvFile = (filePath) => {
  const name = String(filePath ?? "").split(/[\\/]/).pop();
  return name !== ".env.example" && (name === ".env" || name.startsWith(".env."));
};

const blockedCommand = (command, harnessEnabled) => {
  if (!harnessEnabled) return null;

  if (/(^|[;&|]\s*|\s)(?:\S*php\S*\s+)?(?:\S*\/)?artisan(?:\s|$)/i.test(command)) {
    return "los comandos Artisan directos no están permitidos";
  }

  if (/(^|[;&|]\s*|\s)(?:\S*\/)?(?:mysql|mariadb|psql|sqlite3|mongosh|redis-cli)(?:\s|$)/i.test(command)) {
    return "los clientes directos de base de datos no están permitidos";
  }

  return null;
};

export const ParriSafety = async ({ directory }) => ({
  "tool.execute.before": async (input, output) => {
    if (
      (input.tool === "read" || input.tool === "edit") &&
      isProtectedEnvFile(output.args.filePath ?? output.args.path)
    ) {
      throw new Error("BLOQUEADO: los agentes no pueden leer ni modificar archivos de entorno");
    }

    if (input.tool !== "bash") return;

    const harnessEnabled = existsSync(join(directory, ".ai", "features.json"));
    const reason = blockedCommand(normalizeCommand(output.args.command), harnessEnabled);
    if (reason) {
      throw new Error(`BLOQUEADO: ${reason}. Ejecutalo manualmente fuera de OpenCode.`);
    }
  },
});
