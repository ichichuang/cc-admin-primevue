<!--
  @copyright Copyright (c) 2025 chichuang
  @license 自定义商业限制许可证
  @description cc-admin-PrimeVue 企业级后台管理框架 - 更新日志

  本文件受版权保护，商业使用需要授权。
  联系方式: https://github.com/ichichuang/cc-admin-homepage/issues

  This file is protected by copyright. Commercial use requires authorization.
  Contact: https://github.com/ichichuang/cc-admin-homepage/issues
-->

# 变更日志

## [未发布]

### 重构

- **FunctionalColors 接口重构**: 为了适配 PrimeVue v4 的设计令牌系统，重构了 `FunctionalColors` 接口
  - 移除了 PrimeVue 特定属性: `textColor`, `borderColor`, `backgroundColor`, `focusShadowColor`
  - 保留了核心属性: `color`, `hover`, `active`, `disabled`, `light`
  - 简化了接口结构，提高了代码可维护性
  - 适配了 PrimeVue v4 的色阶系统 (50-950)
  - 更新了相关的 getter 方法和 CSS 变量设置
  - 更新了示例页面和文档

### 技术改进

- 优化了颜色系统的设计令牌映射
- 简化了 CSS 变量定义
- 提高了与 PrimeVue v4 的兼容性
- 更新了 UnoCSS 配置以适配重构后的颜色系统
- 修复了按钮和边框快捷方式的命名一致性
- 使用项目内置的文本颜色变量 `text-text100` 替代硬编码的 `text-white`
- 简化了样式定义，提高了代码可维护性

### 文档更新

- 更新了 `PRIMEVUE_COLOR_SYSTEM.md` 文档
- 添加了重构说明和迁移指南
- 更新了使用示例和最佳实践
- 新增了 `CONFIGURATION_UPDATE.md` 配置文件更新总结

## [0.0.1] - 2025-01-XX

### 新增

- 初始版本发布
- 完整的主题色管理系统
- PrimeVue 组件库集成
- 亮色/暗色主题支持
- 多种预设主题色
