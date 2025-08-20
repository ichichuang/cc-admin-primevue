<script setup lang="ts">
import { getCurrentRoute, getCurrentRouteMeta, getMenuTree, goToRoute } from '@/common'
import { useLocale } from '@/hooks'
import { useLayoutStore } from '@/stores'
import type { MenuItem } from 'primevue/menuitem'
import { computed, nextTick, ref, watch } from 'vue'

const { $t } = useLocale()

const layoutStore = useLayoutStore()
// 折叠状态
const isCollapsed = computed(() => layoutStore.sidebarCollapsed)
// 当前断点
const currentBreakpoint = computed(() => layoutStore.getCurrentBreakpoint)

// 展开的菜单项 key 对象
const expandedKeys = computed(() => {
  return layoutStore.getExpandedMenuKeys || {}
})

// PanelMenu 的组件属性配置
const componentsProps = computed(() => ({
  multiple: true, // 允许多个根节点同时展开
  expandedKeys: expandedKeys.value,
  ['onUpdate:expandedKeys'](val: any) {
    // 直接保存到 store
    layoutStore.setExpandedMenuKeys(val || {})
  },
}))

// 处理菜单树数据，转换为 PrimeVue MenuItem 格式
const processMenuTree = (menuItems: any[]): MenuItem[] => {
  const currentRoute = getCurrentRoute()
  const meta = getCurrentRouteMeta()
  const currentName = currentRoute.name || ''
  const currentPaths = meta?.parentPaths || []
  return menuItems
    .filter(item => {
      // 过滤掉不显示的菜单项
      if (item.showLink === false || item.meta?.showLink === false) {
        return false
      }
      return true
    })
    .map(item => {
      const newClass = currentPaths.includes(item.path)
        ? 'selecteds'
        : currentName === item.name
          ? 'selected'
          : ''
      const hasChildren = item.children && item.children.length > 0
      // 是否是叶子节点
      const isLeaf = !hasChildren && !item.path.includes('/')
      // 是否是外链（如果是外链，则显示链接图标）
      const currentIcon = item.meta?.parent && item.meta?.parent !== 'admin' ? '（🔗）' : ''
      // 路由标题
      const currentTitle = item.titleKey ? $t(item.titleKey) : item.title || item.name
      const menuItem: MenuItem = {
        key: item.path || item.name, // PanelMenu 需要 key 属性
        label:
          currentBreakpoint.value === 'sm' || currentBreakpoint.value === 'xs'
            ? currentTitle + currentIcon
            : isCollapsed.value && !isLeaf
              ? ''
              : currentTitle + currentIcon, // 支持国际化
        icon: item.meta?.icon, // 图标
        ...(hasChildren
          ? {}
          : {
              command: () => {
                if (item.name) {
                  const parent = item.meta?.parent || 'admin'
                  const shouldOpenNewWindow = parent === 'screen' || parent === 'fullscreen'
                  goToRoute(item.name, undefined, shouldOpenNewWindow)
                }
              },
            }),
        items: hasChildren ? processMenuTree(item.children) : undefined,
        class: newClass,
      }
      return menuItem
    })
    .sort((a, b) => {
      const rankA = menuItems.find(item => (item.path || item.name) === a.key)?.rank || 0
      const rankB = menuItems.find(item => (item.path || item.name) === b.key)?.rank || 0
      return rankA - rankB
    })
}

const menuTree = getMenuTree()

// 转换菜单数据
const items = computed(() => processMenuTree(menuTree))

/* 折叠状态 */
const isCollapsedRef = ref(isCollapsed.value)
watch(
  isCollapsed,
  (bool: boolean) => {
    if (bool) {
      isCollapsedRef.value = bool
    } else {
      nextTick(() => {
        setTimeout(() => {
          isCollapsedRef.value = bool
        }, 300)
      })
    }
  },
  {
    immediate: true,
  }
)
</script>
<template lang="pug">
.full.py-padding(class='md:block', :class='{ "px-padding": !isCollapsed }')
  DesktopSidebar(:items='items', :components-props='componentsProps')
.full(class='md:hidden')
  MobileSidebar(:items='items', :components-props='componentsProps')
</template>
