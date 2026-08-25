<div align="center">
  <h1>@lailai/ui</h1>
  <p><a href="README.md">English</a> · <strong>简体中文</strong></p>
  <p>
    <img
      src="https://img.shields.io/github/last-commit/lailai0916/ui?style=flat-square"
      alt="最后提交"
    />
    <img
      src="https://img.shields.io/github/languages/top/lailai0916/ui?style=flat-square"
      alt="主要语言"
    />
    <img
      src="https://img.shields.io/github/repo-size/lailai0916/ui?style=flat-square"
      alt="仓库大小"
    />
    <img
      src="https://img.shields.io/badge/code_style-prettier-ff69b4?style=flat-square"
      alt="代码风格：Prettier"
    />
    <img
      src="https://img.shields.io/github/license/lailai0916/ui?style=flat-square"
      alt="许可协议"
    />
  </p>
</div>

## 项目简介

lailai 旗下 Web 产品共用的 React 设计系统。

## 项目特性

🎨 **语义令牌** —— 统一各产品的表面、字体、间距、圆角与状态语言。

🌓 **主题系统** —— 支持浅色、深色和跟随系统。用户选择保存在当前设备。

⌨️ **无障碍原语** —— 支持键盘操作、可见焦点、触控目标与减少动态效果。

📦 **固定版本** —— 消费方安装不可变 Git 标签，无需向 npm 发布软件包。

## 快速开始

安装固定 Git 标签：

```bash
npm install github:lailai0916/ui#v0.2.0
```

在应用入口引入一次全局样式：

```tsx
import '@lailai/ui/styles.css';
```

## 项目结构

```bash
ui/
├── src/                            # 源代码
│   ├── components/                 # 可复用界面原语
│   ├── styles/                     # 设计令牌与组件样式
│   ├── theme/                      # 主题状态与持久化
│   ├── index.ts                    # 软件包公开导出
│   └── vite-env.d.ts               # Vite 类型声明
├── package-lock.json               # 依赖锁定文件
├── package.json                    # 软件包元数据与脚本
├── tsconfig.json                   # TypeScript 配置
└── vite.config.ts                  # 组件库构建配置
```

## 本地开发

```bash
npm install
npm run check
```

软件包遵循语义化版本。Tools 和 Academy 固定使用发布标签，并显式升级版本。

## 许可协议

本项目代码采用 [MIT 许可协议](https://github.com/lailai0916/tools/blob/main/LICENSE)。
