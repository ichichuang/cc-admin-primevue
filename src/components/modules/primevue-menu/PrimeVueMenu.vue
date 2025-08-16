<script setup lang="ts">
import { goToRoute } from '@/common/modules/router'
import MegaMenu from 'primevue/megamenu'
import Menu from 'primevue/menu'
import Menubar from 'primevue/menubar'
import PanelMenu from 'primevue/panelmenu'
import TieredMenu from 'primevue/tieredmenu'
import { computed, ref } from 'vue'

// 使用全局类型定义
interface MenuItem {
  path: string
  name?: string
  title: string
  icon?: string
  showLink: boolean
  rank: number
  roles?: string[]
  auths?: string[]
  children?: MenuItem[]
  meta?: any
}

interface Props {
  /** 菜单类型 */
  type?: 'menu' | 'menubar' | 'megamenu' | 'panelmenu' | 'tieredmenu'
  /** 菜单数据源 */
  model?: MenuItem[]
  /** 菜单方向 */
  orientation?: 'horizontal' | 'vertical'
  /** 是否弹出模式 */
  popup?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示图标 */
  showIcon?: boolean
  /** 是否显示徽章 */
  showBadge?: boolean
  /** 是否显示快捷键 */
  showShortcut?: boolean
  /** 是否显示子菜单标签 */
  showSubmenuLabel?: boolean
  /** 是否显示开始插槽 */
  showStartSlot?: boolean
  /** 是否显示结束插槽 */
  showEndSlot?: boolean
  /** 自定义类名 */
  class?: string
  /** 自定义样式 */
  style?: string | Record<string, any>
  /** 菜单 ID */
  id?: string
  /** 是否可折叠（仅适用于 panelmenu） */
  collapsible?: boolean
  /** 是否默认展开（仅适用于 panelmenu） */
  expandedKeys?: Record<string, boolean>
  /** 是否显示分隔符 */
  showSeparator?: boolean
  /** 是否显示工具提示 */
  showTooltip?: boolean
  /** 工具提示位置 */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  /** 是否启用涟漪效果 */
  ripple?: boolean
  /** 是否启用焦点陷阱 */
  focusTrap?: boolean
  /** 是否启用自动焦点 */
  autoFocus?: boolean
  /** 是否启用键盘导航 */
  keyboardNavigation?: boolean
  /** 是否启用无障碍功能 */
  accessibility?: boolean
  /** 自定义图标映射 */
  iconMap?: Record<string, string>
  /** 自定义徽章映射 */
  badgeMap?: Record<string, string | number>
  /** 自定义快捷键映射 */
  shortcutMap?: Record<string, string>
}

interface Emits {
  /** 菜单项点击事件 */
  (e: 'item-click', item: MenuItem, event: Event): void
  /** 菜单项悬停事件 */
  (e: 'item-hover', item: MenuItem, event: Event): void
  /** 菜单展开事件 */
  (e: 'menu-expand', item: MenuItem): void
  /** 菜单折叠事件 */
  (e: 'menu-collapse', item: MenuItem): void
  /** 菜单选择事件 */
  (e: 'menu-select', item: MenuItem): void
  /** 菜单显示事件 */
  (e: 'show'): void
  /** 菜单隐藏事件 */
  (e: 'hide'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'menu',
  orientation: 'vertical',
  popup: false,
  disabled: false,
  showIcon: true,
  showBadge: true,
  showShortcut: true,
  showSubmenuLabel: true,
  showStartSlot: false,
  showEndSlot: false,
  collapsible: false,
  showSeparator: false,
  showTooltip: false,
  tooltipPosition: 'top',
  ripple: true,
  focusTrap: false,
  autoFocus: false,
  keyboardNavigation: true,
  accessibility: true,
})

const emit = defineEmits<Emits>()

const menuRef = ref()

// 展开的键值（用于 PanelMenu）
const expandedKeys = ref<Record<string, boolean>>(props.expandedKeys || {})

/**
 * 转换路由数据为菜单数据
 */
const convertRouteToMenu = (routeData: MenuItem[]): any[] => {
  return routeData.map(item => {
    const menuItem: any = {
      label: item.title,
      icon: item.icon,
      disabled: !item.showLink,
      data: item, // 保存原始数据
    }

    // 如果有子菜单，递归转换
    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      menuItem.items = convertRouteToMenu(item.children)
      // 有子菜单的项目不设置 command，避免点击跳转
    } else {
      // 确保没有子菜单的项目不设置 items 属性
      menuItem.items = undefined

      // 只有没有子菜单且可点击的项目才设置 command
      if (item.showLink) {
        menuItem.command = () => {
          if (item.name) {
            try {
              goToRoute(item.name)
            } catch (error) {
              console.warn('路由跳转失败:', error)
            }
          }
        }
      }
    }

    // 添加其他可能的属性
    if (item.meta?.badge) {
      menuItem.badge = item.meta.badge
    }
    if (item.meta?.badgeClass) {
      menuItem.badgeClass = item.meta.badgeClass
    }
    if (item.meta?.shortcut) {
      menuItem.shortcut = item.meta.shortcut
    }
    if (item.meta?.separator) {
      menuItem.separator = true
    }

    return menuItem
  })
}

// 转换菜单数据
const menuModel = computed(() => {
  if (!props.model) {
    return []
  }
  return convertRouteToMenu(props.model)
})

// 根据菜单类型获取对应的组件
const menuComponentMap = {
  menu: Menu,
  menubar: Menubar,
  megamenu: MegaMenu,
  panelmenu: PanelMenu,
  tieredmenu: TieredMenu,
}

// 当前菜单组件
const currentMenuComponent = computed(() => {
  return menuComponentMap[props.type]
})

// 处理菜单项点击
const handleItemClick = (item: any, event: Event) => {
  emit('item-click', item.data, event)

  // 如果有子菜单，不执行路由跳转
  if (item.items && item.items.length > 0) {
    return
  }

  // 执行路由跳转
  if (item.data?.name && item.data?.showLink) {
    try {
      goToRoute(item.data.name)
    } catch (error) {
      console.warn('路由跳转失败:', error)
    }
  }
}

// 处理菜单项悬停
const handleItemHover = (item: any, event: Event) => {
  emit('item-hover', item.data, event)
}

// 处理面板切换（展开/折叠）
const handlePanelToggle = (event: any) => {
  const { item, expanded } = event

  // 更新展开状态
  if (item.key) {
    expandedKeys.value[item.key] = expanded
  }

  // 触发事件
  if (expanded) {
    emit('menu-expand', item.data || item)
  } else {
    emit('menu-collapse', item.data || item)
  }
}

// 计算样式类名
const menuClass = computed(() => {
  const classes = ['primevue-menu-wrapper']

  // 添加菜单类型类名
  classes.push(`menu-type-${props.type}`)

  // 添加方向类名
  classes.push(`menu-orientation-${props.orientation}`)

  // 添加自定义类名
  if (props.class) {
    classes.push(props.class)
  }

  return classes.join(' ')
})

// 暴露组件实例方法
defineExpose({
  toggle: (event: Event) => {
    if (menuRef.value?.toggle) {
      menuRef.value.toggle(event)
    }
  },
  show: (event: Event) => {
    if (menuRef.value?.show) {
      menuRef.value.show(event)
    }
  },
  hide: () => {
    if (menuRef.value?.hide) {
      menuRef.value.hide()
    }
  },
  getElement: () => {
    return menuRef.value?.getElement?.() || null
  },
})
</script>

<template>
  <component
    :is="currentMenuComponent"
    ref="menuRef"
    :model="menuModel"
    :orientation="orientation"
    :popup="popup"
    :multiple="false"
    :expanded-keys="expandedKeys"
    :class="menuClass"
    :style="style"
    :id="id"
    :disabled="disabled"
    :ripple="ripple"
    :focus-trap="focusTrap"
    :auto-focus="autoFocus"
    :keyboard-navigation="keyboardNavigation"
    :accessibility="accessibility"
    @item-click="handleItemClick"
    @item-hover="handleItemHover"
    @panel-toggle="handlePanelToggle"
    @show="$emit('show')"
    @hide="$emit('hide')"
  />
</template>

<style lang="scss" scoped>
.primevue-menu-wrapper {
  // 基础样式
  width: 100%;

  // 菜单类型样式
  &.menu-type-menu {
    // Menu 组件样式
  }

  &.menu-type-menubar {
    // Menubar 组件样式
  }

  &.menu-type-megamenu {
    // MegaMenu 组件样式
  }

  &.menu-type-panelmenu {
    // PanelMenu 组件样式
  }

  &.menu-type-tieredmenu {
    // TieredMenu 组件样式
  }

  // 方向样式
  &.menu-orientation-horizontal {
    // 水平方向样式
  }

  &.menu-orientation-vertical {
    // 垂直方向样式
  }
}
</style>
