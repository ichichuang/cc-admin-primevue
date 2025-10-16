# CC-Admin-PrimeVue

> 基于 Vue 3.5+、TypeScript 5+ 和 PrimeVue 的现代化企业级后台管理框架

## 🚀 开始

### 环境要求

- **Node.js**: >= 22.0.0
- **pnpm**: >= 8.0.0

### 安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install
```

### 运行项目

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 项目初始化

```bash
# 运行项目初始化脚本（推荐首次使用）
pnpm init
```

## 📚 技术栈介绍

### 核心框架

- **[Vue 3.5+](https://vuejs.org/)** - 渐进式 JavaScript 框架
- **[TypeScript 5+](https://www.typescriptlang.org/)** - JavaScript 的超集，提供类型安全
- **[Vite 7+](https://vitejs.dev/)** - 下一代前端构建工具

### UI 组件库

- **[PrimeVue 4.3+](https://primevue.org/)** - 企业级 Vue UI 组件库
- **[PrimeIcons 7.0+](https://primeng.org/icons)** - PrimeVue 图标库
- **[@primevue/themes](https://primevue.org/theming/)** - PrimeVue 主题系统
- **[@primevue/forms](https://primevue.org/forms/)** - PrimeVue 表单组件

### 状态管理

- **[Pinia 3.0+](https://pinia.vuejs.org/)** - Vue 的官方状态管理库
- **[pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/)** - Pinia 持久化插件

### 路由管理

- **[Vue Router 4.4+](https://router.vuejs.org/)** - Vue.js 官方路由管理器

### HTTP 请求

- **[Alova 3.3+](https://alova.js.org/)** - 轻量级请求策略库，提供请求/响应拦截、缓存、重试等功能

### 图表可视化

- **[ECharts 6.0+](https://echarts.apache.org/)** - 百度开源的数据可视化图表库
- **[vue-echarts 8.0+](https://github.com/ecomfe/vue-echarts)** - ECharts 的 Vue 3 封装组件

### 表格组件

- **[AG Grid 34.2+](https://www.ag-grid.com/)** - 企业级数据表格组件
- **[ag-grid-vue3](https://www.ag-grid.com/vue-data-grid/)** - AG Grid 的 Vue 3 适配器

### 样式方案

- **[UnoCSS 66.3+](https://unocss.dev/)** - 即时按需原子化 CSS 引擎
- **[Sass 1.89+](https://sass-lang.com/)** - CSS 预处理器
- **[PostCSS](https://postcss.org/)** - CSS 后处理器
- **[postcss-pxtorem](https://github.com/cuth/postcss-pxtorem)** - px 转 rem 插件

### 国际化

- **[Vue I18n 10.0+](https://vue-i18n.intlify.dev/)** - Vue.js 国际化插件

### 日期处理

- **[Day.js 1.11+](https://day.js.org/)** - 轻量级日期处理库
- **[@vuepic/vue-datepicker 11.0+](https://vue3datepicker.com/)** - Vue 3 日期选择器组件
- **[date-holidays 3.26+](https://github.com/commenthol/date-holidays)** - 节假日计算库
- **[@vvo/tzdb 6.183+](https://github.com/vvo/tzdb)** - 时区数据库

### 工具库

- **[Lodash-es 4.17+](https://lodash.com/)** - JavaScript 实用工具库
- **[@vueuse/core 13.9+](https://vueuse.org/)** - Vue 组合式 API 工具集
- **[crypto-js 4.2+](https://cryptojs.gitbook.io/)** - JavaScript 加密库
- **[mitt 3.0+](https://github.com/developit/mitt)** - 轻量级事件发射器
- **[nprogress 0.2+](https://github.com/rstacruz/nprogress)** - 页面加载进度条
- **[yup 1.7+](https://github.com/jquense/yup)** - JavaScript 对象模式验证器

### 动画库

- **[GSAP 3.13+](https://greensock.com/gsap/)** - 专业级动画库
- **[Animate.css 4.1+](https://animate.style/)** - CSS 动画库

### 滚动条

- **[OverlayScrollbars 2.12+](https://kingsora.github.io/OverlayScrollbars/)** - 自定义滚动条库
- **[overlayscrollbars-vue 0.5+](https://kingsora.github.io/OverlayScrollbars/#!overview/vue)** - OverlayScrollbars 的 Vue 适配器

### 拖拽功能

- **[@atlaskit/pragmatic-drag-and-drop 1.7+](https://atlaskit.atlassian.com/packages/design-system/pragmatic-drag-and-drop)** - Atlassian 拖拽库

### 开发工具

- **[ESLint 9.17+](https://eslint.org/)** - JavaScript 代码检查工具
- **[Prettier 3.4+](https://prettier.io/)** - 代码格式化工具
- **[TypeScript ESLint 8.18+](https://typescript-eslint.io/)** - TypeScript 的 ESLint 规则
- **[Husky 9.1+](https://typicode.github.io/husky/)** - Git hooks 工具
- **[lint-staged 15.2+](https://github.com/okonet/lint-staged)** - 暂存文件检查工具
- **[Commitizen 4.3+](https://commitizen.github.io/cz-cli/)** - 规范化提交工具
- **[Commitlint 19.6+](https://commitlint.js.org/)** - 提交信息检查工具

### 构建优化

- **[Terser 5.36+](https://terser.org/)** - JavaScript 压缩工具
- **[vite-plugin-compression 0.5+](https://github.com/vbenjs/vite-plugin-compression)** - Vite 压缩插件
- **[rollup-plugin-visualizer 6.0+](https://github.com/btd/rollup-plugin-visualizer)** - 构建分析工具
- **[@vitejs/plugin-legacy 7.0+](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)** - 浏览器兼容性插件

### 自动导入

- **[unplugin-auto-import 20.0+](https://github.com/antfu/unplugin-auto-import)** - 自动导入 API
- **[unplugin-vue-components 28.8+](https://github.com/antfu/unplugin-vue-components)** - 自动导入组件

### 模板引擎

- **[Pug 3.0+](https://pugjs.org/)** - 简洁的 HTML 模板引擎

## 📋 规范说明

### 代码规范

本项目配置了完整的代码质量检查体系：

#### ESLint 配置

- **基础规则**: 使用 `@eslint/js` 推荐配置
- **TypeScript 规则**: 使用 `typescript-eslint` 推荐配置
- **Vue 规则**: 使用 `eslint-plugin-vue` 推荐配置
- **自定义规则**: 包含命名规范、代码质量等自定义规则

#### 命名规范

- **变量**: camelCase (如: `userName`)
- **常量**: SCREAMING_SNAKE_CASE (如: `API_BASE_URL`)
- **函数**: camelCase (如: `getUserInfo`)
- **接口/类型**: PascalCase (如: `UserInfo`)
- **组件**: PascalCase (如: `UserProfile`)
- **文件**:
  - 全局组件: PascalCase (如: `UserProfile.vue`)
  - 页面文件: kebab-case (如: `user-list.vue`)
  - 功能模块: camelCase (如: `userApi.ts`)

### 检查脚本

`@scripts/` 目录下配置了多个自动化检查脚本：

#### 核心检查脚本

- **`check.ts`** - 统一检查脚本，执行所有质量检查
- **`check-env.ts`** - 环境变量配置检查
- **`naming-rules.ts`** - 命名规范检查
- **`watch-naming.ts`** - 实时命名规范监听

#### 组件管理脚本

- **`component-watcher.ts`** - 组件变化监听器
- **`watch-components.ts`** - 组件监控脚本
- **`update-components.ts`** - 组件类型声明更新

#### 开发工具脚本

- **`dev-parallel.ts`** - 并行开发环境启动
- **`init.ts`** - 项目初始化脚本

#### 使用方式

```bash
# 执行完整检查
pnpm check

# 检查环境变量
pnpm env-check

# 检查命名规范
pnpm naming-check

# 实时监听命名规范
pnpm naming-watch

# 监听组件变化
pnpm component-watcher

# 项目初始化
pnpm init
```

### Git 规范

- **提交规范**: 使用 Commitizen 和 Commitlint 确保提交信息规范
- **代码检查**: 使用 Husky 和 lint-staged 在提交前自动检查代码
- **分支规范**: 遵循 Git Flow 工作流

### 项目结构

```
src/
├── api/                 # API 接口模块
├── assets/              # 静态资源
├── common/              # 通用工具模块
├── components/          # 全局组件
├── constants/           # 常量配置
├── hooks/               # 组合式函数
├── layouts/             # 布局组件
├── locales/             # 国际化配置
├── plugins/             # 插件配置
├── router/              # 路由配置
├── stores/              # 状态管理
├── types/               # 类型定义
├── utils/               # 工具函数
└── views/               # 页面组件
```

---

## 📄 许可证

MIT License
