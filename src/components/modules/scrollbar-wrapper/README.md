# ScrollbarWrapper 组件

一个基于 OverlayScrollbars 的 Vue 3 滚动条组件，提供丰富的配置选项和主题支持。

## 功能特性

- 🎨 **主题支持**：支持浅色、深色主题，自动根据主题切换颜色方案
- 📱 **设备适配**：自动根据设备类型（移动端/桌面端）调整滚动条尺寸
- 🎯 **高度可定制**：支持自定义颜色、尺寸、行为等所有配置
- ⚡ **性能优化**：支持节流/防抖，提供流畅的滚动体验
- 🔧 **类型安全**：完整的 TypeScript 类型支持

## 基础用法

```vue
<template>
  <ScrollbarWrapper>
    <div>你的内容</div>
  </ScrollbarWrapper>
</template>
```

## 主题使用

### 使用默认主题颜色方案

```vue
<template>
  <!-- 浅色主题 -->
  <ScrollbarWrapper theme="os-theme-light">
    <div>浅色主题内容</div>
  </ScrollbarWrapper>

  <!-- 深色主题 -->
  <ScrollbarWrapper theme="os-theme-dark">
    <div>深色主题内容</div>
  </ScrollbarWrapper>
</template>
```

### 自定义颜色方案

```vue
<template>
  <ScrollbarWrapper
    theme="os-theme-light"
    :color-scheme="{
      thumbColor: 'var(--primary100)',
      thumbHoverColor: 'var(--primary200)',
      thumbActiveColor: 'var(--primary300)',
    }"
  >
    <div>自定义颜色内容</div>
  </ScrollbarWrapper>
</template>
```

## 配置选项

### 基础配置

```vue
<template>
  <ScrollbarWrapper
    direction="vertical"
    theme="os-theme-light"
    :size="12"
    :padding-perpendicular="4"
    :padding-axis="4"
  >
    <div>配置内容</div>
  </ScrollbarWrapper>
</template>
```

### 行为配置

```vue
<template>
  <ScrollbarWrapper
    :click-scroll="true"
    :click-scroll-step="1"
    :click-scroll-duration="300"
    :auto-hide="true"
    :auto-hide-delay="800"
    throttle-type="throttle"
    :throttle-wait="16"
  >
    <div>行为配置内容</div>
  </ScrollbarWrapper>
</template>
```

## 事件处理

```vue
<template>
  <ScrollbarWrapper
    @scroll="handleScroll"
    @scroll-start="handleScrollStart"
    @scroll-end="handleScrollEnd"
    @initialized="handleInitialized"
  >
    <div>事件处理内容</div>
  </ScrollbarWrapper>
</template>

<script setup>
const handleScroll = event => {
  console.log('滚动事件:', event)
}

const handleScrollStart = () => {
  console.log('滚动开始')
}

const handleScrollEnd = () => {
  console.log('滚动结束')
}

const handleInitialized = instance => {
  console.log('初始化完成:', instance)
}
</script>
```

## 方法调用

```vue
<template>
  <ScrollbarWrapper ref="scrollbarRef">
    <div>方法调用内容</div>
  </ScrollbarWrapper>
</template>

<script setup>
import { ref } from 'vue'

const scrollbarRef = ref()

// 滚动到顶部
const scrollToTop = () => {
  scrollbarRef.value?.scrollToTop()
}

// 滚动到底部
const scrollToBottom = () => {
  scrollbarRef.value?.scrollToBottom()
}

// 获取滚动条实例
const getInstance = () => {
  return scrollbarRef.value?.getOverlayScrollbars()
}
</script>
```

## 主题颜色方案

组件会根据 `theme` 属性自动选择对应的颜色方案：

- `os-theme-light` → 使用浅色主题颜色方案
- `os-theme-dark` → 使用深色主题颜色方案
- 其他值 → 使用默认颜色方案

你也可以通过 `color-scheme` 属性覆盖任何颜色配置。

## 设备适配

组件会自动根据设备类型调整滚动条配置：

- **移动端**：滚动条更细（8px），动画更快（200ms）
- **桌面端**：滚动条稍大（10px），动画稍慢（300ms）

## 类型定义

所有配置选项都有完整的 TypeScript 类型支持，提供智能提示和类型检查。

```typescript
interface ScrollbarWrapperProps {
  direction?: 'horizontal' | 'vertical' | 'both'
  theme?: string
  size?: number
  colorScheme?: ColorScheme
  // ... 更多配置选项
}
```
