# Releasing

The public npm package is `@lailai0916/ui`; GitHub source is `lailai0916/ui`.
The `CI` workflow in `.github/workflows/ci.yml` validates pushes and pull requests. A push to `main`
then publishes an unpublished stable version automatically through npm Trusted Publishing (OIDC).
The publish job also runs when the maintainer manually dispatches `CI` on `main`.
After npm succeeds, a separate job creates the matching tag and GitHub release from the changelog.
The tag points to npm's recorded source commit; existing GitHub releases are skipped.
An existing npm version is skipped; failed checks, registry errors, or an unpublished version older than
`latest` stop the release. Tags and pull requests only run validation.

## Release a version

1. Update the version in `package.json` and `package-lock.json`, and describe the release in
   `CHANGELOG.md`. Until 1.0, use a minor bump for breaking changes and a patch for compatible fixes.
2. Run `npm run check`, then `npm pack --dry-run`. Confirm the package includes only `dist/`, package
   metadata, README, and license. Install the tarball into a consumer and verify its build and UI.
3. Commit and push the release source to `main`. Wait for `validate`, `publish`, and `release` in the
   [CI workflow](https://github.com/lailai0916/ui/actions/workflows/ci.yml) to succeed.
   Publishing uses a fresh dependency install; `prepublishOnly` reruns the complete package checks.
4. Verify `npm view @lailai0916/ui version` and the matching `vX.Y.Z` tag and GitHub release,
   and install the registry version in each consumer. Commit consumer lockfiles and run their checks.

An npm version is immutable: fix a published defect with another version. Keep the website on an
explicit reviewed version; shared source updates do not silently change a deployed website.

For a compatible fix, bump both package files before committing:

```bash
npm version patch --no-git-tag-version
npm run check
```

Update `CHANGELOG.md` in the same commit. Automatic publishing accepts stable `X.Y.Z` versions only;
prereleases need a separately designed dist-tag policy. Changing code without increasing the version
does not update the npm package. After fixing a workflow or registry failure, rerun the failed job or
dispatch `CI` on `main`; an already published version will not be uploaded again.

## Trusted publisher

The package's npm Settings → Trusted Publisher connection must match:

| Field                | Value          |
| -------------------- | -------------- |
| Provider             | GitHub Actions |
| Organization or user | `lailai0916`   |
| Repository           | `ui`           |
| Workflow filename    | `ci.yml`       |
| Environment name     | Empty          |
| Allow npm publish    | Enabled        |

Only the publish job has `id-token: write`; it runs on a GitHub-hosted runner with Node.js 24 and
npm 11.5.1 or later. npm supplies a short-lived publishing credential and records provenance for this
public repository and package. No `NPM_TOKEN` secret or saved registry credential is needed.
Only the separate GitHub release job has `contents: write`; it uses the workflow's `GITHUB_TOKEN`.

If the repository or workflow filename changes, replace the npm connection before releasing.
See [npm's Trusted Publishing documentation](https://docs.npmjs.com/trusted-publishers/).
