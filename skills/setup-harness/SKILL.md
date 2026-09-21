---
name: setup-harness
description: Instalar o reparar el arnés Parri en el proyecto Git actual, crear su estado y generar un check.sh mínimo con los checks declarados por el proyecto.
---

# Setup del arnés

Instalá el arnés sin implementar código de producto. Conservá documentación, configuración y estado existentes.

## Inspección segura

Leé la estructura, `AGENTS.md`, manifiestos, configuración pública y tests. Nunca leas ni solicites `.env`, `.env.*`, credenciales, claves privadas o logs con secretos. Durante el setup no ejecutes tests, CLIs del framework, comandos de base de datos, despliegues ni servicios externos.

Comprobá que `git` está disponible y que la raíz pertenece a un worktree con `git rev-parse --is-inside-work-tree`. Si no se cumple, detenete; no ejecutes `git init`.

## Estado inicial

Creá solamente los artefactos faltantes:

```text
.ai/features.json
.ai/features/
.ai/progress/history.md
docs/engineering.md
check.sh
```

Un `features.json` nuevo contiene `[]`.

`history.md` comienza con `# Historial`. Nunca sobrescribas estado existente. Si `features.json` no es JSON válido, detenete y explicá el error.

Si `docs/engineering.md` no existe, cargá `code-architecture` y completá ese flujo. No deduzcas reglas deseadas únicamente del legacy. Asegurá, con aprobación previa, que el `AGENTS.md` aplicable referencia `docs/engineering.md`.

## Descubrir los checks

Buscá en manifiestos, documentación y configuración pública los comandos declarados por el proyecto para:

- la suite completa de tests, obligatoria;
- el linter, opcional;
- el typecheck, opcional.

No deduzcas un comando solo por su nombre convencional. Si existe una única declaración clara, usala. Si hay varias candidatas, mostrale al usuario los comandos concretos y preguntá cuál representa el check correspondiente. Si no hay una suite completa declarada, explicalo y proponé una configuración concreta; no inventes un comando ni completes el setup.

Los comandos de lint y typecheck deben ser de solo comprobación: nunca uses modos de autofix o escritura. No ejecutes ningún check durante el setup.

Registrá en `docs/engineering.md`, bajo `## Tests`, el comando de suite completa y los checks opcionales encontrados. Conservá el resto de la guía y no dupliques la sección.

## Generar check.sh

Leé `assets/check.sh` desde este skill y reemplazá todos los tokens `__PARRI_*__` con arrays shell seguros. Usá ejecutable y argumentos separados; no generes `eval` ni `sh -c`. Si un comando declara variables de entorno, representalas mediante `env NOMBRE=valor`. La suite completa es obligatoria. Para checks opcionales ausentes, usá arrays vacíos.

Creá un único `check.sh` ejecutable en la raíz. Si ya existe, mostrale al usuario el diff propuesto y obtené aprobación antes de reemplazarlo.

No ejecutes `./check.sh` durante el setup. Validá solamente:

- que no queden tokens `__PARRI_*__`;
- `bash -n check.sh`;
- el bit ejecutable.

## Feature inicial opcional

Si el usuario ya describió una feature o pide crearla durante el setup, registrala con el siguiente ID libre `F-NNN`. Para una feature SDD, creá `.ai/features/F-NNN-slug/` y guardá esa ruta exacta. No crees todavía `requirements.md`, `design.md` ni `tasks.md`: los crea el orquestador.

Cada entrada usa este contrato:

```json
{
  "id": "F-001",
  "title": "Título en español",
  "description": "Resultado esperado",
  "acceptance_criteria": ["Criterio verificable"],
  "sdd": true,
  "path": ".ai/features/F-001-slug",
  "status": "pending"
}
```

Para una feature sin SDD, `path` debe ser `null`.

Terminá resumiendo qué se creó, qué se conservó y qué checks quedaron configurados.
