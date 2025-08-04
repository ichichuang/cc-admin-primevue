# cc-admin-PrimeVue 脚本目录

本目录包含 cc-admin-PrimeVue 框架的各种工具脚本。

## 📁 脚本文件

### 🔧 核心脚本

| 脚本名称          | 功能描述     | 执行命令            |
| ----------------- | ------------ | ------------------- |
| `dev-parallel.ts` | 并行开发环境 | `pnpm dev`          |
| `init.ts`         | 项目初始化   | `pnpm init:project` |

## 🚀 跨平台特性

### ✅ 已解决的问题

1. **Shell 脚本兼容性**: 所有脚本使用 TypeScript 编写
2. **路径分隔符**: 使用 `path.sep` 确保跨平台兼容
3. **文件系统操作**: 使用 Node.js `fs` 模块
4. **进程管理**: 使用 `child_process.spawn` 替代 shell 命令

### 🔧 技术实现

- **Shebang**: `#!/usr/bin/env -S npx tsx` 确保直接执行
- **TypeScript**: 提供类型安全和更好的开发体验
- **模块化**: 每个脚本都是独立的类，便于维护
- **错误处理**: 完善的错误处理和用户友好的提示

## 📋 使用示例

### 1. 开发环境

```bash
# 启动并行开发环境
pnpm dev

# 输出示例：
# 🚀 cc-admin-PrimeVue 开发环境
# =======================================
# 启动时间: 2025-01-28 15:30:00
# 项目名称: cc-admin-PrimeVue
# =======================================
# ✅ 环境检查通过
# 🚀 启动开发服务器...
# 🔍 启动类型检查...
# 🔍 启动代码检查...
# ✅ 开发环境启动完成！
```

### 2. 项目初始化

```bash
# 初始化项目配置
pnpm init:project

# 输出示例：
# 🚀 cc-admin-PrimeVue 项目初始化
# =======================================
# 初始化时间: 2025-01-28 15:30:00
# 项目名称: cc-admin-PrimeVue
# =======================================
# ✅ 环境检查通过
# 🚀 开始项目初始化...
# 📁 创建必要目录...
# 📝 生成配置文件...
# ✅ 项目初始化完成！
```

## 🔧 开发指南

### 添加新脚本

1. **创建脚本文件**:

   ```typescript
   #!/usr/bin/env -S npx tsx

   /**
    * @copyright Copyright (c) 2025 chichuang
    * @license MIT
    * @description cc-admin-PrimeVue 企业级后台管理框架 - 脚本描述
    * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
    */

   // 脚本内容...
   ```

2. **更新 package.json**:

   ```json
   {
     "scripts": {
       "new-script": "pnpm exec tsx scripts/new-script.ts"
     }
   }
   ```

3. **添加文档**: 更新本 README 文件

### 脚本最佳实践

1. **错误处理**: 使用 try-catch 包装所有异步操作
2. **用户反馈**: 提供清晰的进度提示和错误信息
3. **类型安全**: 定义接口和类型，避免 any 类型
4. **模块化**: 将复杂逻辑拆分为独立的方法
5. **跨平台**: 使用 Node.js 标准库，避免平台特定代码

## 📚 相关文档

- [PrimeVue 集成指南](../docs/primevue-integration.md)
- [开发环境配置指南](../docs/development-guide.md)

---

_本文档由 cc-admin-PrimeVue 框架维护团队编写_
