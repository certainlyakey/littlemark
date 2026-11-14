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

## GitHub Actions and Pages deployment

The workflows publish a **public development demo from a private source repository**. They deploy only `.output/public`; purchasing stays disabled.

| Event                               | What runs                                                                                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pull request targeting `main`       | CI: frozen dependency install, lint, TypeScript, unit tests, and all 36 desktop/mobile browser checks at `/` and `/demo/`. No deployment.                  |
| Push to `main`                      | The Pages workflow calls the same CI workflow, then builds for the actual Pages base path, runs 18 browser checks against that artifact, and publishes it. |
| Manual Pages workflow run on `main` | The same complete checks, build, and deployment. Runs selected on other branches do not deploy.                                                            |

[CI](./.github/workflows/ci.yml) is reusable so a push to `main` does not create duplicate CI runs. [Deploy GitHub Pages](./.github/workflows/pages.yml) waits for those checks before building or publishing. Both workflows read the Node and Bun versions from `.nvmrc` and `.bun-version`.

GitHub Pages metadata supplies `VITE_BASE_PATH`, so the workflows contain no hardcoded owner, repository name, or site URL. The exact artifact tested at that base path is uploaded, including `.nojekyll`. The published URL appears in the `github-pages` deployment environment. Deployments are serialized; failed checks leave the previously published demo in place.

Browser reports and test results are uploaded as `ci-browser-reports` and `pages-browser-reports` artifacts and retained for seven days, including on test failures.

### One-time repository setup

1. Identify the existing private destination repository (`https://github.com/OWNER/REPOSITORY`) and confirm its owner has GitHub Pro, Team, or Enterprise, which supports Pages from private repositories. See [GitHub Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
2. Connect this checkout to that repository and authenticate for normal pushes using SSH or GitHub CLI (`gh auth login`). If the destination already has commits, reconcile its history before pushing; preserve published history.
3. As a repository administrator, enable Actions and allow the referenced `actions/*` and `oven-sh/setup-bun` actions under **Settings → Actions → General**, subject to organization policy.
4. In **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source. Do this before the first deployment run: the workflow reads Pages settings and intentionally does not attempt to enable Pages itself.
5. In **Settings → Environments → github-pages**, allow deployments from `main`. To update automatically on pushes, do not configure required reviewers for that environment.
6. After committing the workflows, push `main`. In the Actions tab, open **Deploy GitHub Pages** and verify **Checks → Build Pages artifact → Publish Pages** succeeds. Follow its deployment URL and test the home page and a direct designer link with a `request` query parameter.

No personal API key, PAT, deployment SSH key, repository secret, or custom environment variable is required by these workflows. GitHub supplies the temporary `GITHUB_TOKEN`. CI has `contents: read`; the artifact build additionally has `pages: read` to obtain the URL; only the publish job has `pages: write` and `id-token: write`. Local Git authentication and initial repository administration are separate from that workflow token. See [GitHub's custom Pages workflow requirements](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

The default deployment branch is `main` and no custom domain is configured. To change branches, update both workflow trigger filters, the Pages workflow's branch guard, and the environment's deployment branch rule together.

### Reruns, troubleshooting, and rollback

- To redeploy the current `main`, open **Actions → Deploy GitHub Pages → Run workflow** and select `main`.
- If **Read GitHub Pages settings** fails, confirm that Pages is enabled with the GitHub Actions source, the account plan supports a private repository, and organization policies allow Pages and the configured permissions.
- If checks fail, inspect the failing step and download its browser-report artifact. To reproduce locally, run `bun run lint`, `bun run typecheck`, `bun run test`, and `bun run test:e2e`. For the actual repository path, build with `VITE_BASE_PATH=/REPOSITORY/` and run `bun run test:e2e:built`.
- If publishing is waiting, inspect the `github-pages` environment's protection settings. If it fails, inspect the Pages deployment job and confirm that the environment allows `main`.
- To roll back, revert the unwanted commit on `main` and push the revert. The workflow checks and republishes the reverted code without rewriting Git history.

The workflows are configured locally; the repository URL, account eligibility, remote settings, and first hosted deployment still need to be established. See [DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md) for the full plan.
