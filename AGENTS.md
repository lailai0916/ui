# Repository instructions

Shared React UI for lailai's websites, published as `@lailai0916/ui`. This repository owns component
behavior, CSS Modules, `--lk-*` design tokens, declarations, and standalone examples. The website
owns its Docusaurus adapters, article widgets, page content, and translations of application text.

Before style-sensitive work, load the shared `lailai-skill`. Repository and README maintenance follows
[Repository standards](https://github.com/lailai0916/lailai-template/blob/main/SETUP.md).

## Commands

Use Node.js 24 and npm. `npm ci` installs development dependencies. `npm run dev` starts the bilingual
React demo. `npm run check` runs formatting, lint, types, build, SSR/package tests, and demo build.
`npm run format` applies formatting. `npm run build` emits `dist/`; `npm pack --dry-run` inspects the
published files. See `docs/releasing.md` for releases. Run checks before committing.

## Architecture

- `src/components/*/` contains component entries and their CSS Modules where needed.
- `src/provider.tsx` connects native defaults to host routing, headings, and localization.
- `src/theme.css` owns shared variables, light/dark palettes, and reduced motion.
- `src/components/ThemeProvider/` owns optional standalone theme state; framework hosts may keep their own manager.
- Stable `data-lk` customization hooks and the former `ui` migration are documented in `docs/integration.md` and `docs/migrating-from-ui.md`.
- `src/hooks/` and `src/utils/` contain public, framework-neutral helpers.
- Public usage guides and MDX previews live in Home at `docs/project/ui/`, published in the [UI documentation](https://lailai.one/docs/project/ui). Update the matching guide when changing a public API; library-local `docs/` owns integration and release details.
- `demo/` exercises all public components without a framework adapter.
- `tests/` verifies server rendering, localization, semantics, and package boundaries.
- `scripts/check-release.mjs` checks registry versions before automatic publishing.

## Publishing

After validation, `.github/workflows/ci.yml` publishes an unpublished stable version on pushes to
`main` or manual dispatches on `main`, using npm Trusted Publishing. Existing versions are skipped;
registry failures and unpublished versions older than `latest` fail. Pull requests and tags never
publish. Bump `package.json` and `package-lock.json` together and update `CHANGELOG.md` for each release.
The npm connection names `lailai0916/ui` and `ci.yml`, with direct publishing allowed and no
environment. Keep that binding aligned with workflow changes. Do not add npm tokens to CI.
After npm succeeds, a separate job creates the matching tag and GitHub release from the changelog,
after comparing package inputs with npm's recorded source commit. The tag points to the validated
workflow commit. Only that job has `contents: write`; existing releases are skipped.

## Conventions

- No imports from Docusaurus, `@site`, or `@theme`; no `--ifm-*` references. Integrations live in hosts.
- Preserve ESM module boundaries and the `use client` directive; keep React external as a peer.
- Export public prop types. Named root exports and existing component subpaths remain compatible.
- Import CSS separately; mark CSS as side effects. Avoid global resets and arbitrary page styling.
- Keep native defaults useful. Provider adapters add no DOM wrapper; labels remain configurable.
- Preserve typography, surfaces, keyboard semantics, focus rings, overflow behavior, and reduced motion.
- Render Iconify icons through the shared `Icon`. Its empty SVG preserves dimensions and CSS before
  data arrives; only that component imports Iconify's renderer. Non-square slots need explicit dimensions.
- No whole-card hover lift. Press feedback is brief; cards do not clip focus rings by default.
- Charts keep loading, empty, failure, and retained-data notices distinct. Callers format date labels.
- Keep English/Chinese examples and documentation aligned; update the inventory for public API changes.
- Never add automated authorship or promotional signatures to commits, PRs, or files.

CI calls the external repository checker at reviewed revision
`44bf94b5718ba605cdd7e240ed2e47b4b53f7500`; update that pin deliberately.

The public npm package intentionally retains the `@lailai0916` scope.
`scripts/validate-standards.py` delegates to the external checker, permits only that exact naming
exception, and separately verifies `@lailai0916/ui`. It does not copy the upstream checker.
