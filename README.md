# Parri Harness para OpenCode

Arnés mínimo para ejecutar una feature por vez con tres roles:

- `orchestrator`: prepara el SDD, ejecuta `check.sh` antes y después del trabajo y mantiene el estado.
- `implementer`: implementa tarea por tarea y ejecuta los tests afectados en cada ciclo.
- `reviewer`: revisa sin editar código, evalúa esos tests y los ejecuta independientemente.

## Instalación

Reinicia OpenCode después de instalar.

## Primer uso en un proyecto

Desde la raíz de un repositorio Git:

```text
/setup-harness
```

El setup crea y configura:

```text
.ai/features.json
.ai/features/
.ai/progress/current.md
.ai/progress/history.md
docs/engineering.md
check.sh
```

`check.sh` reúne la suite completa y, cuando el proyecto los declara, lint y typecheck. El setup descubre esos comandos en archivos públicos y solo pregunta cuando hay varias opciones o falta una suite configurada.

Una feature con SDD pasa por `pending -> spec_ready`, se detiene para aprobación humana y solo entonces continúa a `in_progress`.

## Comprobación del paquete

```bash
node --test tests/*.test.mjs
```

## Estructura instalada

OpenCode descubre automáticamente los archivos de `agents/`, `commands/`, `skills/` y `plugins/` dentro de su directorio de configuración global.
