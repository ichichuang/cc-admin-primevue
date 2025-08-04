<!--
  @copyright Copyright (c) 2025 chichuang
  @license MIT
  @description cc-admin 企业级后台管理框架 - 页面组件
  本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
-->

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>
<template>
  <div class="full bg-bg200">
    Dashboard
    <div class="card center w50">
      <Drawer
        v-model:visible="visible"
        header="Drawer"
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </Drawer>
      <Button
        icon="pi pi-arrow-right"
        label="Drawer"
        @click="visible = true"
      />
    </div>
  </div>
</template>
<style lang="scss" scope></style>
