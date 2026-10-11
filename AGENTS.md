# AGENTS.md

Console weather CLI (course exercise "02-weather"). README is the spec: interactive menu, OpenMeteo weather, final goal is a compiled executable. Sources live in `src/` (`index.ts` entry point, `api.ts`, `storage.ts`, `ui.ts`); package.json has `start`/`dev` scripts.

## Commands

- Install deps: `bun install` (lockfile is `bun.lock` — use Bun, not npm/pnpm/yarn)
- Run: `bun run src/index.ts` (or `bun start` / `bun run dev` for watch mode)
- Typecheck: `bunx tsc` (config sets `noEmit`, so nothing is emitted; no build step)
- Bun 1.4.x; TypeScript is a `peerDependency` (`typescript: ^7`) — provided by the runtime toolchain, not installed directly
- Tests (when added): `bun test`, single file: `bun test path/to/file.test.ts` (no test framework in deps; use Bun's built-in)

## Domain facts (from README)

- Weather data: OpenMeteo, two-step flow — Geocoding API to resolve city name → lat/lon, then Forecast API (`current=temperature_2m`). No API key needed.
  - `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
  - `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
- Menu options: default city weather, all cities, search-and-add city (count=1), delete city, set default, settings (units °C/°F), exit. UI strings are Spanish; keep them Spanish. Note: README example numbering skips 6–7 (options 5, 8, 9).
- "Guardar la ciudad por defecto" implies persisting cities/settings to a local file (JSON via `Bun.file` + `Bun.write`, not localStorage).

## TypeScript conventions

- Imports must use `.ts` extensions (`./index.ts`) — `allowImportingTsExtensions` is on and `moduleResolution: bundler`
- `verbatimModuleSyntax` is on: use `import type` for type-only imports
- Strict mode plus `noUncheckedIndexedAccess` are enabled — array/object index access returns possibly-undefined
