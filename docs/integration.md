# Integration

## Package boundaries

The package supports React 18.3.1 and 19, with ESM JavaScript and TypeScript declarations.
React and React DOM are peer dependencies. Base UI, Iconify, and clsx are runtime dependencies.
Import `theme.css`, then `styles.css`, once in your application. JavaScript entries preserve
module boundaries so bundlers can remove unused components; the shared stylesheet contains all
component styles. Extracting a package reduces duplicated source maintenance, not necessarily the
browser download size.

Root exports are named. Most component subpaths export a default component; `Page` exports
`PageHeader`, `PageTitle`, and `PageContent`, and `Markdown` exports `MDTitle`.
`Field` exports `TextField`, `TextAreaField`, and `SelectField`; `Layout` exports `PageContainer`,
`Stack`, and `Cluster`; `Panel` exports `Panel`, `PanelHeader`, `PanelBody`, and `PanelFooter`.
`Tooltip.Label` and `Tooltip.Value` are compound children. Prop declarations ship in `dist/`;
the complete working examples are in `demo/main.tsx`.
`DropdownSelect` has a default and named export at its component subpath; that subpath also exports
`DropdownSelectField` and their public prop and option types.

## Host routing and translation

Without a provider, links use native anchors and headings use native heading elements. A provider
can supply the host's components. For example, Docusaurus hosts can define this adapter locally:

```tsx
import DocusaurusLink from '@docusaurus/Link';
import DocusaurusHeading from '@theme/Heading';
import { LaikitProvider, type LinkProps, type HeadingProps } from '@lailai0916/ui';

function SiteLink({ to, href, ...props }: LinkProps) {
  return <DocusaurusLink {...props} to={to ?? href} />;
}

function SiteHeading(props: HeadingProps) {
  return <DocusaurusHeading {...props} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LaikitProvider locale="en" linkComponent={SiteLink} headingComponent={SiteHeading}>
      {children}
    </LaikitProvider>
  );
}
```

Supply the current host locale instead of a fixed string in a multilingual site. `locale="zh-Hans"`
selects Chinese defaults; `messages` can override individual built-in labels. `selectMessage`
can delegate plural handling to a host. The default selector accepts pipe-separated forms in
`zero | one | two | few | many | other` order, including only categories used by the locale.
Single-form labels pass through unchanged. Provider nesting inherits unspecified configuration;
changing the locale selects that locale's default messages. Providers add no DOM wrapper.

## Theme and base styles

Use `data-theme="light"` or `data-theme="dark"` on the document root. With no explicit root theme,
colors follow `prefers-color-scheme`. Prefer document-wide theme selection; nested mixed themes
are not a supported isolation boundary. User styles should follow the package imports.

```css
html {
  font-family: var(--lk-font-family);
  font-size: var(--lk-font-size);
  line-height: var(--lk-line-height);
}

body {
  margin: 0;
  color: var(--lk-font-color-base);
  background: var(--lk-background-color);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

:root {
  --lk-color-primary: #1d9bf0;
}
```

No global reset is included. A Docusaurus host should map `--lk-*` color variables to its live
`--ifm-*` variables after the imports, using `:root, :root[data-theme]` specificity. This preserves
runtime accent changes and font preferences. Shadows and focus rings are shared theme tokens.
Modern CSS features such as `color-mix`, container queries, and backdrop filters require modern
browsers. The reduced-motion rule targets the package's prefixed CSS Module classes.

## Component contracts

- `Icon` reserves the same SVG box during server rendering, loading, and failure. It defaults to a
  `1em` square; setting one dimension sets both, while non-square icons need explicit width and height
  or fixed CSS dimensions. Avoid `auto` sizing. Use this component for Iconify rendering in hosts.

- `Card` supplies a surface; `TitleCard` adds a header (`md`, `sm`, or `plain`). Use plain `Card`
  when there is no title. Cards deliberately do not clip focus rings; a full-bleed child may need
  a clipping wrapper owned by the caller.
- `Chart` receives preformatted time-series labels and numeric values. `Donut` receives `{x, y}`
  items; `maxSlices` groups a long tail into the configurable Other slice. `loading`, empty data,
  `error`, and retained-data `notice` remain separate states. Pass accessible empty/error labels.
- `Segmented` button mode uses radio semantics, roving tab order, and arrow keys. Items with `href`
  navigate instead of calling `onChange`. Do not mix navigation and radio items in one group.
  Horizontal groups stack at 480 px, or 360 px with `stackAt={360}`. Set `stackAt={0}` to keep
  short choices in one row. `size="sm"` uses compact text and 32 px items, increasing to 44 px
  on small screens or coarse pointers; the default `md` size retains the original appearance.
  The `segmented` and `segmented-item` data hooks support host layout customization.
- `WindowPanel` owns tabs and collapse behavior. Supply translated collapse/expand labels;
  content and optional toolbar belong to the caller.
- `GitHub` fetches public GitHub repository metadata in the browser; API failures and rate limits
  render a localized error. Iconify may load icon data over the network. Other components take data
  from the host and do not need application credentials.
- `MDTitle` accepts React content and has no personal greeting logic. `PageTitle` retains the original
  HTML title contract for existing hosts: pass only trusted application-authored title strings,
  never untrusted user HTML.

## Server rendering

Imports and server rendering do not access the browser unguarded. Each emitted JavaScript module
retains a `use client` directive for React frameworks with server component boundaries. Interactive
components and providers belong in a client boundary; pass serializable data across the server/client
boundary and define router adapter functions inside that client module. Import global CSS from the
framework's supported application entry. A provider itself has no browser-only DOM wrapper.

Use identical locale and initial values for server rendering and hydration. Browser-dependent
content such as image status, measurements, and GitHub data updates after mount. Hosts should load
saved preferences before paint using their own established mechanism.

## Standalone theme management

Wrap a standalone app in `ThemeProvider` and pass translated `system`, `light`, and `dark` labels to
`ThemeControl`. `useTheme()` exposes `preference`, `resolvedTheme`, and `setPreference`. The default
storage key is `lailai.theme`; `storageKey` can isolate another application. `themeColors` optionally
sets the existing browser theme-color meta tag for light/dark modes. No meta tag is inserted.

The provider reads saved preferences after mount, listens for system and cross-tab changes, and
keeps selection usable when local storage is blocked. A host pre-paint script may set the initial
root theme to avoid a flash. Use only one document theme owner: Docusaurus hosts keep their existing
color-mode manager instead of adding this provider. `LaikitProvider` handles routing/localization
independently and can be used alongside either theme owner.

`ThemeControl` supports segmented buttons or a compact menu. The compact menu focuses the selected
item, supports arrows, Home/End and Escape, closes on outside focus/click, and restores trigger focus
after a selection. Tab leaves the menu normally.

For a one-click appearance button, render controlled `ThemeButton` with `theme={resolvedTheme}`
and `onThemeChange={setPreference}`. Its sun/moon icon shows the current resolved theme; clicking
requests the other theme. Labels follow `LaikitProvider.locale`, or use `label` to override them.
Hosts with an existing theme manager pass their own state and callback without adding a provider.

`ThemeProvider mode="system"` follows the operating system on mount and every system-theme change.
Manual changes apply to the current page until the next system change or reload. This mode neither
reads nor writes saved preferences and ignores cross-tab theme storage events. The default
`mode="preference"` keeps the existing persistent three-mode behavior. Match the selected mode in
the host's pre-paint script to avoid flashing an obsolete saved theme.

`LanguageButton` accepts controlled `locale="en" | "zh-Hans"` and `onLocaleChange`. It displays
the current `EN` / `中` label and requests the other language on click. The host owns translation,
storage and navigation. `label` overrides its localized current/next-language description.
Both buttons forward native attributes and refs, default to `type="button"`, and let a caller's
`onClick` prevent the change with `event.preventDefault()`. Disabled buttons do not activate.
Pointer hover and keyboard focus show a viewport-clamped hint; Escape dismisses it without
consuming a surrounding dialog's Escape. Desktop targets are 32 px, increasing to 44 px at widths
up to 980 px or with a coarse pointer. Motion respects reduced-motion settings. Supported hooks
are `language-button`, `theme-button`, and `action-hint`.

Use `IconButton variant="header"` for adjacent search, documentation actions, or mobile menu
triggers. It uses the same surface, border, focus ring, press feedback, icon strokes, and 32/44 px
geometry as LanguageButton and ThemeButton. Supply a 17 px icon. `size` applies to the default
`ghost` variant; header sizing follows the shared desktop/touch rules. Native button props, refs,
`label`, `title`, and `hint` work in both variants. The trigger retains `data-lk="button"`.

```tsx
function HeaderActions() {
  const { resolvedTheme, setPreference } = useTheme();
  return (
    <>
      <LanguageButton locale={locale} onLocaleChange={setLocale} />
      <ThemeButton theme={resolvedTheme} onThemeChange={setPreference} />
    </>
  );
}
// Mount once at the application root.
<ThemeProvider mode="system">
  <App />
</ThemeProvider>;
```

## Action hints and data tooltips

`Hint` explains an action or adds short supplementary help. Pass a string `label` and one
React element as its child; native controls or custom components must forward their ref and
native event / accessibility props to one DOM element. No wrapper is added around the trigger,
so its layout and styles stay intact. Existing `aria-describedby` IDs and refs are preserved.
The trigger's native `title` is removed to avoid two overlapping popups.

Hover opens after `delay={500}` milliseconds; keyboard focus opens immediately. The popup remains
open while hovered, closes on click or blur, and Escape dismisses it while still reaching a
surrounding dialog. Touch does not produce hover hints. `side` defaults to `bottom` and also accepts
`top`, `left`, or `right`; viewport collisions can flip it. `disabled` suppresses the hint without
disabling the child. Native popup props and `className` are supported; `data-lk="hint"` is the
public customization hook. Header controls retain their existing `data-lk="action-hint"` hook.
`--lk-z-index-hint` controls the popup layer above fixed headers and menus.
Portals from native dialog controls stay inside the dialog's top layer.

```tsx
<Hint label="Search by course title or keyword">
  <Input aria-label="Search" aria-describedby="search-help" />
</Hint>
```

`IconButton` uses Hint automatically, with `title ?? label` as the text; use `hint={false}` or
`title=""` to suppress it. `Button` and `ButtonLink` use Hint when given a nonempty `title`.
LanguageButton and ThemeButton use the same primitive. Keep field labels, errors, and essential
instructions visible using field `description` / `error` props.

`Tooltip` remains a passive, structured data surface with `leftPct`, `Tooltip.Label`, and
`Tooltip.Value`. Chart, heartbeat, or map code owns its visibility and data-point positioning.
It does not add a trigger or a portal. Its existing appearance and API are unchanged.
Interactive cards with links or buttons need a separate dialog or popover pattern.

## Application primitives

- `Button` defaults to `secondary` / `md`; choose `primary`, `ghost`, or `danger` explicitly. Sizes
  are `sm`, `md`, and `lg`. `active` adds toggle semantics when supplied; `IconButton` requires `label`.
- Fields require `label`; optional `description` and `error` are connected to the control. Caller
  `aria-describedby` IDs are preserved. `SelectField` accepts native option children.
- `Progress` accepts `value` and optional positive `max`; invalid ranges render zero progress and
  out-of-range values are clamped. Layout `gap` values and `PageContainer.width` are pixels.
- Prefer public props and theme variables to styling internal markup. Supported `data-lk` hooks
  are `button`, `avatar`, `brand`, `brand-logo`, `field-control`, `panel`, and `theme-menu`.
  Generated CSS Module classes are private. Load host overrides after package CSS.

See [Migrating from ui](migrating-from-ui.md) for the previous GitHub package's API and token mappings.

## Application controls

Use shared components as the visual source of truth. Host CSS should position components and arrange content, rather than restyle their borders, colors, or control geometry.

- `Input`, `TextArea`, and `Select` retain native props, events, and refs. Framed fields add labels, descriptions, and errors. Use `wrapperClassName` for layout and `monospace` for code. `PasswordInput` / `PasswordField` localize reveal labels, preserve autocomplete, and never submit the form from their toggle.
- `Checkbox` and `Radio` require a visible `label`; native checked, name, value, disabled, and change behavior remain intact. Description IDs join caller-provided `aria-describedby`.
- `ButtonLink` uses the configured router with the existing Button variants and sizes. `CopyButton` takes a `value`, localizes feedback, reports failure, and restores focus after its fallback.
- `Tabs` requires controlled `value`, `onChange`, `ariaLabel`, and items with optional `id` / `panelId`. Hosts render matching tab panels. Arrows, Home, and End skip disabled items; filters without panels use `Segmented`.
- `Dialog` requires `open`, `onClose`, and `label`. Native modality traps focus; Escape and backdrop clicks request closure. The component restores focus and body scrolling. Give its content a visible heading and close action.
- `Alert` supports info, success, warning, and danger with optional title, icon, and action. Danger/warning default to alert; other tones default to status. Hosts can override role.
- `Table` preserves native table markup and props inside a horizontally scrollable wrapper. Supply captions and scoped headers; use `wrapperClassName` for placement.
- `Badge` adds optional semantic variants; `DataCard` accepts formatted strings and descriptions; `Card` accepts `as="article"` / `"section"`. `Progress` can hide visual labels while retaining its accessible name.

Stable application hooks include `data-lk="field-control"`, `"checkbox"`, `"radio"`, `"tabs"`, `"tab"`, `"dialog"`, `"alert"`, `"table"`, and `"table-scroll"`. Do not target generated CSS Module class names.

## Dropdown selection / 下拉选择

`Select` and `SelectField` keep their native `<select>` API. For a themed popup, use
`DropdownSelect` or `DropdownSelectField`. Each option has `{ value: string, label: string, disabled?: boolean }`;
values must be unique. Empty strings are valid option values. Use `value` and `onValueChange(value)`
for a controlled selection, or `defaultValue` for an uncontrolled selection. `placeholder` appears
when no matching option is selected. Keep option labels, placeholder, and field copy translated in the host.

`Select` 和 `SelectField` 继续使用原生 `<select>` API。需要主题化弹层时，使用
`DropdownSelect` 或 `DropdownSelectField`。选项格式为
`{ value: string, label: string, disabled?: boolean }`，值必须唯一，允许空字符串。
受控选择使用 `value` 和 `onValueChange(value)`，非受控选择使用 `defaultValue`。
没有匹配选项时显示 `placeholder`；选项、占位提示和字段文案由宿主翻译。

```tsx
import { DropdownSelectField, type DropdownSelectOption } from '@lailai0916/ui';

const options: DropdownSelectOption[] = [
  { value: '', label: 'All projects' },
  { value: 'tools', label: 'Tools' },
  { value: 'archived', label: 'Archived', disabled: true },
];

<DropdownSelectField
  label="Project"
  name="project"
  options={options}
  value={project}
  onValueChange={setProject}
  description="Choose the destination."
/>;
```

The ref points to the trigger's `HTMLButtonElement`; `id`, native button attributes, ARIA attributes,
and `className` apply to that trigger. Provide `aria-label` for an unframed select, or use the field's
visible `label`. Field `description` and `error` join caller `aria-describedby`; errors also set
`aria-invalid`. `wrapperClassName` belongs to the field wrapper. Hooks are `dropdown-select`,
`dropdown-select-trigger`, `dropdown-select-popup`, and `dropdown-select-option`.

ref 指向触发器的 `HTMLButtonElement`；`id`、原生按钮属性、ARIA 属性和 `className`
作用于触发器。不带字段框架时提供 `aria-label`，或通过字段的 `label` 提供可见标签。
`description` 和 `error` 与调用方的 `aria-describedby` 合并，错误同时设置 `aria-invalid`。
`wrapperClassName` 作用于字段外层。上述四个 `data-lk` 值是公开样式接口。

`name` submits the selected value through a visually hidden form control; `form` also supports
association with an external form by ID. `disabled` prevents
interaction and omits that value from form submission. `required` rejects an empty value and focuses
the visible trigger. Native form reset restores an uncontrolled select's `defaultValue`; controlled
hosts restore their state in `onReset`. The trigger is a button, so its change callback receives the
string value rather than a native select event. Selecting the current value does not invoke
`onValueChange`. Reset does not invoke it either, and a canceled reset preserves the selection.

`name` 通过视觉隐藏的表单控件提交选中值，`form` 可通过 ID 关联外部表单。
`disabled` 禁止交互，且不提交该值。
`required` 拒绝空值，并将焦点移到可见触发器。原生表单重置让非受控选择恢复 `defaultValue`；
受控宿主在 `onReset` 中恢复状态。触发器是按钮，变化回调接收字符串值。
重复选择当前值和表单重置均不调用 `onValueChange`；取消重置会保留选中值。

Arrow keys navigate options; Home and End reach the first and last options. Disabled options can
receive keyboard focus for discoverability but cannot be selected.
Typing a label finds an option, Enter selects, Escape dismisses, and Tab leaves the popup. Outside
clicks dismiss it. Long labels wrap in the popup, and long lists scroll within the viewport. Popups
inside a native `Dialog` portal into that dialog to remain in its modal top layer. Server rendering
emits the trigger and form value with no open popup; use identical options, locale, and initial value
for hydration. See [the bilingual examples](../demo/DropdownSelectDemo.tsx).

方向键浏览选项，Home 和 End 移动到首尾选项。禁用项可接收键盘焦点，但不能选中。
输入名称定位选项，Enter 选择，
Escape 关闭，Tab 离开弹层，外部点击也会关闭。长标签在弹层内换行，长列表在视口内滚动。
原生 `Dialog` 中的弹层挂载到该对话框内，保持模态顶层交互。服务端渲染输出触发器和表单值，
不打开弹层；水合时保持选项、语言和初始值一致。

## Site navigation

`SiteHeader` accepts `brand`, optional `navigation`, `mobileAction`, and `actions` React nodes.
It owns the shared surface, height, spacing, responsive container, and touch targets. Applications
provide their router links, search, notifications, account actions, and controlled menu behavior.

- The default position is `sticky`, the height is `--lk-header-height`, and the inner container is
  `PageContainer` with its default width and gutters. `width` is pixels; `fullWidth` fills an app shell
  and takes precedence over `width`.
- `position="fixed"` requires the host to reserve the header height above its content. `static` is
  useful for embedded previews. No slots or popovers are clipped.
- At 900 px and below, `navigation` is hidden and `mobileAction` becomes visible. Supply a menu action
  and an accessible drawer/dialog when the navigation contains essential destinations. The host owns
  expanded state, Escape, focus return, and route changes.
- At 520 px and below, shared `Brand` names are hidden. Give the brand's link an accessible name.
  On touch devices or below 600 px, header action buttons have at least 44 px targets.
- `--lk-header-brand-width` optionally aligns the desktop start column with a host sidebar; the
  compact layout resets the column at 900 px. Brand widths are otherwise measured from content.
- Hooks are `site-header`, `header-inner`, `header-start`, `header-brand`, `header-navigation`,
  `header-mobile-action`, and `header-actions`. Hosts may arrange business content within slots.

`SkipLink` is an ordinary focusable anchor, shown on focus. Its default target is `#main-content`;
provide localized children and a focusable main region (`id="main-content"`, `tabIndex={-1}`).
It forwards native link attributes and a ref and respects reduced motion. Its hook is `skip-link`.
