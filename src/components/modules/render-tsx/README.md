# RenderTSX 组件

一个用于安全渲染 TSX 代码的 Vue 组件，支持错误边界处理和参数传递。

## 功能特性

- ✅ 安全渲染 TSX 代码
- ✅ 错误边界处理
- ✅ 自定义错误回退组件
- ✅ 参数传递支持
- ✅ 开发环境错误详情显示
- ✅ TypeScript 类型支持

## 基本用法

```vue
<template>
  <RenderTSX
    :dom="renderFunction"
    :params="renderParams"
  />
</template>

<script setup lang="ts">
import { RenderTSX } from '@/components/modules/render-tsx'
import type { TSXRenderFunction } from '@/components/modules/render-tsx'

// 定义 TSX 渲染函数
const renderFunction: TSXRenderFunction = params => {
  return (
    <div class="custom-content">
      <h1>Hello {params?.name || 'World'}</h1>
      <p>这是一个 TSX 渲染示例</p>
    </div>
  )
}

// 传递参数
const renderParams = {
  name: 'Vue 3',
}
</script>
```

## Props 说明

| 属性名          | 类型                     | 默认值       | 说明                 |
| --------------- | ------------------------ | ------------ | -------------------- |
| `dom`           | `TSXRenderFunction`      | -            | TSX 渲染函数（必需） |
| `params`        | `any`                    | `null`       | 传递给渲染函数的参数 |
| `errorBoundary` | `boolean`                | `true`       | 是否启用错误边界     |
| `fallback`      | `VNode \| (() => VNode)` | 默认错误组件 | 错误时的回退组件     |
| `class`         | `string`                 | `''`         | 组件类名             |
| `style`         | `Record<string, any>`    | `{}`         | 组件样式             |

## 高级用法

### 自定义错误回退组件

```vue
<template>
  <RenderTSX
    :dom="renderFunction"
    :params="renderParams"
    :fallback="customErrorFallback"
  />
</template>

<script setup lang="ts">
import { h } from 'vue'
import { RenderTSX } from '@/components/modules/render-tsx'

const customErrorFallback = () =>
  h(
    'div',
    {
      style: {
        color: 'red',
        padding: '20px',
        textAlign: 'center',
      },
    },
    '自定义错误提示'
  )

const renderFunction = (params: any) => {
  // 可能出错的渲染逻辑
  if (params?.shouldError) {
    throw new Error('模拟错误')
  }

  return <div>正常内容</div>
}
</script>
```

### 禁用错误边界

```vue
<template>
  <RenderTSX
    :dom="renderFunction"
    :error-boundary="false"
  />
</template>
```

### 使用工具函数

```vue
<script setup lang="ts">
import {
  RenderTSX,
  createErrorFallback,
  createLoadingFallback,
} from '@/components/modules/render-tsx'

// 使用预定义的错误回退组件
const renderFunction = (params: any) => {
  if (params?.loading) {
    return createLoadingFallback()
  }

  if (params?.error) {
    return createErrorFallback(new Error('加载失败'))
  }

  return <div>内容</div>
}
</script>
```

## 类型定义

### TSXRenderFunction

```typescript
type TSXRenderFunction = (params?: any) => VNode | VNode[]
```

### RenderTSXProps

```typescript
interface RenderTSXProps {
  dom: TSXRenderFunction
  params?: any
  errorBoundary?: boolean
  fallback?: VNode | (() => VNode)
  class?: string
  style?: Record<string, any>
}
```

## 错误处理

组件内置了完善的错误处理机制：

1. **错误捕获**: 自动捕获渲染过程中的错误
2. **错误边界**: 防止错误向上传播影响其他组件
3. **开发环境**: 在开发环境下显示详细的错误信息
4. **自定义回退**: 支持自定义错误显示组件

## 注意事项

1. 确保 TSX 渲染函数返回有效的 VNode 或 VNode 数组
2. 在开发环境下，错误详情会自动显示
3. 错误边界默认启用，可以通过 `errorBoundary` 属性禁用
4. 组件会自动处理数组形式的渲染结果

## 工具函数

### createErrorFallback

创建标准错误回退组件。

```typescript
function createErrorFallback(error?: Error, showDetails?: boolean): VNode
```

### createLoadingFallback

创建加载状态组件。

```typescript
function createLoadingFallback(): VNode
```

### safeRender

安全执行渲染函数。

```typescript
function safeRender(renderFn: TSXRenderFunction, params?: any): VNode | VNode[]
```
