# AGENTS.md

## Repo layout

- Single Angular 22 app with SSR (Express 5) — not a monorepo. `angular.json` project is `app2`;
  everything lives under `src/`. npm is the package manager (`packageManager: npm@11.12.1`) —
  don't introduce yarn/pnpm.
- Entrypoints: browser bootstrap `src/main.ts` → root component `src/app/app.ts`; server bootstrap
  `src/main.server.ts`; Express SSR server `src/server.ts` (add REST endpoints there, before the
  static-file and Angular handlers).
- No CI workflows, no lint target, no e2e target. `README.md` mentions `ng e2e`, but `angular.json`
  has no e2e configuration — don't trust that section.

## Commands (run from repo root)

- Dev server: `npm start` (= `ng serve`) → http://localhost:4200 (serves the SSR dev build).
- Build + typecheck: `npm run build` (= `ng build`, production). There is **no separate
  typecheck/lint script** — `ng build` is the typecheck (Angular template checking included).
  Output: `dist/app2/browser` + `dist/app2/server/server.mjs`.
- Run the built SSR server: `npm run serve:ssr:app2` (port from `PORT`, default 4000).
- Tests: `npm test` (= `ng test`). Runner is **Vitest, not Karma** (jsdom env — no browser
  install needed).
  - One-shot run: `ng test --no-watch` — watch mode defaults ON in a TTY and will hang an agent.
  - Focused run: `ng test --no-watch --filter "<regex>"` (regex matches suite and test names),
    e.g. `ng test --no-watch --filter "^App"`.
  - Test files are colocated `src/**/*.spec.ts`. Globals (`describe`, `it`, `expect`) are
    provided via `tsconfig.spec.json` (`vitest/globals`) — no imports needed.
- Formatting: Prettier only — `.prettierrc` (100 cols, single quotes, `angular` parser for
  `*.html`). There is no format script and no linter.
  - `npx prettier --check .` **currently fails on the untouched scaffold (22 files)**. Don't
    reformat the whole repo unprompted; run `npx prettier --write <files you changed>`.
- Verify changes with: `npx prettier --write <changed files>` → `npx ng build` →
  `npx ng test --no-watch`.

## Architecture & gotchas

- **Routes prerender by default**: `src/app/app.routes.server.ts` maps `path: '**'` to
  `RenderMode.Prerender`, so `ng build` statically prerenders every route (build output says
  "Prerendered 1 static route"). A route with dynamic params, or one that must render on the
  server, will break the build until you give it its own `ServerRoute` with
  `RenderMode.Server`/`Client`.
- `provideClientHydration()` is enabled in `src/app/app.config.ts` — SSR state is hydrated into
  the client; don't read `window`/`document` during server rendering.
- Production build budgets (`angular.json`): initial 500 kB warn / 1 MB error; component styles
  4 kB warn / 8 kB error. Exceeding them **fails `ng build`**.
- Express 5 path syntax in `src/server.ts` (e.g. `'/api/{*splat}'`), not Express 4 `'*'`.
- Component selector prefix is `app` (from `angular.json`); scaffold with
  `ng generate component <name>` to stay consistent.
