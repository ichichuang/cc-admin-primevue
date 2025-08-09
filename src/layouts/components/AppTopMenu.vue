<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 布局组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import ColorSwitch from '@/components/common/ColorSwitch.vue'
import FontSizeSwitchDesktop from '@/components/common/FontSizeSwitchDesktop.vue'
import FontSizeSwitchMobile from '@/components/common/FontSizeSwitchMobile.vue'
import LocalesSwitch from '@/components/common/LocalesSwitch.vue'
import PaddingSwitch from '@/components/common/PaddingSwitch.vue'
import RoundSwitch from '@/components/common/RoundSwitch.vue'
import SizeSwitch from '@/components/common/SizeSwitch.vue'
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'
import { useLayoutStore, useUserStore } from '@/stores'
import { ref } from 'vue'
const userStore = useUserStore()
const layoutStore = useLayoutStore()
// 抽屉
const visible = ref(false)
// 弹出框
const op = ref<any>(null)
// 打开/关闭弹出框
const toggleSetting = (type: 'op' | 'visible', event?: any) => {
  if (type === 'op') {
    op.value.toggle(event)
  } else {
    visible.value = !visible.value
  }
}

const handleLogout = () => {
  userStore.logout()
}

/* 控制侧边栏显示 */
const toggleSidebar = () => {
  layoutStore.setShowSidebar(!layoutStore.getShowSidebar)
}
/* 控制侧边栏折叠 */
const toggleSidebarCollapsed = () => {
  layoutStore.setSidebarCollapsed(!layoutStore.getSidebarCollapsed)
}
</script>
<template>
  <div class="between h100% gap-gap">
    <div
      class="c-card size-1-1 center"
      @click="toggleSidebar"
    >
      <div class="icon-line-md:list-indented-reversed fs-appFontSizex"></div>
    </div>
    <div
      class="c-card size-1-1 center"
      @click="toggleSidebarCollapsed"
    >
      <template v-if="layoutStore.getSidebarCollapsed">
        <div class="icon-line-md:arrow-open-right fs-appFontSizex"></div>
      </template>
      <template v-else>
        <div class="icon-line-md:arrow-open-left fs-appFontSizex"></div>
      </template>
    </div>
    <div
      class="md:hidden c-card size-1-1 center"
      @click="toggleSetting('op', $event)"
    >
      <div class="icon-line-md:cog-filled fs-appFontSizex"></div>
    </div>
    <div
      class="hidden md:block c-card size-1-1 center"
      @click="toggleSetting('visible', $event)"
    >
      <div class="icon-line-md:cog-filled fs-appFontSizex text-ellipsis"></div>
    </div>
  </div>

  <!-- 桌面端 -->
  <Drawer
    v-model:visible="visible"
    position="right"
    class="w40% lg:w30% xl:w24% xls:w22%"
  >
    <template #header>
      <div class="font-bold fs-appFontSizex">设置</div>
    </template>
    <div class="full gap-24 between-col start-col relative">
      <ThemeSwitch />
      <ColorSwitch />
      <SizeSwitch />
      <RoundSwitch />
      <PaddingSwitch />
      <FontSizeSwitchDesktop />
      <LocalesSwitch />
    </div>
    <template #footer>
      <div class="flex items-center gap-2">
        <Button
          label="Account"
          icon="pi pi-user"
          class="flex-auto"
          variant="outlined"
        ></Button>
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          class="flex-auto"
          severity="danger"
          text
          @click="handleLogout"
        ></Button>
      </div>
    </template>
  </Drawer>

  <!-- 移动端 -->
  <Popover ref="op">
    <div class="w-400 gap-gap between-col start-col">
      <ThemeSwitch />
      <ColorSwitch />
      <SizeSwitch />
      <PaddingSwitch />
      <RoundSwitch />
      <FontSizeSwitchMobile />
      <LocalesSwitch />
    </div>
  </Popover>
</template>
<style lang="scss" scope></style>
