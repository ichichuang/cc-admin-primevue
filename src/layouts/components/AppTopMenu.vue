<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 布局组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import ColorSwitch from '@/components/common/ColorSwitch.vue'
import GapSwitch from '@/components/common/GapSwitch.vue'
import RoundSwitch from '@/components/common/RoundSwitch.vue'
import SizeSwitch from '@/components/common/SizeSwitch.vue'
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'

import { ref } from 'vue'

const op = ref<any>(null)
const toggle = (event: any) => {
  console.log('toggle')
  op.value.toggle(event)
}
</script>
<template>
  <div class="between h100% gap-gap px-gap">
    <div
      class="c-card"
      @click="toggle"
    >
      <div class="icon-line-md:list-indented-reversed fs-24"></div>
    </div>
    <Popover ref="op">
      <div class="w-300 gap-gapx between-col start-col">
        <ThemeSwitch />
        <ColorSwitch />
        <SizeSwitch />
        <GapSwitch />
        <RoundSwitch />
      </div>
    </Popover>
  </div>
</template>
<style lang="scss" scope></style>
