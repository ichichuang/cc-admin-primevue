# AnimateWrapper 动画组件

## 概述

`AnimateWrapper` 是一个基于 `animate.css` 的 Vue 3 + TypeScript 动画组件，提供了完整的类型支持和丰富的动画功能。

## 特性

✅ **动画名 TS 自动补全** - 不怕拼错动画名称
✅ **所有 animate.css 核心参数** - enter / leave / duration / delay / speed / repeat / appear
✅ **CSS 变量控制** - 精确到毫秒的动画时长和延迟控制
✅ **闭包 slot 用法** - 内容完全自定义
✅ **队列延迟动画** - 列表场景更丝滑的 stagger 动画
✅ **Transition / TransitionGroup 双支持** - 自动适配单元素和列表动画
✅ **全局默认配置** - 零配置调用，统一动画风格

## 安装

组件已集成到项目中，无需额外安装。`animate.css` 依赖已包含在 `package.json` 中。

## 基础用法

### 单元素动画

```vue
<script setup lang="ts">
import { ref } from 'vue'
import AnimateWrapper from '@/components/common/AnimateWrapper.vue'

const visible = ref(false)
</script>

<template>
  <button @click="visible = !visible">切换动画</button>

  <AnimateWrapper
    :show="visible"
    enter="zoomIn"
    leave="zoomOut"
    speed="fast"
    duration="800ms"
    delay="0.2s"
    :repeat="2"
    :appear="true"
  >
    <div class="p-4 bg-primary text-white rounded-lg">🎉 Animate.css 完美版组件</div>
  </AnimateWrapper>
</template>
```

### 列表队列动画

```vue
<script setup lang="ts">
import { ref } from 'vue'
import AnimateWrapper from '@/components/common/AnimateWrapper.vue'

const items = ref([1, 2, 3, 4, 5])

const addItem = () => {
  items.value.push(items.value.length + 1)
}

const removeItem = (index: number) => {
  items.value.splice(index, 1)
}
</script>

<template>
  <button @click="addItem">添加项目</button>

  <AnimateWrapper
    :show="true"
    group
    enter="fadeInUp"
    leave="fadeOutDown"
    speed="faster"
    duration="500ms"
    :stagger="150"
  >
    <div
      v-for="(item, index) in items"
      :key="item"
      class="p-3 bg-secondary text-white rounded-lg mb-2 cursor-pointer"
      @click="removeItem(index)"
    >
      列表项 {{ item }} (点击删除)
    </div>
  </AnimateWrapper>
</template>
```

### 零配置调用

```vue
<template>
  <AnimateWrapper :show="true">
    <div class="p-4 bg-info text-white rounded-lg">✨ 使用全局默认配置的动画</div>
  </AnimateWrapper>
</template>
```

## Props 配置

| 属性       | 类型            | 默认值          | 说明                                 |
| ---------- | --------------- | --------------- | ------------------------------------ |
| `show`     | `boolean`       | -               | **必需** 是否显示元素                |
| `enter`    | `AnimateName`   | `'fadeInUp'`    | 进入动画名称                         |
| `leave`    | `AnimateName`   | `'fadeOutDown'` | 离开动画名称                         |
| `duration` | `string`        | `'800ms'`       | 动画时长                             |
| `delay`    | `string`        | `'0s'`          | 动画延迟                             |
| `speed`    | `AnimateSpeed`  | `'fast'`        | 动画速度                             |
| `repeat`   | `AnimateRepeat` | `1`             | 循环次数                             |
| `appear`   | `boolean`       | `true`          | 是否初次渲染时执行动画               |
| `group`    | `boolean`       | `false`         | 是否列表模式                         |
| `stagger`  | `number`        | `120`           | 队列延迟（ms，仅 group=true 时生效） |

## 动画名称

### 基础动画

- `bounce` - 弹跳
- `flash` - 闪烁
- `pulse` - 脉冲
- `rubberBand` - 橡皮筋
- `shakeX` - 水平摇晃
- `shakeY` - 垂直摇晃
- `headShake` - 摇头
- `swing` - 摇摆
- `tada` - 欢呼
- `wobble` - 摇摆
- `jello` - 果冻
- `heartBeat` - 心跳

### 进入动画

- `fadeIn` - 淡入
- `fadeInDown` - 从下方淡入
- `fadeInUp` - 从上方淡入
- `fadeInLeft` - 从左侧淡入
- `fadeInRight` - 从右侧淡入
- `zoomIn` - 缩放进入
- `zoomInDown` - 从下方缩放进入
- `zoomInUp` - 从上方缩放进入
- `slideInUp` - 从下方滑入
- `slideInDown` - 从上方滑入
- `slideInLeft` - 从左侧滑入
- `slideInRight` - 从右侧滑入
- `bounceIn` - 弹跳进入
- `bounceInDown` - 从下方弹跳进入
- `bounceInUp` - 从上方弹跳进入
- `rotateIn` - 旋转进入
- `flipInX` - X轴翻转进入
- `flipInY` - Y轴翻转进入

### 离开动画

- `fadeOut` - 淡出
- `fadeOutDown` - 向下方淡出
- `fadeOutUp` - 向上方淡出
- `fadeOutLeft` - 向左侧淡出
- `fadeOutRight` - 向右侧淡出
- `zoomOut` - 缩放离开
- `zoomOutDown` - 向下方缩放离开
- `zoomOutUp` - 向上方缩放离开
- `slideOutUp` - 向上方滑出
- `slideOutDown` - 向下方滑出
- `slideOutLeft` - 向左侧滑出
- `slideOutRight` - 向右侧滑出
- `bounceOut` - 弹跳离开
- `bounceOutDown` - 向下方弹跳离开
- `bounceOutUp` - 向上方弹跳离开
- `rotateOut` - 旋转离开
- `flipOutX` - X轴翻转离开
- `flipOutY` - Y轴翻转离开

## 动画速度

- `''` - 默认速度
- `'slower'` - 较慢
- `'slow'` - 慢
- `'fast'` - 快
- `'faster'` - 较快

## 循环次数

- `1` - 执行一次
- `2` - 执行两次
- `3` - 执行三次
- `'infinite'` - 无限循环

## 全局配置

全局默认配置位于 `@/constants/modules/animate.ts`：

```typescript
export const defaultAnimateConfig = {
  enter: 'fadeInUp' as AnimateName,
  leave: 'fadeOutDown' as AnimateName,
  duration: '800ms',
  delay: '0s',
  speed: 'fast' as AnimateSpeed,
  repeat: 1 as AnimateRepeat,
  appear: true,
  group: false,
  stagger: 120,
}
```

## 动画预设

组件还提供了常用的动画预设：

```typescript
export const animatePresets = {
  fade: {
    enter: 'fadeIn' as AnimateName,
    leave: 'fadeOut' as AnimateName,
    duration: '600ms',
  },
  zoom: {
    enter: 'zoomIn' as AnimateName,
    leave: 'zoomOut' as AnimateName,
    duration: '500ms',
  },
  slide: {
    enter: 'slideInUp' as AnimateName,
    leave: 'slideOutDown' as AnimateName,
    duration: '600ms',
  },
  bounce: {
    enter: 'bounceIn' as AnimateName,
    leave: 'bounceOut' as AnimateName,
    duration: '800ms',
  },
  flip: {
    enter: 'flipInX' as AnimateName,
    leave: 'flipOutX' as AnimateName,
    duration: '700ms',
  },
}
```

## 使用示例

访问 `/example/animate` 页面查看完整的使用示例。

## 注意事项

1. **类型安全** - 所有动画名称都有 TypeScript 类型支持，IDE 会自动补全
2. **性能优化** - 组件使用 Vue 3 的 `Transition` 和 `TransitionGroup`，性能优秀
3. **CSS 变量** - 动画时长和延迟通过 CSS 变量控制，支持精确到毫秒的设置
4. **队列动画** - 列表模式支持 stagger 延迟，让列表动画更丝滑
5. **全局配置** - 支持全局默认配置，修改一次即可影响整个项目

## 更新日志

- **v1.0.0** - 初始版本，支持基础动画功能
- **v1.1.0** - 添加全局默认配置支持
- **v1.2.0** - 添加动画预设和队列延迟功能
