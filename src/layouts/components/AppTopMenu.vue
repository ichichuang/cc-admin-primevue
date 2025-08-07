<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 布局组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import ColorSwitch from '@/components/common/ColorSwitch.vue'
import FontSizeSwitch from '@/components/common/FontSizeSwitch.vue'
import GapSwitch from '@/components/common/PaddingSwitch.vue'
import RoundSwitch from '@/components/common/RoundSwitch.vue'
import SizeSwitch from '@/components/common/SizeSwitch.vue'
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'

import { ref } from 'vue'

// 抽屉
const visible = ref(false)
// 弹出框
const op = ref<any>(null)
// 打开/关闭弹出框
const toggle = (type: 'op' | 'visible', event?: any) => {
  if (type === 'op') {
    op.value.toggle(event)
  } else {
    visible.value = !visible.value
  }
}
</script>
<template>
  <div class="between h100%">
    <div
      class="md:hidden c-card p-paddings size-1-1 center"
      @click="toggle('op', $event)"
    >
      <div class="icon-line-md:list-indented-reversed fs-appFontSizex"></div>
    </div>
    <div
      class="hidden md:block c-card p-paddings size-1-1 center"
      @click="toggle('visible', $event)"
    >
      <div class="icon-line-md:list-indented-reversed fs-appFontSizex"></div>
    </div>
  </div>

  <!-- 抽屉 -->
  <Drawer
    v-model:visible="visible"
    position="right"
    class="w22%"
  >
    <template #header>
      <div class="font-bold">设置</div>
    </template>
    <div
      class="w-800 gap-gap between-col start-col text-12 sm:text-14 md:text-15 lg:text-16 xls:text-20 xxl:text-22 xxxl:text-24"
    >
      <ThemeSwitch />
      <ColorSwitch />
      <SizeSwitch />
      <GapSwitch />
      <RoundSwitch />
      <FontSizeSwitch />
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
        ></Button>
      </div>
    </template>
  </Drawer>

  <!-- 弹出框 -->
  <Popover ref="op">
    <div
      class="w-400 gap-gap between-col start-col text-12 sm:text-14 md:text-15 lg:text-16 xls:text-20 xxl:text-22 xxxl:text-24"
    >
      <ThemeSwitch />
      <ColorSwitch />
      <SizeSwitch />
      <GapSwitch />
      <RoundSwitch />
      <FontSizeSwitch />
    </div>
  </Popover>
</template>
<style lang="scss" scope></style>
