<script setup lang="ts">
import { computed } from 'vue'
import CustomMenu from './components/CustomMenu.tsx'
import MegaMenu from './components/MegaMenu.tsx'
import Menubar from './components/Menubar.tsx'
import PanelMenu from './components/PanelMenu.tsx'
import TieredMenu from './components/TieredMenu.tsx'
import type { MenuType, TypedMenuProps } from './utils/types.ts'

const props = withDefaults(defineProps<TypedMenuProps<MenuType>>(), {
  type: 'custom' as const,
  items: () => [] as any[], // 使用 any[] 作为默认值，因为类型是动态的
  componentsProps: () => ({}),
})

// 根据类型选择对应的菜单组件
const menuComponents = {
  custom: CustomMenu,
  mega: MegaMenu,
  bar: Menubar,
  panel: PanelMenu,
  tier: TieredMenu,
} as const

const menuComponent = menuComponents[props.type]

// 构建传递给子组件的 props
const childProps = computed(() => ({
  type: props.type,
  items: props.items,
  componentsProps: props.componentsProps,
}))
</script>

<template lang="pug">
component(:is='menuComponent', v-bind='childProps')
</template>
