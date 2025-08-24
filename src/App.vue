<script setup lang="ts">
import { PrimeVueDialog, dialogStore } from '@/components/modules/prime-dialog'
</script>

<template lang="pug">
.fixed.left-0.top-0.bottom-0.right-0.z-0.container.fs-appFontSize
  LayoutManager
  PrimeVueDialog(:dialog-store='dialogStore')
  ConfirmDialog
  DynamicDialog
</template>

<style lang="scss" scope></style>
