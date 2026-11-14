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

Nitro packaging runs separately because the pinned Nitro Vite integration attempts to bundle a server entry for static presets. SPA pages render in the browser from the actual URL, including its query string. The build-time server in `dist/server` is not part of the published artifact.

### Repository subpaths

For a project site hosted at `https://OWNER.github.io/REPOSITORY/`, build with:

```sh
VITE_BASE_PATH=/REPOSITORY/ bun run build
bun run preview
```

The preview then serves `http://127.0.0.1:4173/REPOSITORY/`. The base path is baked into assets and routing; rebuild when changing it. The artifact itself contains files at its root, without a nested `REPOSITORY` directory.

`VITE_BASE_PATH` defaults to `/` and is normalized to leading and trailing slashes. It can also be set in `.env.local`; see `.env.example`. Home links, favicon URLs, and assets respect this prefix. Direct designer links resolve through `design/index.html`; directory redirects preserve the query string. Unknown URLs return the SPA shell with an HTTP 404 status so the router can show its not-found page.

## Deployment status

The static artifact is ready for GitHub Pages or another static host. Publish **only `.output/public`**. GitHub Actions workflows and browser smoke tests are the next implementation checkpoints; no automatic deployment is configured yet.

The intended demo uses a private source repository and a public Pages website. GitHub Pages for private repositories requires an eligible paid GitHub plan. The repository URL and Pages settings still need to be supplied/configured. See [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md) for the full deployment plan.
