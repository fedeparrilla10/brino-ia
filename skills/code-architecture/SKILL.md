---
name: code-architecture
description: Acordar con el usuario la arquitectura y las convenciones prácticas de un proyecto y guardarlas en docs/engineering.md. Usar cuando el usuario quiera definir o actualizar esas reglas, o cuando setup-harness lo solicite.
---

# Arquitectura y convenciones

El objetivo es mantener una única guía breve y autoritativa en `docs/engineering.md`.

## Entender el proyecto

Leé `AGENTS.md`, la documentación técnica existente y una muestra representativa del código. Diferenciá los patrones observados de las reglas deseadas: que el código legacy haga algo no significa que deba repetirse.

## Acordar la dirección

Presentá un diagnóstico corto y una recomendación concreta. Preguntá de a una las decisiones que realmente cambien cómo se construirá el código. No impongas arquitecturas con nombre, capas ni abstracciones sin una necesidad del proyecto.

Priorizá reglas prácticas sobre:

- ubicación de la lógica de negocio;
- responsabilidades de controladores, servicios, modelos o componentes;
- validación y manejo de errores;
- persistencia e integraciones cuando sean relevantes;
- criterios de tests;
- tratamiento del código legacy.

La política recomendada para legacy es aplicar la guía al código nuevo y adaptar lo existente solo cuando la feature actual lo necesite.

## Escribir la guía

Creá o actualizá mínimamente `docs/engineering.md` en español. Usá esta forma:

```markdown
# Ingeniería

## Arquitectura

- Regla concreta.

## Convenciones

- Regla concreta.

## Tests

- Suite completa: `comando declarado por el proyecto`.
```

Apuntá a 5–10 reglas y menos de 40 líneas. Cuando `setup-harness` haya identificado checks, registrá también la suite completa y los comandos opcionales de lint o typecheck. No incluyas inventarios de archivos, explicaciones genéricas, requisitos de features ni backlogs de refactorización.

Si `AGENTS.md` no referencia la guía, proponé añadir esta instrucción y pedí aprobación antes de editarlo:

> Antes de diseñar, implementar o revisar código, leé `docs/engineering.md` y seguí las reglas relevantes para el cambio.

Terminá indicando la ruta de la guía y las decisiones registradas.
