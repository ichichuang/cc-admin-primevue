# PrimeVue Dialog 组件

基于 PrimeVue 的对话框组件封装，支持标准对话框、确认对话框和动态对话框。

## 功能特性

- ✅ 支持标准对话框 (Dialog)
- ✅ 支持确认对话框 (ConfirmDialog)
- ✅ 支持动态对话框 (DynamicDialog)
- ✅ 支持自定义头部渲染
- ✅ 支持自定义内容渲染
- ✅ 支持自定义底部渲染
- ✅ 支持按钮加载状态
- ✅ 支持最大化/最小化
- ✅ 支持 ESC 键关闭
- ✅ 支持点击遮罩关闭
- ✅ 支持延时打开/关闭
- ✅ 支持便捷方法 (info, success, warning, error, confirm)
- ✅ 支持可拖拽对话框
- ✅ 支持无遮罩对话框
- ✅ 支持自定义位置对话框
- ✅ 支持嵌套对话框
- ✅ 支持动态更新对话框属性

## 主要属性

| 属性             | 类型                                 | 默认值     | 说明                     |
| ---------------- | ------------------------------------ | ---------- | ------------------------ |
| `type`           | `'dialog' \| 'confirm' \| 'dynamic'` | `'dialog'` | 对话框类型               |
| `visible`        | `boolean`                            | `false`    | 是否显示对话框           |
| `header`         | `string`                             | `''`       | 对话框标题               |
| `width`          | `string \| number`                   | `'50%'`    | 对话框宽度               |
| `height`         | `string \| number`                   | `'auto'`   | 对话框高度               |
| `closeOnEscape`  | `boolean`                            | `true`     | 是否可以通过 ESC 键关闭  |
| `closeOnMask`    | `boolean`                            | `true`     | 是否可以通过点击遮罩关闭 |
| `closable`       | `boolean`                            | `true`     | 是否显示关闭按钮         |
| `modal`          | `boolean`                            | `true`     | 是否显示遮罩             |
| `draggable`      | `boolean`                            | `false`    | 是否可拖拽               |
| `position`       | `string`                             | `'center'` | 对话框位置               |
| `appendTo`       | `string`                             | `'body'`   | 附加到指定元素           |
| `maximizable`    | `boolean`                            | `false`    | 是否可最大化             |
| `minimizable`    | `boolean`                            | `false`    | 是否可最小化             |
| `fullscreen`     | `boolean`                            | `false`    | 是否为全屏对话框         |
| `sureBtnLoading` | `boolean`                            | `false`    | 确定按钮是否显示加载状态 |

## 使用方法

### 1. 在 App.vue 中注册组件

```vue
<script setup lang="ts">
import { PrimeVueDialog, dialogStore } from '@/components/modules/prime-dialog'
</script>

<template>
  <PrimeVueDialog :dialog-store="dialogStore" />
</template>
```

### 2. 使用 useDialog Hook

```vue
<script setup lang="ts">
import { useDialog } from '@/hooks/components/useDialog'

const { openDialog, info, success, confirm } = useDialog()

// 打开标准对话框
const showDialog = () => {
  const dialogIndex = dialogStore.value.length
  openDialog({
    header: '标题',
    contentRenderer: () => h('div', '内容'),
    footerButtons: [
      {
        label: '取消',
        severity: 'secondary',
        text: true,
        btnClick: () => closeDialog(dialogIndex),
      },
      {
        label: '确定',
        severity: 'primary',
        text: true,
        btnClick: () => closeDialog(dialogIndex),
      },
    ],
  })
}

// 便捷方法
const showInfo = () => info('信息提示')
const showSuccess = () => success('操作成功')
const showConfirm = () => confirm('确认操作', '确认', () => console.log('确认'))
</script>
```

## 关闭动画

对话框关闭时会自动处理动画效果：

1. **设置 `visible: false`** - 触发 PrimeVue 的关闭动画
2. **延时移除** - 等待动画完成后从数组中移除对话框
3. **可配置延时** - 通过 `closeDelay` 属性控制延时时间（默认 200ms）

这样可以确保关闭动画与点击遮罩关闭的效果一致。

## API 参考

### DialogOptions

| 属性           | 类型                               | 默认值   | 说明             |
| -------------- | ---------------------------------- | -------- | ---------------- |
| type           | 'dialog' \| 'confirm' \| 'dynamic' | 'dialog' | 对话框类型       |
| visible        | boolean                            | false    | 是否显示         |
| header         | string                             | ''       | 对话框标题       |
| width          | string \| number                   | '50%'    | 对话框宽度       |
| height         | string \| number                   | 'auto'   | 对话框高度       |
| maximizable    | boolean                            | false    | 是否可最大化     |
| minimizable    | boolean                            | false    | 是否可最小化     |
| closeOnEscape  | boolean                            | true     | 按ESC键关闭      |
| closable       | boolean                            | true     | 显示关闭按钮     |
| modal          | boolean                            | true     | 是否显示遮罩     |
| center         | boolean                            | false    | 头部和底部居中   |
| destroyOnClose | boolean                            | false    | 关闭时销毁元素   |
| hideFooter     | boolean                            | false    | 隐藏底部按钮     |
| sureBtnLoading | boolean                            | false    | 确定按钮加载状态 |
| openDelay      | number                             | 0        | 打开延时（毫秒） |
| closeDelay     | number                             | 200      | 关闭延时（毫秒） |

### 事件回调

| 事件               | 参数                     | 说明             |
| ------------------ | ------------------------ | ---------------- |
| open               | { options, index }       | 对话框打开时触发 |
| close              | { options, index }       | 对话框关闭时触发 |
| closeCallBack      | { options, index, args } | 对话框关闭回调   |
| maximizeCallBack   | { options, index }       | 最大化时触发     |
| minimizeCallBack   | { options, index }       | 最小化时触发     |
| fullscreenCallBack | { options, index }       | 全屏时触发       |

### 按钮配置

| 属性     | 类型                           | 说明     |
| -------- | ------------------------------ | -------- |
| label    | string                         | 按钮文字 |
| severity | ButtonType                     | 按钮类型 |
| loading  | boolean                        | 加载状态 |
| disabled | boolean                        | 禁用状态 |
| icon     | string                         | 图标     |
| text     | boolean                        | 文字按钮 |
| outlined | boolean                        | 轮廓按钮 |
| rounded  | boolean                        | 圆角按钮 |
| size     | 'small' \| 'normal' \| 'large' | 按钮尺寸 |

## 示例

完整的使用示例请参考：`src/views/example/views/example-dialog.vue`
