# Littlemark

A development demo for a personalized sticker shop, built with React, TanStack Start/Router, TypeScript, and Tailwind CSS. Customization runs in the browser; purchasing is disabled and no backend or database is required.

## Requirements

- Node.js 24 (see `.nvmrc`). With nvm: `nvm install && nvm use`.
- Bun 1.4.4 (see `.bun-version` and `packageManager` in `package.json`).

## Local development

```sh
bun install --frozen-lockfile
bun run dev
```

Use the local URL printed by Vite. The shop is at `/` and the configurator at `/design`. Designer links accept a validated `request` search parameter, for example `/design?request=Iron-on%20labels%20with%20bunny%20art`.

```sh
bun run lint
bun run typecheck
bun run test
```

## Static build and preview

```sh
bun run build
bun run preview
```

The preview serves the completed artifact at `http://127.0.0.1:4173/`. Override `HOST` or `PORT` if necessary. It serves directory index files and the custom 404 page, without an HTTP 200 SPA catch-all.

The build has two stages:

1. Vite and TanStack Start compile the app and prerender its SPA shell into `dist/client`. This stage briefly starts a local HTTP listener, so it requires an environment that permits local listening sockets.
2. Nitro's `github_pages` static builder packages those assets into `.output/public`. It creates `index.html`, `design/index.html`, `404.html`, and `.nojekyll`; no server bundle is deployed.

Nitro packaging runs separately because the pinned Nitro Vite integration attempts to bundle a server entry for static presets. SPA pages render in the browser from the actual URL, including its query string. The shell keeps the page body client-only until hydration completes so preloaded routes cannot render ahead of the empty static shell. The build-time server in `dist/server` is not part of the published artifact.

### Repository subpaths

For a project site hosted at `https://OWNER.github.io/REPOSITORY/`, build with:

```sh
VITE_BASE_PATH=/REPOSITORY/ bun run build
bun run preview
```

The preview then serves `http://127.0.0.1:4173/REPOSITORY/`. The base path is baked into assets and routing; rebuild when changing it. The artifact itself contains files at its root, without a nested `REPOSITORY` directory.

`VITE_BASE_PATH` defaults to `/` and is normalized to leading and trailing slashes. It can also be set in `.env.local`; see `.env.example`. Home links, favicon URLs, and assets respect this prefix. Direct designer links resolve through `design/index.html`; directory redirects preserve the query string. Unknown URLs return the SPA shell with an HTTP 404 status so the router can show its not-found page.

## Browser smoke tests

Install Chromium once after installing dependencies (and again after upgrading Playwright):

```sh
bunx playwright install chromium
bun run test:e2e
```

On Linux CI, use `bunx playwright install --with-deps chromium` to install the required system libraries too.

`test:e2e` builds and tests the static artifact twice, first at `/`, then at `/demo/`. Each build runs the same 18 checks using desktop and mobile Chromium viewports. The builds run sequentially because they share output directories. The last completed build remains available for preview.

The tests cover styles and assets, prompt submission, direct designer links and reloads, query validation, customization and reset, disabled purchasing, browser history, base-aware home links, custom 404 pages, and horizontal overflow. Every test also checks for uncaught browser errors, hydration errors, failed local assets, and Lovable requests. Google Fonts CSS is stubbed to keep behavior checks independent of external font availability.

To check an existing artifact, including a build for the actual repository name:

```sh
VITE_BASE_PATH=/REPOSITORY/ bun run build
bun run test:e2e:built
```

The tests read the base path from the build metadata in `.output/static.json`. They start their own static preview on `127.0.0.1:4175`, refuse to reuse a running server, and leave the development server alone. Keep this port free while testing.

For focused runs, forward Playwright options, for example `bun run test:e2e:built --project=mobile`. Reports are written under `playwright-report/root` or `playwright-report/subpath`; JSON results, failure screenshots, and traces are under the corresponding `test-results` directory. Open a report with `bunx playwright show-report playwright-report/subpath`. These generated files are ignored by Git and lint.

Browser execution requires local listening sockets and a Chromium installation. `bun run test:e2e:built --list` checks test discovery without starting a server or browser, but does not execute the tests.

## Deployment status

The static artifact is ready for GitHub Pages or another static host. Publish **only `.output/public`**. GitHub Actions workflows are the next implementation checkpoint; no automatic deployment is configured yet.

The intended demo uses a private source repository and a public Pages website. GitHub Pages for private repositories requires an eligible paid GitHub plan. The repository URL and Pages settings still need to be supplied/configured. See [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md) for the full deployment plan.
