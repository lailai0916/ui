<div align="center">
  <h1>@lailai/ui</h1>
  <p><strong>English</strong> · <a href="README.zh-Hans.md">简体中文</a></p>
  <p>
    <img
      src="https://img.shields.io/github/last-commit/lailai0916/ui?style=flat-square"
      alt="Last commit"
    />
    <img
      src="https://img.shields.io/github/languages/top/lailai0916/ui?style=flat-square"
      alt="Top language"
    />
    <img
      src="https://img.shields.io/github/repo-size/lailai0916/ui?style=flat-square"
      alt="Repository size"
    />
    <img
      src="https://img.shields.io/badge/code_style-prettier-ff69b4?style=flat-square"
      alt="Code style: Prettier"
    />
    <img
      src="https://img.shields.io/github/license/lailai0916/ui?style=flat-square"
      alt="License"
    />
  </p>
</div>

## Project Introduction

A shared React design system for lailai's web products.

## Project Features

🎨 **Semantic tokens** — One surface, typography, spacing, radius, and state vocabulary across products.

🌓 **System-aware themes** — Light, dark, and system preferences with persistent user choice.

⌨️ **Accessible primitives** — Keyboard-ready controls, visible focus, touch targets, and reduced motion.

📦 **Pinned Git releases** — Consumers install an immutable tag without publishing the package to npm.

## Getting Started

Install a pinned Git tag:

```bash
npm install github:lailai0916/ui#v0.2.0
```

Import the global styles once at the application entry:

```tsx
import '@lailai/ui/styles.css';
```

## Project Structure

```bash
ui/
├── src/                            # Source code
│   ├── components/                 # Reusable interface primitives
│   ├── styles/                     # Tokens and component styles
│   ├── theme/                      # Theme state and persistence
│   ├── index.ts                    # Public package exports
│   └── vite-env.d.ts               # Vite type declarations
├── package-lock.json               # Dependency lock file
├── package.json                    # Package metadata and scripts
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Library build configuration
```

## Development

```bash
npm install
npm run check
```

The package uses semantic versioning. Tools and Academy pin a release tag and upgrade explicitly.

## License

This project's code is licensed under [MIT License](https://github.com/lailai0916/tools/blob/main/LICENSE).
