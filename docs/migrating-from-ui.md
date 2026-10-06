# Migrating from ui / 从 ui 迁移

`lailai0916/ui` is the single maintained component repository. Replace the GitHub dependency
`@lailai/ui` with npm `@lailai0916/ui@0.2.0` or a later compatible release. The former repository has been retired; its Git dependency is no longer a supported install path.
The replacement repository was renamed from `laikit-ui` to `ui`.

`lailai0916/ui` 是统一维护入口。请将 GitHub 依赖 `@lailai/ui` 替换为 npm 包
`@lailai0916/ui@0.2.0` 或后续兼容版本。旧仓库已停用，Git 安装方式不再受支持；替代仓库由 `laikit-ui` 重命名为 `ui`。

## Imports / 导入

```tsx
import { Button, ThemeProvider, ThemeControl, TextField } from '@lailai0916/ui';
import '@lailai0916/ui/theme.css';
import '@lailai0916/ui/styles.css';
```

Update both the manifest and lockfile. Import `theme.css` before `styles.css`, then the host styles.
The package has no global reset: keep the host's box-sizing and base typography. Root exports retain
the old component names; `Button` now uses the existing laikit API below. `ThemeProvider` remains
optional for hosts that already manage their theme. Its default storage key remains `lailai.theme`.

同步更新依赖清单与锁文件。按上述顺序导入 CSS，再导入宿主样式；基础排版与 `box-sizing`
由宿主管理。原组件名称继续保留，但 `Button` 统一使用下表中的 laikit API。
已有主题管理的宿主无需添加 `ThemeProvider`；默认主题存储键仍为 `lailai.theme`。

## Buttons / 按钮

| Previous / 原 API                     | Current / 新 API                              |
| ------------------------------------- | --------------------------------------------- |
| `variant="quiet"`                     | `variant="ghost"`                             |
| `size="small"`                        | `size="sm"`                                   |
| `size="medium"`                       | `size="md"`                                   |
| `size="large"`                        | `size="lg"`                                   |
| Default primary Button / 默认主要按钮 | Set `variant="primary"` explicitly / 显式指定 |

`IconButton` sizes are `sm` and `md`. The unified Button defaults to `secondary`, preserving existing
Home and Tools behavior. `primary`, `secondary`, and `danger` retain their meanings. Use `leftIcon`,
`fullWidth`, `active`, and `rounded` props instead of maintaining another Button implementation.

`IconButton` 尺寸为 `sm` 和 `md`。统一后的 Button 默认使用 `secondary`，保留 Home 和 Tools
原有行为。其余同名变体含义不变；图标、整行宽度、选中状态和圆角可通过组件属性设置。

## Dropdown selection / 下拉选择

Existing `Select` and `SelectField` remain native controls with option children, `onChange(event)`,
and `HTMLSelectElement` refs. No migration is required for those controls. To adopt the themed
popup, use `DropdownSelect` or `DropdownSelectField` with the following API changes:

现有 `Select` 和 `SelectField` 保留原生选项子节点、`onChange(event)` 和
`HTMLSelectElement` ref，无需迁移。改用主题化弹层时，使用 `DropdownSelect` 或
`DropdownSelectField`，并同步以下 API：

| Native Select / 原生选择器                           | DropdownSelect / 下拉选择器                      |
| ---------------------------------------------------- | ------------------------------------------------ |
| `<option value="tools">Tools</option>`               | `options={[{ value: 'tools', label: 'Tools' }]}` |
| `onChange={(event) => setValue(event.target.value)}` | `onValueChange={setValue}`                       |
| `ref: HTMLSelectElement`                             | `ref: HTMLButtonElement`                         |

String values include `''`; each option value must be unique. `name`, `disabled`, and `required`
retain form behavior. Uncontrolled selects reset to `defaultValue`; controlled hosts handle
`onReset`. Field labels, descriptions, errors, and `wrapperClassName` keep their existing roles.
See the [dropdown contract](integration.md#dropdown-selection--下拉选择) for keyboard, dialog, and SSR behavior.

字符串值支持 `''`，各选项值必须唯一。`name`、`disabled` 和 `required` 保留表单语义。
非受控选择重置为 `defaultValue`，受控宿主处理 `onReset`。字段标签、说明、错误和
`wrapperClassName` 的用途不变。键盘、对话框和服务端渲染行为见上述契约文档。

## Tokens / 主题变量

All tokens now use `--lk-`. The renamed suffixes are listed below; other old suffixes retain their
names after changing the prefix. Use variables defined by `src/theme.css`; product-only values
such as Academy's panel shadow remain in the host. Reuse the package palette instead of copying it.

主题变量统一使用 `--lk-`。下表列出名称变化，其余已提供变量只需替换前缀。以
`src/theme.css` 为完整清单；Academy 面板阴影等产品专有值留在宿主，避免复制整套配色。

| Old / 旧                          | New / 新                     |
| --------------------------------- | ---------------------------- |
| `--lui-color-canvas`              | `--lk-background-color`      |
| `--lui-color-surface`             | `--lk-card-background-color` |
| `--lui-color-surface-muted`       | `--lk-color-emphasis-100`    |
| `--lui-color-surface-raised`      | `--lk-background-raised`     |
| `--lui-color-label`               | `--lk-font-color-base`       |
| `--lui-color-label-secondary`     | `--lk-font-color-secondary`  |
| `--lui-color-label-tertiary`      | `--lk-font-color-tertiary`   |
| `--lui-color-separator`           | `--lk-color-emphasis-300`    |
| `--lui-color-separator-strong`    | `--lk-color-emphasis-400`    |
| `--lui-color-accent`              | `--lk-color-primary`         |
| `--lui-color-accent-hover`        | `--lk-color-primary-dark`    |
| `--lui-color-accent-pressed`      | `--lk-color-primary-darker`  |
| `--lui-color-accent-fill`         | `--lk-color-primary`         |
| `--lui-color-accent-fill-hover`   | `--lk-color-primary-dark`    |
| `--lui-color-accent-fill-pressed` | `--lk-color-primary-darker`  |
| `--lui-color-accent-soft`         | `--lk-color-primary-soft`    |
| `--lui-color-accent-label`        | `--lk-color-primary-label`   |
| `--lui-color-focus`               | `--lk-color-primary`         |
| `--lui-font-sans`                 | `--lk-font-family`           |
| `--lui-radius-panel`              | `--lk-radius-md`             |
| `--lui-radius-feature`            | `--lk-radius-lg`             |
| `--lui-motion-control`            | `--lk-transition`            |
| `--lui-motion-surface`            | `--lk-transition-surface`    |

Use `:root, :root[data-theme]` for overrides that apply in both modes and
`:root[data-theme='dark']` for dark-only overrides. Keep these after package CSS.

跨主题覆盖使用 `:root, :root[data-theme]`，深色专用覆盖使用 `:root[data-theme='dark']`；
覆盖样式放在组件库 CSS 之后。

## Styling hooks / 样式接口

Global `.lui-*` classes are replaced by private CSS Modules. Use documented hooks when a public
prop or token cannot express a host adjustment:

全局 `.lui-*` 类已替换为 CSS Modules；无法通过公开属性或变量完成的局部调整，可使用下表接口：

| Old / 旧                  | Supported hook / 公开接口   |
| ------------------------- | --------------------------- |
| `.lui-button`             | `[data-lk="button"]`        |
| `.lui-avatar`             | `[data-lk="avatar"]`        |
| `.lui-brand`              | `[data-lk="brand"]`         |
| `.lui-brand__logo`        | `[data-lk="brand-logo"]`    |
| `.lui-field__control`     | `[data-lk="field-control"]` |
| `.lui-panel`              | `[data-lk="panel"]`         |
| `.lui-theme-picker__menu` | `[data-lk="theme-menu"]`    |

Validate light/dark/system themes, mobile layout, forms, disabled controls, and keyboard navigation
before deploying. Home's existing 26 component APIs remain compatible with this release.

部署前检查深浅及系统主题、移动端布局、表单、禁用控件和键盘导航。Home 原有的 26 个组件
API 与本次版本保持兼容。
