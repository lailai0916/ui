# Changelog

## 0.3.4

- Add IconButton's header variant, reusing the same primitive as LanguageButton and ThemeButton for shared surfaces, borders, focus, press feedback, icon strokes, and responsive touch targets.
- Preserve ordinary icon button defaults, native attributes, refs, Hint opt-outs, and distinct accessible names and hint text.

## 0.3.3

- Add public Hint for short action descriptions on buttons, links, and fields, using Base UI tooltip interactions, keyboard focus, hover delay, Escape dismissal, viewport collision handling, and modal-aware portals.
- Reuse Hint in LanguageButton, ThemeButton, IconButton, titled buttons and links, and repository metadata. Preserve trigger appearance, native attributes, refs, and existing descriptions; replace native title popups.
- Keep Tooltip as the structured data presentation layer for charts, heartbeats, and maps, preserving its API and styles. Add bilingual examples and guidance for both types of hint.

## 0.3.2

- Add controlled LanguageButton and ThemeButton with current-state labels, viewport-clamped hints, shared compact geometry, touch targets, and reduced-motion feedback, based on Prispect’s header controls.
- Add opt-in ThemeProvider system mode: follow system changes and page loads while allowing temporary one-click appearance changes, without reading or writing stored preferences.
- Preserve existing ThemeControl variants, persistent provider defaults, and Home component styles.

## 0.3.1

- Add SiteHeader with shared brand, navigation, mobile action, and application action slots, responsive gutters, compact brand names, and touch targets.
- Add SkipLink for localized keyboard navigation to the main content.
- Keep application routing, search, notifications, authentication, and menu state in consumer projects; expose stable header hooks and optional application-shell alignment.

## 0.3.0

- Add shared native inputs, password reveal controls, checkboxes, and radios; forward field refs and support wrapper layout classes.
- Add ButtonLink, localized CopyButton, accessible Tabs, native Dialog, semantic Alert, and scrollable Table for consumer applications.
- Extend Badge with semantic tones, DataCard with formatted string values and descriptions, Card with semantic containers, and Progress with optional metadata. Existing defaults retain their appearance.
- Add bilingual application examples and component contracts for Tools and Academy integration.

- Add a compact `Segmented` size with the shared selected surface, focus ring, and touch targets.
- Support `stackAt={0}` to keep short segmented choices horizontal on narrow screens.
- Expose stable segmented group and item hooks for host layouts, with bilingual examples and documentation.

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
