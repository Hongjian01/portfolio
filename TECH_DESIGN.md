# TECH_DESIGN.md (与最终 PRD 对齐版)

## 1. 项目概述
本项目是一个基于 **Vite + React + TypeScript** 的现代化个人作品集网站。严格遵循“少即是多”和“开发者美学”的设计理念，通过沉浸式的深色 IDE 视觉体验和细腻的微交互，高效且优雅地展示开发者的工程能力、硬核项目以及专业素养。项目最终将通过 **Vercel** 进行自动化部署与托管。

## 2. 核心技术栈
- **核心框架**: React 18
- **构建工具**: Vite
- **开发语言**: TypeScript (确保类型安全，规范组件与数据接口)
- **样式方案**: Tailwind CSS (实用优先，快速构建深色模式与响应式布局)
- **动画库**: Framer Motion (处理平滑滚动监听、卡片 Hover 微交互与打字机动画)
- **路由管理**: React Router v6 (处理前端路由跳转与 404 异常捕获)
- **部署与监控**: Vercel (自动化 CI/CD、SPA 路由重写、Web Analytics)

## 3. 详细架构设计

### 3.1 目录结构
src/
├── assets/             # 静态资源（图片、SVG 图标等）
├── components/         # 核心 UI 组件
│   ├── Sidebar.tsx     # 左侧固定侧边栏 (包含姓名、头衔、使命陈述、内页导航、社交矩阵)
│   ├── About.tsx       # 右侧区块一：关于我 (技术专长与工程理念)
│   ├── Experience.tsx  # 右侧区块二：工作与实践经历列表
│   ├── Projects.tsx    # 右侧区块三：重点项目展示列表
│   ├── NotFound.tsx    # 404 极客终端异常页
│   └── Shared/         # 通用组件 (如 TechPill 标签, SVG Icon 库)
├── data/               # 数据驱动层 (TypeScript 静态数据)
│   ├── experience.ts   # 工作/实践经历数据
│   └── projects.ts     # 项目数据
├── hooks/              # 自定义 Hook
│   ├── useMousePosition.ts # 捕获鼠标坐标用于聚光灯效果计算
│   └── useScrollSpy.ts     # 监听内容区滚动位置，联动侧边栏高亮
├── styles/             # 全局样式与 Tailwind 配置 (全局引入 Inter, 代码区引入 JetBrains Mono)
├── App.tsx             # 根组件与路由配置 (Router, Routes)
└── main.tsx            # 入口文件
vercel.json             # Vercel 路由重写与缓存配置文件 (关键)

### 3.2 数据模型 (TypeScript Interfaces)
与 PRD 模块严格对应的静态数据接口设计：

// src/types/index.ts

export interface Experience {
id: string;
period: string;       // 时间区间 (如 "2023 - Present")
role: string;         // 职位 (作为标题)
company: string;      // 公司/实验室名称 (包含跳转外链)
description: string;  // 职责与业务价值描述
techStack: string[];  // 技术栈标签 (如 ['Java', 'RocketMQ', 'Redis'])
}

export interface Project {
id: string;
title: string;        // 项目名称
description: string;  // 解决的问题及核心亮点 (如底层网络协议仿真等)
tags: string[];       // 技术栈标签
link?: string;        // GitHub 仓库或论文/演示链接
}

## 4. 关键功能实现方案

### 4.1 响应式双栏布局 (Tailwind CSS)
利用 CSS Grid / Flexbox 实现桌面端“左固定，右滚动”，移动端折叠为单栏瀑布流：

<div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
  <div className="lg:flex lg:justify-between lg:gap-4">
    {/* 左侧边栏：移动端作为 Hero 区块，桌面端 sticky 固定 */}
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
      <Sidebar />
    </header>
    {/* 右侧主内容区：正常滚动流 */}
    <main className="pt-24 lg:w-1/2 lg:py-24">
      <About />
      <Experience />
      <Projects />
    </main>
  </div>
</div>

### 4.2 极客 404 错误页 (Terminal Exception)
- **路由拦截**: 在 `App.tsx` 中配置 `<Route path="*" element={<NotFound />} />`。
- **视觉控制**: 页面全局覆盖 `font-mono`，使用深色背景。
- **动画实现**:
    - 使用 `Framer Motion` 或原生 JavaScript 逐字输出：`Exception in thread "main" java.lang.NullPointerException: Requested page '/unknown-path' is null.`
    - 提供带有 Hover 高亮反色的交互出口 `$ cd /home` 或 `↵ Return to root`，点击后执行 `Maps('/')` 返回首页。

### 4.3 背景聚光灯效果 (Spotlight Effect)
- **方案**: `useMousePosition` 钩子绑定至最外层 `window.addEventListener('mousemove')` 获取光标的 `clientX` 和 `clientY`。
- **渲染**: 在最外层容器下挂载一个 `pointer-events-none` 的固定层，应用动态内联样式实现高饱和度的强调色微光晕：
  `background: radial-gradient(600px circle at ${x}px ${y}px, rgba(45, 212, 191, 0.15), transparent 80%)`。

## 5. Vercel 部署与 CI/CD 规范

### 5.1 路由重写配置 (vercel.json)
由于采用 React Router 作为 SPA 前端路由，必须在项目根目录配置 Vercel 的重写规则。这能防止用户在 `/projects` 或其他内页刷新时触发服务端的 404 错误：

{
"rewrites": [
{
"source": "/(.*)",
"destination": "/index.html"
}
],
"headers": [
{
"source": "/assets/(.*)",
"headers": [
{
"key": "Cache-Control",
"value": "public, max-age=31536000, immutable"
}
]
}
]
}

### 5.2 性能监控与构建指令
- **构建指令**: 默认执行 `npm run build` (内部包含 `tsc && vite build`)。
- **输出目录**: `dist`。
- **性能追踪**: 建议在 `App.tsx` 顶层引入 `@vercel/analytics` 和 `@vercel/speed-insights` 组件，实时监控核心 Web 指标 (Core Web Vitals，确保 LCP < 2.5s) 和访客行为数据。