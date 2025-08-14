<script setup lang="ts">
import { useLayoutStore, useSizeStore } from '@/stores'
import { computed } from 'vue'

const layoutStore = useLayoutStore()
const sizeStore = useSizeStore()
const isPageLoading = computed(() => layoutStore.isPageLoading)
const showHeader = computed(() => layoutStore.getShowHeader)
const showSidebar = computed(() => layoutStore.getShowSidebar)
const showFooter = computed(() => layoutStore.getShowFooter)
const showTabs = computed(() => layoutStore.getShowTabs)

// 侧边栏折叠
const sidebarCollapsed = computed(() => layoutStore.getSidebarCollapsed)
// 移动端侧边栏可见
// const mobileSidebarVisible = computed(() => layoutStore.mobileSidebarVisible)

// 主容器类名
const sidebarClass = computed(() => ({
  width: showSidebar.value
    ? sidebarCollapsed.value
      ? `${sizeStore.getSidebarCollapsedWidth}px`
      : `${sizeStore.getSidebarWidth}px`
    : 0,
}))
</script>

<template lang="pug">
.full.between
  // 菜单栏目
  aside.hidden.full.between-col.color-primary400.c-border.border-y-none.border-l-none.bg-primary100(
    class='md:block',
    :style='sidebarClass'
  )
    .h-headerHeight.p-paddings.center
      span cc
    .flex-1.p-paddings
      .full
        AppSidebar

  // 主体
  main.full
    // 头部
    template(v-if='showHeader')
      header.h-headerHeight.px-padding
        AppHeader

    // 标签页
    template(v-if='showTabs')
      section.full.h-tabsHeight.px-paddingx.bg-bg200
        AppTabs

    // 内容区域
    .full.h-contentBreadcrumbHeight.c-border.border-x-none
      .full.h-contentBreadcrumbHeight.p-paddingl
        .container.rounded-xl.c-border.border-2.border-dashed.p-padding.relative
          AppContainer
          .absolute.t-0.r-0.l-0.b-0.z-1.full.center(v-if='isPageLoading')
            Loading.z-2
            .absolute.full.bg-bg200.opacity-50.z-0

    // 底部
    template(v-if='showFooter')
      footer.h-footerHeight.bg-bg200
        AppFooter
</template>
