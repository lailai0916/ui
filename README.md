<div align="center">
  <h1>laikit UI</h1>
  <p><strong>English</strong> · <a href="README.zh-Hans.md">简体中文</a></p>
  <p>
    <img src="https://img.shields.io/github/actions/workflow/status/lailai0916/ui/ci.yml?branch=main&style=flat-square" />
    <img src="https://img.shields.io/npm/v/@lailai0916/ui?style=flat-square" />
    <img src="https://img.shields.io/github/last-commit/lailai0916/ui?style=flat-square" />
    <img src="https://img.shields.io/github/languages/top/lailai0916/ui?style=flat-square" />
    <img src="https://img.shields.io/github/repo-size/lailai0916/ui?style=flat-square" />
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4?style=flat-square" />
    <img src="https://img.shields.io/github/license/lailai0916/ui?style=flat-square" />
  </p>
</div>

## Project Introduction

laikit UI is the shared React component library extracted from [lailai's Home](https://lailai.one), published as `@lailai0916/ui`.

The former GitHub package `@lailai/ui` has been merged into this library; the repository was renamed from `laikit-ui` to `ui`. Home, Tools, and Academy share this npm package; see the [migration guide](docs/migrating-from-ui.md) for older applications.

## Project Features

🧩 **Shared Components** — 58 components cover cards, forms, controls, charts, navigation, and window panels, with TypeScript declarations and per-component imports.

🎨 **One Theme** — Shared CSS variables, light and dark palettes, and reduced-motion support keep multiple websites consistent.

🔌 **Framework Adapters** — Native links and headings work without Docusaurus; `LaikitProvider` connects a host router, heading renderer, and translations when needed.

🌐 **English and Chinese** — Built-in English and Simplified-Chinese messages cover library-owned labels; applications supply their own content.

## Getting Started

Use React 18.3.1 or React 19. Development requires Node.js 20.19+; CI uses Node.js 24.

```bash
npm install @lailai0916/ui react react-dom
```

```tsx
import { Button, LaikitProvider, TitleCard } from '@lailai0916/ui';
import '@lailai0916/ui/theme.css';
import '@lailai0916/ui/styles.css';

export function App() {
  return (
    <LaikitProvider locale="en">
      <TitleCard title="Welcome">
        <Button onClick={() => alert('Hello!')}>Say Hello</Button>
      </TitleCard>
    </LaikitProvider>
  );
}
```

Import the two CSS files once at the application entry, in the order shown. The package does not install a global CSS reset or override the host's body font. Set your base typography and `box-sizing` in the application; the theme exposes `--lk-font-family`, `--lk-font-size`, and `--lk-line-height` defaults.

Set `data-theme="light"` or `data-theme="dark"` on `<html>` to select a theme. Without an explicit theme, the palette follows the system preference. Override `--lk-*` tokens after importing the package to customize colors. Standalone React apps can use `ThemeProvider` and `ThemeControl` to persist preferences; hosts such as Docusaurus keep their existing theme manager.

For a direct component import, use `import Button from '@lailai0916/ui/Button'`. `Page`, `Markdown`, `Field`, `Layout`, and `Panel` subpaths have named exports. All components are also available as named exports from the package root.

## Project Structure

```bash
ui/
├── demo/                           # Standalone React examples
├── docs/                           # Integration and release guides
├── scripts/                        # Build and release helpers
├── src/                            # Components, theme, and adapters
├── tests/                          # Package and SSR tests
├── package.json                    # Dependencies, exports, and commands
└── vite.config.ts                  # ESM and CSS build
```

## Components

| Category   | Exports                                                                                                                                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout     | `Card`, `TitleCard`, `LinkCard`, `DataCard`, `ShareCard`, `PageHeader`, `PageTitle`, `PageContent`, `PageContainer`, `SiteHeader`, `Stack`, `Cluster`, `Panel`, `PanelHeader`, `PanelBody`, `PanelFooter` |
| Controls   | `Button`, `ButtonLink`, `CopyButton`, `IconButton`, `Segmented`, `Tabs`, `Slider`, `Switch`, `ThemeControl`                                                                                               |
| Charts     | `Chart`, `Donut`, `Progress`, `Table`                                                                                                                                                                     |
| Display    | `Alert`, `Dialog`, `Badge`, `Icon`, `IconBlock`, `Tooltip`, `Skeleton`, `DataState`, `TrafficLights`, `WindowBar`, `WindowPanel`, `MDTitle`, `Quote`, `GitHub`, `Avatar`, `Brand`, `EmptyState`           |
| Forms      | `Input`, `TextArea`, `Select`, `TextField`, `TextAreaField`, `SelectField`, `PasswordInput`, `PasswordField`, `Checkbox`, `Radio`                                                                         |
| Navigation | `Paginator`, `SkipLink`                                                                                                                                                                                   |

The count excludes `LaikitProvider`, `ThemeProvider`, routing helpers, hooks, and `Tooltip.Label` / `Tooltip.Value`. Shared utilities include `useImageStatus`, `useMeasuredHeight`, `formatCompact`, and `formatBytes`.

The [usage documentation](https://lailai.one/docs/project/ui) includes component previews, API guides, theming, and maintenance.

See the [integration guide](docs/integration.md) for router adapters, server rendering, theme customization, and component contracts. The [interactive examples](demo/main.tsx) exercise every component without Docusaurus.

## Development

```bash
git clone https://github.com/lailai0916/ui.git
cd ui
npm ci
npm run dev
npm run check
```

`npm run check` verifies formatting, lint, types, the distributable, server rendering tests, and the demo build. `npm run build` writes the package to `dist/`; `npm run build:demo` writes the examples to `demo-dist/`. See [release instructions](docs/releasing.md) and [contribution guidelines](.github/CONTRIBUTING.md).

Pushing to `main` automatically publishes a new stable package version after validation, using npm Trusted Publishing. Update the version in `package.json` and `package-lock.json` and add a changelog entry before pushing. Already published versions are skipped. Consumer websites update their dependency and redeploy separately.

## License

This project's code is licensed under [MIT License](https://github.com/lailai0916/tools/blob/main/LICENSE).
