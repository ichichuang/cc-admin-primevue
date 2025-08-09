<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 布局组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import { useLayoutStore, useSizeStore } from '@/stores'
import { computed } from 'vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import AppContainer from './AppContainer.vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppTabs from './AppTabs.vue'

const layoutStore = useLayoutStore()
const sizeStore = useSizeStore()
const showHeader = computed(() => layoutStore.getShowHeader)
const showSidebar = computed(() => layoutStore.getShowSidebar)
const showBreadcrumb = computed(() => layoutStore.getShowBreadcrumb)
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

<template>
  <div class="container between">
    <!-- 菜单栏目 -->

    <!-- <template v-if="showSidebar"> -->
    <aside
      aside
      class="hfull bg-primary100 color-primary400"
      :style="sidebarClass"
    >
      <AppSidebar />
    </aside>
    <!-- </template> -->
    <!-- 主体 -->
    <main class="full">
      <!-- 头部 -->
      <template v-if="showHeader">
        <header class="h-headerHeight">
          <AppHeader />
        </header>
      </template>

      <!-- 内容区域 -->
      <div class="full h-contentsHeight">
        <!-- 面包屑 -->
        <template v-if="showBreadcrumb">
          <section class="full h-breadcrumbHeight">
            <AppBreadcrumb />
          </section>
        </template>

        <!-- 标签页 -->
        <template v-if="showTabs">
          <section class="full h-tabsHeight">
            <AppTabs />
          </section>
        </template>

        <div class="full h-contentHeight p-paddingl bg-bg200">
          <AppContainer />
        </div>
      </div>

      <!-- 底部 -->
      <template v-if="showFooter">
        <footer class="h-footerHeight">
          <AppFooter />
        </footer>
      </template>
    </main>
  </div>
</template>
