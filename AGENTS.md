# gym-buddy-api — Agent Instructions

## Runtime & Commands

- **Runtime**: Bun — do NOT use `npm`, `npx`, or `node` for dev workflows.
- **Start dev**: `bun run start:dev` (hot-reload via `--watch`).
- **Start prod**: build first (`bun run build`), then `bun run start:prod`.
- **Lint**: `bun run lint` — uses **oxlint** (not ESLint). Config in `oxlint.json`.
- **Format**: `bun run format` — Prettier, single quotes, trailing commas.
- **Typecheck**: `npx tsc --noEmit` (no dedicated npm script).

## Tests

- **Unit**: `bun run test` — Vitest, runs `**/*.spec.ts`.
- **Watch**: `bun run test:watch`.
- **Coverage**: `bun run test:cov`.
- **E2E**: `bun run test:e2e` — runs `**/*.e2e-spec.ts` with its own config (`vitest.config.e2e.ts`). Requires a running PostgreSQL instance.
- Vitest globals are enabled (`describe`, `it`, `expect` available without import).

## Database

- **PostgreSQL + PostGIS** (image: `postgis/postgis:15-3.3-alpine`).
- Start/stop: `docker compose up -d` / `docker compose down`.
- Connection config via `.env`: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- **Schema sync**: controlled by `DB_SYNCHRONIZE` env var (`true`/`false`). TypeORM `autoLoadEntities: true` — no manual entity registration needed.
- No migration tool configured; schema is synchronized by TypeORM in dev.

## Architecture

- **NestJS 12** with TypeScript 6.0.2, `nodenext` module resolution.
- **Global API prefix**: `/api/v1`.
- **Global ValidationPipe**: `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`.
- Modules: `auth`, `users`, `swipes`, `matches`, `messages`, `hashing` (Tinder-style gym buddy matching).
- Import paths use `.js` extension in source (TypeScript `nodenext` resolution).
- `class-validator` + `class-transformer` for DTO validation.
- JWT-based auth (`@nestjs/jwt`), custom `AuthModule` with `AuthModule`.

## Project Structure

- `src/` — source code.
- `test/` — e2e tests (`app.e2e-spec.ts`).
- `dist/` — build output (gitignored).
- `shared/` — shared enums (activity, availability, experience-level).
