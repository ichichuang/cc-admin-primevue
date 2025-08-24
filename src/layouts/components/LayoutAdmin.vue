<script setup lang="ts">
import { AppSidebar } from '@/layouts/components/app-sidebar'
import { useLayoutStore, useSizeStore } from '@/stores'
import { computed } from 'vue'

const layoutStore = useLayoutStore()
const sizeStore = useSizeStore()
const isPageLoading = computed(() => layoutStore.isPageLoading)
const showHeader = computed(() => layoutStore.getShowHeader)
const showSidebar = computed(() => layoutStore.getShowSidebar)
const showFooter = computed(() => layoutStore.getShowFooter)
const showTabs = computed(() => layoutStore.getShowTabs)
// 当前断点
const currentBreakpoint = computed(() => layoutStore.getCurrentBreakpoint)

// 侧边栏折叠

const sidebarCollapsed = computed(() => layoutStore.getSidebarCollapsed)
// 移动端侧边栏可见
// const mobileSidebarVisible = computed(() => layoutStore.mobileSidebarVisible)

// 侧边栏类名
const sidebarClass = computed(() => ({
  width: showSidebar.value
    ? sidebarCollapsed.value
      ? `${sizeStore.getSidebarCollapsedWidth}px`
      : `${sizeStore.getSidebarWidth}px`
    : 0,
}))

// 主容器类名
const mainClass = computed(() => ({
  width:
    currentBreakpoint.value === 'xs' || currentBreakpoint.value === 'sm'
      ? '100%'
      : showSidebar.value
        ? sidebarCollapsed.value
          ? 'calc(100% - var(--sidebar-collapsed-width))'
          : 'calc(100% - var(--sidebar-width))'
        : '100%',
}))
</script>

<template lang="pug">
.full.between
  // 菜单栏目
  aside.fixed.z-4.full.between-col.color-primary400.c-border.border-y-none.border-l-none.bg-primary100.c-transition(
    class='left--100% md:relative md:left-0',
    :style='sidebarClass'
  )
    .h-headerHeight.center
      AppTitle
    div(class='h-[calc(100%-var(--header-height))]')
      .full
        AppSidebar

  // 主体
  main.full.c-transitionx(:style='mainClass')
    // 头部
    template(v-if='showHeader')
      header.h-headerHeight.px-padding
        AppHeader

    // 标签页
    template(v-if='showTabs')
      section.full.h-tabsHeight.bg-bg200
        AppTabs

    // 内容区域
    .full.h-contentBreadcrumbHeight
      .full.h-contentBreadcrumbHeight
        .container.relative.py-padding(class='lg:py-paddingx xxl:py-paddingl')
          AppContainer
          .absolute.t-0.r-0.l-0.b-0.z-1.full.center(v-if='isPageLoading')
            Loading.z-2
            .absolute.full.bg-bg100.opacity-50.z-0

    // 底部
    template(v-if='showFooter')
      footer.h-footerHeight.bg-bg200
        AppFooter
</template>
