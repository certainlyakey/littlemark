# Independent build and GitHub Pages demo deployment

## Summary

Remove Lovable tooling, telemetry, and Cloudflare deployment defaults. Retain React, TanStack Start/Router, Tailwind, and Nitro, using **SPA mode with Nitro’s `github_pages` preset** to publish static files.

The source repository stays private; the development demo is publicly accessible. Purchasing remains disabled. Pushes to `main` automatically update the demo.

## Deployment prerequisites

| Needed | Details |
|---|---|
| Existing repository URL | Supply `https://github.com/OWNER/REPOSITORY` and identify a deployment branch if it is not `main`. |
| Eligible GitHub plan | Pages from private repositories requires GitHub Pro, Team, or Enterprise. Confirm the repository owner has an eligible plan. [GitHub availability](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) |
| Repository access | Write access to push code and workflows; admin access for the initial Pages configuration. |
| Initial Pages settings | Enable Actions and select **Settings → Pages → Build and deployment → Source: GitHub Actions**. Permit deployment from `main` in the `github-pages` environment. |
| Authentication for initial setup | Prefer an authenticated GitHub CLI session or SSH for pushing, plus browser/CLI access for settings. A personal API key is **not required for recurring deployments**. |

GitHub Actions supplies its temporary `GITHUB_TOKEN`; no deployment PAT, SSH deploy key, Cloudflare credentials, or Lovable credentials need storing in repository secrets. Deployment uses `pages: write` and `id-token: write`. [GitHub workflow requirements](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

If setup must use an API token instead of an existing authenticated session, it needs repository contents/workflow write access and Pages administration access. Configure it through local authentication, without committing it.

## Application and build changes

- Replace the Lovable Vite wrapper with explicit TanStack Start, React, Tailwind, TypeScript path resolution, and Nitro plugins. Preserve dependency deduplication where needed.
- Configure TanStack Start SPA mode and Nitro’s `github_pages` static preset. Publish only `.output/public`; no server process is deployed. [Nitro Pages preset](https://nitro.build/deploy/providers/github-pages)
- Generate the SPA shell and finalize the output with `index.html`, `design/index.html`, `404.html`, and `.nojekyll`. Both known routes must resolve without relying on host rewrite rules. Unknown paths load the shell and display the existing router’s not-found screen.
- Remove Lovable browser reporting and its root-boundary integration. Remove the custom server entry, middleware, and server error helpers that become unnecessary; use Start’s default build-time entry.
- Remove the Lovable package, `.lovable` metadata, Bun exceptions for Lovable packages, obsolete Cloudflare configuration comments, and template instructions. Update documentation while preserving the shop-specific AGENTS.md rules.
- Retain Nitro: its multi-platform internals may contain Cloudflare presets, but the application will have no active Cloudflare integration.
- Keep Bun and `bun.lock`; pin Bun to `1.4.4` and Node to the `24` release line for local development and CI. Use frozen-lockfile installs and avoid unrelated dependency upgrades.
- Resolve the existing Prettier violations so lint can serve as a deployment gate; retain existing lint rules.

**URL interface:** add `VITE_BASE_PATH`, defaulting to `/`. Use its normalized value consistently for Vite assets, router navigation, favicon, and error-page home links. Deployment derives it from GitHub Pages metadata rather than hardcoding the repository name.

Preserve `/` and `/design` as application routes, including validated `request` search state, shared chrome, illustrations, and styles. Under a project site, their published URLs become `/REPOSITORY/` and `/REPOSITORY/design/`. Initialize designer state from the browser’s actual query string.

## GitHub Actions

Add two workflows:

- **CI:** run on pull requests targeting `main` and pushes to `main`. Install pinned tools and dependencies, then run lint, TypeScript checking, existing tests, static builds, and browser smoke tests.
- **Pages deployment:** run on pushes to `main` and manual `workflow_dispatch`. Require successful checks before publishing. Use official checkout, Node setup, Pages configuration, artifact upload, and Pages deployment actions, plus Bun setup.
- Derive the deployment base path from `actions/configure-pages`; build the static artifact for that path and upload `.output/public`, including `.nojekyll`.
- Keep build permissions read-only. Grant `pages: write` and `id-token: write` only to the deployment job, which uses the `github-pages` environment and reports the published URL.
- Serialize deployments with a Pages concurrency group. Pull requests never publish or receive deployment permissions.

Update the README with local commands, required GitHub settings, deployment behavior, troubleshooting, and rollback through a normal revert followed by redeployment.

## Validation and first deployment

- Run existing tests, TypeScript, and lint.
- Add browser smoke tests against a static server without SPA catch-all rewrites, at both `/` and a representative `/demo/` base path.
- Verify prompt submission, direct designer links, refreshes, trailing-slash redirects with query preservation, malformed search input, back navigation, customization controls, assets, and the unknown-route screen.
- Confirm no hydration errors, Lovable telemetry, or requests to Lovable services; purchasing remains disabled.
- Check that deployment artifacts contain the required HTML and assets and require no runtime server.
- Work from a checkout of the existing repository; reconcile this exported directory with its current contents and preserve published history.
- Push the completed changes, observe the first successful Actions deployment, and verify the published URLs. Confirm a subsequent push updates the demo automatically.

**Defaults:** public demo from an existing private repository, deployment branch `main`, standard `github.io` project URL, no custom domain, browser rendering, and no checkout/backend work. The repository URL and plan eligibility remain required setup inputs; neither is available in the current directory.
