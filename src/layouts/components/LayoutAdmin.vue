<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'

const layoutStore = useLayoutStore()
const isPageLoading = computed(() => layoutStore.isPageLoading)
const showHeader = computed(() => layoutStore.getShowHeader)
const showSidebar = computed(() => layoutStore.getShowSidebar)
const showFooter = computed(() => layoutStore.getShowFooter)
const showTabs = computed(() => layoutStore.getShowTabs)

// 侧边栏折叠
const sidebarCollapsed = computed(() => layoutStore.getSidebarCollapsed)
</script>

<template lang="pug">
.full.between
  // 菜单栏目
  aside.h-full.c-transition.relative.z-2(
    :class='showSidebar ? (sidebarCollapsed ? "md:block md:w-sidebarCollapsedWidth" : "md:block md:w-sidebarWidth") : "hidden md:w-0"'
  )
    .full.bg-primary100
      .h-headerHeight.center.hidden(class='md:block')
        AppTitle
      div(class='h-[calc(100%-var(--header-height))]')
        .full
          AppSidebar

  // 主体
  main.h-full.w-375.c-transitions.flex-1
    // 头部
    template(v-if='showHeader')
      header.h-headerHeight.px-padding
        AppHeader
    // 标签页
    template(v-if='showTabs')
      section.h-tabsHeight.bg-bg200
        AppTabs

    // 内容区域
    .w-full.h-contentBreadcrumbHeight.relative.py-padding.c-transitions(
      class='lg:py-paddingx xxl:py-paddingl'
    )
      AppContainer
      template(v-if='isPageLoading')
        .absolute.t-0.r-0.l-0.b-0.z-1.center
          Loading
        .absolute.t-0.r-0.l-0.b-0.bg-bg100.opacity-80

    // 底部
    template(v-if='showFooter')
      footer.h-footerHeight.bg-bg200
        AppFooter
</template>
