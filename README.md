# @lailai/ui

Shared interface primitives for lailai's web products.

The package centralizes semantic design tokens, system-aware theming, accessible controls,
surface hierarchy, progress indicators, avatar treatment, and common empty states. Product
features remain inside their own repositories.

## Install

Until the public API reaches `1.0`, consumers install a pinned Git tag:

```bash
npm install github:lailai0916/ui#v0.1.1
```

Import the global styles once at the application entry point:

```tsx
import '@lailai/ui/styles.css';
```

## Development

```bash
npm install
npm run check
```
