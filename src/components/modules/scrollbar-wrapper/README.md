# ScrollbarWrapper 组件

一个基于 `custom-vue-scrollbar` 的增强滚动条组件，支持动态尺寸计算和响应式设计。

## 特性

- 🎯 **智能尺寸计算**: 垂直滚动条高度自适应，宽度动态计算；水平滚动条宽度自适应，高度动态计算
- 📱 **响应式设计**: 移动端和PC端使用不同的滚动条尺寸
- 🎨 **自定义颜色**: 支持自定义滚动条颜色方案
- 🔧 **灵活配置**: 支持所有 `custom-vue-scrollbar` 的配置选项
- 📊 **设备适配**: 自动适配不同设备的屏幕尺寸

## 动态尺寸计算规则

### 滚动条尺寸范围 (thumbMinSize/thumbMaxSize)

- **垂直滚动条**:
  - 最小高度: 移动端 `30px`，PC端 `40px`
  - 最大高度: 移动端 `200px`，PC端 `300px`

- **水平滚动条**:
  - 最小宽度: 移动端 `25px`，PC端 `35px`
  - 最大宽度: 移动端 `150px`，PC端 `250px`

### 滚动条宽度 (thumbWidth)

- **垂直滚动条**:
  - 宽度动态计算: 移动端 `Math.max(deviceWidth * 0.025, 8)`，PC端 `Math.max(deviceWidth * 0.018, 10)`
  - 高度自适应: 根据内容比例自动计算

- **水平滚动条**:
  - 高度动态计算: 移动端 `Math.max(deviceWidth * 0.018, 6)`，PC端 `Math.max(deviceWidth * 0.015, 8)`
  - 宽度自适应: 根据内容比例自动计算

> **说明**: 滚动条的自适应尺寸（垂直滚动的高度，水平滚动的宽度）由 `custom-vue-scrollbar` 根据内容比例自动计算。使用合理的固定值作为最小/最大尺寸范围，确保拖拽功能正常工作。

## 基础用法

```vue
<template>
  <!-- 使用默认动态尺寸 -->
  <ScrollbarWrapper class="h-96">
    <div class="p-4">
      <!-- 长内容 -->
      <div
        v-for="i in 100"
        :key="i"
        class="mb-2"
      >
        内容行 {{ i }}
      </div>
    </div>
  </ScrollbarWrapper>
</template>

<script setup lang="ts">
import ScrollbarWrapper from '@/components/modules/scrollbar-wrapper'
</script>
```

## 自定义尺寸

```vue
<template>
  <!-- 自定义滚动条尺寸 -->
  <ScrollbarWrapper
    :thumb-min-size="50"
    :thumb-max-size="200"
    :thumb-width="12"
    class="h-96"
  >
    <div class="p-4">
      <!-- 内容 -->
    </div>
  </ScrollbarWrapper>
</template>
```

## 自定义颜色方案

```vue
<template>
  <!-- 自定义颜色方案 -->
  <ScrollbarWrapper
    :color-scheme="{
      thumbColor: '#3b82f6',
      thumbHoverColor: '#1d4ed8',
      trackColor: '#f8fafc',
      thumbPlaceholderColor: '#e2e8f0',
    }"
    class="h-96"
  >
    <div class="p-4">
      <!-- 内容 -->
    </div>
  </ScrollbarWrapper>
</template>
```

## 水平滚动

```vue
<template>
  <!-- 水平滚动 -->
  <ScrollbarWrapper
    direction="horizontal"
    class="h-32"
  >
    <div
      class="flex gap-4 p-4"
      style="width: 2000px;"
    >
      <div
        v-for="i in 20"
        :key="i"
        class="w-48 h-24 bg-gray-200 rounded"
      >
        卡片 {{ i }}
      </div>
    </div>
  </ScrollbarWrapper>
</template>
```

## 编程式滚动

```vue
<template>
  <div>
    <div class="mb-4 space-x-2">
      <button @click="scrollToTop">滚动到顶部</button>
      <button @click="scrollToBottom">滚动到底部</button>
      <button @click="scrollToPosition">滚动到指定位置</button>
    </div>

    <ScrollbarWrapper
      ref="scrollbarRef"
      class="h-96"
    >
      <div class="p-4">
        <div
          v-for="i in 100"
          :key="i"
          class="mb-2"
        >
          内容行 {{ i }}
        </div>
      </div>
    </ScrollbarWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ScrollbarWrapper from '@/components/modules/scrollbar-wrapper'

const scrollbarRef = ref()

const scrollToTop = () => {
  scrollbarRef.value?.scrollToTop()
}

const scrollToBottom = () => {
  scrollbarRef.value?.scrollToBottom()
}

const scrollToPosition = () => {
  scrollbarRef.value?.scrollTo({
    top: 500,
    behavior: 'smooth',
  })
}
</script>
```

## Props

| 属性             | 类型                                 | 默认值       | 说明                                |
| ---------------- | ------------------------------------ | ------------ | ----------------------------------- |
| `direction`      | `'horizontal' \| 'vertical'`         | `'vertical'` | 滚动方向                            |
| `thumbMinSize`   | `number`                             | `0`          | 滚动条最小尺寸（0表示使用动态计算） |
| `thumbMaxSize`   | `number`                             | `0`          | 滚动条最大尺寸（0表示使用动态计算） |
| `thumbWidth`     | `number`                             | `0`          | 滚动条宽度（0表示使用动态计算）     |
| `autoHide`       | `boolean`                            | `true`       | 是否自动隐藏                        |
| `autoHideDelay`  | `number`                             | `900`        | 自动隐藏延迟时间(ms)                |
| `autoExpand`     | `boolean`                            | `true`       | 是否自动展开                        |
| `fixedThumb`     | `boolean`                            | `false`      | 是否固定滚动条                      |
| `throttleType`   | `'throttle' \| 'debounce' \| 'none'` | `'debounce'` | 节流类型                            |
| `throttleWait`   | `number`                             | `333`        | 节流等待时间                        |
| `simulateScroll` | `boolean`                            | `false`      | 是否模拟滚动                        |
| `colorScheme`    | `ColorScheme`                        | `{}`         | 自定义颜色方案                      |

## Events

| 事件名           | 参数         | 说明           |
| ---------------- | ------------ | -------------- |
| `wrapper-resize` | `rect: Rect` | 包装器尺寸变化 |
| `content-resize` | `rect: Rect` | 内容尺寸变化   |

## Exposed Methods

| 方法名           | 参数                        | 返回值                | 说明           |
| ---------------- | --------------------------- | --------------------- | -------------- |
| `scrollTo`       | `options: ScrollToOptions`  | `void`                | 滚动到指定位置 |
| `scrollToTop`    | `behavior?: ScrollBehavior` | `void`                | 滚动到顶部     |
| `scrollToBottom` | `behavior?: ScrollBehavior` | `void`                | 滚动到底部     |
| `getScrollEl`    | -                           | `HTMLElement \| null` | 获取滚动元素   |

## 设备适配

组件会自动监听设备信息变化，包括：

- 窗口尺寸变化 (`resize`)
- 横竖屏切换 (`orientationchange`)
- 页面显示 (`pageshow`)
- 标签页激活/隐藏 (`visibilitychange`)

当设备信息发生变化时，滚动条尺寸会自动重新计算，确保在不同设备上都有良好的用户体验。
