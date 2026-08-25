# Repository instructions

## Project

`@lailai/ui` contains the visual tokens, theme behavior, and generic React primitives shared
by lailai's web products. Product-specific navigation, learning components, and tools stay in
their own repositories.

## Commands

```bash
npm install
npm run check
npm run build
```

## Conventions

- Preserve the public API unless a coordinated consumer change is included.
- Use semantic tokens instead of hard-coded component colors.
- Support light, dark, and system theme preferences.
- Keep controls keyboard-accessible and mobile touch targets at least 44 px.
- Do not use gradients, translucent surfaces, or whole-card hover movement.
- Run `npm run check` before publishing a tag.
