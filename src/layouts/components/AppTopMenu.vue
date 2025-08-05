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
</script>
<template>
  <div class="full between gap-gap">
    <ThemeSwitch />
    <ColorSwitch />
    <SizeSwitch />
    <GapSwitch />
    <RoundSwitch />
  </div>
</template>
<style lang="scss" scope></style>
