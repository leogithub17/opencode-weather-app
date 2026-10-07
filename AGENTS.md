# AGENTS.md

Console weather CLI (course exercise "02-weather"). README is the spec: interactive menu, OpenMeteo weather, final goal is a compiled executable. Currently almost empty — only `index.ts` with a hello-world; package.json has no scripts.

## Commands

- Install deps: `bun install` (lockfile is `bun.lock` — use Bun, not npm/pnpm/yarn)
- Run: `bun run index.ts`
- Typecheck: `bunx tsc` (config sets `noEmit`, so nothing is emitted; no build step)
- Tests (when added): `bun test`, single file: `bun test path/to/file.test.ts` (no test framework in deps; use Bun's built-in)

## Domain facts (from README)

- Weather data: OpenMeteo, two-step flow — Geocoding API to resolve city name → lat/lon, then Forecast API (`current=temperature_2m`). No API key needed.
  - `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
  - `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
- Menu options: default city weather, all cities, search-and-add city (count=1), delete city, set default, settings (units °C/°F), exit. UI strings are Spanish; keep them Spanish.
- "Guardar la ciudad por defecto" implies persisting cities/settings to a local file (JSON via `Bun.file` + `Bun.write`, not localStorage).

## TypeScript conventions

- Imports must use `.ts` extensions (`./index.ts`) — `allowImportingTsExtensions` is on and `moduleResolution: bundler`
- `verbatimModuleSyntax` is on: use `import type` for type-only imports
- Strict mode plus `noUncheckedIndexedAccess` are enabled — array/object index access returns possibly-undefined
