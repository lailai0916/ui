# Changelog

## 0.2.1

- Add a shared `Icon` that preserves SVG dimensions and styling before icon data arrives or fails.
- Use stable icon slots in badges, segmented controls, card headers, pagination, and other shared components.
- Add loading-state regression checks and reject direct Iconify renderer imports outside the shared component.

## 0.2.0

- Unify the 16 additional visual components from the former `@lailai/ui` package, bringing the library to 42 components.
- Consolidate the source repository under `lailai0916/ui`, retaining the npm name `@lailai0916/ui`.
- Move fields, panels, layout, identity, progress, and theme controls to CSS Modules and `--lk-*` tokens.
- Add a standalone, SSR-safe `ThemeProvider` with persistent system/light/dark preferences and cross-tab synchronization.
- Extend the shared Button with `danger` and `lg`, and reuse it in IconButton. Existing defaults remain unchanged.
- Preserve field accessibility metadata, clamp invalid progress values, and support keyboard navigation in compact theme menus.
- Add migration documentation, stable customization hooks, bilingual examples, and regression checks.

## 0.1.1

- Preserve selected Segmented and WindowPanel backgrounds on hover in system dark mode.
- Keep WindowPanel tab and toggle hover text consistent with explicit dark mode.
- Publish new stable versions automatically from `main` through npm Trusted Publishing.

## 0.1.0

- Extract 26 React components and shared hooks, formatters, and design tokens from lailai's Home.
- Replace Docusaurus dependencies with optional routing, heading, locale, and message adapters.
- Provide ESM component entries, TypeScript declarations, shared styles, and light/dark themes.
- Add standalone English/Chinese examples and package/server rendering checks.
