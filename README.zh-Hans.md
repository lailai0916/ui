<div align="center">
  <h1>laikit UI</h1>
  <p><a href="README.md">English</a> · <strong>简体中文</strong></p>
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

## 项目简介

laikit UI 是从 [lailai's Home](https://lailai.one) 抽出的共享 React 组件库，以 `@lailai0916/ui` 发布。

原 GitHub 包 `@lailai/ui` 的组件已合并到此库，仓库由 `laikit-ui` 重命名为 `ui`。Home、Tools 和 Academy 共用这一 npm 包；旧项目请参考[迁移指南](docs/migrating-from-ui.md)。

## 项目特性

🧩 **共享组件** — 63 个组件覆盖卡片、表单、控件、图表、导航和窗口面板，提供 TypeScript 类型声明与按组件导入入口。

🎨 **统一主题** — 共用 CSS 变量、深浅配色及减少动画支持，让多个网站保持一致。

🔌 **框架适配** — 原生链接和标题无需 Docusaurus 即可使用；需要时可通过 `LaikitProvider` 接入宿主路由、标题渲染和翻译。

🌐 **中英双语** — 内置英文和简体中文，覆盖组件库自身的标签；应用内容由调用方传入。

## 快速开始

支持 React 18.3.1 和 React 19。开发需要 Node.js 20.19+；CI 使用 Node.js 24。

```bash
npm install @lailai0916/ui react react-dom
```

```tsx
import { Button, LaikitProvider, TitleCard } from '@lailai0916/ui';
import '@lailai0916/ui/theme.css';
import '@lailai0916/ui/styles.css';

export function App() {
  return (
    <LaikitProvider locale="zh-Hans">
      <TitleCard title="欢迎">
        <Button onClick={() => alert('你好！')}>打个招呼</Button>
      </TitleCard>
    </LaikitProvider>
  );
}
```

在应用入口按上述顺序各导入一次 CSS。组件库不安装全局 CSS reset，也不覆盖宿主的正文字体。请在应用中设置基础排版和 `box-sizing`；主题提供 `--lk-font-family`、`--lk-font-size` 和 `--lk-line-height` 默认值。

在 `<html>` 上设置 `data-theme="light"` 或 `data-theme="dark"` 选择主题；未指定时，配色跟随系统。导入组件库后覆盖 `--lk-*` 变量即可定制颜色。独立 React 应用可使用 `ThemeProvider` 和 `ThemeControl` 保存主题偏好；Docusaurus 等已有主题管理的宿主继续使用自身的管理方式。 顶部栏可使用受控的 `LanguageButton` 与 `ThemeButton`；`ThemeProvider mode="system"` 在系统变化和重新加载时跟随系统，并允许当前页临时切换。

按组件导入可写为 `import Button from '@lailai0916/ui/Button'`。`Page`、`Markdown`、`Field`、`Layout` 和 `Panel` 子路径使用具名导出；所有组件也都支持从包根入口具名导入。

## 项目结构

```bash
ui/
├── demo/                           # 独立 React 示例
├── docs/                           # 接入和发布指南
├── scripts/                        # 构建和发布辅助脚本
├── src/                            # 组件、主题与适配层
├── tests/                          # 包入口与 SSR 测试
├── package.json                    # 依赖、入口和命令
└── vite.config.ts                  # ESM 与 CSS 构建
```

## 组件清单

| 分类 | 导出                                                                                                                                                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 布局 | `Card`, `TitleCard`, `LinkCard`, `DataCard`, `ShareCard`, `PageHeader`, `PageTitle`, `PageContent`, `PageContainer`, `SiteHeader`, `Stack`, `Cluster`, `Panel`, `PanelHeader`, `PanelBody`, `PanelFooter` |
| 控件 | `Button`, `ButtonLink`, `CopyButton`, `IconButton`, `LanguageButton`, `ThemeButton`, `Segmented`, `Tabs`, `Slider`, `Switch`, `ThemeControl`                                                              |
| 图表 | `Chart`, `Donut`, `Progress`, `Table`                                                                                                                                                                     |
| 展示 | `Alert`, `Dialog`, `Badge`, `Icon`, `IconBlock`, `Hint`, `Tooltip`, `Skeleton`, `DataState`, `TrafficLights`, `WindowBar`, `WindowPanel`, `MDTitle`, `Quote`, `GitHub`, `Avatar`, `Brand`, `EmptyState`   |
| 表单 | `Input`, `TextArea`, `Select`, `DropdownSelect`, `TextField`, `TextAreaField`, `SelectField`, `DropdownSelectField`, `PasswordInput`, `PasswordField`, `Checkbox`, `Radio`                                |
| 导航 | `Paginator`, `SkipLink`                                                                                                                                                                                   |

数量不含 `LaikitProvider`、`ThemeProvider`、路由辅助组件、hooks 及 `Tooltip.Label` / `Tooltip.Value`。共享工具包括 `useImageStatus`、`useMeasuredHeight`、`formatCompact` 和 `formatBytes`。

`Select` 和 `SelectField` 保留原生 `<select>` 属性与选项子节点。`DropdownSelect` 和
`DropdownSelectField` 根据字符串值的 `options` 提供主题化弹层，支持键盘操作、表单提交和对话框。
具体行为见[下拉选择契约](docs/integration.md#dropdown-selection--下拉选择)和[双语示例](demo/DropdownSelectDemo.tsx)。

[接入指南](docs/integration.md) 说明路由适配、服务端渲染、主题定制和组件约定。[交互示例](demo/main.tsx) 在不依赖 Docusaurus 的环境中展示全部组件。

完整的[使用文档](https://lailai.one/docs/project/ui)包含组件预览、API、主题定制和维护发布流程。

## 开发

```bash
git clone https://github.com/lailai0916/ui.git
cd ui
npm ci
npm run dev
npm run check
```

`npm run check` 验证格式、lint、类型、发布产物、服务端渲染测试和示例构建。`npm run build` 将包输出到 `dist/`；`npm run build:demo` 将示例输出到 `demo-dist/`。另见[发布说明](docs/releasing.md)和[贡献指南](.github/CONTRIBUTING.md)。

推送到 `main` 后，通过验证的新稳定版本会经 npm Trusted Publishing 自动发布。推送前同步更新 `package.json` 和 `package-lock.json` 的版本号，并补充更新日志。已经发布的版本会跳过；各网站仍需更新依赖并重新部署。

## 许可协议

本项目代码采用 [MIT 许可协议](https://github.com/lailai0916/tools/blob/main/LICENSE)。
